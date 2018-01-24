import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export default class BpmTicker {

    private bpm: number = 0;
    private isPlaying: boolean = false;
    private tickSubject: Subject<void> = new Subject();

    private static millSecPer16thNote(bpm: number): number {
        return (60000 / (bpm * 4));
    }

    onTick(): Observable<void> {
        return this.tickSubject.asObservable();
    }

    start(bpm: number) {
        this.bpm = bpm;
        this.isPlaying = true;
        this.registerNextTimeout();
    }

    changeBpm(bpm: number) {
        this.bpm = bpm;
    }

    stop() {
        this.isPlaying = false;
    }

    private registerNextTimeout() {
        if (!this.isPlaying) {
            return;
        }

        const nextFromBpm = BpmTicker.millSecPer16thNote(this.bpm);
        setTimeout(
            () => {
                this.registerNextTimeout();
                this.tickSubject.next();
            },
            nextFromBpm
        );
    }
}