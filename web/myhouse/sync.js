class Sync{

    async getHouse(){
        const response = await fetch("/api/house");

        if(!response.ok){
            throw Error('Failed to get requests');
        }

        const data = await response.json();
        return data;
    }

    async createHouse(house){
        const response = await fetch("/api/house", {
            method: "POST",
            body: JSON.stringify(house),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw Error('Failed to Create House');
        }
    }

    async modifyHouse(house){
        const response = await fetch("/api/house", {
            method: "PUT",
            body: JSON.stringify(house),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw Error('Failed to Modify House');
        }
    }

    async getRequests(){
        const response = await fetch("/api/house/membership/request/all");

        if(!response.ok){
            throw Error('Failed to get requests');
        }

        const data = await response.json();
        return data;
    }

    async getMembers(){
        const response = await fetch("/api/house/member/all");

        if(!response.ok){
            throw Error('Failed to get Members');
        }

        const data = await response.json();
        return data;
    }

    async getPermissionLevel(){
        const response = await fetch("/api/house/membership/permissions");

        if(!response.ok){
            throw Error('Failed to get Permissions');
        }

        const data = await response.json();
        return data;
    }

    async modifyMemberRole(member_id, role){
        const response = await fetch(`/api/house/membership/${member_id}`, {
            method: "PUT",
            body: JSON.stringify({role: role}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw Error('Failed to get modify role');
        }
    }

    async kickMember(member_id){
        const response = await fetch(`/api/house/membership/${member_id}`,{
            method: "DELETE"
        });
        if(!response.ok){
            throw Error('Failed to Kick Member');
        }
    }

    async acceptRequest(user_id){
        const response = await fetch("/api/house/membership", {
            method: "POST",
            body: JSON.stringify({user_id: user_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw Error('Failed to get accept request');
        }
    }

    async rejectRequest(user_id){
        const response = await fetch(`/api/house/membership/request/${user_id}`, {
            method: "DELETE",
        });
        if(!response.ok){
            throw Error('Failed to get reject request');
        }
    }

    async getMemberUnits(member_id){
        const response = await fetch(`/api/house/member/${member_id}/units`);

        if(!response.ok){
            throw Error('Failed to get member units');
        }

        const data = await response.json();
        return data;
    }

    async getParticipation(){
        const response = await fetch('/api/house/war/participation');
        if(!response.ok){
            throw Error('Failed to get participations');
        }

        const data = await response.json();
        return data;
    }

    async updateParticipation(decision){
        const response = await fetch('/api/house/war/participation',{
            method: "POST",
            body: JSON.stringify({decision: decision}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw Error('Failed to Update Participation');
        }
    }
}

export default Sync;