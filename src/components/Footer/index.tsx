import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = 'CloudCat - ScriptCat';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '云猫',
          title: '云猫',
          href: 'https://docs.scriptcat.org/dev/cloudcat.html',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/scriptscat/cloudcat',
          blankTarget: true,
        },
        {
          key: '脚本猫',
          title: '脚本猫',
          href: 'https://docs.scriptcat.org/',
          blankTarget: true,
        },
      ]}
    />
  );
};
