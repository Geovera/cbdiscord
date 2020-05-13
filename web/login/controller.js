import Sync from './sync'

class LoginPageController{
    constructor(view){
        this.view = view;
        this.sync = new Sync();
        
        this.view.addEventListener('login_attempt', this.login(event.detail.credentials));
        this.view.addEventListener('register_attempt', this.login(event.detail.credentials))
    }

    async login(credentials){
        try{
            const user_data = await this.sync.login(credentials);
            localStorage.setItem('username', user_data.user_name);
            location.replace('/');
        }catch(error){
            console.log(error);
            alert('Failed to login')
        }
    }

    async login(credentials){
        try{
            const user_data = await this.sync.register(credentials);
            localStorage.setItem('username', user_data.user_name);
            location.replace('/');
        }catch(error){
            console.log(error);
            alert('Failed to register')
        }
    }
}

export default LoginPageController;