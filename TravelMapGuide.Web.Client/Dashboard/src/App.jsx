import React, { lazy } from 'react'
import CreateTravel from './pages/CreateTravel'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import TravelList from './pages/TravelList'
import NotAuthorized from './pages/NotAuthorized'
import UserList from './pages/UserList'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/create-travel" component={CreateTravel} />
          <Route path="/travel-list" component={TravelList} />
          <Route path="/user-list" component={UserList} />
          <Route path="/not-authorized" component={NotAuthorized} />
          {/* Place new routes over this */}
          <Route path="/app" component={Layout} />
          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
    </>
  )
}

export default App
