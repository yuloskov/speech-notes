// @ts-nocheck
import {Form, Input, Button} from 'antd';
import {useHistory} from 'react-router-dom';
import ApiClient from '../ApiClient';
import React from 'react';

function RegisterForm({setAuthed}) {
  const history = useHistory();

  async function onFinish(values) {
    console.log('Success:', values);
    const resp = await ApiClient.post('auth/register/', {
      username: values.username,
      password: values.password,
    });
    console.log(resp)
    setAuthed(true)
    history.push('/secret')
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{remember: true}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: '500px' }}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{required: true, message: 'Please input your username!'}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true, message: 'Please input your password!'}]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Register
        </Button>
        <Button onClick={() => history.push('/login')}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
