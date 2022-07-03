import { Switch, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RouteResults from './pages/RouteResults';

import { LOGIN, REGISTER, ROUTE_RESULTS } from './utilities/constants/routes';

function App() {
  return (
    <Switch>
      <Route path={LOGIN} exact>
        <Login />
      </Route>
      <Route path={REGISTER} exact>
        <Register />
      </Route>
      <Route path={ROUTE_RESULTS} exact>
        <RouteResults />
      </Route>
    </Switch>
  );
}

export default App;