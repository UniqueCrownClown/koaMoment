<template>
  <div>
    <x-dialog v-model="commentInput"
              class="comment-dialog"
              hide-on-blur>
      <div class="message-comment-text">
        <group title="评论个锤子">
          <x-textarea placeholder="orz~~~~"
                      v-model="commentText"></x-textarea>
          <x-button type="primary"
                    mini
                    class="message-comment-send"
                    @click.native="handleCommentInput">发送</x-button>
        </group>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import { XDialog } from 'vux'
import { mapState, mapMutations } from "vuex";
import { addComment } from "../api";
import Util from "../util/util"
import vm from "@/event.js";
export default {
  name: "CommentInput",
  props: ["showCommentInput"],
  components: {
    XDialog
  },
  data () {
    return {
      commentText: "",
    }
  },
  methods: {
    ...mapMutations(["saveComment", "setCommentInput"]),
    async handleCommentInput () {
      this.setCommentInput(false);
      if (this.commentText === "") {
        return;
      }
      let params = new URLSearchParams();
      params.append("message",  this.commentText);
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
          this.commentText ="";
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
.message-comment-send{
  cursor: pointer;
}
</style>
