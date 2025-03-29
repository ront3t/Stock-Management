// apps/frontend/src/components/LoginPage.tsx
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import { Form, Input, Button } from 'antd';

const LoginPage = observer(() => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authStore.login(values.username, values.password);
      // Redirect to portfolio page via routing logic
    } catch (error) {
      console.error('Login error', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', marginTop: '100px' }}>
      <h2>Login</h2>
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default LoginPage;
