class LoginView extends EventTarget {
    constructor(element){
      super()
      this.element = element
  
      this.login_field    = this.element.querySelector("[name=login]")
      this.password_field = this.element.querySelector("[name=password]")
      this.login_button   = this.element.querySelector("#login_button")
  
      this.login_button.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("login_attempt", {detail: {
          login: this.login_field.value,
          password: this.password_field.value }
        }))
      })
  
    }
  
    show(){
      this.element.style.display = ""
    }
  
    hide(){
      this.element.style.display = "none"
    }
  }
  
  export default LoginView
  