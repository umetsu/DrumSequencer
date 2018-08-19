import { combineReducers } from 'redux'
import * as drumSequencer from './drumSequencer'

export type RootState = {
  drumSequencer: drumSequencer.DrumSequencerState
}

export const rootReducer: (
  state: RootState,
  action: any
) => RootState = combineReducers({
  drumSequencer: drumSequencer.reducer,
} as any)