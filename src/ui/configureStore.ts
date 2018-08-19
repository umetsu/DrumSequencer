import { applyMiddleware, compose, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import { rootReducer } from './module'

const win = window as any

/* redux-dev-tools */
const dev =
  process.env.NODE_ENV !== 'production' ||
  (typeof window === 'object' && window.location.search === '?dev')

const composeEnhancers =
  typeof win === 'object' && win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose

// with middleware
const enhancer = dev
  ? composeEnhancers(applyMiddleware(thunk))
  : applyMiddleware(thunk)

export function configureStore(): Store {
  return createStore(rootReducer, enhancer)
}