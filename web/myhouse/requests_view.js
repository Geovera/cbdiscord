import TableView from '../views/table_view.js'

const requests_columns = [
    {title: 'ID', term: 'id'},
    {title: 'Name', term: 'username'}
];
class RequestsView extends EventTarget{

    constructor(element){
        super();

        this.element            = element;
        this.request            = {};
        this.accept_button      = this.element.querySelector('#accept');
        this.reject_button      = this.element.querySelector('#reject');
        this.table_view         = new TableView(this.element, requests_columns);

        this.table_view.addEventListener("row_click", (event) => {
            this.dispatchEvent(new CustomEvent("request_select", {detail: event.detail}));
        });
        this.accept_button.addEventListener('click', () => {
            this.requestEvent("accept_request");
        });
        this.reject_button.addEventListener('click', () => {
            this.requestEvent("reject_request");
        });
        this.disable()
    }

    selectRequest(request){
        this.request = request;
        if(!request){
            this.disable();
        }else{
            this.enable();
        }
    }
    requestEvent(event_name){
        if(!this.request){
            alert('No request selected');
        }
        this.dispatchEvent(new CustomEvent(event_name, {detail: this.request.id}));
    }

    drawTable(data){
        this.table_view.drawTable(data);
    }

    show(){
        this.element.style.display = "";
    }
    hide(){
        this.element.style.display = "none"
    }

    enable(){
        this.accept_button.disabled = false;
        this.reject_button.disabled = false;
    }
    disable(){
        this.accept_button.disabled = true;
        this.reject_button.disabled = true;
    }
}

export default RequestsView;