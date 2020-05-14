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

    constructor(columns){
        super();

        this.columns = columns ? columns : default_columns;
        this.table      = $("#units_table")
        this.datatable = this.table.DataTable({
            columns: this.columns
        });
        const datatable = this.datatable;
        const view = this;
        $("#units_table tbody").on("click", "tr", function(){
            const index = datatable.row(this).index();
            view.dispatchEvent(new CustomEvent("row_click", {detail: index}));
        })
    }

    drawTable(data){
        const data_set = data.map((ele) => {
            var d = [];
            this.columns.forEach((col) =>{
                d.push(ele[col.term]);
            })
            return d;
        });
        this.datatable.clear().rows.add(data_set).draw();
    }
}

export default UnitTableView;