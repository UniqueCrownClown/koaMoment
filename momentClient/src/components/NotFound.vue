<template>
  <div class="moment-notfound">
    <div class="moment-notfound-container">
      <img src="../assets/feidie.gif"
           alt="">
      <span class="moment-notfound-text">你访问的页面正在外太空！！!</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "NotFound"
}
</script>
<style lang="less" scoped>
.moment-notfound {
  width: 100%;
  position: fixed;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #005aa7; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #fffde4,
    #005aa7
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #fffde4,
    #005aa7
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .moment-notfound-container {
    width: 658px;
    height: 494px;
    position: relative;
    display: flex;
    justify-content: center;
    .moment-notfound-text {
      position: absoulte;
      color: #eeeeee;
      font-size: 24px;
      font-weight: 700;
      background-color: rgba(255, 255, 255, 0.3);
      position: absolute;
      bottom: 48px;
      border-radius: 10px;
      padding: 12px;
    }
  }
}
</style>
