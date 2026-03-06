# LSSM Server

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-API-green)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![Status](https://img.shields.io/badge/status-active-success)

**LSSM Server (Lightweight Server Status Manager)** is the central backend for monitoring servers using lightweight agents.
Agents send system metrics, logs, and heartbeats to this server, which stores and manages them through an API.

---

# Features

* Server / agent management
* Heartbeat monitoring
* CPU & RAM metrics
* Log collection
* Permission system
* Token authentication
* Alert integrations (Telegram / Discord / Email)

---

# Architecture

```
+-------------+        HTTPS        +-------------+
| LSSM Agent  |  -----------------> | LSSM Server |
| (Rust)      |                     |   FastAPI   |
+-------------+                     +-------------+
       |                                   |
       | sends                             |
       v                                   v
 CPU / RAM usage                    Database / Logs
 Heartbeat
 Logs
```

Each **agent corresponds to one server entry** in the database.

---

## Tech Stack

- **Python**
- **FastAPI**
- **PostgreSQL / SQLite**
- **SQLAlchemy**
- **JWT / Token authentication**

Agents are typically written in:

- **Rust** (recommended)
- **Python** (optional)

---

# Installation Guide

## 1 Clone repository

```bash
git clone https://github.com/yourusername/lssm-server.git
cd lssm-server
```

---

## 2 Create virtual environment

Linux / macOS:

```bash
python -m venv venv
source venv/bin/activate
```

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

---

## 3 Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4 Create `.env` file

Create a `.env` file in the project root:

```bash
touch .env
```

---

Great — I’ll extend your README with the **professional sections** you asked for. You can append these sections to your existing README. The base file you uploaded already contains the intro, install guide, and `.env` config. 


---


# Environment Configuration (.env)

Example configuration:

```env
# Email notifications
PASSWORD_EMAIL=your_email_app_password
SMTP_SERVER_EMAIL=your_email@gmail.com

# Telegram alerts
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_chat_id

# Discord alerts
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook

# API security
SECRET_KEY=generate_random_secret_key_here
ALGORITHM=HS256
```

### Explanation

| Variable              | Description                                    |
| --------------------- | ---------------------------------------------- |
| `PASSWORD_EMAIL`      | App password used for SMTP email notifications |
| `SMTP_SERVER_EMAIL`   | Email used to send alerts                      |
| `TELEGRAM_BOT_TOKEN`  | Telegram bot used for notifications            |
| `CHAT_ID`             | Telegram chat ID where alerts are sent         |
| `DISCORD_WEBHOOK_URL` | Discord webhook for alerts                     |
| `SECRET_KEY`          | Secret key used for token signing              |
| `ALGORITHM`           | JWT signing algorithm                          |

---

# Systemd Service (Production)

If you want to run the server directly on Linux.

Create:

```bash
/etc/systemd/system/lssm-server.service
```

Service file:

```ini
[Unit]
Description=LSSM Server
After=network.target

[Service]
User=lssm
WorkingDirectory=/opt/lssm-server
ExecStart=/opt/lssm-server/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable lssm-server
sudo systemctl start lssm-server
```

# Running the Server

Start the API server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:

```
http://localhost:8000
```

FastAPI documentation:

```
http://localhost:8000/docs#
```

---

# Example Agent Heartbeat

```
POST /heartbeat
```

Example payload:

```json
{
  "token": "agent_token",
  "cpu_usage": 17,
  "ram_usage": 42
}
```

---

# Roadmap

Planned features:

* Web dashboard
* Historical metrics
* Prometheus integration
* WebSocket live monitoring
* Multi-node clusters

---

# License

GPL 3.0 License

# Author

Created by **antekes1**

Project: **LSSM – Lightweight Server Status Manager**