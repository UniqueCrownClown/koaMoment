<template>
  <div class="message-comment">
    <div v-show="commentInput"
         class="message-comment-container">
      <input placeholder="orz~~~~"
             class="message-comment-input"
             v-model="commentText" />
      <button class="message-comment-send"
              @click="handleCommentInput">发送</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { addComment } from "../api";
import Util from "../util/util"
import vm from "@/event.js";
export default {
  name: "CommentInput",
  props: ["showCommentInput"],
  data () {
    return {
      commentText: "",
    }
  },
  // mounted () {
  //   this.setCommentInput(true);
  // },
  methods: {
    ...mapMutations(["saveComment", "setCommentInput"]),
    async handleCommentInput () {
      this.setCommentInput(false);
      if (this.commentText === "") {
        return;
      }
      let params = new URLSearchParams();
      params.append("message", this.commentText);
      params.append("momentid", this.currentCommentData.momentid);
      params.append("belong", this.currentCommentData.belong);
      params.append("source", this.currentCommentData.source);
      params.append("target", this.currentCommentData.target);
      const responseValue = await addComment(params);
      let { status, data } = responseValue;
      if (status !== 200) {
        throw data.msg || "评论异常";
      } else {
        if (data.code != 200) {
          Util.info(this, data.msg);
        } else {
          this.commentText = "";
          vm.$emit("message", data.data);
        }
      }
    }
  },
  computed: {
    ...mapState(["loginMan", "currentCommentData", "commentInput"])
  },
}
</script>
<style lang="less" scoped>
.message-comment {
  position: fixed;
  bottom: 6px;
  padding: 0 10px;
  width: calc(100% - 20px);
  .message-comment-container {
    display: flex;
    border-radius: 4px;
    box-shadow: 0px 0px 4px #1aad19;
    background-color: #eeeeee;
    .message-comment-input {
      flex-grow: 1;
      outline: none;
      border: none;
      margin: 10px;
      background-color: #eeeeee;
    }
    .message-comment-send {
      cursor: pointer;
      outline: none;
      width: 80px;
      margin: 4px;
      background-color: #ffffff;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      color: #eeeeee;
      &:hover {
        background-color: #1aad19;
        color: #ffffff;
      }
    }
  }
}
</style>
