import axios from 'axios'
import config from '../config'
import store from '../store/store';



// 全局设置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 创建一个axios的实列
const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use = instance.interceptors.request.use;

// request拦截器，每次发送请求的时候拦截下来
instance.interceptors.request.use(
  config => {
    // 每次发送请求，检查 vuex 中是否有token,如果有放在headers中
    if (store.state.loginMan.token) {
      config.headers.Authorization = store.state.loginMan.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)

let cType = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}


export const login = params => instance.post(`${config.IP}:${config.PORT}/api/user/login`, params) // 用户登录

export const register = params => instance.post(`${config.IP}:${config.PORT}/api/user`, params) // 用户注册

export const allMomment = () => instance.get(`${config.IP}:${config.PORT}/api/user/moment`) // 获取所有的comment

export const getMomment = () => instance.get(`${config.IP}:${config.PORT}/api/user/getmoment`) // 获取某个用户的comment

export const addMoment = params => instance.post(`${config.IP}:${config.PORT}/api/user/addmoment`, params) // 用户发表moment

export const delMoment = params => instance.post(`${config.IP}:${config.PORT}/api/user/delmoment`, params) // 用户moment

export const postImage = params => instance.post(`${config.IP}:${config.PORT}/api/user/postImage`, params, cType) //用formData上送图片

export const setAdmire = params => instance.post(`${config.IP}:${config.PORT}/api/user/setAdmire`, params) //点赞

export const delAdmire = params => instance.post(`${config.IP}:${config.PORT}/api/user/delAdmire`, params) //取消点赞
