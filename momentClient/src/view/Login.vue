<template>
  <div>
    <div>
      <h3>用户登录</h3>
    </div>
    <group>
      <x-input title="姓名"
               name="loginName"
               placeholder="请输入姓名"
               v-model="loginForm.account"></x-input>
    </group>
    <group>
      <x-input title="密码"
               name="loginPwd"
               placeholder="请填写密码"
               type="password"
               v-model="loginForm.checkPass"></x-input>
    </group>
    <div style="padding:15px;">
      <x-button type="primary"
                @click.native="handleLogin">登录</x-button>
    </div>
    <div class="toBottom">
      <card>
        <div slot="content"
             class="card-demo-flex card-demo-content01">
          <div class="vux-1px-r">找回密码</div>
          <div class="vux-1px-r"
               @click="toRegister">注册</div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { Card } from "vux"
import { login } from "../api"
import { mapMutations, mapState, mapGetters } from "vuex"
import config from '../config'
import Util from "../util/util"

export default {
  name: "Login",
  components: {
    Card
  },
  data () {
    return {
      loginForm: {
        account: "testa",
        checkPass: "123456"
      }
    };
  },
  methods: {
    ...mapMutations(["save", "remove"]),
    toRegister () {
      //  路由跳转
      this.$router.push(`/register`);
    },
    async handleLogin () {
      let params = new URLSearchParams();
      params.append("username", this.loginForm.account);
      params.append("password", this.loginForm.checkPass);
      let responseValue = await login(params);
      let { status, data } = responseValue;
      if (status !== 200) {
        throw data.msg || "登录异常";
      } else {
        if (data.code != 200) {
          Util.info(data.msg);
          return;
        }
        this.save({
          _id: data.data.id,
          username: data.data.username,
          token: data.data.token,
          avatar: data.data.avatar
        });
        this.$router.push(`/main`);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import '~vux/src/styles/close.less';

.popup0 {
  padding-bottom: 15px;
  height: 200px;
}

.card-demo-flex {
  display: flex;
  justify-content: center;
}
.card-demo-content01 {
  padding: 10px 0;
}

.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
}
</style>
