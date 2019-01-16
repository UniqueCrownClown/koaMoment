import Vue from 'vue'
import store from '../store/store'
import Router from 'vue-router'
import Register from '@/view/Register'
import Login from '@/view/Login'
import Main from '@/view/Main'
import WriteMoment from '@/view/WriteMoment'
import MessageBox from '@/components/MessageBox'
import CommentBox from '@/components/CommentBox'
import CommentInput from '@/components/CommentInput'
import NotFound from '@/components/NotFound'

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
    },
    {
      path: '/commentBox',
      name: 'CommentBox',
      component: CommentBox
    },
    {
      path: '/commentInput',
      name: 'CommentInput',
      component: CommentInput
    },
    {
      path: "/404",
      name: "NotFound",
      component: NotFound
    },
    {
      path: "*", // 此处需特别注意置于最底部
      redirect: "/404"
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
