class UnitDetailView extends EventTarget{

    constructor(){
        super();

        this.unit = {};
        this.element = document.querySelector("unit-detail");

        this.fields = {
            img             : this.element.querySelector(".unit-img"),
            name            : this.element.querySelector(".unit-name"),
            level_input     : this.element.querySelector("#level-input"),
            elite_input     : this.element.querySelector("#elite-ckb"),
            button          : this.element.querySelector(".unit-button")
        }

        this.disableInput()
        this.fields.button.addEventListener("click", (event) =>{
            this.dispatchEvent(new CustomEvent("submit_detail", {detail: this.unit}))
        });
        this.fields.level_input.addEventListener("input", () =>{
            this.unit.unit_level = this.fields.level_input.value;
        })
        this.fields.elite_input.addEventListener("change", () =>{
            this.unit.elite_flg = this.fields.elite_input.checked;
        })
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
    }

    enableInput(){
        this.fields.level_input.disabled    = false;
        this.fields.elite_input.disabled    = false;
        this.fields.button.disabled         = false;
    }
    disableInput(){
        this.fields.level_input.disabled    = true;
        this.fields.elite_input.disabled    = true;
        this.fields.button.disabled         = true;
    }
}

export default UnitDetailView;