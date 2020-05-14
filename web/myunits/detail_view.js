class UnitDetailView extends EventTarget{

    constructor(){
        super();

        this.unit = {};
        this.element = document.querySelector("unit-detail");

        this.fields = {
            img             : this.element.querySelector(".unit_img"),
            name            : this.element.querySelector(".unit_name"),
            level_input     : this.element.querySelector("#level_input"),
            elite_input     : this.element.querySelector("#elite_ckb"),
            delete_button   : this.element.querySelector(".delete_button"),
            modify_button   : this.element.querySelector(".modify_button"),
            add_button      : this.element.querySelector(".add_button"),
        }

        this.disableInput()
        this.toggleTabs(true);
        this.fields.delete_button.addEventListener("click", (event) =>{
            this.dispatchEvent(new CustomEvent("delete_unit", {detail: this.unit.id}));
        });
        this.fields.modify_button.addEventListener("click", (event) =>{
            this.dispatchEvent(new CustomEvent("modify_unit", {detail: this.unit}));
        });
        this.fields.add_button.addEventListener("click", (event) =>{
            this.dispatchEvent(new CustomEvent("add_unit", {detail: this.unit}));
        });
        this.fields.level_input.addEventListener("input", () =>{
            this.unit.unit_level = this.fields.level_input.value;
        })
        this.fields.elite_input.addEventListener("change", () =>{
            this.unit.elite_flg = this.fields.elite_input.checked;
        })
    }

    toggleTabs(flg){
        if(flg){
            this.fields.delete_button.style.display = "";
            this.fields.modify_button.style.display = "";
            this.fields.add_button.style.display = "none";
        }else{
            this.fields.delete_button.style.display = "none";
            this.fields.modify_button.style.display = "none";
            this.fields.add_button.style.display = "";
        }
        this.clean();
    }

    changeUnit(unit){
        this.unit = unit;
        if(!this.unit){
            this.disableInput();
        }else{
            this.enableInput();
            this.refresh();
        }
    }

    refresh(){
        if(this.unit.img){
            this.fields.img.src = this.unit.img;
        }
        this.fields.name.innerText = this.unit.name;
        this.fields.level_input.value = this.unit.unit_level;
        this.fields.elite_input.checked = this.unit.elite_flg;
    }

    clean(){
        this.fields.img.src = "";
        this.fields.name.innerText = "---";
        this.fields.level_input.value = 0;
        this.fields.elite_input.checked = false;
        this.unit = {};
    }

    enableInput(){
        this.fields.level_input.disabled    = false;
        this.fields.elite_input.disabled    = false;
        this.fields.delete_button.disabled  = false;
        this.fields.modify_button.disabled  = false;
        this.fields.add_button.disabled     = false;
    }
    disableInput(){
        this.fields.level_input.disabled    = true;
        this.fields.elite_input.disabled    = true;
        this.fields.delete_button.disabled  = true;
        this.fields.modify_button.disabled  = true;
        this.fields.add_button.disabled     = true;
    }
}

export default UnitDetailView;