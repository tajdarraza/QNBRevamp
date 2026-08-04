// ================================
// Configuration
// ================================

const CENTER_X = 60;
const CENTER_Y = 60;
const RADIUS = 44;

const START_ANGLE = -90;

const progressPath = document.getElementById("progressPath");
const thumb = document.getElementById("thumb");


const percentLabel = document.getElementById("percent");
const paidLabel = document.getElementById("paid");

let currentProgress = 0;


// ======================================
// Convert Polar to Cartesian
// ======================================

function polarToCartesian(cx, cy, radius, angle){

    const radians = (angle - 90) * Math.PI / 180.0;

    return {

        x : cx + radius * Math.cos(radians),

        y : cy + radius * Math.sin(radians)

    };

}


// ======================================
// Build SVG Arc
// ======================================

function describeArc(cx,cy,radius,startAngle,endAngle){

    const start = polarToCartesian(
        cx,
        cy,
        radius,
        endAngle
    );

    const end = polarToCartesian(
        cx,
        cy,
        radius,
        startAngle
    );

    const largeArcFlag =
        endAngle-startAngle <=180 ? "0":"1";

    return [

        "M",start.x,start.y,

        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y

    ].join(" ");

}



// ======================================
// Update Thumb Position
// ======================================

function updateThumb(angle){

    const point =
        polarToCartesian(
            CENTER_X,
            CENTER_Y,
            RADIUS,
            angle
        );

    thumb.setAttribute(
        "transform",
        "translate("+
        point.x+
        ","+
        point.y+
        ")"
    );

}


// ======================================
// Draw Progress
// ======================================

function setProgress(value){

    value =
        Math.max(
            0,
            Math.min(100,value)
        );

    currentProgress=value;

    const endAngle =
        START_ANGLE+
        (360*value/100);

    const path =
        describeArc(

            CENTER_X,

            CENTER_Y,

            RADIUS,

            START_ANGLE,

            endAngle

        );

    progressPath.setAttribute(
        "d",
        path
    );

    updateThumb(
        endAngle
    );

    percentLabel.innerHTML =
        Math.round(value)+"%";

}



// ======================================
// Animate
// ======================================

function animateTo(target){

    target =
        Math.max(
            0,
            Math.min(100,target)
        );

    const start =
        currentProgress;

    const duration =
        900;

    const startTime =
        performance.now();

    function frame(now){

        const elapsed =
            now-startTime;

        const progress =
            Math.min(
                elapsed/duration,
                1
            );

        const eased =
            1-
            Math.pow(
                1-progress,
                3
            );

        const value =
            start+
            (target-start)
            *eased;

        setProgress(value);

        if(progress<1){

            requestAnimationFrame(
                frame
            );

        }

    }

    requestAnimationFrame(
        frame
    );

}



// ======================================
// Change Center Text
// ======================================

function setCenterText(percent,text){

    percentLabel.innerHTML=
        percent+"%";

    paidLabel.innerHTML=
        text;

}



// ======================================
// Colors
// ======================================

function setColors(
    progress,
    background
){

    progressPath.style.stroke=
        progress;

    document
        .getElementById("bg")
        .style.stroke=
        background;

}







// ======================================
// Initial Draw
// ======================================

setProgress(0);