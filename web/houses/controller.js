import Sync from './sync.js';

class HousesController{

    constructor(view){
        this.view = view;
        this.sync = new Sync();

        this.houses = [];
        this.selectedIndex = undefined;
        this.getHouses();

        this.view.addEventListener("house_select", (event) => this.selectedIndex = event.detail);
        this.view.addEventListener("request_attemp", () => this.attempRequest());

        this.checkHouse();
        setInterval(async () => this.checkHouse(), 5000)
    }

    async attempRequest(){
        if(this.selectedIndex === undefined){
            alert("No house selected");
            return;
        }
        try{
            await this.sync.requestHouse(this.houses[this.selectedIndex].id);
            alert('Attemp Successfully Sent');
        }catch(error){
            console.log(error);
            alert("Attemp failed");
        }
    }

    async checkHouse(){
        try{
            const has_house = await this.sync.hasHouse();
            if(has_house){
                this.view.hideJoin();
            }else{
                this.view.showJoin();
            }
        }catch(error){
            console.log(error);
        }
    }

    async getHouses(){
        this.houses = [];
        try{
            this.houses = await this.sync.getHouses();
        }catch(error){
            console.log(error);
            alert('Failed to retrieve houses');
        }

        this.view.drawTable(this.houses);
    }
}

export default HousesController;