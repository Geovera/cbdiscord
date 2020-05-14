import TableView from "../views/table_view.js";

const default_columns =[
    {title: "ID", term: "id"},
    {title: "Name", term: "name"},
    {title: "Unit Type", term: "unit_type"},
    {title: "Stars", term: "stars"},
    {title: "HP", term:"hp"},
    {title: "PAP", term:"pap"},
    {title: "PD", term:"pd"},
    {title: "SAP", term:"sap"},
    {title: "SD", term:"sd"},
    {title: "BAP", term:"bap"},
    {title: "BD", term:"bd"},
    {title: "PDF", term:"pdf"},
    {title: "SDF", term:"sdf"},
    {title: "BDF", term:"bdf"},
    {title: "Leadership", term:"ld"},
    {title: "Hero Level", term:"hl"},
    {title: "Speed", term:"speed"},
    {title: "Unit Range", term:"unit_range"},
    {title: "Ammo", term:"ammo"},
    {title: "Labour", term:"labour"},
]

class UnitTableView extends EventTarget{

    constructor(){
        super();

        this.table_view = new TableView(default_columns);
    }

    drawTable(data){
        this.table_view.drawTable(data);
    }
}

export default UnitTableView;