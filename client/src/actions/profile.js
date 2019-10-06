import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: errors[0].msg, status: err.response.status }
    });
  }
};

export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  formData = JSON.stringify(formData);
  try {
    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

    if (!edit) history.push('/dashboard');
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    // issue with css, for now scroll to top to see modals
    window.scrollTo(0, 0);

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { errors }
    });
  }
};

export const addExperience = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience added success', 'success'));

    history.push('/dashboard');
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    // issue with css, for now scroll to top to see modals
    window.scrollTo(0, 0);

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { errors }
    });
  }
};

export const addEducation = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education added success', 'success'));

    history.push('/dashboard');
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    // issue with css, for now scroll to top to see modals
    window.scrollTo(0, 0);

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { errors }
    });
  }
};
