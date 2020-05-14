class TableView extends EventTarget{

    constructor(columns, overflow){
        super();
        if(!columns){
            throw Error('Columns are needed');
        }
        this.columns = columns;
        this.table      = $("#units_table")
        this.datatable = this.table.DataTable({
            columns: this.columns
        });
        if(overflow){
            this.$overflow_div = $("<div></div>").addClass("overflow_table");
            $("#units_table_filter").after(this.$overflow_div);
            this.table.detach();
            this.$overflow_div.append(this.table);
        }
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

export default TableView;