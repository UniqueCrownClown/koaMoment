<template>
      <div class="message-comment">
        <div class="message-admire">
          <span class="message-qunzong"
                v-for="(item,index) in momentItem.admireList"
                :key="index">{{item}}</span>
        </div>
        <div class="message-commentList"></div>
      </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>

</style>
