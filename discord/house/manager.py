import asyncio
import discord
import json
from discord.ext            import commands
from house.model            import HouseModel
from util.api_requests      import Api, ApiError
from util.embed_style       import EmbedStyle
from .h_params              import *

class HouseManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()

    def createModels(self, data):
        models = []
        for item in data:
            models.append(HouseModel(**item))
        return models

    @commands.command()
    async def allHouses(self, ctx):
        """Get all Houses"""

        try:
            data = await Api.get('/house/all');
            house_models = self.createModels(data)
            return await EmbedStyle.createPages(self.bot, ctx, house_models, 10, self.craftHousesPage);
        except ApiError as error:
            ctx.send(error.message)

    def craftHousesPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='Conquy')

        houses_str = '';
        for i in range(minI, maxI):
            if i < len(data):
                house = data[i]
                houses_str+= '[{0}] {1}\t| {2}\t| {3}\t| {4}\n'.format(house.id, house.name, house.level, house.camp_location, house.liege)

        embed.add_field(name='id\t| Name\t| Level\t| Camp Location\t| Liege', value=houses_str)

        return embed

    @commands.command()
    async def createHouse(self, ctx, *, params:create_params=create_params.defaults()):
        """Create a house"""
        try:
            body = params
            body['house_name'] = params['name']
            body['house_level'] = params.get('level')

            session = await self.bot.getUserSession(ctx.message.author)
            await Api.postSession('/house', body, session)
            await ctx.send('House created')
        except ApiError as error:
            await ctx.send(error.message)

    @commands.command()
    async def modHouse(self, ctx, *, params:mod_params=mod_params.defaults()):
        """Modify your house"""
        try:
            body = params
            body['house_name'] = params.get('name')
            body['house_level'] = params.get('level')

            session = await self.bot.getUserSession(ctx.message.author)
            await Api.putSession('/house', body, session)
            await ctx.send('House modified')
        except ApiError as error:
            await ctx.send(error.message)

    @commands.command()
    async def deleteHouse(self, ctx):
        """Delete your house"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            await Api.deleteSession('/house', session)
            await ctx.send('House deleted')
        except ApiError as error:
            await ctx.send(error.message)