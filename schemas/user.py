from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str
    name: str
    password: str
    veryfication_code: str
    gender: str
    age: int
    invite_code: Optional[str] = None

class ResetPassBase(BaseModel):
    email: str
    new_password: str
    veryfication_code: str

class Token(BaseModel):
    acces_token: str
    toke_type: str

class verification_request(BaseModel):
    email: str

class ChangePassword(BaseModel):
    token: str
    old_password: str
    new_password: str

class updateUser(BaseModel):
    token: str
    request_code: str = None
    name: str = None
    username: str = None
    email: str = None

### user route

class GetInfo(BaseModel):
    token: str

class UserInfoBase(BaseModel):
    token: str
    name: str = None
    age: int = None
    height: int = None
    pal: float = None
    cel: float = None

class TokenRoute(BaseModel):
    token: str

class AddWeightBase(BaseModel):
    token: str
    new_weight: float

class EditWeightGoal(BaseModel):
    token: str
    new_goal: float

class SetMacroGoals(BaseModel):
    token: str
    calories: int
    proteins: int
    fats: int
    carbohydrates: int

class GenGoal(BaseModel):
    token: str
    calories: int

class AddFoodToFavorite(BaseModel):
    token: str
    food_id: int
    food_type: str

class GetFoodFavorite(BaseModel):
    token: str
    food_type: str