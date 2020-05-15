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

        this.request_tab           = document.querySelector('.tab');
        this.request_button        = this.request_tab.querySelector('.request_house');
        this.houses_table_view     = new TableView($('table-wrapper'), house_columns);

        this.houses_table_view.addEventListener("row_click", (event) =>{
            this.dispatchEvent(new CustomEvent("house_select", {detail: event.detail}));
        });
        this.request_button.addEventListener("click", (event) => {
            this.dispatchEvent(new CustomEvent("request_attemp"));
        });
    }

    hideJoin(){
        this.request_tab.style.display = "none";
    }
    showJoin(){
        this.request_tab.style.display = "";
    }

    drawTable(data){
        this.houses_table_view.drawTable(data);
    }

}

export default HousesView;