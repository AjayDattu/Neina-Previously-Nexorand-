// components/ContactInfo.0js
"use client"
import React from 'react';
import { Card, Space, Typography, Tooltip } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const ContactInfo = () => {
  return (
    <Card
      title="Contact Information"
      bordered={false}
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Title level={4}>Get in touch</Title>
      <Text strong>Feel free to reach out via the following platforms:</Text>
      <Space direction="vertical" style={{ marginTop: '20px' }}>
        {/* GitHub */}
        <Space align="center">
          <Tooltip title="View my GitHub profile">
            <a href="https://github.com/AjayDattu" target="_blank" rel="noopener noreferrer">
              <GithubOutlined style={{ fontSize: '24px', color: '#333' }} />
            </a>
          </Tooltip>
          <Text>
            GitHub: Explore my projects and open-source contributions.
          </Text>
        </Space>

        {/* LinkedIn */}
        <Space align="center">
          <Tooltip title="Connect with me on LinkedIn">
            <a href="https://www.linkedin.com/in/ajaydattu005" target="_blank" rel="noopener noreferrer">
              <LinkedinOutlined style={{ fontSize: '24px', color: '#0077b5' }} />
            </a>
          </Tooltip>
          <Text>
            LinkedIn: Let's connect professionally and share opportunities.
          </Text>
        </Space>

        {/* Email */}
        <Space align="center">
          <Tooltip title="Send me an email">
            <a href="mailto:dattuajay005@example.com">
              <MailOutlined style={{ fontSize: '24px', color: '#f44336' }} />
            </a>
          </Tooltip>
          <Text>
            Email: Reach me for collaboration or inquiries.
          </Text>
        </Space>
      </Space>
    </Card>
  );
};

export default ContactInfo;
