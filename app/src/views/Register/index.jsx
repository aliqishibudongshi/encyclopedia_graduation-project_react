import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {API_BASE_URL} from "../../config";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleRegister = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, values);
      const { status } = response.data;
      setRegistrationStatus(status);
    } catch (error) {
      console.error(error);
      setRegistrationStatus('error');
    }
  };

  const onFinish = (values) => {
    setLoading(true);
    handleRegister(values);
    setLoading(false);
  };

  useEffect(() => {
    if (registrationStatus === 'success') {
      messageApi.open({
        type: 'success',
        content: '注册成功，请登录。',
      });
      navigate('/login');
    } else if (registrationStatus === 'error') {
      messageApi.open({
        type: 'error',
        content: '注册失败，请再试一次。',
      });
    }
  }, [registrationStatus, messageApi, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, textAlign: 'center', border: '1px solid #ddd', borderRadius: 8 }}>
      {contextHolder}
      <Title level={3}>注册</Title>
      <Form
        name="register"
        onFinish={onFinish}
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

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认你的密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密码不匹配'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请确认你的密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注册
          </Button>
        </Form.Item>

        <Text>
          已经有账户了吗？{' '}
          <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0 }}>
            登录
          </Button>
        </Text>
      </Form>
    </div>
  );
};

export default Register;