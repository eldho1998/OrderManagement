import './Login.css';
import { Button, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import React, { useRef } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  });
  const passwordRef = useRef(null);
  const loginRef = useRef(null);

  const onChange = (e, key) => {
    setUserLogin({ ...userLogin, [key]: e.target.value });
  };

  const OnUserLoginClick = async () => {
    try {
      const response = await axios.post('/user/login', userLogin);
      localStorage.setItem('ID', response.data.id);
      localStorage.setItem('token', response.data.token);
      messageApi.open({
        type: 'success',
        content: 'Log In Success!',
      });
      setTimeout(() => navigate('/user/home'), 2000);
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Log In Failed!',
      });
    }
  };

  const backToMain = () => {
    navigate('/');
  };

  const handleEmailKeyPress = e => {
    if (e.key === 'Enter') {
      passwordRef.current.focus();
    }
  };

  const handlePasswordPress = e => {
    if (e.key === 'Enter') {
      loginRef.current.focus();
    }
  };

  return (
    <div className="user-login-main">
      {contextHolder}
      <h1>You can now Login</h1>

      <div className="user-login-form">
        <form>
          <div className="email">
            <label>Email</label>
            <Input
              onKeyDown={handleEmailKeyPress}
              onChange={e => onChange(e, 'email')}
              type="email"
              placeholder="example@gmail.com"
            />
          </div>

          <div className="password">
            <label>Password</label>
            <Input
              ref={passwordRef}
              onKeyDown={handlePasswordPress}
              onChange={e => onChange(e, 'password')}
              type="password"
              placeholder="enter your password"
            />
          </div>

          <div className="bt">
            <Button ref={loginRef} onClick={OnUserLoginClick} type="primary">
              Login
            </Button>
          </div>
        </form>
        <div onClick={backToMain} className="backto-main">
          <p>Back to main</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
