import React from 'react';
import { connect } from 'dva';
import { Icon, Button, Modal, Form, Input, Upload, message } from 'antd';
import { postVoteContent, update, editRemoveImg } from '../services/example';
import { routerRedux } from 'dva/router';
const { TextArea } = Input;

@Form.create()
@connect(state => ({
	cache: state.example.cache,
	visible: state.example.visible,
	edit: state.example.edit,
	images: state.example.images
}))

export default class modalMusk extends React.PureComponent {

	state = {
		imageUrl: '',
		image: [],
		images: []
	}

	componentDidMount() {

	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.cache._id !== this.props.cache._id) {
			console.log('可以在这里写cache');
			const { cache } = nextProps;

			if (cache && cache.imageUrl) {
				let imageArray = []
				let index = 0
				for (const c of cache.imageUrl) {
					imageArray.push({
						'uid': index,
						'name': c,
						'status': 'done',
						'id': cache._id,
						'url': 'http://127.0.0.1:3000' + c || '',
						'thumbUrl': 'http://127.0.0.1:3000' + c || ''

					})
					index++;
				}
				console.log(imageArray);
				this.setState({
					image: imageArray
				})
			}

		}
	}

	postVote(e) {
		const { cache } = this.props;
		const { imageUrl } = this.state;
		console.log(cache);
		console.log(imageUrl)
		this.props.form.validateFields(async (error, value) => {
			try {
				let result;
				if (Object.keys(cache).length === 0) {

					if (imageUrl && imageUrl.response) {
						console.log('更新 应该')
						// 先上传图片
						Object.assign(value, {
							_id: imageUrl.response._id
						});

						result = await postVoteContent(value, localStorage.getItem('backend'));
						if (result.data.code === 403) {
							message.warn(result.data.msg);
							this.props.dispatch(routerRedux.push('/backend/login'));
						};

					};

				} else {
					result = await update({ id: cache._id, ...value }, localStorage.getItem('backend'));
					if (result.data.code === 403) {
						message.warn(result.data.msg);
						this.props.dispatch(routerRedux.push('/backend/login'));
					}
				}
				this.props.dispatch({
					type: 'example/fetchBackend',
					payload: {}
				});
				message.success(result.data.msg);
				this.hideModal()
			} catch (error) {
				message.warn(error);
			}

		})
	}

	hideModal = () => {
		this.props.dispatch({
			type: 'example/hidden',
			payload: false
		})
	}

	action = (e) => {
		let fileList = e.fileList;

		this.setState({
			image: fileList
		})
		if (e && e.event) {
			this.setState({
				imageUrl: e.fileList[0]
			});
		};
	}

	onRemove = async (e) => {

		let result = await editRemoveImg(e, localStorage.getItem('backend'));
		if (result.data.code === 200) {
			message.success(result.data.msg);
		} else {
			message.error(result.data.msg)
		}
	}
	render() {

		const { getFieldDecorator } = this.props.form;
		const { cache, visible, edit } = this.props;
		const { image, imageUrl } = this.state;

		return (
			<Modal
				title="添加投票内容"
				visible={visible}
				onOk={this.hideModal}
				onCancel={this.hideModal}
				footer={null}
			>
				<Form style={{ textAlign: 'center', margin: '0 auto', width: 300 }} onSubmit={this.postVote.bind(this)} className="login-form">
					<Form.Item>
						{getFieldDecorator('name', {
							initialValue: cache.name || '',
							rules: [{ required: true, message: '请输入姓名!' }]
						})(
							<Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="马思纯" defaultValue="fgr" />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('school', {
							initialValue: cache.school || '',
							rules: [{ required: true, message: '请输入学校' }],
						})(
							<Input size="large" prefix={<Icon type="read" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="安徽大学" />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('desc', {
							initialValue: cache.desc || '',
							rules: [{ required: true, message: '请输入作品介绍!' }],
						})(
							<TextArea prefix={<Icon type="text" style={{ color: 'rgba(0,0,0,.25)' }} />} rows={4} placeholder="一句话介绍作品" />
						)}
					</Form.Item>
					{console.log(edit)}
					<Form.Item>
						{getFieldDecorator('files', {
							rules: [{ required: false, message: '请上传文件!' }],
						})(
							edit !== 'edit' ?
								imageUrl && imageUrl.response ?
									<Upload
										name="image" action="http://127.0.0.1:3000/api/update" headers={{ Authorization: this.props.auth }} data={{ id: imageUrl.response._id }} onChange={e => this.action(e)} listType="picture" multiple={true}>
										<Button>
											<Icon type="upload" /> 点击上传文件
										</Button>
									</Upload>
									:
									<Upload
										name="image" action="http://127.0.0.1:3000/api/upload" headers={{ Authorization: this.props.auth }} onChange={e => this.action(e)} listType="picture" multiple={true}>
										<Button>
											<Icon type="upload" /> 点击上传文件
									</Button>
									</Upload>
								:
								<Upload
									fileList={[...image]}
									onRemove={this.onRemove}
									name="image" action="http://127.0.0.1:3000/api/update" headers={{ Authorization: this.props.auth }} data={{ id: cache._id, image }} onChange={e => this.action(e)} listType="picture" multiple={true}>
									<Button>
										<Icon type="upload" /> 点击上传文件
              		</Button>
								</Upload>
						)}
					</Form.Item>

					<Form.Item>
						{
							edit !== 'edit' ?
								<Button type="primary" htmlType="submit" style={{ fontFamily: '微软雅黑' }} className="login-form-button">
									添加投票内容
            		</Button>
								:
								<Button type="primary" htmlType="submit" style={{ fontFamily: '微软雅黑' }} className="login-form-button">
									保存
            		</Button>
						}

					</Form.Item>
				</Form>
			</Modal>
		)
	}
}