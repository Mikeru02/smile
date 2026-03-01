import asyncio
import sys
from telegram.ext import Application
from typing import Final
import argparse

async def message_smile_members(app: Application, message: str, users: list[int]):
    for uid in users:
        try:
            await app.bot.send_message(chat_id=uid, text=message)
            print(f"Sent to {uid}")
        except Exception as e:
            print(f"Failed to send to {uid}: {e}")

async def main():
    parser = argparse.ArgumentParser(description="Telegram Bot Message Sender")
    parser.add_argument('--token', type=str, required=True, help="Bot Token")
    parser.add_argument('--users', type=str, required=True, help="Comma separated list of user IDs")
    parser.add_argument('--message', type=str, required=True, help="Message to send")
    args = parser.parse_args()

    token = args.token
    users = [int(uid) for uid in args.users.split(',')]
    message = args.message

    app = Application.builder().token(token).build()
    await app.initialize()
    await app.start()

    print("Sending messages...")
    await message_smile_members(app, message, users)

    print("Stopping bot...")
    await app.stop()
    await app.shutdown()

if __name__ == "__main__":
    asyncio.run(main())