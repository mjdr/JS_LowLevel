document.addEventListener('DOMContentLoaded', init);
let ws;
function init(){
    ws = new WebSocket('ws://localhost:8082/test');

    ws.addEventListener('open',()=>console.log('opened'));
    ws.addEventListener('error',(e)=>console.log('error', e));
    ws.addEventListener('close',()=>console.log('close'));
    ws.addEventListener('message',(m)=>{
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            console.log(new Uint8Array(reader.result));
        });
        reader.readAsArrayBuffer(m.data);
        console.log('message', m);
    });
}