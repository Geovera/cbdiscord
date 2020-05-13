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
            console.log(credentials)
            if(credentials.username==="" || credentials.password===""){
                alert("Fields can't be empty")
            }
            // const user_data = await this.sync.login(credentials);
            // localStorage.setItem('username', user_data.user_name);
            // location.replace('/');
        }catch(error){
            console.log(error);
            alert('Failed to login')
        }
    }

    async register(credentials){
        try{
            console.log(credentials)
            if(credentials.username==="" || credentials.password==="" || credentials.confirm_password===""){
                alert("Fields can't be empty")
                return;
            }
            if(credentials.password !== credentials.confirm_password){
                alert("Passwords don't match")
                return;
            }
            // const user_data = await this.sync.register(credentials);
            // localStorage.setItem('username', user_data.user_name);
            // location.replace('/');
        }catch(error){
            console.log(error);
            alert('Failed to register')
        }
    }
}

export default LoginPageController;