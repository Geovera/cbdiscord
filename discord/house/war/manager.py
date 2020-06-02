import asyncio
import discord
import json
from tabulate           import tabulate
from datetime           import datetime
from dateutil           import parser
from discord.ext        import commands
from util.api_requests  import Api, ApiError
from util.embed_style   import EmbedStyle

class WarManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()

    @commands.command()
    async def currentWar(self, ctx):
        """Get current war information"""
        try:
            data = await Api.get('/house/war');
            date = parser.parse(data.get('day'))
            await ctx.send('Current War Date: {0}/{1}/{2}'.format(date.year, date.month, date.day))
        except ApiError as error:
            await ctx.send(error.message)

    async def warParticipation(self, ctx, decision):
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            await Api.postSession('/house/war/participation', {"decision": decision}, session)
            await ctx.send('Participation updated')
        except ApiError as error:
            await ctx.send(error.message)

    @commands.command(aliases=["si"])
    async def warYes(self, ctx):
        """Yes confirmation to current war"""
        await self.warParticipation(ctx, "Yes")

    @commands.command(aliases=["no"])
    async def warNo(self, ctx):
        """No confirmation to current war"""
        await self.warParticipation(ctx, "No")

    @commands.command(aliases=["idk"])
    async def warIdk(self, ctx):
        """Maybe confirmation to current war"""
        await self.warParticipation(ctx, "Maybe")

    @commands.command()
    async def houseParticipation(self, ctx):
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/house/participation', session)
            
            date = parser.parse(data['war'].get('day'))
            await ctx.send('Participation for War: {0}/{1}/{2}'.format(date.year, date.month, date.day))
            await EmbedStyle.createPages(self.bot, ctx, data.get('participation'), 10, self.craftParticipationPage)
        except ApiError as error:
            await ctx.send(error.message)

    def craftParticipationPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='Conquy')

        table = []
        for i in range(minI, maxI):
            if i < len(data):
                part = data[i]
                item = part.values()
                table.append(item)

        headers = ["Name", "Decision"]

        max_lens = [len(str(max(i, key=lambda x: len(str(x))))) for i in zip(headers, *table)]
        participation_str = '```';
        for row in (headers, *table):
            participation_str += (' | '.join('{0:{width}}'.format(x, width=y) for x, y in zip(row, max_lens))) + '\n'
        participation_str +='```'
        embed.add_field(name='Participation', value=participation_str)

        return embed