function notify(day, time) {
    let found = new Notification('Dose trouvée !', {
        body: `Trouvé une dose le ${day} à ${time}`,
        icon: 'https://socoemergency.org/wp-content/uploads/2020/11/icon-vaccine.png'
    });
    setTimeout(() => { found.close() }, 10000);
    let alerte = new Audio("https://ozna.me/Metal-Gear-Alert_-Sound-Effect.mp3");
    alerte.play();
    document.title = "⬤ " + document.title;
    document.addEventListener("visibilitychange", () => {
        if (document.title[0] == "⬤") {
            document.title = document.title.slice(2);
        }
    });
};

function parse_date(date) {
    let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    date = date.split(" ");
    let m = months.indexOf(date[1]) + 1;
    return new Date(`${m}-${date[0]}-2021`);
}

function refresh(motive) {
    let changeEvent = new Event("change", {"bubbles": true});
    motive.selectedIndex = 0;
    motive.dispatchEvent(changeEvent);
    setTimeout(() => {
        motive.selectedIndex = 1;
        motive.dispatchEvent(changeEvent);
    }, 500);
}


if (Notification.permission != "granted") {
    Notification.requestPermission();
};


// ======= For Desktop version =======
function desktop() {
    document.removeEventListener("visibilitychange", () => document.title = document.title.slice(2));
    let motive = document.getElementById('booking_motive');

    let loop = setInterval(() => {
        // If the availability is for later ("Prochain rendez-vous le ...")
        let later = document.querySelector('div.dl-desktop-availabilities-overlay div.availabilities-message button.dl-button-small-primary.dl-button.dl-button-size-normal');
        let dateButton = document.querySelector("div.availabilities-slot");

        if (later) {
            later.click()
        } else if (dateButton) {
            let dayColumn = dateButton.parentElement.parentElement;
            let day = dayColumn.querySelector("div.availabilities-day-date").innerText;
            let date = parse_date(day);

            if (date <= new Date("06-14-2021")) {
                dateButton.click();
    
                notify(day, dateButton.innerText);
    
                clearInterval(loop);
                var restart = setTimeout(() => {
                    desktop();
                }, 60000);
                document.body.addEventListener('click', () => {
                    clearTimeout(restart);
                    document.body.removeEventListener('click');
                }, true);
            } else {
                refresh(motive);
            }
        } else {
            refresh(motive);
        };
    }, 4000);
};





// Monitor and log on desktop version
function monitor() {
    let motive = document.getElementById('booking_motive');

    let loop = setInterval(() => {
        // If the availability is for later ("Prochain rendez-vous le ...")
        let later = document.querySelector('div.dl-desktop-availabilities-overlay div.availabilities-message button.dl-button-small-primary.dl-button.dl-button-size-normal');
        let dateButton = document.querySelector("div.availabilities-slot");

        if (later) {
            later.click()
        } else if (dateButton) {
            let dayColumn = dateButton.parentElement.parentElement;
            let day = dayColumn.querySelector("div.availabilities-day-date").innerText;
            let date = parse_date(day);

            if (date < new Date("06-14-2021")) {
                let currentDate = new Date();
                let cDay = currentDate.getDate();
                let cMonth = currentDate.getMonth() + 1;
                let cYear = currentDate.getFullYear();
                localStorage.setItem("rec", localStorage.getItem("rec") + `${cDay}/${cMonth}/${cYear},${currentDate.getHours()}:${currentDate.getMinutes()};`)
                refresh(motive);
            } else {
                refresh(motive);
            }
        } else {
            refresh(motive);
        };
    }, 2000);
};


/*
let script = document.createElement('script');
script.src = "https://gist.githubusercontent.com/user038418/b51a70d079434dca50b338aa78e0d6f7/raw/809e1190599036942bb8dc40db1f4ba178865a6e/PrestoMaDose.js";
document.body.appendChild(script);

let button = document.createElement('button');
button.setAttribute('onclick', 'desktop()');
button.onclick = () => {
    desktop();
};
button.innerText = "Trouver un rendez-vous";
button.id = "prestoMaDose";
button.setAttribute('style', "position: fixed;bottom: 1rem;right: 1rem;z-index: 11;background-color: #0596de;border: none;border-radius: .5rem;font-size: 1.5rem;padding: .5rem 1rem;color: #ffffff;");
document.body.appendChild(button);
*/
