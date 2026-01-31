const rawSegments = [
    { name: "Auto",               start: "0:20", end: "0:00" },
    { name: "Delay",              start: "0:03", end: "0:00" },
    { name: "Transition Shift",   start: "2:20", end: "2:10" },
    { name: "Shift 1",            start: "2:10", end: "1:45" },
    { name: "Shift 2",            start: "1:45", end: "1:20" },
    { name: "Shift 3",            start: "1:20", end: "0:55" },
    { name: "Shift 4",            start: "0:55", end: "0:30" },
    { name: "End Game",           start: "0:30", end: "0:00" }
];

const parseTime = str => {
    const [m, s] = str.split(":").map(Number);
    return (m * 60 + s) * 1000;
};


// ----- Preprocess segments with durations + cumulative start -----
let cumulative = 0;
const segments = rawSegments.map(seg => {
    const startMs = parseTime(seg.start);
    const endMs = parseTime(seg.end);
    const duration = startMs - endMs;
    const segObj = {
        name: seg.name,
        startMs,
        endMs,
        duration,
        cumulativeStart: cumulative
    };
    cumulative += duration;
    return segObj;
});


// ----- Timer state -----
let state = {
    running: false,
    startTimestamp: null,
    accumulatedTime: 0
};

// restore previous state (optional)
const saved = localStorage.getItem("seq-timer");
if (saved) state = JSON.parse(saved);

function saveState() {
    localStorage.setItem("seq-timer", JSON.stringify(state));
}

function totalElapsed() {
    if (!state.running) return state.accumulatedTime;
    return state.accumulatedTime + (Date.now() - state.startTimestamp);
}


// ----- Find current segment -----
function getCurrentSegment(elapsed) {
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (elapsed < seg.cumulativeStart + seg.duration) {
            const elapsedInSegment = elapsed - seg.cumulativeStart;
            const displayMs = seg.startMs - elapsedInSegment;
            return {
                name: seg.name,
                displayMs
            };
        }
    }
    return null; // finished
}


// ----- Format milliseconds -----
function formatTimeMs(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2,"0")}`;
}


// ----- Render loop -----
const display = document.getElementById("time");
const phase = document.getElementById("phase");
const durationDisplay = document.getElementById("duration");

let prevRemainingSegSec = null;

function render() {
    const elapsed = totalElapsed();
    const current = getCurrentSegment(elapsed);

    if (!current) {
        display.textContent = "0:00";
        phase.textContent = "Match Over";
        durationDisplay.textContent = "0";
        return;
    }

    display.textContent = formatTimeMs(current.displayMs);
    const seg = segments.find(s => s.name === current.name);
    const elapsedInSegment = elapsed - seg.cumulativeStart;
    const remainingSegSec = Math.floor((seg.duration - elapsedInSegment) / 1000);
    durationDisplay.textContent = remainingSegSec;

    if (remainingSegSec !== prevRemainingSegSec) {
        if (remainingSegSec <= 2) { // heads-up alert
            vibrate();
        }

        if (remainingSegSec == 0) {
            switch (phase.textContent) {
                // force inject the upcoming phase even though technically not there yet (deviation of 1 second, the 0th second)
                // this is for a visual seamless transition, as the colors already change
                case "Auto":
                    phase.textContent = "Delay";
                    break;
                case "Delay":
                    phase.textContent = "Transition Shift";
                    break;
                case "End Game":
                    break;

                case "Transition Shift":
                    if (!AutoWinner) {
                        // if we are red and blue won auto, then we do not change colors
                        // if we are blue and red won auto, then we do not change colors
                        phase.textContent = "Shift 1";
                        break;
                    } else if (AutoWinner) {
                        // if we are red and won auto, we change color
                        // if we are blue and won auto, we change color
                        swapAlliance();
                        phase.textContent = "Shift 1";
                        break;
                    }

                case "Shift 1":
                    swapAlliance();
                    phase.textContent = "Shift 2";
                    break;

                case "Shift 2":
                    swapAlliance();
                    phase.textContent = "Shift 3";
                    break;

                case "Shift 3":
                    swapAlliance();
                    phase.textContent = "Shift 4";
                    break;

                case "Shift 4":
                    if (!AutoWinner) {
                        // if we are red and blue won auto, we change color
                        // if we are blue and red won auto, we change color
                        swapAlliance();
                        console.log(phase.innerText + remainingSegSec);
                        phase.textContent = "End Game";
                        console.log(phase.innerText + remainingSegSec);
                        break;
                    } else if (AutoWinner) {
                        // if we are red and won auto, then we do not change colors
                        // if we are blue and won auto, then we do not change colors
                        console.log(phase.innerText + remainingSegSec);
                        phase.textContent = "End Game";
                        console.log(phase.innerText + remainingSegSec);
                        break;
                    }

                default:
                    // extensive testing says we never hit this... good luck with debug if we ever get here
                    alert("Something broke:\nEither you borked something or this is an unknown edge case");
                    break;
            }
        }

        prevRemainingSegSec = remainingSegSec; // store new value
    }

    requestAnimationFrame(render);
}

render();


// ----- Controls -----
function start() {
    if (state.running) return;
    state.running = true;
    state.startTimestamp = Date.now();
    saveState();
}

function pause() {
    if (!state.running) return;
    state.accumulatedTime = totalElapsed();
    state.running = false;
    state.startTimestamp = null;
    saveState();
}

function reset() {
    state = {
        running: false,
        startTimestamp: null,
        accumulatedTime: 0
    };
    saveState();
    
    // Update display immediately to first segment
    const first = segments[0];
    display.textContent = formatTimeMs(first.startMs);
    phase.textContent = first.name;

    // Segment duration countdown
    durationDisplay.textContent = Math.ceil(first.duration / 1000);

    requestAnimationFrame(render);

    AutoWinner = false;
    WinAutoNo.style.display = "inline-block", WinAutoYes.style.display = "none";
}
