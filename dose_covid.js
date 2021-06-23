class Search {
    constructor() {
        this.motive = document.getElementById('booking_motive');
    }

    parse_date(date) {
        let months = ["jan.", "fév.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
        date = date.split(" ");
        let m = months.indexOf(date[1]) + 1;
        return new Date(`2021-${m}-${date[0]}`);
    }

    notify(day, time) {
        let found = new Notification('Dose trouvée !', {
            body: `Trouvé une dose le ${day} à ${time}`,
            icon: 'https://socoemergency.org/wp-content/uploads/2020/11/icon-vaccine.png'
        });
        setTimeout(() => {
            found.close()
        }, 10000);
        let alerte = new Audio("https://ozna.me/Metal-Gear-Alert_-Sound-Effect.mp3");
        alerte.play();
        document.title = "⬤ " + document.title;
        document.addEventListener("visibilitychange", () => {
            if (document.title[0] === "⬤") {
                document.title = document.title.slice(2);
            }
        });
    }
    refresh() {
        console.log("refresh");
        let changeEvent = new Event("change", {"bubbles": true});
        this.motive.selectedIndex = 0;
        this.motive.dispatchEvent(changeEvent);
        setTimeout(() => {
            this.motive.selectedIndex = this.doseNumber +1;
            this.motive.dispatchEvent(changeEvent);
        }, 500);
    }

    get next_dates() {
        console.log("next set of dates");
        let clickEvent = new MouseEvent("click", {"bubbles": true});
        document.querySelectorAll('svg.dl-icon.availabilities-pagination-arrow.dl-icon-large')[1].dispatchEvent(clickEvent);
        return true;
    }

    desktop() {
        document.removeEventListener("visibilitychange", () => document.title = document.title.slice(2));

        let loop = setInterval(() => {
            // If the availability is for later ("Prochain rendez-vous le ...")
            let later = document.querySelector('div.dl-desktop-availabilities-overlay div.availabilities-message button.dl-button-small-primary.dl-button.dl-button-size-normal');
            let dateButtons = document.querySelectorAll("div.availabilities-slot");

            if (later) {
                later.click()
            } else if (dateButtons[0]) {
                let dateIndex = 0;
                let wait = false;

                let dayColumn = dateButtons[dateIndex].parentElement.parentElement;
                let day = dayColumn.querySelector("div.availabilities-day-date").innerText;
                let date = this.parse_date(day);
                console.log(date);

                if (this.filterType === 1 || this.filterType === 2) {
                    if (this.targetDate - date > 259200000) {
                        // Show the next set of dates
                        wait = this.next_dates;
                    } else {
                        while (((this.targetDate - date <= 86400000) && this.filterType === 1) || ((this.targetDate - date >= 0) && this.filterType === 2)) {
                            // Look at the next day
                            dateIndex += 1;
                            console.log("test: " + ((this.targetDate - date > 0) && this.filterType === 1));
                            console.log("next day, dateIndex: " + dateIndex);
                            console.log(dateButtons.length);
                            try {
                                dayColumn = dateButtons[dateIndex].parentElement.parentElement;
                                day = dayColumn.querySelector("div.availabilities-day-date").innerText;
                                date = this.parse_date(day);
                                console.log(date);
                            } catch (err) {
                                wait = this.next_dates;
                                throw err;
                            }

                        }
                    }
                }


                if ((this.filterType === 0 && date < this.targetDate) || (this.filterType === 1 && !(date > this.targetDate || date < this.targetDate)) || (this.filterType === 2 && date > this.targetDate)) {
                    dateButtons[dateIndex].click();

                    this.notify(day, dateButtons[dateIndex].innerText);

                    clearInterval(loop);
                    let restart = setTimeout(() => {
                        this.desktop();
                    }, 60000);
                    document.body.addEventListener('click', () => {
                        clearTimeout(restart);
                    }, {once: true});
                } else if (!wait) {
                    this.refresh();
                }
            } else {
                this.refresh();
            }
        }, 3000);

        document.querySelector('div#prestoMaDose button#stop').addEventListener('click', () => {
            clearInterval(loop);
        }, {once: true});
    }

    init() {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://raw.githack.com/user038418/prestomadose/main/style.css';
        document.head.appendChild(link);

        let label = document.createElement('label');
        label.for = "type";
        label.innerText = "Trouver une ... ";

        let selectDose = document.createElement('select');
        selectDose.classList.add("dl-select");
        selectDose.classList.add('form-control');
        selectDose.classList.add('booking-compact-select');

        let optionsDose = ["1ère", "2ème", "3ème"];
        optionsDose.forEach((type) => {
            let option = document.createElement('option')
            option.value = type;
            option.innerText = `${type} dose`;
            selectDose.appendChild(option);
        });

        let selectDate = document.createElement('select');
        selectDate.classList.add("dl-select");
        selectDate.classList.add('form-control');
        selectDate.classList.add('booking-compact-select');

        let optionsDate = ["avant", "pour", "apres"];
        optionsDate.forEach((type) => {
            let option = document.createElement('option')
            option.value = type;
            option.innerText = `${type} le`;
            selectDate.appendChild(option);
        });

        let inputDate = document.createElement('input');
        inputDate.type = "date";
        inputDate.name = "date";
        inputDate.value = "2021-07-14";
        inputDate.min = "2021-05-27";

        let startButton = document.createElement('button');
        startButton.onclick = () => {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }

            setTimeout(() => {
                this.targetDate = new Date(inputDate.value);
                this.filterType = selectDate.selectedIndex;
                this.doseNumber = selectDose.selectedIndex;
                this.desktop();
            }, 500);

            startButton.classList.add("check");
            setTimeout(() => {
                startButton.classList.remove("check");
            }, 3500);
        };
        startButton.innerText = "Lancer la recherche";

        let stopButton = document.createElement('button');
        stopButton.innerHTML = "&#10007;"
        stopButton.id = "stop";
        stopButton.title = "Arrêter la recherche";


        let div = document.createElement('div');
        div.id = "prestoMaDose";
        div.appendChild(label);
        div.appendChild(selectDose);
        div.appendChild(selectDate);
        div.appendChild(inputDate);
        div.appendChild(startButton);
        div.appendChild(stopButton);
        document.body.appendChild(div);
    }
}





let search = new Search();
search.init();