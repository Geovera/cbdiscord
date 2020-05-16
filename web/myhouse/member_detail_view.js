const role_options = [
    {value: 'lg', text: 'Liege'},
    {value: 'sen', text: 'Seneschal'},
    {value: 'mar', text: 'Marshall'},
    {value: 'nob', text: 'Noble'},
    {value: 'tre', text: 'Treasurer'},
    {value: 'kng', text: 'Knight'}
]

class MemberDetailView extends EventTarget{

    constructor(element){
        super();

        this.element    = element;
        this.member     = {};
        this.fields = {
            weapon_img:     this.element.querySelector('weapon_img'),
            name:           this.element.querySelector('.detail_name'),
            role_selector:  this.element.querySelector('#role'),
            update_button:  this.element.querySelector('.modify_button'),
            delete_button:  this.element.querySelector('.delete_button')
        }
        this.fields.update_button.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("modify_member_role", {detail:{member_id: this.member.id, role: this.fields.role_selector.value}}))
        });
        this.fields.delete_button.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("kick_member", {detail: this.member.id}));
        });
        this.disable();
    }

    updatePermissions(perission_level){
        if(perission_level===0){
            this.changeRolesOptions(-1);
        }else{
            this.changeRolesOptions(perission_level);
        }
    }

    changeRolesOptions(start){
        var i, L = this.fields.role_selector.options.length - 1;
        for(i = L; i >= 0; i--) {
            this.fields.role_selector.remove(i);
        }
        for(var i = start + 1; i<role_options.length; i++){
            const opt = document.createElement("option");
            opt.value = role_options[i].value;
            opt.text  = role_options[i].text;
            this.fields.role_selector.add(opt);
        }
    }

    show(){
        this.element.style.display = ""
    }
    hide(){
        this.element.style.display = "none";
    }

    selectMember(member){
        this.member = member;
        if(!this.member){
            this.disable();
        }else{
            this.enable();
            this.refresh();
        }
    }

    refresh(){
        if(this.member.weapon_img){
            this.fields.weapon_img.src      = this.member.weapon_img;
        }
        this.fields.name.innerText          = this.member.username;
        this.fields.role_selector.value     = this.member.lk_key;
    }

    clear(){
        this.fields.weapon_img.src          = "";
        this.fields.name.innerText          = "---";
    }

    enable(){
        this.fields.role_selector.disabled = false;
        this.fields.update_button.disabled = false;
        this.fields.delete_button.disabled = false;
    }
    disable(){
        this.fields.role_selector.disabled = true;
        this.fields.update_button.disabled = true;
        this.fields.delete_button.disabled = true;
    }
}

export default MemberDetailView;