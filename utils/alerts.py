import requests
import httpx

# from settings import chat_id, telegram_bot_api
# def send_telegram_alert(message):
#     BOT_TOKEN = telegram_bot_api
#     CHAT_ID = chat_id
#
#     url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
#     payload = {
#         "chat_id": CHAT_ID,
#         "text": message,
#         "parse_mode": "Markdown"
#     }
#
#     requests.post(url, json=payload)

class AlertManager:
    def __init__(self, providers: list):
        self.providers = providers

    async def send(self, alert_type: str, alert_message: str):
        # Format the message
        full_message = (
            "===============\n"
            "❗❗ New alert ❗❗\n"
            "===============\n"
            f"{alert_type}\n"
            "===============\n"
            f"{alert_message}"
        )

        # Send to ALL providers automatically
        for provider in self.providers:
            await provider.send(full_message)

class TelegramProvider:
    def __init__(self, bot_token: str, chat_id: str):
        self.bot_token = bot_token
        self.chat_id = chat_id

    async def send(self, message: str):
        url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
        payload = {
            "chat_id": self.chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        async with httpx.AsyncClient() as client:
            await client.post(url, json=payload)

class WebhookProvider:
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    async def send(self, message: str):
        payload = {
            "source": "LSSM",
            "type": "ALERT",
            "message": message
        }
        async with httpx.AsyncClient() as client:
            await client.post(self.webhook_url, json=payload)\

class DiscordProvider:
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    async def send(self, message: str):
        payload = {
            "content": message
        }
        async with httpx.AsyncClient() as client:
            await client.post(self.webhook_url, json=payload)