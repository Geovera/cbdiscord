class Unit(object):

    def __init__(self, id, name, type, stars=0, hp=0, pap=0, pd=0, sap=0, sd=0, bap=0, bd=0, pdf=0, sdf=0, bdf=0, leadership=0, troop_count=0, hero_level=0, speed=0, range=0, ammo=0, labour=0, 
        img=None, 
        vet_img=None,
        unit_level=0,
        elite_flg=None):
        self.id = id
        self.name = name
        self.type = type
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
        self.leadership = leadership
        self.troop_count = troop_count
        self.hero_level = hero_level
        self.speed = speed
        self.range = range
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
        return '[{0}] {1}\t| {2}\t| {3}'.format(self.id, self.name, self.type, self.stars)