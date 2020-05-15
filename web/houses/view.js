import TableView from "../views/table_view.js"

const house_columns = [
    {title: 'ID', term: 'id'},
    {title: 'Name', term: 'house_name'},
    {title: 'Liege', term: 'liege_username'},
    {title: 'Level', term: 'house_level'},
    {title: 'Camp Location', term: 'camp_locaiton'}
];

class HousesView extends EventTarget{

    constructor(){
        super();

        this.join_tab           = document.querySelector('.tab');
        this.join_button        = this.join_tab.querySelector('.join_button');
        this.houses_table_view  = new TableView($('table-wrapper'), house_columns);
    }

    drawTable(data){
        this.houses_table_view.drawTable(data);
    }

}

export default HousesView;