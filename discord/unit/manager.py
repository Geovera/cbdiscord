import asyncio
import discord
import json
from discord.ext import commands
from discord.user import User
from unit.model import Unit
from util.api_requests import Api, ApiError
from .unit_parameters import *
from discord_argparse import ArgumentConverter
from util.embed_style import EmbedStyle

class UnitManager(commands.Cog):

    def __init__(self, bot, loop=None):
        self.bot = bot
        self.loop = loop or asyncio.get_event_loop()

    async def handleApiError(self, ctx, error):
        if error.error_code == 400:
            return await ctx.send(error.message)
        else:
            return await ctx.send('Unexpected error. Please try again')

    #@commands.HelpCommand()
    async def send_cog_help(self, cog):
        print('Hello')
        self.add_command_formatting(command)
        for name, param in command.clean_params.items():
            if isinstance(param.annotation, ArgumentConverter):
                arguments = param.annotation.arguments
                if not arguments:
                    continue
                self.paginator.add_line("Arguments:")
                max_size = max(len(name) for name in arguments)

                for name, argument in arguments.items():
                    entry = "{0}{1:<{width}} {2}".format(self.indent * " ", name, argument.doc, width=max_size)
                    self.paginator.add_line(self.shorten_text(entry))
        self.paginator.close_page()
        await self.send_pages()

    async def send_bot_help(self, command):
        print('There')
        self.add_command_formatting(command)
        for name, param in command.clean_params.items():
            if isinstance(param.annotation, ArgumentConverter):
                arguments = param.annotation.arguments
                if not arguments:
                    continue
                self.paginator.add_line("Arguments:")
                max_size = max(len(name) for name in arguments)

                for name, argument in arguments.items():
                    entry = "{0}{1:<{width}} {2}".format(self.indent * " ", name, argument.doc, width=max_size)
                    self.paginator.add_line(self.shorten_text(entry))
        self.paginator.close_page()
        await self.send_pages()

    @commands.command()
    async def modifyUnit(self, ctx, unit:str, *, params:modify_param_converter=modify_param_converter.defaults()):
        """Modify units by name or id. Specify parameters to be modified"""

        if not params:
            return await ctx.send('Some parameters have to be provided')
        data = None
        try:
            data = await self._getUnit(unit)
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
        
        if msg.content.lower() != 'yes':
            return await ctx.send('Operation aborted')
        try:
            await Api.put('/unit/{0}'.format(data['id']), params)
            return await ctx.send('Succesfully modifed {0}'.format(data['name']))
        except ApiError as error:
            return await self.handleApiError(ctx, error)


        

    @commands.command()
    async def insertUnit(self, ctx, name:str, *, params:insert_param_converter=insert_param_converter.defaults()):
        """Insert unit by name. Additional parameters can be added"""

        unit_data = params;
        unit_data['name'] = name;

        try:
            await Api.post('/unit', unit_data)
            return await ctx.send('Unit added successfully')
        except ApiError as error:
            return await self.handleApiError(ctx, error)

    @commands.command()
    async def unitinfo(self, ctx, *, unit:str):
        """Get info from unit"""

        data = None
        try:
            data = await self._getUnit(unit)
        except ApiError as error:
            return await self.handleApiError(ctx, error)

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
        return await EmbedStyle.createPages(self.bot, ctx, data, 5, self.createUnitPage)

    def createUnitPage(self, data, minI, maxI):
        embed = discord.Embed(color=0x19212d)
        embed.set_author(name='TestBot')

        units_str = '';
        for i in range(minI, maxI):
            if i < len(data):
                units_str+= str(data[i]) + '\n'

        embed.add_field(name='id\t| name\t| type\t| stars', value=units_str)

        return embed

    async def _getUnit(self, search_term):
        return await Api.get('/unit/{0}'.format(search_term))
        