import React from "react";
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/Home'

import Store from './controllers/store'

const store = Store();

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about">
            <p>about</p>
          </Route>
          <Route path="/users">
            <p>users</p>
          </Route>
          <Route path="/">
            <Home store={store} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const container = document.getElementById('container')

ReactDOM.render(<App />, container)