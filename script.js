
let glitchDoms = document.getElementsByClassName('glitch');

function range(start, end, step){
    let res = [];
    while (start < end) {
        res.push(start);
        start = start + step;
    }
    return res;
}

function chooseRandom(arr){
    let idx = Math.floor(Math.random()*arr.length);
    return arr[idx];
}

function randFromRange(start, end, step) {
    let arr = range(start, end, step);
    return chooseRandom(arr);
}

function generateNthGlitchStyle(n){
    let colors = ['#ff71ce','#01cdfe','#05ffa1','#b967ff','#fffb96'];
    let lefts = [randFromRange(-10, 11, 2), randFromRange(-10, 11, 2)];
    let tops = [randFromRange(-10, 11, 2), randFromRange(-10, 11, 2)];
    let shadows = [randFromRange(1,4,1),randFromRange(1,4,1)];
    let shadowColors = [chooseRandom(colors),chooseRandom(colors)];
    let cTops = [randFromRange(0,30,2), randFromRange(30,60,2)];
    let cBots = [randFromRange(30,60,2), randFromRange(0,30,2)];

    return `
    .glitch${n}::before {
        left: ${lefts[0]}px;
        top: ${tops[0]}px;
        text-shadow: ${shadows[0]}px 0 ${shadowColors[0]};
        clip-path: inset(${cTops[0]}% 0% ${cBots[0]}% 0%);
    }
    .glitch${n}::after {
        left: ${lefts[1]}px;
        top: ${tops[1]}px;
        text-shadow: ${shadows[1]}px 0 ${shadowColors[1]};
        clip-path: inset(${cTops[1]}% 0% ${cBots[1]}% 0%);
    }
`
}

function initializeGlitch(){
    let sections = document.getElementById('sections').childNodes;
    let idx = 0
    for (let dom of sections) {
        if (dom instanceof HTMLElement) {
            dom.setAttribute('data-text', dom.textContent);
            dom.classList.add('glitch');
            dom.id = idx;
            idx = idx + 1;
        }
    }
}
initializeGlitch()


function addGlitch(dom) {  
    let n = dom.id;
    dom.classList.add(`glitch${n}`);
    let styleDOM = document.createElement('style');
    let style = generateNthGlitchStyle(n);
    console.log(style);
    styleDOM.innerHTML = style;
    dom.parentNode.insertBefore(styleDOM, dom);
}


function glitchImage (imageData, glitchLevel) {
    var indicator = 'base64,',
        parts = imageData.split(indicator),
        data = atob(parts[1]),
        prefix = parts[0] + indicator;
    for (var i=0; i < data.length; i++) {
        var randomNumber = parseInt(Math.random() * (data.length / glitchLevel));
        if (i % randomNumber == 0 && i > (data.length / 20)) {
            data = data.replaceAt(i, data.charAt(i+1));
        }
    }
    return prefix + btoa(data);
}

Array.from(glitchDoms).forEach(e=>{
    e.addEventListener('mouseover', 
        e => addGlitch(e.target), 
        {once: true});
});