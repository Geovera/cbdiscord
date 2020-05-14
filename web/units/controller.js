class UnitTableController{
    constructor(view){
        this.view = view;

        this.getAllUnits()
    }

    async getAllUnits(){
        try{
            const units_response = await fetch('/api/unit/all');
            this.view.drawTable((await units_response.json()).units);
        }catch(error){
            console.log(error);
            alert('Failed to get units')
        }
    }
}

export default UnitTableController;