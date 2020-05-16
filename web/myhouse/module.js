import MyHouseController from "./controller.js"
import MyHouseView from "./view.js";

if(!document.cookie){
    location.replace("/login")
}else{
    new MyHouseController(new MyHouseView())
}