<template>
  <div class="messageBox">
    <div class="messageBox-left"><img :src="momentItem.messageAvatar"
           alt=""></div>
    <div class="messageBox-right">
      <div class="message-owner">{{momentItem.messageOwner}}</div>
      <div class="message-content">{{momentItem.messageContent}}</div>
      <div class="messge-picList">
        <div class="message-picItem"
             v-for="(item,index) in momentItem.imgList"
             :key="index">
          <img class="message-img"
               :src="item" />
        </div>
      </div>
      <div class="message-toolBar">
        <div class="message-time">{{momentItem.messageTime}}</div>
        <div class="message-collection">
          <i class="iconfont icon-pinglun"
             @click="showAdmire= !showAdmire"></i>
          <div class="message-admireBox"
               v-show="showAdmire">
            <i class="iconfont icon-aixin"
               @click="admireClick">{{admireText}}</i>
            <i class="iconfont icon-pinglun1"
               @click="commentClick = !commentClick ;showAdmire = false">评论</i>
          </div>
        </div>
        <div class="message-comment-text"
             v-show="commentClick">
          <group>
            <x-input name="commentText"
                     placeholder="orz~~~~"
                     v-model="commentText"
                     class="weui-vcode">
              <x-button slot="right"
                        type="primary"
                        mini>发送</x-button>
            </x-input>
          </group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setAdmire, delAdmire } from "../api"
import { mapMutations, mapState } from "vuex"
export default {
  name: "MessageBox",
  props: ["momentItem"],
  methods: {
    admireClick () {
      this.showAdmire = false;
      if (this.admireText === "赞") {
        // let params = new URLSearchParams();
        // params.append("username", "testb");
        // params.append("momentId", "xxxx");
        // let responseValue = await setAdmire(params);
        // let { status, data } = responseValue;
        this.admireText = "取消";

      } else {
        // let params = new URLSearchParams();
        // params.append("username", "testb");
        // params.append("momentId", "xxxx");
        // let responseValue = await delAdmire(params);
        this.admireText = "赞";
      }
    },
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.messageBox {
  display: flex;
  .messageBox-left {
    width: 100px;
    padding: 10px;
    img {
      width: 100%;
    }
  }
  .messageBox-right {
    padding: 10px;
    flex-grow: 1;
    .message-owner {
      text-align: left;
    }
    .message-content {
      text-align: left;
    }
    .messge-picList {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .message-picItem {
        width: 33%;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
    .message-img {
      width: 100px;
      height: 100px;
    }
    .message-toolBar {
      .message-time {
        text-align: left;
      }
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
    }
    //评论信息列表 start
    .message-comment {
      .message-admire {
        text-align: left;
        span {
          padding: 0 10px;
          cursor: pointer;
        }
      }
    }
    //评论信息列表 end
  }
}
</style>
