import os, time, datetime
from importlib import import_module
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.staticfiles import StaticFiles
from typing import List, Annotated
from starlette.responses import HTMLResponse
import models
import settings

from database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse

#import routes
routes_list = []
for file in os.listdir("./routes"):
    if file.endswith('.py'):
        route_name = file[:-3]
        root_module = import_module(f'routes.{route_name}')
        module = import_module(f'routes')
        globals()[route_name] = getattr(module, route_name)
        routes_list.append(root_module)

app = FastAPI(title="LSSM", summary="")
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.config = {"max_upload_size": "500.0 MB"}

for thing in routes_list:
    app.include_router(thing.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

######

# frontend import

######
app.mount("/assets", StaticFiles(directory="./react/dist/assets"), name="assets")
app.mount("/app", StaticFiles(directory="./react/dist"), name="app")

@app.get("/icon.png", include_in_schema=False)
async def favicon():
    return FileResponse("./static/icon.png")

@app.get("/")
async def root():
    return FileResponse(os.path.join("./react/dist", "index.html"))

@app.get("/status", status_code=status.HTTP_200_OK)
async def statuss():
    return {"status": "ok", "time": time.time()}

@app.get("/version", status_code=status.HTTP_200_OK)
async def version():
    return {"name": "LSSM core", "version": "1.0.0"}

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str, request: Request):
    # Check if the path corresponds to an existing static file
    static_file_path = os.path.join("dist", full_path)
    if os.path.isfile(static_file_path):
        return FileResponse(static_file_path)

    # Serve index.html for any path that does not correspond to a specific route
    return FileResponse(os.path.join("./react/dist", "index.html"))

# @app.get("/removing_expired")
async def removing_expired():
    with Session(bind=engine) as session:
            email_requests = session.query(models.Email_verify_requests).all()
            for request in email_requests:
                if request.expiry_at <= datetime.datetime.today():
                    session.delete(request)
                    session.commit()

@app.on_event("startup")
async def startup_event():
    await removing_expired()

# @app.get("/", response_class=HTMLResponse)
# def home():
#     return """
#     <html>
#         <head>
#             <title>Server manager</title>
#         </head>
#         <body>
#             <h1>Hi welcome in manager of the server =)</h1>
#         </body>
#     </html>
#     """


# @app.post("/")
# async def test_root(request: Request):
#     print("HEADERS:", request.headers)
#     print("USER AGENT:", request.headers.get("user-agent"))
#     return {"ok": True}


# TODO: add https support

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6060)