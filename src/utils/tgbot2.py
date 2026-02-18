import asyncio
import random
from telegram.ext import Application
from typing import Final

TOKEN: Final = '8016115621:AAEt5XKiG_34aPmj3ef4yA_6ty4P5WV9iXE'
# BOT_USERNAME: Final = 'SMILE_THESIS_BOT'

async def message_smile_members(app: Application, message: str):
    users = [
        5127163539,
        7712666464,
        7182927413,
        6068795985
    ]

    for uid in users:
        try:
            await app.bot.send_message(chat_id=uid, text=message)
            print(f"Sent to {uid}")
        except Exception as e:
            print(f"Failed to send to {uid}: {e}")

async def main():
    app = Application.builder().token(TOKEN).build()

    await app.initialize()
    await app.start()

    print("Sending messages...")
    mssg = random.choice(["The Lavender trash bag is full",
                          "The Green apple trash bag is full",
                          "The Pink trash bag is full"
                          ])
    await message_smile_members(app, mssg)

    print("Stopping bot...")
    await app.stop()
    await app.shutdown()

if __name__ == "__main__":
    asyncio.run(main())
