import React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import Store from '../store/store'
import Login from '../pages/login'
import Dashboard from '../pages/dashboard';
import { observer } from 'mobx-react'

const PrivateRoute= ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={() =>
            Store.token ? (
                children
            ) : (
                <Redirect to="/" />
            )
            }
        />
    )
}

const Routes = observer(() => {    

    return (
        <Switch>
            <Route exact path="/">
                <Login />
            </Route>
            <PrivateRoute exact path="/sa">
                <Dashboard />
            </PrivateRoute>
        </Switch>        
    )
})

export default withRouter(Routes)