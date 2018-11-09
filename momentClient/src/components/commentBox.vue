<template>
  <div class="message-commentList">
    <div class="message-commentItem"
         v-for="item in commentList"
         :key="item.id"
         @click="handleAnswer(item)">
      <div>
        <span>{{item.source}}</span>
        <div v-show="item.isAnswer"
             class="huifu-block">回复<span>{{item.target}}</span></div>
        <span>:</span>
        <span>{{item.message}}({{item.time}})</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { getComment, addComment } from "../api";
import vm from "@/event.js";
import Util from "../util/util"
export default {
  name: "CommentBox",
  props: ["momentId"],
  data () {
    return {
      answerId: "clown",
      commentList: []
    }
  },
  filters: {
  },

  methods: {
    ...mapMutations(["saveComment", "setCommentInput"]),
    async handleAnswer (item) {
      this.setCommentInput(true);
      this.saveComment({
        momentid: this.momentId,
        source: this.loginMan.username,
        target: item.source,
        belong: item.id
      });
    },
  },
  async mounted () {
    //要去查询指定momentId的回来
    const responseValue = await getComment(this.momentId);
    let { status, data } = responseValue;
    if (status !== 200) {
      throw data.msg || "查询异常";
    } else {
      if (data.code != 200) {
        Util.info(this, data.msg);
      } else {
        Util.info(this, data.data);
        this.commentList = data.data;
        this.commentList.forEach(element => {
          if (element.belong === "" && element.target === "") {
            element.isAnswer = false
          } else {
            element.isAnswer = true
          }
        });
      }
    }
    //监听
    vm.$on('message', (data) => {
      console.log(data);
      if(this.momentId ===data.momentid){
        if(data.belong ===""){
          data.isAnswer = false
        }else{
          data.isAnswer = true;
        }
        this.commentList.push(data);
      }
    })

  },
  computed: {
    ...mapState(["loginMan", "currentCommentData", "commentInput"])
  },
}
</script>
<style lang="less" scoped>
.message-commentList {
  .message-commentItem {
    cursor: pointer;
    text-align: left;
  }
  .huifu-block {
    display: inline-block;
  }
}
</style>
