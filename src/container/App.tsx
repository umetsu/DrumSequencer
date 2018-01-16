import * as React from 'react';
import Control from '../component/Control';
import Sound from '../util/Sound';

interface DrumSet {
    bassDrum: Sound;
    hat: Sound;
    snareDrum: Sound;
    cymbal: Sound;
}

interface State {
    readonly canSoundPlay: boolean;
}

class App extends React.Component<{}, State> {

    state: State = {
        canSoundPlay: false,
    };

    private drumSet: DrumSet = {
        bassDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/bassdrum.wav'),
        snareDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/snare.wav'),
        hat: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/hat.wav'),
        cymbal: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/cymbal.wav'),
    };

    componentDidMount() {
        const drumSet = this.drumSet;
        Promise.all([drumSet.bassDrum, drumSet.snareDrum, drumSet.hat, drumSet.cymbal]
            .map(s => {
                return s.load();
            }))
            .then(() => {
                this.state = {...this.state, canSoundPlay: true};
            });
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