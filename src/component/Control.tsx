import * as React from 'react';

interface Props {
    onBassDrumClick: () => void;
    onSnareDrumClick: () => void;
    onHatClick: () => void;
    onCymbalClick: () => void;
}

const Control = ({onBassDrumClick, onSnareDrumClick, onHatClick, onCymbalClick}: Props) => {
    return (
        <div>
            <h1>Hello World!</h1>
            <button onClick={onBassDrumClick}>bd</button>
            <button onClick={onSnareDrumClick}>sd</button>
            <button onClick={onHatClick}>hh</button>
            <button onClick={onCymbalClick}>rc</button>
        </div>
    );
};

export default Control;