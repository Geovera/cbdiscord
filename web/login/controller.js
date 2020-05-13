import Sync from './sync.js'

class LoginPageController{
    constructor(view){
        this.view = view;
        this.sync = new Sync();
        
        this.view.addEventListener('login_attempt',     event       => this.login(event.detail));
        this.view.addEventListener('register_attempt',  event       => this.register(event.detail))
    }

    async login(credentials){
        try{
            if(credentials.username==="" || credentials.password===""){
                alert("Fields can't be empty")
            }
            const user_data = await this.sync.login(credentials);
            console.log(user_data)
            localStorage.setItem('username', user_data.username);
            location.replace('/');
        }catch(error){
            console.log(error);
            alert('Failed to login')
        }
    }

    async register(credentials){
        try{
            if(credentials.username==="" || credentials.password==="" || credentials.confirm_password===""){
                alert("Fields can't be empty")
                return;
            }
            if(credentials.password !== credentials.confirm_password){
                alert("Passwords don't match")
                return;
            }
            await this.sync.register({username: credentials.username, password: credentials.password});
            alert('Register Successful')
            location.reload();
        }catch(error){
            console.log(error);
            alert('Failed to register')
        }
    }
}

export default LoginPageController;