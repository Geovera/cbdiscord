class Sync{

    async getMyUnits(){
        const response = await fetch('/api/user/units');
        if(!response.ok){
            throw Error('Failed to get units')
        }
        const response_data = await response.json();

        return response_data;
    }

    async getUnitsToAdd(){
        const response = await fetch('/api/user/units-inverse');
        if(!response.ok){
            throw Error('Failed to get units')
        }
        const response_data = await response.json();

        return response_data;
    }

    async addUnit(data){
        const response = await fetch('/api/user/unit', {
            method: "POST",
            body: JSON.stringify({unit_id: data.id, unit_level: data.unit_level}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async modifyUnit(data){
        const response = await fetch(`/api/user/unit/${data.id}`, {
            method: "PUT",
            body: JSON.stringify({unit_id: data.id, unit_level: data.unit_level}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export default Sync;