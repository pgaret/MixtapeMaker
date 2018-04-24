import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'
import rootReducer from './reducers/index'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import {composeWithDevTools} from 'redux-devtools-extension'
import './index.css';
import App from './App';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import registerServiceWorker from './registerServiceWorker';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
  <PersistGate loading={<p>Loading</p>} persistor={persistor}>
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
      </div>
    </Router>
  </PersistGate>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
