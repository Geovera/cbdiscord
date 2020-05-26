import discord
from asyncio import TimeoutError

class EmbedStyle:

    @staticmethod
    async def createPages(bot, ctx, data, max_rows, createRowsFunc):
        if(len(data) == 0):
            return await ctx.send('No data')
        max_pages = len(data) // max_rows
        rem = len(data) % max_rows
        cur_page = 0;
        first_run = True
        if rem!=0:
            max_pages+=1

        
        while True:
            if first_run:
                embed = createRowsFunc(data, max_rows*cur_page, max_rows*cur_page + max_rows)
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
                res, user = await bot.wait_for('reaction_add', timeout=30.0, check=check_react)
            except TimeoutError:
                return await EmbedStyle.pagesTimeout(msg)

            if '⏪' in str(res.emoji):
                cur_page-= 1

                embed = createRowsFunc(data, max_rows*cur_page, max_rows*cur_page + max_rows)

                msg = await EmbedStyle.changePage(ctx, msg, embed)
            if '⏩' in str(res.emoji):
                cur_page+= 1

                embed = createRowsFunc(data, max_rows*cur_page, max_rows*cur_page + max_rows)

                msg = await EmbedStyle.changePage(ctx, msg, embed)

    @staticmethod
    async def pagesTimeout(msg):
        if isinstance(msg.channel, discord.channel.DMChannel):
            return await msg.delete();
        else:
            return await msg.clear_reactions();

    @staticmethod
    async def changePage(ctx, msg, embed):
        if isinstance(msg.channel, discord.channel.DMChannel):
            await msg.delete();
            return await ctx.send(embed=embed)
        else:
            await msg.clear_reactions();
            await msg.edit(embed=embed)
            return msg
