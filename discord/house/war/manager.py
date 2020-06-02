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

    @commands.command(aliases=["si","SI", "yes"])
    async def warYes(self, ctx):
        """Yes confirmation to current war"""
        await self.warParticipation(ctx, "Yes")

    @commands.command(aliases=["no", "NO"])
    async def warNo(self, ctx):
        """No confirmation to current war"""
        await self.warParticipation(ctx, "No")

    @commands.command(aliases=["idk", "IDK"])
    async def warIdk(self, ctx):
        """Maybe confirmation to current war"""
        await self.warParticipation(ctx, "Maybe")

    @commands.command(aliases=["guerra"])
    async def houseParticipation(self, ctx):
        try:
            session = await self.bot.getUserSession(ctx.message.author)
            data = await Api.getSession('/house/war/participation', session)
            
            date = parser.parse(data['war'].get('day'))
            await ctx.send('Participation for War: {0}/{1}/{2}'.format(date.year, date.month, date.day))
            members = data.get('participation')

            yes_list    = list(filter(lambda x: x.get('decision')=='Yes', members))
            no_list     = list(filter(lambda x: x.get('decision')=='No', members))
            idk_list    = list(filter(lambda x: x.get('decision')=='Maybe', members))

            yes_embed   = self.craftColumns(yes_list, 3, 'Yes')
            no_embed    = self.craftColumns(no_list, 3, 'No')
            idk_embed   = self.craftColumns(idk_list, 3, 'Maybe')

            await ctx.send(embed=yes_embed)
            await ctx.send(embed=no_embed)
            await ctx.send(embed=idk_embed)
        except ApiError as error:
            await ctx.send(error.message)

    def craftColumns(self, data, numOfColumns, title):
        embed = discord.Embed()
        embed.set_author(name=title)

        if(len(data) == 0):
            embed.add_field(name='Members', value='None')
            return embed

        lens = len(data)//numOfColumns
        rem = len(data)%numOfColumns
        if rem!=0:
            lens += 1
        table = []

        for i in range(lens):
            temp = []
            for j in range(numOfColumns):
                index = (numOfColumns*i) + j
                if index < len(data):
                    temp.append(data[index].get('username'))
                else:
                    # Add empty cell for zipping purposes
                    temp.append(' ')
            table.append(temp)

        headers = ['a', 'b', 'c']
        max_lens = [len(str(max(i, key=lambda x: len(str(x))))) for i in zip(headers, *table)]
        out_str = '```'
        for row in table:
            out_str += (' | '.join('{0:{width}}'.format(x, width=y) for x, y in zip(row, max_lens))) + '\n'
        out_str += '```'
        embed.add_field(name="Members", value=out_str)

        return embed