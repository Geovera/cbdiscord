import TableView from "../views/table_view.js";

const units_columns = [
    {title: 'ID', term: 'id'},
    {title: 'Name', term: 'name'},
    {title: 'Type', term: 'unit_type'},
    {title: 'Level', term: 'unit_level'},
    {title: 'Elite', term: 'elit_flg'}
]

class MemberUnitsView extends EventTarget{

    constructor(element){
        super();

        this.element = element;
        this.table_view = new TableView(this.element, units_columns);
    }

    drawTable(data){
        console.log(data)
        this.table_view.drawTable(data);
    }

    show(){
        this.element.style.display = "";
    }
    hide(){
        this.element.style.display = "none"
    }
}

export default MemberUnitsView;