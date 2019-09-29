import React, { useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: 'techguyinfo@gmail.com',
    password: '123456',
  });

  const onInput = e => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    login({ email, password });
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const { email, password } = formData;
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group"></div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onInput}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onInput}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Sign In" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { setAlert, login }
)(Login);
