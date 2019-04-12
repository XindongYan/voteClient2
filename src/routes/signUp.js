import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Card, Input, Button, message, Form, Icon } from 'antd';
import { setNickName } from '../services/example';

@Form.create()
@connect(state => ({

}))

export default class signUp extends React.PureComponent {

	submitNickName(e) {
		this.props.form.validateFields(async (error, value) => {
			try {
				let result = await setNickName(value);
				localStorage.setItem('currentUser', result.data.nickName);
				message.success('创建用户成功');
				window.location.href=`${window.location.origin}/`;
			} catch (e) {
				message.warn('创建用户失败');
			}
		})

	}
	render() {

		const { getFieldDecorator } = this.props.form;

		return (
			<div className={styles.normal}>
				<ul className={styles.list} >
					<Card style={{ width: 400, fontWeight: 'bold', margin: '0 auto' }} title="输入您的昵称">
						<Form style={{ textAlign: 'center' }} onSubmit={this.submitNickName.bind(this)} className="login-form">
							<Form.Item>
								{getFieldDecorator('nickName', {
									rules: [{ required: true, message: '组织名称不可为空' }],
								})(
									<Input prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" placeholder="小不点" style={{ width: 230 }} />
								)}
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" style={{ fontFamily: '微软雅黑' }} className="login-form-button">
									立即创建
            		</Button>
							</Form.Item>
						</Form>
					</Card>
				</ul>
			</div>
		)
	}
}
