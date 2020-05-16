import TableView from "../views/table_view.js"
import MemberDetailView from "./member_detail_view.js";

const members_columns = [
    {title: "ID", term: "id"},
    {title: "Name", term: "username"},
    {title: "Leadership", term: "leadership"},
    {title: "House Role", term: "house_role"}
]

class MembersView extends EventTarget{

    constructor(element){
        super();

        this.element            = element;
        this.table_detail       = this.element.querySelector('table-detail');
        this.table_view         = new TableView(this.table_detail, members_columns, true);
        this.member_detail_view = new MemberDetailView(this.element.querySelector('detail'));    

        this.table_view.addEventListener("row_click", (event) => {
            this.dispatchEvent(new CustomEvent("member_select", {detail: event.detail}));
        });
        this.member_detail_view.addEventListener("modify_member_role", (event) =>{
            this.dispatchEvent(new CustomEvent("modify_member_role", {detail: event.detail}));
        });
        this.member_detail_view.addEventListener("kick_member", (event) =>{
            this.dispatchEvent(new CustomEvent("kick_member", {detail: event.detail}));
        });

    }

    selectMember(member){
        this.member_detail_view.selectMember(member);
    }

    drawTable(data){
        this.table_view.drawTable(data);
    }

    updatePermissions(permission_level){
        if(permission_level < 2){
            this.member_detail_view.show();
            this.table_detail.style.display = "grid"
        }else{
            this.member_detail_view.hide();
            this.table_detail.style.display = "initial";
        }
        this.member_detail_view.updatePermissions(permission_level);
    }
}

export default MembersView