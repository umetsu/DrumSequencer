import { buildActionCreator, createReducer, Reducer } from 'hard-reducer'
import { Subscription } from 'rxjs'
import BpmTicker from '../../util/BpmTicker'
import DrumSet from '../../util/DrumSet'
import Sound from '../../util/Sound'
import { RootState } from './index'

// 副作用があるものの扱いはどうするのがいいのか
const drumSet: DrumSet = {
  bassDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/bassdrum.wav'),
  snareDrum: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/snare.wav'),
  hat: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/hat.wav'),
  cymbal: new Sound('https://raw.githubusercontent.com/umetsu/DrumSequencer/master/asset/cymbal.wav'),
}
const bpmTicker: BpmTicker = new BpmTicker()
let subscription: Subscription = Subscription.EMPTY

const playDrums = (state: DrumSequencerState, index: number) => {
  [
    {notes: state.bassDrumNotes, sound: drumSet.bassDrum},
    {notes: state.snareDrumNotes, sound: drumSet.snareDrum},
    {notes: state.hatNotes, sound: drumSet.hat},
    {notes: state.cymbalNotes, sound: drumSet.cymbal}
  ]
    .filter((data) => {
      return data.notes[index]
    })
    .map((data) => {
      return data.sound
    })
    .forEach((sound) => {
      sound.play()
    })
}

//
// Action
//
const {createAction, createAsyncAction, createThunkAction} = buildActionCreator({
  prefix: "drum-sequencer/"
})

export const loadSounds = createAsyncAction(
  "load-sounds",
  async () => {
    await Promise.all(
      [drumSet.bassDrum, drumSet.snareDrum, drumSet.hat, drumSet.cymbal]
        .map(s => {
          return s.load()
        })
    )
    return {}
  }
)

export const startSound = createThunkAction(
  "start-sound",
  async ({bpm}: { bpm: number }, dispatch, getState: () => RootState) => {
    subscription.unsubscribe()
    subscription = bpmTicker.onTick()
      .subscribe(() => {
        const state = getDrumSequencerState(getState())
        if (state.isPlaying) {
          const index = state.currentNoteIndex != null ? state.currentNoteIndex : 0
          playDrums(state, index)
        }

        dispatch(updateNoteIndex({}))
      })
    bpmTicker.start(bpm)
  }
)

export const updateNoteIndex = createAction("update-note-index")

export const stopSound = createAsyncAction(
  "stop-sound",
  async () => {
    bpmTicker.stop()
    subscription.unsubscribe()
  }
)

export const changeBpm = createAsyncAction(
  "change-bpm",
  async ({bpm}) => {
    bpmTicker.changeBpm(bpm)

    return {bpm}
  }
)

//
// State
//
export enum EditingTrack {
  BASS_DRUM,
  SNARE_DRUM,
  HAT,
  CYMBAL,
}

export type DrumSequencerState = {
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

const initialState: DrumSequencerState = {
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
}

//
// Reducer
//
export const reducer: Reducer<DrumSequencerState> = createReducer(initialState)
  .case(loadSounds.resolved, (state) => {
    return {...state, canSoundPlay: true}
  })
  .case(startSound.resolved, (state) => {
    return {...state, isPlaying: true, currentNoteIndex: 0}
  })
  .case(updateNoteIndex, (state) => {
    const currentIndex = state.currentNoteIndex == null ? 0 : state.currentNoteIndex
    const index = (currentIndex + 1) % 16
    return {...state, currentNoteIndex: index}
  })
  .case(stopSound.resolved, (state) => {
    return {...state, isPlaying: false, currentNoteIndex: null}
  })
  .case(changeBpm.resolved, (state, payload) => {
    return {...state, bpm: payload.bpm}
  })

//
// Selector
//
export const getDrumSequencerState = (state: RootState): DrumSequencerState => state.drumSequencer
export const getCanSoundPlay = (state: RootState) => getDrumSequencerState(state).canSoundPlay
export const getIsPlaying = (state: RootState) => getDrumSequencerState(state).isPlaying
export const getBpm = (state: RootState) => getDrumSequencerState(state).bpm