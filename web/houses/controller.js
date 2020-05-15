import Sync from './sync.js';

class HousesController{

    constructor(view){
        this.view = view;
        this.sync = new Sync();

        this.getHouses();
    }

    async getHouses(){
        try{
            const houses = await this.sync.getHouses();
            this.view.drawTable(houses);
        }catch(error){
            console.log(error);
            alert('Failed to retrieve houses');
        }
    }
}

export default HousesController;