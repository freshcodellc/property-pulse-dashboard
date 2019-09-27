import React from 'react';
import { useAuth } from '../context/auth';
import logoGreen from '../images/property-pulse-logo-green.svg';
import './Login.css';

function Login() {
  const { login } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    login({ email: email.value, password: password.value });
  };

  return (
    <div className="login">
      <img src={logoGreen} alt="Property Pulse Logo" />
      <h1 className="login-title">Log in to Property Pulse</h1>
      <div className="login-form">
        <form className="login-form__inner" onSubmit={handleSubmit}>
          <input className="login-form__input" type="text" name="email" />
          <input className="login-form__input" type="password" name="password" />
          <button className="login-form__button" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
