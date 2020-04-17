import asyncio
import discord

import discord
from requests import Session
from discord.ext import commands
from unit.manager import UnitManager
from user.manager import UserManager
from util.command_error_handler import CommandErrorHandler
from util.api_requests import Api
from settings import DISCORD_TOKEN


class ConqBot(commands.Bot):
    def __init__(self, command_prefix='>'):
        super().__init__(command_prefix)
        self.id_to_session = {}

    async def getUserSession(self, user:discord.User):
        if user.id in self.id_to_session:
            return self.id_to_session[user.id]
        new_session = Session()
        await Api.postSession('/user/d-login', {"discordId": user.id}, new_session);
        self.id_to_session[user.id] = new_session

        return new_session
        

loop = asyncio.get_event_loop()
bot = ConqBot(command_prefix='>')
bot.add_cog(CommandErrorHandler(bot))
bot.add_cog(UserManager(bot))
bot.add_cog(UnitManager(bot))

@bot.event
async def on_ready():
    print('It is on')
    print('I am running on ' + bot.user.name)
    print('With the ID: ' + str(bot.user.id))

bot.run(DISCORD_TOKEN)