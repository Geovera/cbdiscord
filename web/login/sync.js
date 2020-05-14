class Sync{
    async login(credentials){
        const login_response = await fetch('/api/user/login', {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(!login_response.ok){
            throw new Error(`Login failed with ${login_response.status}`)
        }
        const user_data = await login_response.json();

        return user_data;
    }

    async register(credentials){
        const register_response = await fetch('/api/user/register', {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(!register_response.ok){
            throw new Error(`Register failed with ${login_response.status}`)
        }
    }
}

export default Sync