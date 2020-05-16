class HouseView  extends EventTarget{
    
    constructor(element){
        super();

        this.element            = element;
        this.is_editing         = false;
        this.modify_btn          = this.element.querySelector('#modify_btn');
        this.create_btn         = this.element.querySelector('#create_btn')
        this.edit_btn           = this.element.querySelector('#edit_btn');
        this.title              = this.element.querySelector('#title');
        this.house              = {};

        this.display_fields = {
            element:            this.element.querySelector('#house_text'),
            name:               this.element.querySelector('#house_name'),
            house_level:        this.element.querySelector('#house_level'),
            liege_name:         this.element.querySelector('#liege_name'),
            camp_location:      this.element.querySelector('#camp_location'),
            // members: this.element.querySelector('.members'),
        }

        this.edit_fields = {
            element:            this.element.querySelector('#house_edit'),
            name:               this.element.querySelector('input#house_name'),
            house_level:        this.element.querySelector('input#house_level'),
            camp_location:      this.element.querySelector('input#camp_location'),
            // liege_name: this.element.querySelector('input.liege_name'),
            // members: this.element.querySelector('input.members'),
        }

        this.edit_btn.addEventListener("click", () => {
            this.toggleEdit();
        });
        this.create_btn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("create_house", {detail: {
                house_name:           this.edit_fields.name.value,
                house_level:        this.edit_fields.house_level.value,
                camp_location:      this.edit_fields.camp_location.value,
            }}))
        });
        this.modify_btn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("modify_house", {detail: {
                house_id:       this.house.id,
                house_name:           this.edit_fields.name.value ? this.edit_fields.name.value : this.house.name,
                house_level:    this.edit_fields.house_level.value ? this.edit_fields.house_level.value : this.house.house_level,
                camp_location:  this.edit_fields.camp_location.value ? this.edit_fields.camp_location.name.value : this.house.camp_location,
            }}))
        });

    }

    selectHouse(house){
        this.house = house;
        this.toggleView();
    }

    toggleView(){
        this.title.innerText = 'House';
        this.refreshText();
        this.hideEdit();
        this.showText();
        this.create_btn.style.display = "none";
    }

    updatePermissions(permission_level){
        if(permission_level<2){
            this.edit_btn.style.display = "";
        }else{
            this.edit_btn.style.display = "none";
        }
    }

    toggleCreate(){
        this.title.innerText = 'Create a House';
        this.hideText();
        this.showEdit();
        this.edit_btn.style.display     = "none";
        this.modify_btn.style.display   = "none";
        this.create_btn.style.display   = "";
    }

    toggleEdit(){
        this.is_editing = !this.is_editing;
        this.refresh();
    }

    refresh(){
        if(this.is_editing){
            this.hideText();
            this.showEdit();
        }else{
            this.refreshText();
            this.hideEdit();
            this.showText();
        }
    }

    refreshText(){
        this.display_fields.name.innerText          = `House Name: ${this.house.house_name}`;
        this.display_fields.house_level.innerText   = `House Level: ${this.house.house_level}`;
        this.display_fields.liege_name.innerText    = `Liege: ${this.house.liege_username}`;
        this.display_fields.camp_location.innerText = `Camp Location: ${this.house.camp_location}`;
    }

    showText(){
        this.display_fields.element.style.display = "";
    }

    hideText(){
        this.display_fields.element.style.display = "none"
    }

    showEdit(){
        this.edit_fields.element.style.display  = "";
        this.modify_btn.style.display           = "";
    }

    hideEdit(){
        this.edit_fields.element.style.display  = "none";
        this.modify_btn.style.display           = "none";
    }
}

export default HouseView;