import * as React from 'react'
import { ReactNode } from 'react'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { RootState } from '../module'
import {
  changeBpm,
  getBpm,
  getCanSoundPlay,
  getIsPlaying,
  loadSounds,
  startSound,
  stopSound
} from '../module/drumSequencer'
import Control from './Control'

type Props = {
  children: ReactNode
  canSoundPlay: boolean
  isPlaying: boolean
  bpm: number
  togglePlayingState: (isPlaying: boolean, bpm: number) => void
  changeBpm: (bpm: number) => void
  loadSounds: () => void
}

const enhancer = compose(
  connect(
    (state: RootState) => {
      return {
        canSoundPlay: getCanSoundPlay(state),
        isPlaying: getIsPlaying(state),
        bpm: getBpm(state)
      }
    },
    (dispatch: any) => {
      return {
        togglePlayingState: (isPlaying: boolean, bpm: number) => {
          if (isPlaying) {
            dispatch(stopSound({}))
          } else {
            dispatch(startSound({bpm}))
          }
        },
        changeBpm: (bpm: number) => {
          dispatch(changeBpm({bpm}))
        },
        loadSounds: () => {
          dispatch(loadSounds({}))
        }
      }
    }
  ),
  lifecycle<Props, {}>({
    componentDidMount() {
      this.props.loadSounds()
    }
  })
)

export default enhancer(function DrumSequencer(
  {
    canSoundPlay,
    isPlaying,
    togglePlayingState,
    bpm,
    changeBpm
  }: Props
) {
  const onPlayButtonClick = () => {
    togglePlayingState(isPlaying, bpm)
  }
  return (
    <Control
      canSoundPlay={canSoundPlay}
      isPlaying={isPlaying}
      onPlayButtonClick={onPlayButtonClick}
      bpm={bpm}
      onBpmChanged={changeBpm}
    />
  )
})