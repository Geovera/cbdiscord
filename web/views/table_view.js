class TableView extends EventTarget{

    constructor(element, columns, overflow){
        super();

        
        if(!element){
            throw Error('No element passed');
        }
        if(!columns){
            throw Error('Columns are needed');
        }
        this.$element   = $(element);
        this.columns    = columns;
        this.$table     = this.$element.find('#data_table');
        this.datatable  = this.$table.DataTable({
            columns: this.columns
        });
        if(overflow){
            this.$overflow_div = $("<div></div>").addClass("overflow_table");
            this.$element.find('#data_table_filter').after(this.$overflow_div);
            this.$table.detach();
            this.$overflow_div.append(this.$table);
        }
        const datatable = this.datatable;
        const view = this;
        this.$table.children("tbody").on("click", "tr", function(){
            const index = datatable.row(this).index();
            view.$table.children("tbody").children().removeClass("active");
            $(datatable.row(this).node()).addClass("active");
            view.dispatchEvent(new CustomEvent("row_click", {detail: index}));
        })
    }

    drawTable(data){
        const data_set = data.map((ele) => {
            var d = [];
            this.columns.forEach((col) =>{
                const t = ele[col.term] !== undefined ? ele[col.term] : '-';
                d.push(t);
            })
            return d;
        });
        this.datatable.clear().rows.add(data_set).draw();
    }
}

export default TableView;