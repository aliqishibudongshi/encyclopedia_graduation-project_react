import { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {API_BASE_URL} from "../../config";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetPasswordStatus, setResetPasswordStatus] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleResetPassword = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/reset-password`, values);
      const { status } = response.data;
      setResetPasswordStatus(status);
    } catch (error) {
      setResetPasswordStatus('error');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    handleResetPassword(values);
    setLoading(false);
  };

  useEffect(() => {
    if(resetPasswordStatus === 'success') {
      messageApi.open({
        type: 'success',
        content: '密码重置成功，请登录。',
      });
      navigate('/login');
    }else if(resetPasswordStatus === 'error'){
      messageApi.open({
        type: 'error',
        content: '密码重置失败，请再试一次。',
      });
    }
  }, [messageApi, navigate, resetPasswordStatus]);
  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, textAlign: 'center', border: '1px solid #ddd', borderRadius: 8 }}>
      {contextHolder}
      <Title level={3}>重置密码</Title>
      <Text>请输入新密码。</Text>
      <Form
        name="reset-password"
        onFinish={onFinish}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入你的邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}
        >
          <Input placeholder="请输入你的邮箱" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[{ required: true, message: '请输入新密码！' }]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          dependencies={['password']}
          rules={[{ required: true, message: '请确认新密码！' }, ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致！'));
            }
          })]}
        >
          <Input.Password placeholder="请确认新密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;