import { useState } from 'react';
import { Form, Input, Button, Typography, Space, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { API_BASE_URL } from "../../config";


const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, values);
      const { token, username } = response.data;
      // Dispatch login action
      dispatch(login({ token, username }));

      messageApi.open({
        type: "success",
        content: "登录成功",
      });

      navigate("/dashboard/illustrations");
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: '登录失败，电子邮件或密码错误',
      });
    }
  };

  const onFinish = (values) => {
    setLoading(true);
    handleLogin(values);
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Login Failed:', errorInfo);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '100px auto',
        padding: 20,
        textAlign: 'center',
        border: '1px solid #ddd',
        borderRadius: 8
      }}>
      {contextHolder}
      <Title level={3}>登录</Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入你的邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}
        >
          <Input placeholder="请输入你的邮箱" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入你的密码' }]}
        >
          <Input.Password placeholder="请输入你的密码" />
        </Form.Item>

        <Form.Item>
          <Space size="large">
            <Button type="primary" htmlType="submit" loading={loading}>
              登录
            </Button>
            <Button type="link" onClick={() => navigate('/forgot-password')}>
              忘记密码?
            </Button>
          </Space>
        </Form.Item>

        <Text>
          没有账户？{' '}
          <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0 }}>
            立即注册
          </Button>
        </Text>
      </Form>
    </div>
  );
};

export default Login;
