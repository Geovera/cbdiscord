const columns =[
    {title: "ID"},
    {title: "Name"},
    {title: "Unit Type"},
    {title: "Stars"},
    {title: "HP"},
    {title: "PAP"},
    {title: "PD"},
    {title: "SA"},
    {title: "SD"},
    {title: "BAP"},
    {title: "BD"},
    {title: "PDF"},
    {title: "SDF"},
    {title: "BDF"},
    {title: "Leadership"},
    {title: "Hero Level"},
    {title: "Speed"},
    {title: "Unit Range"},
    {title: "Ammo"},
    {title: "Labour"},
]

class UnitTableView extends EventTarget{

    constructor(){
        super();

        this.table      = $("#units-table")
        this.datatable = this.table.DataTable({
            columns: columns
        });

        // this.drawTable([{"a":"a",b:"b", c: null, d:null, e:null, f:null, g:null, h:null, i:null, j:null, k:null, l:null, m:null, n:null, o:null, p:null, q:null, r:null, s:null}]);
    }

    drawTable(data){
        const data_set = data.map((ele) => Object.values(ele));

        this.datatable.clear().rows.add(data_set).draw();
    }
}

export default UnitTableView;