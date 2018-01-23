import { AppBar } from 'material-ui';
import * as React from 'react';
import { Subscription } from 'rxjs/Subscription';
import Control from '../component/Control';
import State, { EditingTrack } from '../state';
import DrumSet from '../util/DrumSet';
import Sound from '../util/Sound';
import BpmTicker from '../util/BpmTicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const initialState: State = {
    canSoundPlay: false,
    bpm: 100,
    editingTrack: EditingTrack.BASS_DRUM,
    bassDrumNotes: [
        true, false, false, false, false, false, false, false,
        true, false, false, false, false, false, false, false
    ],
    snareDrumNotes: [
        false, false, false, false, true, false, false, false,
        false, false, false, false, true, false, false, false
    ],
    hatNotes: [
        true, false, true, false, true, false, true, false,
        true, false, true, false, true, false, true, false
    ],
    cymbalNotes: [
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
    ],
    currentNoteIndex: null,
    isPlaying: false,
};

class App extends React.Component<{}, State> {

    state: State = initialState;

    private drumSet: DrumSet = {
        bassDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/bassdrum.wav'),
        snareDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/snare.wav'),
        hat: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/hat.wav'),
        cymbal: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/cymbal.wav'),
    };

    private bpmTicker: BpmTicker = new BpmTicker();
    private subscription: Subscription = Subscription.EMPTY;

    componentDidMount() {
        this.loadSounds();
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (prevState.isPlaying) {
            const index = prevState.currentNoteIndex != null ? prevState.currentNoteIndex : 0;
            this.playDrums(index);
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <AppBar title="DrumSequencer"/>
                <Control
                    canSoundPlay={this.state.canSoundPlay}
                    isPlaying={this.state.isPlaying}
                    onPlayButtonClick={this.togglePlayingState}
                />
            </MuiThemeProvider>
        );
    }

    loadSounds = () => {
        const drumSet = this.drumSet;
        Promise.all([drumSet.bassDrum, drumSet.snareDrum, drumSet.hat, drumSet.cymbal]
            .map(s => {
                return s.load();
            }))
            .then(() => {
                this.setState({...this.state, canSoundPlay: true});
            });
    }

    togglePlayingState = () => {
        if (this.state.isPlaying) {
            this.stopSound();
        } else {
            this.startSound();
        }
    }

    startSound = () => {
        this.subscription = this.bpmTicker.onTick()
            .subscribe(() => {
                this.updateNoteIndex();
            });
        this.bpmTicker.start(this.state.bpm);

        this.setState({...this.state, isPlaying: true, currentNoteIndex: 0});
    }

    stopSound = () => {
        this.bpmTicker.stop();
        this.subscription.unsubscribe();

        this.setState({...this.state, isPlaying: false, currentNoteIndex: null});
    }

    updateNoteIndex = () => {
        const currentIndex = this.state.currentNoteIndex == null ? 0 : this.state.currentNoteIndex;
        const index = (currentIndex + 1) % 16;
        this.setState({...this.state, currentNoteIndex: index});
    }

    playDrums = (index: number) => {
        [
            {notes: this.state.bassDrumNotes, sound: this.drumSet.bassDrum},
            {notes: this.state.snareDrumNotes, sound: this.drumSet.snareDrum},
            {notes: this.state.hatNotes, sound: this.drumSet.hat},
            {notes: this.state.cymbalNotes, sound: this.drumSet.cymbal}
        ]
            .filter((data) => {
                return data.notes[index];
            })
            .map((data) => {
                return data.sound;
            })
            .forEach((sound) => {
                sound.play();
            });
    }
}

export default App;