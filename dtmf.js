document.addEventListener("DOMContentLoaded", init);

function init(){
    let dtmf = new DTMFGenerator();

    let data = [...new Array(128).keys()]
    .map(()=>Math.floor(Math.random()*16));

    setTimeout(send.bind(null, dtmf, data), 1000);

}

async function send(dtmf, buffer){
    for(let i = 0;i < buffer.length;i++){
        dtmf.playTone(buffer[i]);
        await delay(60);
        dtmf.stop();
        await delay(30);        
        
    }
    return 0;
}
async function delay(ms){
    return new Promise((s,f)=>setTimeout(s, ms));
}

