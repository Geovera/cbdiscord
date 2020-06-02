import asyncio
import discord
import json
from discord.ext        import commands
from util.api_requests  import Api, ApiError
from util.embed_style   import EmbedStyle

class MembershipManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()

    @commands.command()
    async def sendRequest(self, ctx, house_id:int):
        """Send member request to house id"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            await Api.postSession('/house/membership/request', {"house_id": house_id}, session)
            await ctx.send('Request sent');
        except ApiError as error:
            await ctx.send(error.message)

    @commands.command()
    async def cancelRequest(self, ctx):
        """Cancel member request"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            await Api.deleteSession('/house/membership/request', session)
            await ctx.send('Request cancelled');
        except ApiError as error:
            await ctx.send(error.message)

    @commands.command()
    async def allRequests(self, ctx):
        """All requests to house"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/house/membership/request/all', session)
            if(len(data) == 0):
                await ctx.send('No requests')
            else:
                await EmbedStyle.createPages(self.bot, ctx, data, 10, self.craftRequestsPage)
        except ApiError as error:
            await ctx.send(error.message)
    
    def craftRequestsPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='Conquy')

        requests_str = '';
        for i in range(minI, maxI):
            if i < len(data):
                request = data[i]
                requests_str+= '[{0}] {1}'.format(request.get('id'), request.get('username'))

        embed.add_field(name='id\t| Name', value=requests_str)

        return embed

    @commands.command()
    async def acceptRequest(self, ctx, user_id:int):
        """Accept membership request"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.postSession('/house/membership',{"user_id": user_id} , session)

            await ctx.send('Membership accepted')
        except ApiError as error:
            await ctx.send(error.message)

    @commands.command()
    async def rejectRequest(self, ctx, user_id:int):
        """Refuse membership request"""
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.deleteSession('/house/membership/request/{0}'.format(user_id), session)

            await ctx.send('Membership rejected')
        except ApiError as error:
            await ctx.send(error.message)