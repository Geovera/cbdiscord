import Sync from "./sync.js"

class MyUnitsController{

    constructor(view){
        this.view = view;

        this.data =[];
        this.sync = new Sync();
        this.view.addEventListener("unit_tab_change", () => this.getMyUnits())
        this.view.addEventListener("add_tab_change", () => this.getUnitsToAdd())
        this.view.addEventListener("row_click", (event) => this.changeUnitDetail(event.detail));
        this.view.addEventListener("add_unit", (event) => this.addUnit(event.detail));
        this.view.addEventListener("modify_unit", (event) => this.modifyUnit(event.detail));

        this.getMyUnits();
    }

    async addUnit(data){
        try{
            await this.sync.addUnit(data);
            alert('Insertion Successful');
            this.view.unitAdded();
        }catch(error){
            console.log(error);
            alert('Insertion to update')
        }
    }

    async modifyUnit(data){
        try{
            await this.sync.modifyUnit(data);
            alert('Update Successful')
            this.view.unitModified();
        }catch(error){
            console.log(error);
            alert('Failed to update')
        }
    }

    changeUnitDetail(index){
        this.view.changeUnitDetail(this.data[index]);
    }

    async getMyUnits(){
        this.data = [];
        try{
            this.data = (await this.sync.getMyUnits()).units;
        }catch(error){
            console.log(error);
            // alert('Failed to get units')
        }
        this.view.drawTable(this.data);
    }

    async getUnitsToAdd(){
        this.data = [];
        try{
            this.data = (await this.sync.getUnitsToAdd()).units;
        }catch(error){
            console.log(error);
            // alert('Failed to get units')
        }
        this.view.drawTable(this.data);
    }
}

export default MyUnitsController;