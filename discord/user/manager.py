import asyncio
import discord
import json
from discord.ext import commands
from discord.user import User
from unit.model import Unit
from util.api_requests import Api, ApiError
from util.embed_style import EmbedStyle
from .uu_parameters import *

class UserManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()


    async def handleApiError(self, ctx, error):
        return await ctx.send(error.message)


    @commands.command()
    async def registerUser(self, ctx):
        req_body = {'discordId': ctx.message.author.id}
        try:
            await Api.post('/user/discord-register', req_body)
            await ctx.send('Register succesful')
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    @commands.command()
    async def removeAssign(self, ctx, term:str):
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
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            await Api.deleteSession('/user/unit/{0}'.format(data['id']), session)
            return await ctx.send('Unit Assignment Removed')
        except ApiError as error:
            return await self.handleApiError(ctx, error);

    @commands.command()
    async def modUnit(self, ctx, term:str, *, params:param_converter=param_converter.defaults()):
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
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            body = params
            await Api.putSession('/user/unit/{0}'.format(data['id']), body, session)
            return await ctx.send('Unit Modified Successfully')
        except ApiError as error:
            return await self.handleApiError(ctx, error);

    @commands.command()
    async def assignUnit(self, ctx, term:str, *, params:param_converter=param_converter.defaults()):
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
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            body = params
            body['unit_id'] = data['id']
            print(body)
            await Api.postSession('/user/unit', body, session)
            return await ctx.send('Unit Assigned Successfully')
        except ApiError as error:
            return await self.handleApiError(ctx, error);

    @commands.command()
    async def myUnits(self, ctx):
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/user/units', session)
            units_data = []
            for item in data['units']:
                units_data.append(Unit(**item))
            return await EmbedStyle.createPages(self.bot, ctx, units_data, 5, self.createUnitPage)
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    def createUnitPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='TestBot')

        units_str = '';
        for i in range(minI, maxI):
            if i < len(data):
                unit = data[i]
                units_str+= '[{0}] {1}\t| {2}\t| {3}\t| {4}\n'.format(unit.id, unit.name, unit.type, unit.stars, unit.unit_level)

        embed.add_field(name='id\t| name\t| type\t| stars\t| level', value=units_str)

        return embed
