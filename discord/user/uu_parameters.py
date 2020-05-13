from discord_argparse import *

param_converter = ArgumentConverter(
    unit_level = OptionalArgument(
        str,
        doc='Level of Unit',
    ),
    elite_flg = OptionalArgument(
        bool,
        doc='Is Unit Elite',
    )
)