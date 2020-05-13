class Unit(object):

    def __init__(self, id, name, unit_type, stars=0, hp=0, pap=0, pd=0, sap=0, sd=0, bap=0, bd=0, pdf=0, sdf=0, bdf=0, ld=0, tc=0, hl=0, speed=0, unit_range=0, ammo=0, labour=0, 
        img=None, 
        vet_img=None,
        unit_level=0,
        elite_flg=None):
        if unit_type=='':
            unit_type = 'None'
        self.id = id
        self.name = name
        self.unit_type = unit_type
        self.stars = stars
        self.hp = hp
        self.pap = pap
        self.pd = pd
        self.sap = sap
        self.sd = sd
        self.bap = bap
        self.bd = bd
        self.pdf = pdf
        self.sdf = sdf
        self.bdf = bdf
        self.ld = ld
        self.tc = tc
        self.hl = hl
        self.speed = speed
        self.unit_range = unit_range
        self.ammo = ammo
        self.labour = labour
        self.img = img
        if img == None:
            self.img = 'https://www.conquerorsblade.com/static/img/Conqueror.cd5398b.png'
        self.vet_img = vet_img
        if vet_img == None:
            self.vet_img = 'https://www.conquerorsblade.com/static/img/Conqueror.cd5398b.png'

        self.unit_level = unit_level
        self.elite_flg = elite_flg

    @classmethod
    def from_dict(cls, **data):
        return cls(**data)

    def to_dict(self):
        return {
            'uid': self.id
        }

    def __str__(self):
        return '[{0}] {1}\t| {2}\t| {3}'.format(self.id, self.name, self.unit_type, self.stars)