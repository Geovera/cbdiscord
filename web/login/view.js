import LoginView        from "./login_view.js"
import RegisterView     from "./register_view.js"

class LoginPageView extends EventTarget {
    constructor(){
        super();
        this.login_form =       new LoginView(document.querySelector('login-form'));
        this.register_form =    new RegisterView(document.querySelector('register-form'));

        this.login_form.addEventListener("login_attempt", (event) => {
          this.dispatchEvent(new CustomEvent("login_attempt", {detail: event.detail}))
        })

        this.register_form.addEventListener("register_attempt", (event) => {
            this.dispatchEvent(new CustomEvent("register_attempt", {detail: event.detail}))
        })
    }
}

export default LoginPageView;