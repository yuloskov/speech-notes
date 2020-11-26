import React from 'react';
import {Route, Redirect} from 'react-router-dom';


function PrivateRoute ({component: Component, authed, children, ...rest}: any) {
  console.log(authed)
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? children
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;
