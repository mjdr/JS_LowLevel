class DTMFGenerator {
    constructor(){
        this.aCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.osc1 = this.aCtx.createOscillator();
        this.osc2 = this.aCtx.createOscillator();
        this.gain = this.aCtx.createGain();
        this.freqs = [
            [941, 1336],
            [697, 1209],
            [697, 1336],
            [697, 1477],
            [770, 1209],
            [770, 1336],
            [770, 1477],
            [852, 1209],
            [852, 1336],
            [852, 1477],
            [697, 1633],
            [770, 1633],
            [852, 1633],
            [941, 1633],
            [941, 1477],
            [941, 1209]
        ];
        this.gain.gain.value = 0.0;

        this.osc1.connect(this.gain);
        this.osc2.connect(this.gain);
        this.gain.connect(this.aCtx.destination);

        this.osc1.start();
        this.osc2.start();
    }

    playTone(key){
        this.osc1.frequency.setValueAtTime(this.freqs[key][0], this.aCtx.currentTime); 
        this.osc2.frequency.setValueAtTime(this.freqs[key][1], this.aCtx.currentTime);

        this.gain.gain.setValueAtTime(0.05, this.aCtx.currentTime);
    }

    stop(){
        this.gain.gain.setValueAtTime(0, this.aCtx.currentTime);
    }
}
