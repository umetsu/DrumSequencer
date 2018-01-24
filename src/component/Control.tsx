import { RaisedButton, Slider } from 'material-ui';
import * as React from 'react';

interface Props {
    canSoundPlay: boolean;
    isPlaying: boolean;
    onPlayButtonClick: () => void;
    bpm: number;
    onBpmChanged: (bpm: number) => void;
}

const Control = ({canSoundPlay, isPlaying, onPlayButtonClick, bpm, onBpmChanged}: Props) => {
    const playButtonText = isPlaying ? 'stop' : 'play';
    return (
        <div>
            <RaisedButton
                label={playButtonText}
                disabled={!canSoundPlay}
                primary={true}
                onClick={onPlayButtonClick}
            />
            <p>BPM: {bpm}</p>
            <Slider
                min={10}
                max={240}
                step={1}
                value={bpm}
                onChange={(e, v) => onBpmChanged(v)}
            />
        </div>
    );
};

export default Control;