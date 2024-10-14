import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../services/authenticate';
import userpool from '../userpool';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const formInputChange = (formField, value) => {
    if (formField === 'email') {
      setEmail(value);
    }
    if (formField === 'password') {
      setPassword(value);
    }
    if (formField === 'newPassword') {
      setNewPassword(value);
    }
  };

  const validation = () => {
    return new Promise((resolve, reject) => {
      if (email === '' && password === '') {
        setEmailErr('Email is Required');
        setPasswordErr('Password is required');
        resolve({ email: 'Email is Required', password: 'Password is required' });
      } else if (email === '') {
        setEmailErr('Email is Required');
        resolve({ email: 'Email is Required', password: '' });
      } else if (password === '') {
        setPasswordErr('Password is required');
        resolve({ email: '', password: 'Password is required' });
      } else if (password.length < 6) {
        setPasswordErr('must be 6 characters');
        resolve({ email: '', password: 'must be 6 characters' });
      } else {
        resolve({ email: '', password: '' });
      }
    });
  };

  const handleClick = () => {
    setEmailErr('');
    setPasswordErr('');
    validation()
      .then((res) => {
        if (res.email === '' && res.password === '') {
          authenticate(email, password, newPassword)
            .then((data) => {
              setLoginErr('');
              navigate('/dashboard');
            }, (err) => {
              if (err.code === 'PasswordResetRequiredException' || err.code === 'NewPasswordRequired') {
                setShowNewPassword(true);
              } else {
                console.log(err);
                setLoginErr(err.message);
              }
            })
            .catch((err) => console.log(err));
        }
      }, (err) => console.log(err))
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <div className="form">
        <div className="formfield">
          <TextField
            value={email}
            onChange={(e) => formInputChange('email', e.target.value)}
            label="Email"
            helperText={emailErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={password}
            onChange={(e) => formInputChange('password', e.target.value)}
            type="password"
            label="Password"
            helperText={passwordErr}
          />
        </div>
        {showNewPassword && (
          <div className="formfield">
            <TextField
              value={newPassword}
              onChange={(e) => formInputChange('newPassword', e.target.value)}
              type="password"
              label="New Password"
            />
          </div>
        )}
        <div className="formfield">
          <Button type="submit" variant="contained" onClick={handleClick}>Login</Button>
        </div>
        <Typography variant="body">{loginErr}</Typography>
      </div>
    </div>
  );
};

export default Login;
