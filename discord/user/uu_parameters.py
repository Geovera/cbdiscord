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

register_params = ArgumentConverter(
    username = OptionalArgument(
        str,
        doc='Username for web app',
    ),
    password = OptionalArgument(
        str,
        doc='Password for web app',
    )
)