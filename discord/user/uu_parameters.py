from discord_argparse import *

param_converter = ArgumentConverter(
    unit_level = OptionalArgument(
        str,
        doc='Level of Unit',
    ),
    eltie_flg = OptionalArgument(
        bool,
        doc='Is Unit Elite',
    )
)