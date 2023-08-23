import React, { useState } from 'react';
import { Label, Modal, ModalBody } from 'reactstrap';
import './login-popup.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { postRequest } from '../../../api';
import ipDetails from '../../../helper/ip-information';

const LoginPopup = ({ isOpen, toggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const ipaddress = await ipDetails();
      if (ipaddress?.ip) {
        data.ipAddress = ipaddress?.ip;
      }
      const result = await postRequest('auth/userLogin', data, false);
      if (result?.success) {
        setLoading(false);
        localStorage.setItem('user', JSON.stringify(result?.data?.user));
        localStorage.setItem('userToken', result?.data?.token);
        navigate('/', true);
      } else {
        setLoading(false);
        setError(result?.message || '');
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="login-modal">
      <div className="modal-header">
        <div className="close-login-modal">
          <h5 className="modal-title">Login</h5>
          <button type="button" className="close-btn" onClick={toggle}>
            <img src="./images/close.svg" alt="close" />
          </button>
        </div>
      </div>
      <ModalBody>
        {error ? <div className="text-danger mb-1">{error}</div> : ''}
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Label for="username" className="login-label">
              Username
            </Label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter Username"
              className="form-control"
              {...register('username', {
                required: 'Username is required',
              })}
            />
            {errors?.username ? (
              <div className="text-danger">{errors?.username?.message}</div>
            ) : (
              ''
            )}
          </div>
          <div className="form-group">
            <Label for="password" className="login-label">
              Password
            </Label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              className="form-control"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors?.password ? (
              <div className="text-danger">{errors?.password?.message}</div>
            ) : (
              ''
            )}
            <div className="forgot-password">
              <a href="/">
                <u>Forgot Password?</u>
              </a>
            </div>
          </div>
          <div className="form-group">
            <div className="custom-control custom-checkbox d-inline-block">
              <input
                type="checkbox"
                id="customCheck"
                name="example1"
                className="custom-control-checkbox"
              />
              <Label for="customCheck" className="custom-control-label">
                I am at least
                <a href="/" className="text-danger" role="button">
                  18 years
                </a>
                of age and I have read, accept and agree to the
                <a href="/terms-and-conditions" className="" target="_blank">
                  Terms and Conditions
                </a>
                ,
                <a href="/responsible-gaming" className="" target="_blank">
                  Responsible Gaming
                </a>
                ,
                <a href="/aml-policy" className="" target="_blank">
                  AML Policy
                </a>
                ,
                <a href="/kyc-policy" className="" target="_blank">
                  KYC Policy
                </a>
                ,<a href="/">GamCare</a>,<a href="/">Gambling Therapy</a>
              </Label>
            </div>
          </div>
          <div className="form-group mb-1">
            <button type="submit" className="btn login-btn" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm me-2" />
              )}
              Login
            </button>
          </div>
          <small className="recaptchaTerms">
            This site is protected by reCAPTCHA and the Google
            <a href="/">Privacy Policy</a> and
            <a href="/">Terms of Service</a> apply.
          </small>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default LoginPopup;