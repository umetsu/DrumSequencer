import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

interface Props {
    canSoundPlay: boolean;
    isPlaying: boolean;
    onPlayButtonClick: () => void;
}

const Control = ({canSoundPlay, isPlaying, onPlayButtonClick}: Props) => {
    const playButtonText = isPlaying ? 'stop' : 'play';
    return (
        <div>
            <RaisedButton
                label={playButtonText}
                disabled={!canSoundPlay}
                primary={true}
                onClick={onPlayButtonClick}
            />
        </div>
    );
};

export default Control;