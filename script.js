const initialStyle = `
.glitch {
    position: relative;
    cursor: progress;
}

.glitch-0 {
    position: relative;
    display: block;
    margin-bottom: 0 !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
}

.glitch-1 {
    position: relative;
    display: block;
    margin-bottom: 0 !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
}

.glitch-2 {
    position: relative;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
}
`

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
    console.log([start, end, step, arr]);
    return chooseRandom(arr);
}


function generateAnimation(n, clv){
    let leftStart = [randFromRange(-2*clv, 2*clv, 1), randFromRange(-2*clv, 2*clv, 1)];
    let leftGlitch = [randFromRange(-50*clv, 50*clv, 5), randFromRange(-50*clv, 50*clv, 5)];
    let fontSize = [randFromRange(1,Math.floor(clv/2),1),randFromRange(1,Math.floor(clv/2),1)];
    console.log(leftGlitch);
    let keyframes = `
    @keyframes anime${n}-0 {
        0% {
            left: ${leftStart[0]}
            font-size: 1em;
        }
        90% {
            left: ${leftGlitch[0]}px;
            font-size: ${fontSize[0]}em;
        }
        91% {
            left: ${leftStart[0]};
            font-size: 1em;
        }
    }

    @keyframes anime${n}-1 {
        0% {
            left: ${leftStart[1]}
            font-size: 1em;
        }
        20% {
            left: ${leftGlitch[1]}px;
            font-size: ${fontSize[1]}em;
        }
        21% {
            left: ${leftStart[1]};
            font-size: 1em;
        }
    }
    `
    let animation1 = `
        animation-name: anime${n}-0;
        animation-duration: 4s;
        animation-timing-function: steps(2, jump-none);
        animation-iteration-count: infinite;
    `

    let animation2 = `
        animation-name: anime${n}-1;
        animation-duration: 4s;
        animation-timing-function: steps(2, jump-none);
        animation-iteration-count: infinite;`

    return [keyframes, animation1, animation2];
}

function generateTransformation(n) {
    let direction = randFromRange(-90, 91, 90);
    let translateX = randFromRange(-200, 200, 10);
    let translateY = randFromRange(-200, 200, 10);
    return `transform: rotate(${direction}deg) translate(${translateX}px, ${translateY}px);`
}


function generateNthGlitchStyle(n, clv){
    let colors = ['#ff71ce','#01cdfe','#05ffa1','#b967ff','#fffb96'];
    let lefts = [randFromRange(-2*clv, 2*clv, 2), randFromRange(-2*clv, 2*clv, 2)];
    let tops = [randFromRange(-5*clv, 5*clv, 2), randFromRange(-5*clv, 5*clv, 2)];
    let shadows = [randFromRange(-clv,clv,2),randFromRange(-clv,clv,2)];
    let shadowColors = [chooseRandom(colors),chooseRandom(colors)];
    let cTops = [randFromRange(0,3*clv,2), randFromRange(2*clv,4*clv,2)];
    let cBots = [randFromRange(2*clv,4*clv,2), randFromRange(0,3*clv,2)];

    let anime = clv >= 6 ? generateAnimation(n, clv) : ['','',''];
    let transformation = clv >= 8 ? generateTransformation(n) : '';

    return `
    ${anime[0]}

    #glitch${n}-0 {
        top: ${tops[0]}px;
        left: ${lefts[0]}px;
        text-shadow: ${shadows[0]}px 0 ${shadowColors[0]};
        clip-path: inset(${cTops[0]}% 0% ${cBots[0]}% 0%);
        ${anime[1]}
    }
    #glitch${n}-1 {
        top: ${tops[1]}px;
        left: ${lefts[1]}px;
        text-shadow: ${shadows[1]}px 0 ${shadowColors[1]};
        clip-path: inset(${cTops[1]}% 0% ${cBots[1]}% 0%);
        ${anime[2]}
        ${transformation}
    }
`
}


function querySeveralSelectors(selectors) {
    let selectedNodes = []
    for (selector of selectors) {
        let nodes = document.getElementsByTagName(selector);
        selectedNodes = [...selectedNodes, ...Array.from(nodes)];
    }
    return selectedNodes;
}



function initializeGlitch(){

    let initStyleDOM = document.createElement('style');
    initStyleDOM.innerHTML = initialStyle;
    document.querySelector('body').appendChild(initStyleDOM);
    
    let nodes = querySeveralSelectors(['p', 'h1', 'h2', 'h3', 'ul'])

    let idx = 0

    nodes.forEach(dom => {
        if (dom instanceof HTMLElement) {

            dom0 = dom.cloneNode(true);
            dom1 = dom.cloneNode(true);
            dom2 = dom.cloneNode(true); // original

            let calculatedHeight = dom.offsetHeight;
            
            dom0.classList.add('glitch-0');
            dom0.id = `glitch${idx}-0`;
            dom0.style.marginTop = `-${calculatedHeight}px`;
            dom1.classList.add('glitch-1');
            dom1.id = `glitch${idx}-1`;
            dom1.style.marginTop = `-${calculatedHeight}px`;
            dom2.classList.add('glitch-2');

            let container = document.createElement('div');
            container.classList.add('glitch');
            container.id = idx;
            container.appendChild(dom2);
            container.appendChild(dom0);
            container.appendChild(dom1);

            dom.parentNode.replaceChild(container, dom);

            idx = idx + 1;
        }
    });
}


function addGlitch(dom) {  
    let n = dom.id;
    let styleDOM = document.createElement('style');
    let scrolled = document.documentElement.scrollTop;
    let total = document.body.scrollHeight;
    let clv = Math.floor(Math.sqrt(scrolled/total)*10+2); // chaos level
    console.log(clv);
    let style = generateNthGlitchStyle(n, clv);
    styleDOM.innerHTML = style;
    dom.parentNode.insertBefore(styleDOM, dom);
}


let glitchDoms = document.getElementsByClassName('glitch');
initializeGlitch();


Array.from(glitchDoms).forEach(e=>{
    e.addEventListener('mouseover', 
        e => addGlitch(e.currentTarget), 
        {once: true});
});