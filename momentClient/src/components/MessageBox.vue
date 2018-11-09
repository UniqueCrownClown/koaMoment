<template>
  <div>
    <div class="messageBox"
         v-for="momentItem in getData"
         :key="momentItem.momentId">
      <div class="messageBox-left"><img :src="momentItem.avatar|getPath"
             alt=""></div>
      <div class="messageBox-right">
        <div class="message-owner">{{momentItem.ownner}}</div>
        <div class="message-content">{{momentItem.message}}</div>
        <div class="message-picList">
          <div class="message-picItem"
               v-for="(item,index) in momentItem.imageList"
               :key="index">
            <img class="message-img"
                 :src="item|getPath" />
          </div>
        </div>
        <div class="message-toolBar">
          <div class="message-time">{{momentItem.time}}</div>
          <AdmireBox :momentId="momentItem.momentId"></AdmireBox>
          <CommentBox :momentId="momentItem.momentId"></CommentBox>
        </div>
      </div>
    </div>
    <CommentInput></CommentInput>
  </div>
</template>

<script>
import Util from '../util/util'
import { mapMutations, mapState } from "vuex"
import CommentBox from "@/components/CommentBox"
import AdmireBox from "@/components/AdmireBox"
import CommentInput from "@/components/CommentInput"
export default {
  name: "MessageBox",
  props: ["cmomentData"],
  components: {
    CommentInput,
    CommentBox,
    AdmireBox
  },
  data () {
    return {
      showCommentInput: false,
      commentData: {}
    }
  },
  methods: {
  },
  computed: {
    ...mapState(["loginMan"]),
    //监听父组件的数值变化
    getData () {
      return this.cmomentData;
    }
  },
  filters: {
    getPath (value) {
      return Util.getrealPicPath(value)
    },
    orderByData(value) {
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
    .message-picList {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .message-picItem {
        width: 33%;
        padding-bottom: 33%;
        position: relative;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
    }
  }
}
</style>
