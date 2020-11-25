import {useState} from 'react';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import RegisterForm from './components/RegisterForm';


function App() {
  const [authed, setAuthed] = useState(false);

  console.log(authed)
  return (
   <Router>
      <Switch>
        <Route path="/login">
          <LoginForm setAuthed={setAuthed} />
        </Route>
        <Route path="/register">
          <RegisterForm setAuthed={setAuthed} />
        </Route>
        <PrivateRoute path='/secret' authed={authed}>
          Private data
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
