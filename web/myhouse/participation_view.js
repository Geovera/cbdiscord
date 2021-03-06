import TableView from "../views/table_view.js";

const participation_column = [
    {title: "Name", term: "username"},
    {title: "Decision", term: "decision"}
];

class ParticipationView extends EventTarget{

    constructor(element){
        super();

        this.element        = element;
        this.war_date       = element.querySelector("#war_date")
        this.yes_button     = element.querySelector("#yes");
        this.maybe_button   = element.querySelector("#maybe");
        this.no_button      = element.querySelector("#no");
        this.table_view     = new TableView($(element), participation_column);

        this.yes_button.addEventListener("click", (event) => {
            this.dispatchEvent(new CustomEvent("participation_atempt", {detail:'Yes'}));
        });
        this.maybe_button.addEventListener("click", (event) => {
            this.dispatchEvent(new CustomEvent("participation_atempt", {detail: 'Maybe'}));
        });
        this.no_button.addEventListener("click", (event) => {
            this.dispatchEvent(new CustomEvent("participation_atempt", {detail: 'No'}));
        });
    }

    updateParticipation(data){
        this.updateWarDate(data.war);
        this.drawTable(data.participation);
    }
    updateWarDate(war){
        const day_str = new Date(war.day).toLocaleDateString();
        this.war_date.innerText = 'WarDate: ' + day_str;
    }

    drawTable(data){
        this.table_view.drawTable(data);
    }
}

export default ParticipationView;