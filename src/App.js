import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css'; // reset css
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import fire from './firebase/firebase';

import './App.scss';
import AppRouter from './routes/AppRouter';
import configureStore from './store/configureStore';
import { setTextFilter } from './actions/filters';


const store = configureStore();

// console.log(store.getState());
fire.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log('---> ', user.displayName)
        // User is signed in.
    }
});

console.log(store.dispatch(setTextFilter('Price')));
// store.dispatch(sortByAmount(user));

const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

ReactDOM.render(jsx, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();