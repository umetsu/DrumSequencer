declare namespace window {
    let AudioContext: {
        new(): AudioContext;
    };
    let webkitAudioContext: {
        new(): AudioContext;
    };
}

export default class Sound {

    private fileUrl: string;
    private audioContext: AudioContext;
    private buffer: AudioBuffer;

    constructor(fileUrl: string) {
        this.fileUrl = fileUrl;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    }

    load(): Promise<AudioBuffer> {
        const request = new XMLHttpRequest();
        request.open('GET', this.fileUrl, true);
        request.responseType = 'arraybuffer';

        return new Promise<AudioBuffer>((resolve, reject) => {
            request.onload = () => {
                this.audioContext.decodeAudioData(
                    request.response,
                    (buffer: AudioBuffer) => {
                        this.buffer = buffer;
                        resolve();
                    },
                    (e: Error) => {
                        console.error(e);
                        reject(e);
                    });
            };
            request.send();
        });
    }

    play() {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }
}