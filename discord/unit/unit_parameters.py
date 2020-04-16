from discord_argparse import *

insert_param_converter = ArgumentConverter(
    type = OptionalArgument(
        str,
        doc='Type of Unit',
    ),
    stars = OptionalArgument(
        int,
        doc='Stars of unit',
    ),
    hp = OptionalArgument(
        int,
        doc='Health points',
    ),
    pap = OptionalArgument(
        int,
        doc='Piercing armor penetration',
    ),
    pd = OptionalArgument(
        int,
        doc='Piercing damage',
    ),
    pdf = OptionalArgument(
        int,
        doc='Piercing defense',
    ),
    sap = OptionalArgument(
        int,
        doc='Slashing armor penetration',
    ),
    sd = OptionalArgument(
        int,
        doc='Slasing damage',
    ),
    sdf = OptionalArgument(
        int,
        doc='Slasing defense',
    ),
    bap = OptionalArgument(
        int,
        doc='Blunt armor penetration',
    ),
    bd = OptionalArgument(
        int,
        doc='Blunt damage',
    ),
    bdf = OptionalArgument(
        int,
        doc='Blunt defense',
    ),
    ld = OptionalArgument(
        int,
        doc='Required leadership',
    ),
    tc = OptionalArgument(
        int,
        doc='Troop count of unit',
    ),
    hl = OptionalArgument(
        int,
        doc='Hero level required',
    ),
    speed = OptionalArgument(
        int,
        doc='Speed of unit',
    ),
    range = OptionalArgument(
        int,
        doc='Range of unit',
    ),
    ammo = OptionalArgument(
        int,
        doc='Ammo if unit',
    ),
    labour = OptionalArgument(
        int,
        doc='Resourse collection labour',
    ),
    img = OptionalArgument(
        str,
        doc='Url of unit image',
    ),
    vet_img = OptionalArgument(
        str,
        doc='Url of veterany image',
    )
)

modify_param_converter = ArgumentConverter(
    name = OptionalArgument(
        str,
        doc='New name',
    ),
    type = OptionalArgument(
        str,
        doc='Type of Unit',
    ),
    stars = OptionalArgument(
        int,
        doc='Stars of unit',
    ),
    hp = OptionalArgument(
        int,
        doc='Health points',
    ),
    pap = OptionalArgument(
        int,
        doc='Piercing armor penetration',
    ),
    pd = OptionalArgument(
        int,
        doc='Piercing damage',
    ),
    pdf = OptionalArgument(
        int,
        doc='Piercing defense',
    ),
    sap = OptionalArgument(
        int,
        doc='Slashing armor penetration',
    ),
    sd = OptionalArgument(
        int,
        doc='Slasing damage',
    ),
    sdf = OptionalArgument(
        int,
        doc='Slasing defense',
    ),
    bap = OptionalArgument(
        int,
        doc='Blunt armor penetration',
    ),
    bd = OptionalArgument(
        int,
        doc='Blunt damage',
    ),
    bdf = OptionalArgument(
        int,
        doc='Blunt defense',
    ),
    ld = OptionalArgument(
        int,
        doc='Required leadership',
    ),
    tc = OptionalArgument(
        int,
        doc='Troop count of unit',
    ),
    hl = OptionalArgument(
        int,
        doc='Hero level required',
    ),
    speed = OptionalArgument(
        int,
        doc='Speed of unit',
    ),
    range = OptionalArgument(
        int,
        doc='Range of unit',
    ),
    ammo = OptionalArgument(
        int,
        doc='Ammo if unit',
    ),
    labour = OptionalArgument(
        int,
        doc='Resourse collection labour',
    ),
    img = OptionalArgument(
        str,
        doc='Url of unit image',
    ),
    vet_img = OptionalArgument(
        str,
        doc='Url of veterany image',
    )
)