import asyncio
import discord
import json
import random
import string
from discord.ext            import commands
from discord.user           import User
from unit.model             import Unit
from util.api_requests      import Api, ApiError
from util.embed_style       import EmbedStyle
from .uu_parameters         import *

class UserManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()


    async def handleApiError(self, ctx, error):
        return await ctx.send(error.message)

    def randomPassword(self, stringLength=10):
        letters = string.ascii_lowercase
        return ''.join(random.choice(letters) for i in range(stringLength))

    @commands.command()
    async def registerUser(self, ctx, *, params:register_params=register_params.defaults()):
        """Register user. Only done once per user. Can't access user related content otherwise.
        Username is optional and the discord username is default. Password is random if not specified"""

        username = params.get('username')
        user = ctx.message.author
        if(username==None):
            username = user.name
        password = params.get('password')
        if(password==None):
            password = self.randomPassword(random.randint(8, 16))
        req_body = {'discordId': str(ctx.message.author.id), 'username': username, 'password': password}
        try:
            await Api.post('/user/discord-register', req_body)
            await user.send('Register succesful\nUsername: {0}\nPassword: {1}'.format(username, password))
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    @commands.command()
    async def removeAssign(self, ctx, term:str):
        """Unassign unit from yourself"""
        data = None
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/user/unit/{0}'.format(term), session)
        except ApiError as error:
            return await self.handleApiError(ctx, error)
        await ctx.send('Do you want to remove \'{0}\'? Yes to confirm'.format(data['name']))

        def check(m):
            return m.channel == ctx.channel and m.author == ctx.message.author

        msg = ''
        try:
            msg = await self.bot.wait_for('message', timeout=30.0, check=check)
        except asyncio.TimeoutError:
            return await ctx.send('Operation aborted')
        if not(msg.content.lower() == 'yes' or msg.content.lower() == 'y'):
            return await ctx.send('Operation aborted')
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            await Api.deleteSession('/user/unit/{0}'.format(data['id']), session)
            return await ctx.send('Unit Assignment Removed')
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    @commands.command()
    async def modUnit(self, ctx, term:str, *, params:param_converter=param_converter.defaults()):
        """Modify unit assigned.
            Example: modUnit \"Yelmo\" unit_level=20
            Help for more info"""
        data = None
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/user/unit/{0}'.format(term), session)
        except ApiError as error:
            return await self.handleApiError(ctx, error)
        await ctx.send('Do you want to modify \'{0}\'? Yes to confirm'.format(data['name']))

        def check(m):
            return m.channel == ctx.channel and m.author == ctx.message.author

        msg = ''
        try:
            msg = await self.bot.wait_for('message', timeout=30.0, check=check)
        except asyncio.TimeoutError:
            return await ctx.send('Operation aborted')
        if not(msg.content.lower() == 'yes' or msg.content.lower() == 'y'):
            return await ctx.send('Operation aborted')
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            body = params
            await Api.putSession('/user/unit/{0}'.format(data['id']), body, session)
            return await ctx.send('Unit Modified Successfully')
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    @commands.command()
    async def assignUnit(self, ctx, term:str, *, params:param_converter=param_converter.defaults()):
        """Assign unit to yourself.
            Example: assignUnit \"Yelmo\" unit_level=1
            Help for more info"""
        data = None
        try:
            data = await Api.get('/unit/{0}'.format(term))
        except ApiError as error:
            return await self.handleApiError(ctx, error)
        await ctx.send('Do you want to assign \'{0}\'? Yes to confirm'.format(data['name']))

        def check(m):
            return m.channel == ctx.channel and m.author == ctx.message.author

        msg = ''
        try:
            msg = await self.bot.wait_for('message', timeout=30.0, check=check)
        except asyncio.TimeoutError:
            return await ctx.send('Operation aborted')
        if not(msg.content.lower() == 'yes' or msg.content.lower() == 'y'):
            return await ctx.send('Operation aborted')
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            body = params
            body['unit_id'] = data['id']
            await Api.postSession('/user/unit', body, session)
            return await ctx.send('Unit Assigned Successfully')
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    @commands.command()
    async def myUnits(self, ctx):
        """Get units assigned to user"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/user/units', session)
            units_data = []
            for item in data:
                units_data.append(Unit(**item))
            return await EmbedStyle.createPages(self.bot, ctx, units_data, 5, self.createUnitPage)
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    def createUnitPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='TestBot')

        units_str = ''
        for i in range(minI, maxI):
            if i < len(data):
                unit = data[i]
                units_str+= '[{0}] {1}\t| {2}\t| {3}\t| {4}\n'.format(unit.id, unit.name, unit.unit_type, unit.stars, unit.unit_level)

        embed.add_field(name='id\t| name\t| type\t| stars\t| level', value=units_str)

        return embed
