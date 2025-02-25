import { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "../../config";

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
      error.response.data.status === 'username error' ? setResetPasswordStatus('username error') :
        setResetPasswordStatus('error');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    await handleResetPassword(values);
    setLoading(false);
  };

  useEffect(() => {
    if (resetPasswordStatus === 'success') {
      messageApi.open({
        type: 'success',
        content: '密码重置成功，请登录。',
      });
      navigate('/login');
      setResetPasswordStatus(null);
    } else if (resetPasswordStatus === 'username error') {
      messageApi.open({
        type: 'error',
        content: '用户名不存在',
      });
    } else if (resetPasswordStatus === 'error'){
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
          label="用户名"
          name="username"
          validateFirst
          normalize={(value) => value.trim()}
          rules={[{ required: true, message: '请输入你的用户名' }]}
        >
          <Input placeholder="请输入你的用户名" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          validateFirst
          rules={[
            {
              required: true,
              message: '请输入新密码',
              validateTrigger: 'onSubmit'
            },
            {
              min: 8,
              message: '密码长度至少8位',
              validateTrigger: ['onChange', 'onBlur']
            },
            {
              max: 20,
              message: '密码长度最多20位',
              validateTrigger: ['onChange', 'onBlur']
            },
            {
              pattern: /^\S+$/, // 禁止任何空格
              message: '密码不能包含空格',
              validateTrigger: ['onChange', 'onBlur']
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) return Promise.resolve();

                const hasLower = /[a-z]/.test(value);
                const hasUpper = /[A-Z]/.test(value);
                const hasNumber = /\d/.test(value);

                let errorMsg = [];
                if (!hasLower) errorMsg.push('至少1个小写字母');
                if (!hasUpper) errorMsg.push('至少1个大写字母');
                if (!hasNumber) errorMsg.push('至少1个数字');

                return errorMsg.length === 0
                  ? Promise.resolve()
                  : Promise.reject(new Error(`需要包含：${errorMsg.join('，')}`));
              },
              validateTrigger: ['onChange', 'onBlur']
            })
          ]}
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
              return Promise.reject(new Error('密码不匹配'));
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