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
import history from './browerHistory';
import {PoweroffOutlined} from '@ant-design/icons';


function App() {
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

            <Route path='/login'>
              <LoginForm setAuthed={setAuthed}/>
            </Route>
            <Route path='/register'>
              <RegisterForm setAuthed={setAuthed}/>
            </Route>

            <PrivateRoute path='/notes' authed={authed}>
              <Dashboard/>
            </PrivateRoute>

            <Redirect to="/notes"/>

          </Switch>
        </Layout.Content>
      </Layout>
    </Router>
  );
}

export default App;
