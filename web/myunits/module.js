import MyUnitsView from "./view.js";
import MyUnitsController from "./controller.js";

if(!document.cookie){
    location.replace("/login")
}else{
    new MyUnitsController(new MyUnitsView);
}