class HouseModel(object):
    def __init__(self, id, house_name, house_level, camp_location, liege_id, liege_username):
        self.id             = id
        self.name           = house_name
        self.level          = house_level
        self.camp_location  = camp_location
        self.liege_id       = liege_id
        self.liege          = liege_username
