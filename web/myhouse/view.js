import HouseView            from "./house_view.js";
import ParticipationView    from "./participation_view.js";
import MembersView          from "./members_view.js";
import RequestsView         from "./requests_view.js";
import MemberUnitsView      from "./member_units_view.js";

class MyHouseController extends EventTarget{

    constructor(){
        super();

        this.house_view         = new HouseView(document.querySelector('house-area'));
        this.participation_view = new ParticipationView(document.querySelector('war-participation'));
        this.members_view       = new MembersView(document.querySelector('members-area'));
        this.requests_view      = new RequestsView(document.querySelector('requests-area'));
        this.member_units_view  = new MemberUnitsView(document.querySelector('member-units'))
        this.area_1             = document.querySelector('#area_1');
        this.area_2             = document.querySelector('#area_2');


        this.house_view.addEventListener("create_house", (event) => {
            this.dispatchEvent(new CustomEvent("create_house", {detail: event.detail}));
        });
        this.house_view.addEventListener("modify_house", (event) => {
            this.dispatchEvent(new CustomEvent("modify_house", {detail: event.detail}));
        });
        this.participation_view.addEventListener("participation_atempt", (event) => {
            this.dispatchEvent(new CustomEvent("participation_attemp", {detail: event.detail}));
        });
        this.members_view.addEventListener("member_select", (event) => {
            this.dispatchEvent(new CustomEvent("member_select", {detail: event.detail}));
        });
        this.members_view.addEventListener("modify_member_role", (event) => {
            this.dispatchEvent(new CustomEvent("modify_member_role", {detail: event.detail}));
        });
        this.members_view.addEventListener("kick_member", (event) => {
            this.dispatchEvent(new CustomEvent("kick_member", {detail: event.detail}));
        });
        this.requests_view.addEventListener("request_select", (event) => {
            this.dispatchEvent(new CustomEvent("request_select", {detail: event.detail}));
        });
        this.requests_view.addEventListener("accept_request", (event) => {
            this.dispatchEvent(new CustomEvent("accept_request", {detail: event.detail}));
        });
        this.requests_view.addEventListener("reject_request", (event) => {
            this.dispatchEvent(new CustomEvent("reject_request", {detail: event.detail}));
        });

        this.hideArea1();
        this.hideArea2();
    }

    drawParticipationTable(data){
        this.participation_view.drawTable(data);
    }

    drawMemberUnitsTable(data){
        this.member_units_view.drawTable(data);
    }

    selectRequest(request){
        this.requests_view.selectRequest(request);
    }
    drawRequestsTable(data){
        this.requests_view.drawTable(data);
    }

    selectMember(member){
        this.members_view.selectMember(member);
    }

    drawMembersTable(data){
        this.members_view.drawTable(data);
    }

    updatePermissions(permission_level){
        if(permission_level<2){
            this.showArea2();
            this.requests_view.show();
            this.member_units_view.show();
        }else{
            this.hideArea2();
            this.requests_view.hide();
            this.member_units_view.hide();
        }
        this.members_view.updatePermissions(permission_level);
        this.house_view.updatePermissions(permission_level);
    }

    updateViews(house){
        if(!house){
            this.hideArea1();
            this.hideArea2();
            this.house_view.toggleCreate();
        }else{
            this.showArea1();
            this.house_view.selectHouse(house);
        }
    }

    showArea1(){
        this.area_1.style.display = "grid";
    }
    hideArea1(){
        this.area_1.style.display = "none";
    }
    showArea2(){
        this.area_2.style.display = "grid";
    }
    hideArea2(){
        this.area_2.style.display = "none";
    }
}

export default MyHouseController;