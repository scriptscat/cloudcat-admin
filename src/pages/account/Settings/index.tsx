import { BetaSchemaForm, ProFormCaptcha, ProFormColumnsType } from "@ant-design/pro-form";
import { PageContainer } from "@ant-design/pro-layout";
import ProCard from '@ant-design/pro-card';
import { LockOutlined } from "@ant-design/icons";
import { Button, message } from "antd";


type DataItem = {
	name: string;
	state: string;
};

const changePassword: ProFormColumnsType<DataItem>[] = [
	{
		title: '旧密码',
		dataIndex: 'old-password',
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
		valueType: 'password',
		width: 'm',
	},
	{
		title: '新密码',
		dataIndex: 'new-password',
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
		valueType: 'password',
		width: 'm',
	},
	{
		title: '确认新密码',
		dataIndex: 'confirm-password',
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
		valueType: 'password',
		width: 'm',
	},
];


const changeInfo: ProFormColumnsType<DataItem>[] = [
	{
		title: '用户名',
		dataIndex: 'username',
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
		width: 'm',
	},
	{
		title: '邮箱',
		dataIndex: 'email',
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
		width: 'm',
	},
	{
		title: '验证码',
		dataIndex: 'captcha',
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
		renderFormItem: () => {
			return <div className='pro-field-m'>
				<ProFormCaptcha
					fieldProps={{
						prefix: <LockOutlined className={'prefixIcon'} />,
					}
					}
					placeholder={'请输入验证码'}
					captchaTextRender={(timing, count) => {
						if (timing) {
							return `${count} ${'获取验证码'}`;
						}
						return '获取验证码';
					}}
					name="captcha"
					onGetCaptcha={async () => {
						message.success('获取验证码成功！验证码为：1234');
					}}
				/>
			</div>
		},
		width: 'm',
	},
];

export default (): React.ReactNode => {
	return (
		<PageContainer>
			<ProCard.Group split="horizontal">
				<ProCard title='用户信息' headerBordered>
					<BetaSchemaForm<DataItem>
						submitter={{
							// 配置按钮文本
							searchConfig: {
								submitText: '修改信息',
							},
						}}
						layoutType='Form'
						onFinish={async (values) => {
							console.log(values);
						}}
						columns={changeInfo}
					/>
				</ProCard>
				<ProCard title='修改密码' headerBordered>
					<BetaSchemaForm<DataItem>
						submitter={{
							// 配置按钮文本
							searchConfig: {
								submitText: '修改密码',
							},
						}}
						layoutType='Form'
						onFinish={async (values) => {
							console.log(values);
						}}
						columns={changePassword}
					/>
				</ProCard>
				<ProCard title='三方登录' headerBordered>
					<ProCard title="微信登录" bordered>
						<Button type="primary">绑定</Button>
						<Button type="primary" danger>解绑</Button>
					</ProCard>
					<ProCard title="油猴中文网登录" bordered>
						<Button type="primary">绑定</Button>
						<Button type="primary" danger>解绑</Button>
					</ProCard>
				</ProCard>
			</ProCard.Group>
		</PageContainer>
	);
}