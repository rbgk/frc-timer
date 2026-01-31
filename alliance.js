const alliance = "alliance";
const cookieDomain = "rbgk.github.io/frc-timer";
const expireTime = 365;

function getCookie(key) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Setting a cookie
function setCookie(key, value, days, domain) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    const domainStr = domain ? "; domain=" + domain : "";
    document.cookie = `${key}=${value || ""}${expires}; path=/${domainStr}`;
}

function init() {
    setCookie(alliance, "red");
    document.getElementById("body").style.backgroundColor = "var(--r-alliance)";
}

function swapAlliance() {
    getCookie(alliance) === "red" ? setCookie(alliance, "blue") : setCookie(alliance, "red");

    switch (getCookie(alliance)) {
        case "red":
            document.getElementById("body").style.backgroundColor = "var(--r-alliance)";
            break;

        case "blue":
            document.getElementById("body").style.backgroundColor = "var(--b-alliance)";
            break;
    }
}

function vibrate() {
    let pause = 50;
    let pulse = 250;
    let one = 1000;
    window.navigator.vibrate([one, pause, one, pause, pulse, pause, pulse, pause, pulse, pause, pulse]);
}

const WinAutoToggle = document.getElementById('WinAutoToggle');
const WinAutoStat = document.getElementById('WinAuto');
const WinAutoNo = document.getElementById('WinAutoNo');
const WinAutoYes = document.getElementById('WinAutoYes');
let AutoWinner = false;
WinAutoToggle.addEventListener('click', () => {
    AutoWinner = !AutoWinner; // toggle state
    AutoWinner ? (WinAutoYes.style.display = "inline-block", WinAutoNo.style.display = "none" ): (WinAutoNo.style.display = "inline-block", WinAutoYes.style.display = "none"); // update button text
});

function chooseAlliance() {
    swapAlliance();
    alliance_color = getCookie(alliance);

    switch (alliance_color) {
        case "red":
            document.getElementById("alliance_color").textContent = "Red";
            break;

        case "blue":
            document.getElementById("alliance_color").textContent = "Blue";
            break;
    }
}