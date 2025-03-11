import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Space, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { API_BASE_URL } from "../../config";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      // 过滤输入字段
      const filteredValues = {
        username: values.username.trim(),
        password: values.password.trim()
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        filteredValues,
        { withCredentials: true }
      );

      const { token, username } = response.data;
      if (!token || !username) {
        throw new Error('Invalid response data');
      }

      dispatch(login({ token, username }));
      setLoginStatus('success');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data.error === '密码错误') {
        setLoginStatus('password error');
      } else if (error.response?.data.error === '用户不存在') {
        setLoginStatus('username error');
      } else {
        setLoginStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    switch (loginStatus) {
      case 'success':
        messageApi.success({
          content: '登录成功，正在跳转...',
          duration: 1.5,
          onClose: () => navigate("/dashboard/illustrations")
        });
        break;
      case 'password error':
        messageApi.error({
          content: '密码错误，请重新输入',
          duration: 3
        });
        break;
      case 'username error':
        messageApi.error({
          content: '用户名错误，请重新输入',
          duration: 3
        });
        break;
      case 'error':
        messageApi.error({
          content: '登录失败，请检查凭证或网络连接',
          duration: 3
        });
        break;
      default:
        break;
    }


  }, [loginStatus, messageApi, navigate]);

  return (
    <div style={{
      maxWidth: 400,
      margin: '100px auto',
      padding: 20,
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: 8
    }}>
      {contextHolder}
      <Title level={3}>用户登录</Title>
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          label="用户名"
          name="username"
          normalize={(value) => value.trim()}
          rules={[
            {
              required: true,
              message: '请输入用户名',
              validateTrigger: 'onSubmit'
            },
            {
              pattern: /^[a-zA-Z0-9_-]{4,20}$/,
              message: '用户名格式不正确（4-20位字母/数字/_/-）',
              validateTrigger: ['onBlur', 'onSubmit']
            }
          ]}
        >
          <Input
            placeholder="请输入注册用户名"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
              validateTrigger: 'onSubmit'
            },
            {
              pattern: /^\S+$/,
              message: '密码不能包含空格',
              validateTrigger: ['onChange', 'onBlur']
            }
          ]}
        >
          <Input.Password
            placeholder="请输入登录密码"
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ flex: 1 }}
            >
              立即登录
            </Button>
            <Button
              type="link"
              onClick={() => navigate('/forgot-password')}
              style={{ paddingRight: 0 }}
            >
              忘记密码？
            </Button>
          </Space>
        </Form.Item>

        <Text type="secondary" style={{ marginTop: 16 }}>
          还没有账号？{' '}
          <Button
            type="link"
            onClick={() => navigate('/register')}
            style={{ padding: 0, fontWeight: 'bold' }}
          >
            立即注册
          </Button>
        </Text>
      </Form>
    </div>
  );
};

export default Login;