import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "../../config";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      // 过滤所有字段的首尾空格
      const filteredValues = Object.fromEntries(
        Object.entries(values).map(([key, val]) =>
          [key, typeof val === 'string' ? val.trim() : val]
        )
      );

      const response = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        filteredValues
      );

      if (response.data.status === 'success') {
        setRegistrationStatus('success');
      }
    } catch (error) {
      const backendError = error.response?.data;
      let errorMessage = '注册失败，请检查网络或稍后重试';

      if (backendError) {
        switch (backendError.code) {
          case 'USERNAME_EXISTS':
            errorMessage = '用户名已被使用，请更换其他用户名';
            break;
          case 'VALIDATION_FAILED':
            errorMessage = `数据验证失败：${backendError.message}`;
            break;
          case 'PASSWORD_REQUIREMENTS':
            errorMessage = '密码不符合要求：需包含大小写字母和数字';
            break;
          default:
            break;
        }
      }
      messageApi.error(errorMessage);
      setRegistrationStatus('error');

    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    handleRegister(values);
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
          label="用户名"
          name="username"
          validateFirst
          normalize={(value) => value.trim()} // 自动去除首尾空格
          rules={[
            {
              required: true,
              message: '请输入用户名',
              validateTrigger: 'onSubmit'
            },
            {
              min: 4,
              message: '用户名至少4个字符',
              validateTrigger: ['onChange', 'onBlur']
            },
            {
              max: 20,
              message: '用户名最多20个字符',
              validateTrigger: ['onChange', 'onBlur']
            },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message: '只能包含字母、数字、下划线(_)和横线(-)',
              validateTrigger: ['onChange', 'onBlur']
            },
            {
              validator: async (_, value) => {
                if (!value || !/^[a-zA-Z0-9_-]+$/.test(value)) return Promise.resolve();
                try {
                  const res = await axios.get(`${API_BASE_URL}/api/users/check?username=${value}`);
                  return res.data.available
                    ? Promise.resolve()
                    : Promise.reject(new Error('用户名已被使用'));
                } catch {
                  return Promise.reject(new Error('验证服务不可用'));
                }
              },
              validateTrigger: ['onChange', 'onBlur']
            }
          ]}
        >
          <Input
            placeholder="4-20位（字母/数字/_/-）"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          validateFirst
          rules={[
            {
              required: true,
              message: '请输入密码',
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
          <Input.Password
            placeholder="8-20位（大小写字母+数字，无空格）"
            allowClear
          />
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