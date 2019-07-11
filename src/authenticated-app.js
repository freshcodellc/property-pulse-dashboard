import React from 'react';
import { Router, Redirect } from '@reach/router';
import Dashboard from './screens/Dashboard';
import NotFound from './screens/NotFound';
import Settings from './screens/Settings';

function AuthenticatedApp() {
  return (
    <div>
      <Routes />
    </div>
  );
}

function RedirectHome() {
  return <Redirect to="/dashboard" />;
}

function Routes() {
  return (
    <Router>
      <RedirectHome path="/" />
      <Dashboard path="/dashboard" />
      <Settings path="/settings" />
      <NotFound default />
    </Router>
  );
}

export default AuthenticatedApp;
