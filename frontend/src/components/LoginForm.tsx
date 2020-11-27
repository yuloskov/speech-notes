import React from 'react';
import { Form, Input, Button } from 'antd';
import ApiClient, { setToken } from '../ApiClient';
import history from '../browerHistory';
import {UserT} from '../types';


function LoginForm({setAuthed}: any) {
  async function onFinish({username, password}: UserT) {
    const resp = await ApiClient.post('auth/login/', {
      username,
      password,
    });
    setToken(resp.data.token);
    setAuthed(true);
    history.push('/notes');
  };
  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: '500px' }}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Login
        </Button>
        <Button onClick={() => history.push('/register')}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
