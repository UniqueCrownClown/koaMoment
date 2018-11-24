<template>
  <div class="moment-collection">
    <div class="message-collection">
      <div class="message-admireBox"
           v-show="showAdmire">
        <i class="iconfont icon-aixin"
           @click="handleAdmire(momentId)">
          {{admireText= admireList.includes(loginMan.username)?"取消":"赞"}}
        </i>
        <i class="iconfont icon-pinglun1"
           @click="togglePinlun(momentId)">评论</i>
      </div>
      <i class="iconfont icon-pinglun"
         ref="main"
         @click="toggleAdmire()"></i>
    </div>
    <div class="message-admire-list">
      <i class="iconfont icon-aixin"></i>
      <span v-for="(item,index) in admireList"
            :key="index">{{item}}</span>
    </div>
  </div>
</template>
<script>
import Util from '../util/util'
import { mapMutations, mapState } from "vuex"
import { getAdmire, setAdmire, delAdmire } from "../api";
export default {
  name: "AdmireBox",
  props: ["momentId"],
  data () {
    return {
      showAdmire: false,
      admireText: "赞",
      admireList: []
    }
  },
  methods: {
    ...mapMutations(["setcurrentmomentId", "setCommentInput", "saveComment"]),
    toggleAdmire () {
      this.showAdmire = !this.showAdmire;
    },
    togglePinlun (momentId) {
      //隐藏框
      this.showAdmire = false;
      this.setCommentInput(true);
      this.saveComment({
        momentid: momentId,
        source: this.loginMan.username,
        target: "",
        belong: ""
      });
    },
    async handleAdmire (momentId) {
      //隐藏框
      this.showAdmire = false;
      let name = this.loginMan.username;
      let params = new URLSearchParams();
      params.append("momentid", momentId);
      params.append("username", name);
      let responseValue;
      if (this.admireList.includes(name)) {
        responseValue = await delAdmire(params);
        this.admireList.splice(this.admireList.indexOf(name), 1);
      } else {
        responseValue = await setAdmire(params);
        this.admireList.push(name);
      }
      let { status, data } = responseValue;
      if (status !== 200) {
        throw data.msg || "发送异常";
      } else {
        if (data.code != 200) {
          Util.info(this, data.msg);
        } else {
          Util.info(this, data.msg);
        }

      }
    },
  },
  async mounted () {
    //要去查询指定momentId的回来
    const responseValue = await getAdmire(this.momentId);
    let { status, data } = responseValue;
    if (status !== 200) {
      throw data.msg || "查询异常";
    } else {
      if (data.code != 200) {
        console.log(data.msg);
      } else {
        if (data.data[0]) {
          this.admireList = data.data[0].admire;
        }
      }
    }
    document.addEventListener("click", ev => {
      if (this.$refs.main && !this.$refs.main.contains(ev.target)) {
        this.showAdmire = false;
      }
    });
  },
  computed: {
    ...mapState(["loginMan", "currentCommentData", "currentMomentId"])
  }
}
</script>
<style lang="less" scoped>
.moment-collection {
  .message-collection {
    display: flex;
    justify-content: flex-end;
    height: 40px;
    i {
      font-size: 2rem;
      height: inherit;
      cursor: pointer;
      margin: 0 10px;
      line-height: 40px;
    }
    .message-admireBox {
      display: flex;
      justify-content: center;
      align-content: center;
      background-color: #2c3e50;
      i {
        font-size: 1rem;
        color: #fff;
        padding: 0 10px;
        cursor: pointer;
        font-weight: normal;
        line-height: 40px;
        &:hover {
          color: #f55;
        }
      }
    }
  }
  .message-admire-list {
    text-align: left;
    border-bottom: 1px solid #cccccc;
    i {
      font-weight: 700;
    }
    span {
      padding: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
