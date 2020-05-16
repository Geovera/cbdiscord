import TableView from "../views/table_view.js";
import UnitDetailView from "./detail_view.js"

const unit_columns =[
    {title: "ID", term: "id"},
    {title: "Name", term: "name"},
    {title: "Unit Type", term: "unit_type"},
    {title: "Stars", term: "stars"},
    {title: "HP", term:"hp"},
    // {title: "PAP", term:"pap"},
    // {title: "PD", term:"pd"},
    // {title: "SAP", term:"sap"},
    // {title: "SD", term:"sd"},
    // {title: "BAP", term:"bap"},
    // {title: "BD", term:"bd"},
    // {title: "PDF", term:"pdf"},
    // {title: "SDF", term:"sdf"},
    // {title: "BDF", term:"bdf"},
    // {title: "Leadership", term:"ld"},
    // {title: "Hero Level", term:"hl"},
    // {title: "Speed", term:"speed"},
    // {title: "Unit Range", term:"unit_range"},
    // {title: "Ammo", term:"ammo"},
    {title: "Labour", term:"labour"},
    {title: "Unit Level", term:"unit_level"},
    {title: "Elite", term:"elite_flg"}
]

class MyUnitView extends EventTarget{
    
    constructor(){
        super();

        this.my_units_add       = document.querySelector("#my_units");
        this.add_units          = document.querySelector("#add_units");
        this.unit_table_view    = new TableView($('table-wrapper'), unit_columns, true);
        this.unit_detail_view   = new UnitDetailView();
        this.my_units_tab       = true;
        this.my_units_add.addEventListener("click", (event) =>{
            this.changeTab(event.currentTarget);
            this.dispatchEvent(new CustomEvent("unit_tab_change"))
        });
        this.add_units.addEventListener("click", () =>{
            this.changeTab(event.currentTarget);
            this.dispatchEvent(new CustomEvent("add_tab_change"))
        });
        this.unit_table_view.addEventListener("row_click", (event) =>{
            this.dispatchEvent(new CustomEvent("row_click", {detail: event.detail}));
        });
        this.unit_detail_view.addEventListener("delete_unit", (event) =>{
            this.dispatchEvent(new CustomEvent("delete_unit", {detail: event.detail}));
        });
        this.unit_detail_view.addEventListener("modify_unit", (event) =>{
            this.dispatchEvent(new CustomEvent("modify_unit", {detail: event.detail}));
        });
        this.unit_detail_view.addEventListener("add_unit", (event) =>{
            this.dispatchEvent(new CustomEvent("add_unit", {detail: event.detail}));
        });
    }

    changeTab(tab){
        var i, tablinks;

        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        this.my_units_tab = !this.my_units_tab;
        this.unit_detail_view.toggleTabs(this.my_units_tab);
        tab.className += " active";
    }

    drawTable(data){
        this.unit_table_view.drawTable(data);
    }

    changeUnitDetail(data){
        this.unit_detail_view.changeUnit(data);
    }

    unitAdded(){
        this.unit_detail_view.clean();
        this.dispatchEvent(new CustomEvent("add_tab_change"))
    }

    unitsModified(){
        this.dispatchEvent(new CustomEvent("unit_tab_change"))
    }
}

export default MyUnitView;