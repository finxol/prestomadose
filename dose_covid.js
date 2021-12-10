class Search {
    constructor() {
        this.today = new Date();
    }

    /**
     * Parse a date string to a date object
     * @param {String} date Date to give to the object
     * @returns {Date} Date object set to the needed time
     */
    parse_date_string(date) {
        let months = ["jan.", "fév.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
        date = date.split(" ");
        let m = `${months.indexOf(date[1]) + 1}`;
        let day = `${date[0]}`;
        if (day.length === 1) {
            day = `0${day}`;
        }
        if (m.length === 1) {
            m = `0${m}`;
        }
        return new Date(`2021-${m}-${day}T00:00:00`);
    }

    /**
     * Parse a date string to a date object
     * @param {Date} date Date object to parse into a string
     * @return {String} Date string in the format yyyy/mm/dd
     */
    parse_date_object(date) {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        return `${year}-${month +1}-${day}`;
    }

    /**
     * Create a notification to inform a dose has been found
     * @param {String} day Day of the found dose
     * @param {String} time Time of the found dose
     */
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

    /**
     * Refresh the results list
     */
    refresh() {
        console.log("refresh");
        let changeEvent = new Event("change", {"bubbles": true});
        this.motive.selectedIndex = 0;
        this.motive.dispatchEvent(changeEvent);
        setTimeout(() => {
            this.motive.selectedIndex = this.doseNumber;
            this.motive.dispatchEvent(changeEvent);
        }, 500);
    }

    /**
     * Load the next set of dates
     * @returns {boolean} always true
     */
    get next_dates() {
        console.log("next set of dates");
        let clickEvent = new MouseEvent("click", {"bubbles": true});
        document.querySelectorAll('svg.dl-icon.availabilities-pagination-arrow.dl-icon-large')[1].dispatchEvent(clickEvent);
        return true;
    }

    /**
     * Controls the appointment search
     */
    desktop() {
        document.removeEventListener("visibilitychange", () => document.title = document.title.slice(2));

        let loop = setInterval(() => {
            // If the availability is for later ("Prochain rendez-vous le ...")
            let later = document.querySelector('#booking-content > div.booking.booking-compact-layout > div:nth-child(5) > div > div.dl-layout-container.dl-layout-spacing-xs-0 > div.dl-step-children.dl-layout-item.dl-layout-size-xs-12.dl-layout-size-sm-12 > div > div > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div > div > div > div > div > button > span');
            let dateButtons = document.querySelectorAll("div.availabilities-slot");

            if (later) {
                later.click()
            } else if (dateButtons[0]) {
                let dateIndex = 0;
                let wait = false;

                let dayColumn = dateButtons[dateIndex].parentElement.parentElement;
                let day = dayColumn.querySelector("div.availabilities-day-date").innerText;
                let date = this.parse_date_string(day);

                if (this.filterType === 1 || this.filterType === 2) {
                    if (this.targetDate - date > 259200000) {
                        // Show the next set of dates
                        wait = this.next_dates;
                    } else {
                        while (((this.targetDate - date > 0) && this.filterType === 1) || ((this.targetDate - date >= 0) && this.filterType === 2)) {
                            // Look at the next day
                            dateIndex += 1;
                            try {
                                dayColumn = dateButtons[dateIndex].parentElement.parentElement;
                                day = dayColumn.querySelector("div.availabilities-day-date").innerText;
                                date = this.parse_date_string(day);
                            } catch (err) {
                                wait = this.next_dates;
                                throw err;
                            }

                        }
                    }
                }

                console.log("if-test: " + (this.filterType === 1 && !(date > this.targetDate || date < this.targetDate)));


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

    /**
     * Initialise the bottom control bar
     */
    init() {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdn.jsdelivr.net/gh/user038418/prestomadose@v4.0/style.css';
        document.head.appendChild(link);

        let label = document.createElement('label');
        label.for = "type";
        label.innerText = "Trouver une ... ";

        let selectDose = document.createElement('select');
        selectDose.classList.add("dl-select");
        selectDose.classList.add('form-control');
        selectDose.classList.add('booking-compact-select');

        let booking_motive = document.querySelectorAll('select#booking_motive option');
        booking_motive.forEach((type) => {
            let option = document.createElement('option')
            option.value = type.value;
            option.innerText = type.textContent;
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
        inputDate.value = this.parse_date_object(this.today);
        inputDate.min = this.parse_date_object(this.today);

        let startButton = document.createElement('button');
        startButton.onclick = () => {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }

            setTimeout(() => {
                this.motive = document.getElementById('booking_motive');
                this.targetDate = new Date(`${inputDate.value}T00:00:00`);
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