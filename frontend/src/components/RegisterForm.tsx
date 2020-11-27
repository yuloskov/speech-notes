import React from 'react';
import {Form, Input, Button} from 'antd';
import ApiClient, {setToken} from '../ApiClient';
import history from '../browerHistory';


function RegisterForm({setAuthed}: any) {
  async function onFinish(values: { username: string, password: String }) {
    const resp = await ApiClient.post('auth/register/', {
      username: values.username,
      password: values.password,
    });
    setToken(resp.data.token);
    setAuthed(true);
    history.push('/notes');
  }
  
  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  }

  return (
    <Form
      name='basic'
      initialValues={{remember: true}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{maxWidth: '500px'}}
    >
      <Form.Item
        label='Username'
        name='username'
        rules={[{required: true, message: 'Please input your username!'}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label='Password'
        name='password'
        rules={[{required: true, message: 'Please input your password!'}]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item wrapperCol={{span: 16}}>
        <Button type='primary' htmlType='submit' style={{marginRight: 8}}>
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
