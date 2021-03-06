import React, {useState} from 'react';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import {
  Route,
  Switch,
  Router,
  Redirect,
} from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import {Button, Layout} from 'antd';
import {hasToken, logout} from './ApiClient';
import history from './browserHistory';


export default function App() {
  const [authed, setAuthed] = useState(hasToken());

  return (
    <Router history={history}>
      <Layout className="layout" style={{minHeight: '100vh'}}>
        <Layout.Header>
          {authed && <div style={{float: 'right'}}><Button
            type="primary"
            loading={false}
            onClick={() => {
              logout();
              setAuthed(false);
            }}
          >
            Log out
          </Button></div>}
        </Layout.Header>
        <Layout.Content style={{padding: '50px'}}>
          <Switch>
            {/* Authorization */}
            <Route path='/login'>
              <LoginForm setAuthed={setAuthed}/>
            </Route>
            <Route path='/register'>
              <RegisterForm setAuthed={setAuthed}/>
            </Route>
            {/* Application */}
            <PrivateRoute path='/notes' authed={authed}>
              <Dashboard/>
            </PrivateRoute>
            {/* Default fallback */}
            <Redirect to="/notes"/>
          </Switch>
        </Layout.Content>
      </Layout>
    </Router>
  );
}
