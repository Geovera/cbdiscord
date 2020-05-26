from discord_argparse import *

create_params = ArgumentConverter(
    name = RequiredArgument(
        str,
        doc='House Name',
    ),
    level = OptionalArgument(
        int,
        doc='House Level',
    ),
    camp_location = OptionalArgument(
        str,
        doc='Camp Location'
    )
)

mod_params = ArgumentConverter(
    name = OptionalArgument(
        str,
        doc='House Name',
    ),
    level = OptionalArgument(
        int,
        doc='House Level',
    ),
    camp_location = OptionalArgument(
        str,
        doc='Camp Location'
    )
)