export default interface State {
    readonly canSoundPlay: boolean;
    readonly bpm: number;
    readonly editingTrack: EditingTrack;
    readonly bassDrumNotes: Array<boolean>;
    readonly snareDrumNotes: Array<boolean>;
    readonly hatNotes: Array<boolean>;
    readonly cymbalNotes: Array<boolean>;
    readonly currentNoteIndex: number | null;
    readonly isPlaying: boolean;
}

export enum EditingTrack {
    BASS_DRUM,
    SNARE_DRUM,
    HAT,
    CYMBAL,
}