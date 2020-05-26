import Sync from "./sync.js";

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

class MyHouseController{

    constructor(view){
        this.view               = view;
        this.sync               = new Sync();
        this.permission_level   = 1000;
        this.members            = [];
        this.requests           = [];
        this.house              = {};

        this.view.addEventListener("create_house",          (event) => this.createHouse(event.detail));
        this.view.addEventListener("modify_house",          (event) => this.modifyHouse(event.detail));
        this.view.addEventListener("participation_attemp",  (event) => this.attempParticipate(event.detail));
        this.view.addEventListener("member_select",         (event) => this.selectMember(event.detail));
        this.view.addEventListener("modify_member_role",    (event) => this.modifyMemberRole(event.detail.member_id, event.detail.role));
        this.view.addEventListener("kick_member",           (event) => this.kickMember(event.detail));
        this.view.addEventListener("request_select",        (event) => this.selectRequest(event.detail));
        this.view.addEventListener("accept_request",        (event) => this.acceptRequest(event.detail));
        this.view.addEventListener("reject_request",        (event) => this.rejectRequest(event.detail));

        this.refresh();
        setInterval(() => {
            this.refresh();
        }, 10000);

        this.view.updateViews(undefined);

    }

    async createHouse(house){
        try{
            await this.sync.createHouse(house);
            alert('House Created');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to Create House')
        }
    }
    async modifyHouse(house){
        try{
            await this.sync.modifyHouse(house);
            alert('House Modified');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to Modify House')
        }
    }

    async modifyMemberRole(member_id, role){
        try{
            await this.sync.modifyMemberRole(member_id, role);
            alert('Role Modified');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to modify role')
        }
    }

    async kickMember(member_id){
        try{
            await this.sync.kickMember(member_id);
            alert('Member Kicked');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to Kick Member');
        }
    }

    async refresh(){
        this.getHouse();
        this.getParticipation();
        this.getMembers();
        this.getPermissionLevel();
        this.getRequests();
    }

    async acceptRequest(user_id){
        try{
            await this.sync.acceptRequest(user_id);
            alert('Request Accepted');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to Accept Request')
        }
    }
    async rejectRequest(user_id){
        try{
            await this.sync.rejectRequest(user_id);
            alert('Request Refused');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to Refuse Request')
        }
    }

    selectRequest(index){
        this.view.selectRequest(this.requests[index]);
    }
    async selectMember(index){
        const member = this.members[index];
        try{
            const units = await this.sync.getMemberUnits(member.id);
            this.view.drawMemberUnitsTable(units);
            this.view.selectMember(member);
        }catch(error){
            console.log(error);
            alert('Failed at Selecting Member');
        }
    }

    async getRequests(){
        this.requests = [];
        try{
            this.requests = await this.sync.getRequests();
        }catch(error){
            console.log(error);
        }
        this.view.drawRequestsTable(this.requests);
    }

    async getMembers(){
        this.members = [];
        try{
            this.members = await this.sync.getMembers();
        }catch(error){
            console.log(error);
            // alert('Failed to get Members');
        }
        this.view.drawMembersTable(this.members);
    }

    async attempParticipate(decision){
        try{
            await this.sync.updateParticipation(decision);
            alert('Update Successfull');
            this.refresh();
        }catch(error){
            console.log(error);
            alert('Failed to Update Participaation');
        }
    }

    async getParticipation(){
        try{
            const data = await this.sync.getParticipation();
            this.view.updateParticipationView(data);
        }catch(error){
            console.log(error);
        }
    }

    async getPermissionLevel(){
        try{
            const permission_level = await this.sync.getPermissionLevel();
            if(this.getPermissionLevel !== permission_level){
                this.permission_level = permission_level;
                this.view.updatePermissions(this.permission_level);
            }
        }catch(error){
            console.log(error);
        }
    }

    async getHouse(){
        try{
            const house = await this.sync.getHouse();
            if(!isEquivalent(this.house, house)){
                this.house = house;
                this.view.updateViews(house);
            }
        }catch(error){
            this.house = {};
            this.view.updateViews();
            console.log(error);
        }
    }
}

export default MyHouseController;