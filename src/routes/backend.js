import React from 'react';
import { connect } from 'dva';
// import styles from './IndexPage.css';
import { Layout, Menu, List, Avatar, Icon, Popconfirm, Button, message, Dropdown, Breadcrumb } from 'antd';
import { routerRedux } from 'dva/router';
import Modal from '../components/modal';
import { remove, backendContent } from '../services/example';

const { Header, Content, Footer } = Layout;


@connect(state => ({
  voteBackendContent: state.example.voteBackendContent
}))

export default class backend extends React.PureComponent {

  state = {
    visible: false,
    imageUrl: '',
    cache: {},
    action: false,
    type: '',
    currentUser: {}
  }

  async componentDidMount() {
    let backend = localStorage.getItem('backend');
    if (!backend) {
      window.location.href = `${window.location.origin}/?#/backend/login`;
    } else {
      let result = await backendContent({}, backend);
      if (result.data.code === 403) {
        window.location.href = `${window.location.origin}/?#/backend/login`;
      }
    }

    this.props.dispatch({
      type: 'example/fetchBackend',
      payload: {}
    });
    this.setState({
      currentUser: backend
    })
  }


  showModal = (e, action) => {
    if (action === 'edit') {
      this.setState({
        cache: e,
        type: action
      });
      this.props.dispatch({
        type: 'example/show',
        payload: {
          value: e
        }
      })
    } else {
      this.setState({
        type: 'create',
      })
      this.props.dispatch({
        type: 'example/show',
        payload: {
          value: e
        }
      })
    }
  }

  back = () => {
    this.props.dispatch(routerRedux.push('/'))
  }

  delete = async (e) => {
    try {
      let result = await remove(e, this.state.currentUser);
      if (result.data.code === 403) {
        message.warn(result.data.msg);
        this.props.dispatch(routerRedux.push('/backend/login'));
      } else {
        this.props.dispatch({
          type: 'example/voteBackendContent',
          payload: result
        });
        message.success('删除成功');
      }
    } catch (error) {
      message.error(error)
    }
  }

  edit = (e) => {
    this.setState({
      action: true
    })
    this.showModal(e, 'edit');
  }

  handleMenuClick = (e) => {
    this.props.dispatch({
      type: 'example/fetchBackend',
      payload: { type: e.key, token: backend }
    });
  }

  render() {

		/**
		 * currentUser 当前token
		 * cache 修改时的缓存
		 * type 类型
		 */
    const { currentUser, cache, type } = this.state;
    console.log(type)

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">由赞数从高到底排列</Menu.Item>
        <Menu.Item key="2">由赞数从低到高排列</Menu.Item>
        <Menu.Item key="3">由最近时间排列</Menu.Item>
        <Menu.Item key="4">由最远时间排列</Menu.Item>
      </Menu>
    );

    const listData = [];
    for (let i = 0; i < 23; i++) {
      listData.push({
        href: 'http://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      });
    }

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    return (
      <Layout>
        {/* 头 */}
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">后台设置</Menu.Item>
            <Menu.Item key="2"><Button type="primary" onClick={e => this.back()}>返回首页</Button></Menu.Item>
          </Menu>
        </Header>

        {/* 内容  */}
        <Content style={{ padding: '0 50px', margin: '0 auto', marginTop: 104, width: '60%' }}>
          <Breadcrumb style={{ margin: '10px 0' }}>
            <Dropdown overlay={menu}>
              <Button>
                排序规则 <Icon type="down" />
              </Button>
            </Dropdown>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 30, minHeight: 380 }}>
            <ul style={{ padding: 0 }}><span style={{ fontWeight: 'bold' }}>已发布的内容</span><Button type="primary" onClick={this.showModal} shape="round" icon="plus" size="default" style={{ float: 'right' }}>添加</Button></ul>
            <List
              style={{ marginTop: 30 }}
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                },
                pageSize: 4,
              }}
              dataSource={this.props.voteBackendContent.data.content}
              footer={<div><b>投票系统后台管理</b></div>}
              renderItem={item => (
                <List.Item
                  key={item.name}
                  actions={[<IconText type="like-o" text={item.like} />, <a onClick={e => this.edit(item)}>编辑</a>,
                  <Popconfirm title="确定删除这条内容吗?" onConfirm={e => this.delete(item)} okText="Yes" cancelText="No">
                    <a>删除</a>
                  </Popconfirm>
                  ]}
                  extra={<img width={272} alt="logo" src={`http://127.0.0.1:3000${item.imageUrl[0]}`} />}
                >
                  <List.Item.Meta
                    avatar={<Avatar>管理员</Avatar>}
                    title={item.name}
                    description={item.school}
                  />
                  {item.desc}
                </List.Item>
              )}
            />,
          </div>
        </Content>

        {/* 尾部 */}
        <Footer style={{ textAlign: 'center' }}>
          朱杰作品
        </Footer>

        {cache ? <Modal auth={currentUser} cache={cache} type={type} /> : ''}
      </Layout>
    )
  }
}
