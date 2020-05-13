class RegisterView extends EventTarget {
    constructor(element){
        super()
        this.element                = element
        this.username_field         = this.element.querySelector("[name=username]")
        this.password_field         = this.element.querySelector("[name=password]")
        this.confirm_password_field = this.element.querySelector("[name=confirm_password]");
        this.login_button           = this.element.querySelector("#register_button")

        this.login_button.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("register_attempt", {detail: {
            username: this.username_field.value,
            password: this.password_field.value,
            confirm_password:  this.confirm_password_field.value
           }}))
        })
  
    }
  
    show(){
      this.element.style.display = ""
    }
  
    hide(){
      this.element.style.display = "none"
    }
  }

export default RegisterView