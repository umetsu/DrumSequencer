import * as React from 'react';
import Control from '../component/Control';
import State from '../state';
import DrumSet from '../util/DrumSet';
import Sound from '../util/Sound';
import BpmTicker from '../util/BpmTicker';

class App extends React.Component<{}, State> {

    state: State = {
        canSoundPlay: false,
        bpm: 20,
    };

    private drumSet: DrumSet = {
        bassDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/bassdrum.wav'),
        snareDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/snare.wav'),
        hat: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/hat.wav'),
        cymbal: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/cymbal.wav'),
    };

    private bpmTicker: BpmTicker = new BpmTicker();

    componentDidMount() {
        const drumSet = this.drumSet;
        Promise.all([drumSet.bassDrum, drumSet.snareDrum, drumSet.hat, drumSet.cymbal]
            .map(s => {
                return s.load();
            }))
            .then(() => {
                this.state = {...this.state, canSoundPlay: true};
            });

        this.bpmTicker.onTick()
            .subscribe(() => {
                this.playBassDrum();
            });
        this.bpmTicker.start(this.state.bpm);
    }

    render() {
        return (
            <Control
                onBassDrumClick={this.playBassDrum}
                onSnareDrumClick={this.playSnareDrum}
                onHatClick={this.playHat}
                onCymbalClick={this.playCymbal}
            />
        );
    }

    playBassDrum = () => {
        if (!this.state.canSoundPlay) {
            return;
        }
        this.drumSet.bassDrum.play();
    }

    playSnareDrum = () => {
        if (!this.state.canSoundPlay) {
            return;
        }
        this.drumSet.snareDrum.play();
    }

    playHat = () => {
        if (!this.state.canSoundPlay) {
            return;
        }
        this.drumSet.hat.play();
    }

    playCymbal = () => {
        if (!this.state.canSoundPlay) {
            return;
        }
        this.drumSet.cymbal.play();
    }
}

export default App;