import asyncio
import discord

from discord.ext import commands
from unit.manager import UnitManager
from settings import DISCORD_TOKEN

loop = asyncio.get_event_loop()
bot = commands.Bot(command_prefix='>')
bot.add_cog(UnitManager(bot))

@bot.event
async def on_ready():
    print('It is on')
    print('I am running on ' + bot.user.name)
    print('With the ID: ' + str(bot.user.id))

bot.run(DISCORD_TOKEN)