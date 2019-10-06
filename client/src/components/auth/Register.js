import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { validateEmail, validatePassword } from '../../utils/validate';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: 'Joe Biden',
    email: 'joe@gmail.com',
    password: '123456Aa!',
    password2: '123456Aa!'
  });
  const { name, email, password, password2 } = formData;

  const onInput = e => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    const form = { hasError: false };
    if (!validateEmail(email)) {
      setAlert('Please enter a valid email', 'danger', 3000);
      form.hasError = true;
    }

    if (!name.trim()) {
      setAlert('Name is required', 'danger', 3000);
      form.hasError = true;
    }

    if (password.trim().length < 6) {
      setAlert(
        'Please enter a password with 6 or more characters',
        'danger',
        3000
      );
      form.hasError = true;
    } else {
      let msg = validatePassword(password);
      if (msg) {
        msg = 'Password must include a ' + msg;
        setAlert(msg, 'danger', 3000);
      }
    }

    if (password !== password2) {
      setAlert("Passwords don't match", 'danger', 3000);
      form.hasError = true;
    }
    if (!form.hasError) {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onInput}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onInput}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onInput}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onInput}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
