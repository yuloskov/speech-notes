// @ts-nocheck
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import ApiClient from '../ApiClient';

function LoginForm({setAuthed}) {
  const history = useHistory();

  async function onFinish(values) {
    console.log('Success:', values);
    setAuthed(true)
    const resp = await ApiClient.post('auth/login/', {
      username: values.username,
      password: values.password,
    });
    // TODO store token in local storage
    console.log(resp)
    history.push('/secret')
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
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
        <Button type="primary" htmlType="submit">
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
