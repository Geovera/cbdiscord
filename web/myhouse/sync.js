class Sync{

    async getRequests(){
        const response = await fetch("/api/house/requests");

        if(!response.ok){
            throw Error('Failed to get requests');
        }

        const data = await response.json();
        return data;
    }

    async getMembers(){
        const response = await fetch("/api/house/members");

        if(!response.ok){
            throw Error('Failed to get Members');
        }

        const data = await response.json();
        return data;
    }

    async getPermissionLevel(){
        const response = await fetch("/api/house/my-permission");

        if(!response.ok){
            throw Error('Failed to get Permissions');
        }

        const data = await response.json();
        return data;
    }

    async modifyMemberRole(member_id, role){
        const response = await fetch("/api/house/modify-role", {
            method: "POST",
            body: JSON.stringify({member_id: member_id, role: role}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok){
            throw Error('Failed to get modify role');
        }
    }

    async kickMember(member_id){
        const response = await fetch(`/api/house/delete-member/${member_id}`,{
            method: "DELETE"
        });
        if(!response.ok){
            throw Error('Failed to Kick Member');
        }
    }

    async acceptRequest(user_id){
        const response = await fetch("/api/house/accept-request", {
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
        const response = await fetch(`/api/house/reject-request/${user_id}`, {
            method: "DELETE",
        });
        if(!response.ok){
            throw Error('Failed to get reject request');
        }
    }

    async getMemberUnits(member_id){
        const response = await fetch(`/api/house/member-units/${member_id}`);

        if(!response.ok){
            throw Error('Failed to get member units');
        }

        const data = await response.json();
        return data;
    }

    async getParticipation(){
        const response = await fetch('/api/house/participation');
        if(!response.ok){
            throw Error('Failed to get participations');
        }

        const data = await response.json();
        return data;
    }

    async updateParticipation(decision){
        const response = await fetch('/api/house/participation',{
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