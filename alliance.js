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
            document.getElementById("alliance_color").textContent = "Red"
            break;

        case "blue":
            document.getElementById("body").style.backgroundColor = "var(--b-alliance)";
            document.getElementById("alliance_color").textContent = "Blue"
            break;

        default:
            document.getElementById("body").style.backgroundColor = "var(--r-alliance)";
            document.getElementById("alliance_color").textContent = "Red"
            break;
    }
}

function vibrate() {
    window.navigator.vibrate([250, 50, 250, 50, 500]);
}

const toggle = document.getElementById('toggle');
const WinAutoStat = document.getElementById('WinAuto');
let AutoWinner = false;
toggle.addEventListener('click', () => {
    AutoWinner = !AutoWinner; // toggle state
    AutoWinner ? WinAutoStat.textContent = "Yes" : WinAutoStat.textContent = "No"; // update button text
});
