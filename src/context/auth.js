import React from 'react';
import { useAsync } from 'react-async';
import { bootstrapAppData } from '../utils/bootstrap';
import * as authClient from '../utils/auth-client';
import { FullPageSpinner } from '../components/loader';

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false);
  const { data = { user: null }, error, isRejected, isPending, isSettled, reload } = useAsync({
    promiseFn: bootstrapAppData,
  });

  React.useLayoutEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true);
    }
  }, [isSettled]);

  if (!firstAttemptFinished) {
    if (isPending) {
      return <FullPageSpinner />;
    }
    if (isRejected) {
      return (
        <div>
          <p>Uh oh... There's a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      );
    }
  }
  const login = form => authClient.login(form).then(reload);
  const register = form => authClient.register(form).then(reload);
  const logout = () => authClient.logout().then(reload);
  return <AuthContext.Provider value={{ data, login, logout, register }} {...props} />;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

function withAuth(Component) {
  return function WrappedComponent(props) {
    return <Component {...props} auth={useAuth()} />;
  };
}

export { AuthProvider, useAuth, withAuth };
