import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Card, Input, Button, message, Form, Icon } from 'antd';
import { backendLogin } from '../services/example';

@Form.create()
@connect(state => ({
	currentUser: state.example.currentUser
}))

export default class adminLogin extends React.PureComponent {

	submitNickName(e) {
		this.props.form.validateFields(async (error, value) => {
			try {
				let backend = await backendLogin(value);
				localStorage.setItem('backend', backend.data.token);
				this.props.dispatch({
					type: 'example/fetch',
					payload: { ...backend }
				})
				window.location.href = `${window.location.origin}/?#/backend`;
			} catch (e) {
				message.warn('登陆信息有误');
			}
		})

	}
	render() {

		const { getFieldDecorator } = this.props.form;

		return (
			<div className={styles.normal}>
				<ul className={styles.list} >
					<Card style={{ width: 400, fontWeight: 'bold', margin: '0 auto' }} title="管理员登陆">
						<Form style={{ textAlign: 'center' }} onSubmit={this.submitNickName.bind(this)} className="login-form">
							<Form.Item>
								{getFieldDecorator('username', {
									rules: [{ required: true, message: '账号不可为空' }],
								})(
									<Input prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" style={{ width: 230 }} />
								)}
							</Form.Item>
							<Form.Item>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '密码不可为空' }],
								})(
									<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" type="password" style={{ width: 230 }} />
								)}
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" style={{ fontFamily: '微软雅黑' }} className="login-form-button">
									登陆
            		</Button>
							</Form.Item>
						</Form>
					</Card>
				</ul>
			</div>
		)
	}
}
