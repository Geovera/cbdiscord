import LoginView      from "./login_view.js"

class LoginPageView extends EventTarget {
    constructor(){

        this.login_form = new LoginView(document.querySelector('login-form'))
        this.login_form.addEventListener("login_attempt", (event) => {
          this.dispatchEvent(new CustomEvent("login_attempt", {detail: {login: event.detail.login, password: event.detail.password}}))
        })
        this.register_form.addEventListener("register_attempt", (event) => {
            this.dispatchEvent(new CustomEvent("register_attempt", {detail: {
                login: event.detail.login, 
                password: event.detail.password, 
                confirm_password: event.detail.confirm_password}
            }))
        })
    }
}

export default LoginPageView;