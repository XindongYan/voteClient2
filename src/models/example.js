import { getVoteContent, like } from '../services/example';

export default {

  namespace: 'example',

  state: {
    voteBackendContent: {
      data: {
        content: []
      }
    },
    visible: false,
    cache: {},  // 修改时的默认值
    currentUser: {},
    edit: '',
    images: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save', payload: { ...payload } });
    },
    *fetchBackend({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(getVoteContent, payload);
      yield put({
        type: 'voteBackendContent',
        payload: { ...response }
      });
      // if (callback) callback(response);
    },
    *postLike({ payload, callback }, { call, put }) {
      const response = yield call(like, payload);
      yield put({
        type: 'likes',
        payload: { ...response }
      });
      // if (callback) callback(response);
    },
    *show({ payload }, { call, put }) {
      yield put({
        type: 'changeVisible',
        payload: { visible: true, payload },
      });
    }
  },

  reducers: {
    changeVisible(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        visible: payload.visible,
        cache: payload.payload.value,
        edit: payload.payload.action
      }
    },

    hidden(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        visible: payload
      }
    },

    save(state, action) {
      console.log(action);
      return { ...state, ...action.payload };
    },

    voteBackendContent(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        voteBackendContent: payload
      }
    }
  },

  likes(state, { payload }) {
    return {
      ...state,
      voteBackendContent: payload
    }
  },

};
