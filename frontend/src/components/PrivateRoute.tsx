import {Route, Redirect} from 'react-router-dom';


function PrivateRoute ({component: Component, authed, children, ...rest}: any) {
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
