# from ngrams import *
import asyncio
import json
from pathlib import Path
from typing import Final
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

TOKEN: Final = '8016115621:AAEt5XKiG_34aPmj3ef4yA_6ty4P5WV9iXE'
BOT_USERNAME: Final = 'SMILE_THESIS_BOT'

# COMMANDS
async def start_command(update = Update, context = ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello, pang Thesis namin 'to, kung di kita kagrupo... ALIS!")

async def help_command(update = Update, context = ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("BOT ako na nagse-send ng message sa Thesis members na nangangasiwa sa'kin")

async def custom_command(update = Update, context = ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("This is a custom command")

async def check_password_command(update = Update, context = ContextTypes.DEFAULT_TYPE):
    user = update.message.from_user
    passw = "SmileKaLangzzz"
    await update.message.reply_text(f"This is the password: {passw} and u are {user.id}")
    pass

async def get_users_command(update = Update, context = ContextTypes.DEFAULT_TYPE):
    user = update.message.from_user
    # passw = "SmileKaLangzzz"
    print(user.id)
    await update.message.reply_text(f"u are {user.id}")
    pass

async def message_smile_members(app: Application, message):
    users = [
    ]

    for uid in users:
        try:
            await app.bot.send_message(
                chat_id=uid,
                text= message
            )
            print(f"Sent to {uid}")
        except Exception as e:
            print(f"Failed to send to {uid}: {e}")

# RESPONSES
def handle_response(text: str) -> str:
    text = text.lower()

    # rg = ReplyGenerator()
    
    # return
    # return f"{rg.get_reply(text)}\n{rg.get_next_word(text)}"

    # if 'hello' in text:
    #     return 'Hello po'
    
    # if 'how are you' in text:
    #     return 'I am good'
    
    # if 'i love python' in text:
    #     return 'okay'
    
    # return 'Sorry, I dont understand'
    return "nakakatamad mag gawa ng response hehe"


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message_type: str = update.message.chat.type
    text: str = update.message.text
    
    print(f"User: {update.message.chat.id} in {message_type} >>> {text}")

    if message_type == 'group':
        if BOT_USERNAME in text:
            new_text: str = text.replace(BOT_USERNAME, '').strip
            response: str = handle_response(new_text)
        else:
            return
    else: # here kapag private message langz
        response: str = handle_response(text)

    print('BOT: ', response)
    await update.message.reply_text(response)

async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"UPDATE {update} | caused error: {context.error}")


if __name__ == "__main__":
    print("The bot is starting...")
    app = Application.builder().token(TOKEN).build()

    # COMMANDS
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('help', help_command))
    app.add_handler(CommandHandler('custom', custom_command))
    app.add_handler(CommandHandler('check_password', check_password_command))
    app.add_handler(CommandHandler('get_user_id', get_users_command))
    

    # MESSAGES
    app.add_handler(MessageHandler(filters.TEXT, handle_message))

    #  ERRORS
    app.add_error_handler(error)

    # POLLS THE BOT
    print("Polling...")
    app.run_polling(poll_interval=5, drop_pending_updates=True)