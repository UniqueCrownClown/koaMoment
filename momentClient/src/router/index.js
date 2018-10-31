import Vue from 'vue'
import store from '../store/store'
import Router from 'vue-router'
import Register from '@/view/Register'
import Login from '@/view/Login'
import Main from '@/view/Main'
import WriteMoment from '@/view/WriteMoment'
import MessageBox from '@/components/MessageBox'


Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      path: '/messagetest',
      name: 'MessageBox',
      component: MessageBox
    },
    {
      path: '/main/write',
      name: 'WriteMoment',
      component: WriteMoment
    }
  ]
})
//注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  //获取store里面的token
  let token = store.state.loginMan.token;
  //判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router
