let canvas, ctx, width, height, dataInput, rateInput;
let graphCanvas, graphCtx;

let state, timer, bitTransfered, buffer;
let clkState, dataState, rawData;

function init(){
    canvas = document.getElementById('display');
    dataInput = document.getElementById('data');
    rateInput = document.getElementById('rate');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    graphCanvas = document.getElementById('graph');
    graphCtx = graphCanvas.getContext('2d');

    state = "Done";

    rawData = [];

    setDATA(false);
    setCLK(false);

}



function sendData(){
    if(state != 'Done') return;
    state = 'Sending';
    rawData = [];
    let dt = 1000.0/Number.parseFloat(rateInput.value)/2.0;
    send(dataInput.value, dt).then(() => state='Done');

}

function drawGraph(){
    if(rawData.length < 2) return;
    let gWidth = graphCanvas.width;
    let gHeight = graphCanvas.height;

    let startTime = rawData[0][0];
    let endTime = rawData[rawData.length - 1][0];

    graphCtx.clearRect(0,0, gWidth, gHeight);

    let drawSignal = (label, id, sh, dh) =>{
        graphCtx.textAlign = "start";
        graphCtx.strokeStyle = "black";
        graphCtx.font = "15px Arial";
        graphCtx.fillText(label, 0,gHeight - (gHeight*sh + 0.5*gHeight*dh));
    
        graphCtx.beginPath();
        graphCtx.moveTo(gWidth*0.05, gHeight - (gHeight*sh));
    
        for(let i = 0; i < rawData.length;i++){
            let nx = (rawData[i][0] - startTime)/(endTime - startTime);
            let x = gWidth*0.05 + nx * (gWidth * 0.9);
            let y = gHeight - (gHeight*sh + rawData[i][id]*gHeight*dh);
    
            
            graphCtx.lineTo(x, y);
        }
        graphCtx.stroke();
    };
    drawSignal('CLK' , 1, 0.71, 0.25);
    drawSignal('DATA' , 2, 0.43, 0.25);

    let forEachEdge = (f) => {
        for(let i = 0; i < rawData.length - 1;i++){
            if(rawData[i][1] != 0 || rawData[i+1][1] != 1)
                continue;
            let nx = (rawData[i][0] - startTime)/(endTime - startTime);
            let x = gWidth*0.05 + nx * (gWidth * 0.9);
            f(rawData[i], x);
        }
    };



    graphCtx.strokeStyle = "red";
    graphCtx.beginPath();

    forEachEdge((data, x) => {
        graphCtx.moveTo(x, gHeight * 0.05);
        graphCtx.lineTo(x, gHeight * 0.6);
    });
    graphCtx.stroke();

    forEachEdge((data, x) => {
        graphCtx.font = "15px Arial";
        graphCtx.textAlign = "center";
        graphCtx.fillText(data[2].toString() , x,gHeight * 0.6 + 15);
    });

    let startX = 0, edgeNumber = 0, byte = 0;
    forEachEdge((data, x) => {
        if(edgeNumber % 8 == 0){
            startX = x;
            byte = 0;
        }
        byte *= 2;
        byte += data[2];
        
        if(edgeNumber % 8 == 7){
            graphCtx.beginPath();
            graphCtx.moveTo(startX, gHeight * 0.67);
            graphCtx.lineTo(x , gHeight * 0.67);
            graphCtx.stroke();

            graphCtx.fillText('0x'+byte.toString(16) , (startX + x) / 2 ,  gHeight * 0.74);
            graphCtx.fillText("'"+String.fromCharCode(byte)+"'" , (startX + x) / 2 ,  gHeight * 0.8);
        }
        edgeNumber++;
    });

    
}



function setCLK(value){
    rawData.push([Date.now(), value ? 1:0, dataState ? 1:0]);
    drawGraph();
    if(clkState == value) return;
    clkState = value;
    ctx.fillStyle = value ? 'white' : 'black';
    ctx.fillRect(0,0, width/2, height);

}
function setDATA(value){
    rawData.push([Date.now(), clkState ? 1:0, value ? 1:0]);
    drawGraph();
    if(dataState == value) return;
    dataState = value;
    ctx.fillStyle = value ? 'white' : 'black';
    ctx.fillRect(width/2,0, width/2, height);
}

async function send(buffer, ms){
    for(let i = 0;i < buffer.length;i++){
        let b = buffer.charCodeAt(i);
        for(let j = 0;j < 8;j++)
            await sendBit((b & (1 << (7-j))) != 0, ms);
    }

    setDATA(false);
    setCLK(false);
}
async function sendBit(bit, ms){
    setDATA(bit);
    await delay(ms);
    setCLK(false);
    setCLK(true);
    await delay(ms);
    setCLK(true);
    setCLK(false);
}

async function delay(ms){
    return new Promise((s,f)=>setTimeout(s, ms));
}