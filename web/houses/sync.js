class Sync{

    async getHouses(){
        const houses_response = await fetch('/api/house/all');
    
        const houses = await houses_response.json();

        return houses;
    }
}

export default Sync;