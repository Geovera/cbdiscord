from util.api_requests import Api
import asyncio
import discord
import json
from discord.ext import commands
from discord.user import User
from unit.model import Unit

class UnitManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()


    @commands.command()
    async def unitinfo(self, ctx, *, unit:str):
        """Get info from unit"""

        data = None
        try:
            unit_id = int(unit)
            data = await Api.get('/unit/id/{0}'.format(unit_id))
        except ValueError:
            data = await Api.get('/unit/name/{0}'.format(unit))

        if data==None:
            return await ctx.send('No unit found for: ' + unit)

        unit_data = Unit(**data)
        
        embed = discord.Embed();

        embed.title = unit_data.name
        embed.set_image(url=unit_data.vet_img)
        embed.set_thumbnail(url=unit_data.img)

        embed.add_field(name='ID', value=unit_data.id, inline=True)
        embed.add_field(name='Name', value=unit_data.name)
        embed.add_field(name='Type', value=unit_data.type, inline=True)
        embed.add_field(name='Stars', value=(unit_data.stars/2))
        embed.add_field(name='Speed', value=unit_data.speed, inline=True)
        embed.add_field(name='Range', value=unit_data.range)
        embed.add_field(name='Ammo', value=unit)
        embed.add_field(name='Leadership Cost', value=unit_data.leadership)
        embed.add_field(name='Troop Count', value=unit_data.troop_count, inline=True)
        embed.add_field(name='Piercing AP', value=unit_data.pap, inline=True)
        embed.add_field(name='Piercing Dg', value=unit_data.pd, inline=True)
        embed.add_field(name='Piercing Df', value=unit_data.pdf, inline=True)
        embed.add_field(name='Slasing AP', value=unit_data.sap, inline=True)
        embed.add_field(name='Slasing Dg', value=unit_data.sd, inline=True)
        embed.add_field(name='Slasing Df', value=unit_data.sdf, inline=True)
        embed.add_field(name='Blunt AP', value=unit_data.bap, inline=True)
        embed.add_field(name='Blunt Dg', value=unit_data.bd, inline=True)
        embed.add_field(name='Blunt Df', value=unit_data.bdf, inline=True)
        embed.add_field(name='Labour', value=unit_data.labour, inline=True)

        await ctx.send(embed=embed)


    @commands.command()
    async def allunits(self, ctx):
        """Gets all units"""

        data = await Api.get('/unit/all')
        if data == None:
            return await ctx.send('No units found')
        
        units_data = []
        for item in data['units']:
            units_data.append(Unit(**item))

        await self.createUnitTable(ctx, units_data)

    async def createUnitTable(self, ctx, data):
        max_rows = 5
        max_pages = len(data) // max_rows
        rem = len(data) % max_rows
        cur_page = 0;
        first_run = True
        if rem!=0:
            max_pages+=1

        
        while True:
            if first_run:
                embed = self.createUnitPage(data, max_rows*cur_page, max_rows*cur_page + max_rows)

                first_run = False
                msg = await ctx.send(embed=embed)

            reactmoji = []
            if max_pages == 1 and cur_page == 0:
                pass
            elif cur_page == 0:
                reactmoji.append('⏩')
            elif cur_page == max_pages-1:
                reactmoji.append('⏪')
            elif cur_page > 0 and cur_page < max_pages-1:
                reactmoji.extend(['⏪', '⏩'])

            for react in reactmoji:
                await msg.add_reaction(react)

            def check_react(reaction, user):
                if reaction.message.id != msg.id:
                    return False
                if user != ctx.message.author:
                    return False
                if str(reaction.emoji) not in reactmoji:
                    return False
                return True

            try:
                res, user = await self.bot.wait_for('reaction_add', timeout=30.0, check=check_react)
            except asyncio.TimeoutError:
                return await msg.clear_reactions()

            if '⏪' in str(res.emoji):
                cur_page-= 1

                embed = self.createUnitPage(data, max_rows*cur_page, max_rows*cur_page + max_rows)

                await msg.clear_reactions()
                await msg.edit(embed=embed)
            if '⏩' in str(res.emoji):
                cur_page+= 1

                embed = self.createUnitPage(data, max_rows*cur_page, max_rows*cur_page + max_rows)

                await msg.clear_reactions()
                await msg.edit(embed=embed)


    def createUnitPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='TestBot')

        units_str = '';
        for i in range(minI, maxI):
            if i < len(data):
                units_str+= str(data[i]) + '\n'

        embed.add_field(name='id\t| name\t| type\t| stars', value=units_str)

        return embed
