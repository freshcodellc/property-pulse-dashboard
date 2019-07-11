import React from 'react';
import { useAuth } from '../context/auth';

function Login() {
  const { login } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    login({ email: email.value, password: password.value });
  };

  return (
    <div className="app">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" />
        <input type="password" name="password" />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
