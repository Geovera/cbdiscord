class Sync{

    async getHouses(){
        const houses_response = await fetch('/api/house/all');

        if(!houses_response.ok){
            throw Error('Failed to get units')
        }
        const houses = await houses_response.json();

        return houses;
    }

    async hasHouse(){
        const response = await fetch('/api/house/has-house');

        if(response.status === 401){
            return false;
        }
        if(!response.ok){
            throw Error('Failed to get units')
        }
        const has_house = await response.json();

        return has_house;
    }

    async requestHouse(house_id){
        const response = await fetch('/api/house/request', {
            method: "POST",
            body: JSON.stringify({house_id: house_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok){
            throw Error('Failed to Send Request')
        }
    }
}

export default Sync;