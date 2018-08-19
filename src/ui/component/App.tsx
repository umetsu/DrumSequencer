import { AppBar } from 'material-ui'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '../configureStore'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import DrumSequencer from './DrumSequencer'

const App = () => {
  const store = configureStore()
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <>
          <AppBar title="DrumSequencer" />
          <DrumSequencer />
        </>
      </MuiThemeProvider>
    </Provider>
  )
}

export default App