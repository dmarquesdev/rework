// React
import React from 'react';

// Store
import { createStore, applyMiddleware } from 'redux';

// Libs
import Cookies from '../libs/cookies';
import thunkMiddleware from 'redux-thunk';


export default class BaseModule extends React.Component {
    constructor(props, store, pageTitle = 'No Title', shouldBeLoggedIn = false, redirectPath = '/') {
        super(props);

        if (shouldBeLoggedIn && this._isLoggedIn() === false) {
            window.location.href = redirectPath;
        }

        this.state = {
            'isLoggedIn': this._isLoggedIn(),
            'isLoading': false
        };

        // Set Title
        document.title = pageTitle;

        // Create Store
        this.store = createStore(
            store,
            this.state,
            applyMiddleware(
                thunkMiddleware
            )
        );

        this.shouldBeLoggedIn = shouldBeLoggedIn;
        this.pageTitle = pageTitle;
        this.redirectPath = redirectPath;
    }

    /* Lifecycle Methods */
    componentWillMount() {
        if (this.shouldBeLoggedIn !== this._isLoggedIn()) {
            window.location.href = this.redirectPath;
        } else {
            this.unsubscribe = this.store.subscribe(() =>
                this._updateState()
            );
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    /* Private Methods */
    _updateState() {
        const state = this.store.getState();

        if (this.shouldBeLoggedIn !== state.isLoggedIn) {
            window.location.href = this.redirectPath;
        }

        this._storeUpdated(state);
    }

    // Actions
    _onInsert(item, action, local) {
        this.store.dispatch(action.insert([item], local));
    }

    _onUpdate(item, action, local) {
        this.store.dispatch(action.update(item, local));
    }

    _onUpdateAll(items, action, local) {
        this.store.dispatch(action.updateAll(items, local));
    }

    _onRemove(id, action, local) {
        this.store.dispatch(action.remove(id, local));
    }

    _onRemoveWithConflict(id, action, local, items, name, check) {
        const conflict = this._checkConflicts(id, items, name, check);

        if (!conflict) {
            this.store.dispatch(action.remove(id, local));
        }
    }

    _checkConflicts() {
        throw new Error('_checkConflicts method must be implemented by children');
    }

    _storeUpdated() {
        throw new Error('_storeUpdated method must be implemented by children');
    }

    _isLoggedIn() {
        return Cookies.getCookie('Session') !== undefined;
    }
}
