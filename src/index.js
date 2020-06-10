import React from 'react';
import ReactDOM from 'react-dom';
import './components/inc/App.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(<App />, document.getElementById('app'));
serviceWorker.register();
