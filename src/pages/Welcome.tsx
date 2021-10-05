import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useModel } from 'umi';
import styles from './Welcome.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;

  return (
    <PageContainer>
      <Card>
        <Alert
          message={`${currentUser!.username},欢迎登录云猫后台`}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text
          strong
        >
          更多功能建设中... {'  '}
          <a
            href="https://github.com/scriptscat/scriptcat/projects/1"
            rel="noopener noreferrer"
            target="__blank"
          >
            查看我们的开发计划
          </a>
        </Typography.Text>
        <br />
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <a
            href="https://github.com/scriptscat/scriptcat"
            rel="noopener noreferrer"
            target="__blank"
          >
            脚本猫
          </a>
        </Typography.Text>
        <CodePreview>
          git clone git@github.com:scriptscat/scriptcat.git
        </CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <a
            href="https://github.com/scriptscat/cloudcat-frontend"
            rel="noopener noreferrer"
            target="__blank"
          >
            云猫前端
          </a>
        </Typography.Text>
        <CodePreview>
          git clone git@github.com:scriptscat/cloudcat-frontend.git
        </CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <a
            href="https://github.com/scriptscat/cloudcat-frontend"
            rel="noopener noreferrer"
            target="__blank"
          >
            云猫后端
          </a>
        </Typography.Text>
        <CodePreview>
          git clone git@github.com:scriptscat/cloudcat.git
        </CodePreview>
      </Card>
    </PageContainer>
  );
};
