import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {API_BASE_URL} from "../../config";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/forgot-password`, values);
      const { status } = response.data;
      setForgotPasswordStatus(status);
    } catch (error) {
      setForgotPasswordStatus('error');
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    handleForgotPassword(values);
    setLoading(false);
  };

  useEffect(() => {
    if (forgotPasswordStatus === 'success') {
      messageApi.open({
        type: 'success',
        content: '请重置密码。',
      });
      navigate('/reset-password');
    } else if (forgotPasswordStatus === 'error') {
      messageApi.open({
        type: 'error',
        content: '用户名输入错误，请再试一次。',
      });
    }
  }, [forgotPasswordStatus, messageApi, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, textAlign: 'center', border: '1px solid #ddd', borderRadius: 8 }}>
      {contextHolder}
      <Title level={3}>忘记密码</Title>
      <Text>输入您的用户名以接收密码重置链接。</Text>
      <Form
        name="forgot-password"
        onFinish={onFinish}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入你的用户名' }]}
        >
          <Input placeholder="请输入你的用户名" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            发送重置链接
          </Button>
        </Form.Item>

        <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0 }}>
          返回登录
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
