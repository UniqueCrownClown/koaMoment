<template>
  <div>
    <div class="main-background">
      <div class="main-header">
        <div>
          <x-icon type="ios-arrow-left"
                  size="30"
                  class="main-back-btn"
                  @click="handleBackLogin"></x-icon>
          <x-icon type="ios-ionic-outline"
                  size="30"
                  class="main-refresh-btn"
                  @click="handleRefreshMoment"></x-icon>
        </div>
        <h3>moment</h3>
        <x-icon class="main-writebox-btn"
                type="ios-plus-outline"
                size="30"
                @click="handleWriteBox"></x-icon>
      </div>

      <div class="main-mes">
        <span class="main-username">{{loginMan.username}}</span>
        <img class="main-avatar"
             :src="loginMan.avatar|getPath"
             alt="登录者头像">
      </div>
    </div>
    <div class="main-message-collection">
      <MessageBox :cmomentData="momentData"></MessageBox>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import MessageBox from "@/components/MessageBox";
import { allMoment, getMoment } from "../api";
import Util from "../util/util"

export default {
  name: "Main",
  components: {
    MessageBox
  },
  filters: {
    getPath: function (value) {
      return Util.getrealPicPath(value)
    }
  },
  data () {
    return {
      momentData: []
    };
  },
  methods: {
    handleWriteBox () {
      this.$router.push(`/main/write`);
    },
    async handleRefreshMoment () {
      alert("query");
      //查询所有moment
      let responseValue = await getMoment("testb");
      let { status, data } = responseValue;
      if (status !== 200) {
        throw data.msg || "登录异常";
      } else {
        if (data.code != 200) {
          Util.info(this, data.msg);
        } else {
          //Util.info(this, data.data);
        }
        return;
      }
      //处理一下，按时间戳排序
      this.momentData = data.data.momentData;

    },
    handleBackLogin () {
      this.$router.push(`/`);
    },
    compareDate (dateStr) {
      return new Date(dateStr);
    },
    quickSort (arr) {
      if (arr.length <= 1) {
        return arr;
      }
      var pivotIndex = Math.floor(arr.length / 2);
      var pivot = arr.splice(pivotIndex, 1)[0];
      var left = [];
      var right = [];
      for (var i = 0; i < arr.length; i++) {
        if (this.compareDate(arr[i].time) > this.compareDate(pivot.time)) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }
      return this.quickSort(left).concat([pivot], this.quickSort(right));
    }
  },
  async mounted () {
    // 显示
    this.$vux.loading.show({
      text: 'Loading'
    })
    //要去查询所有的moment回来
    const responseValue = await allMoment();
    let { status, data } = responseValue;
    if (status !== 200) {
      throw data.msg || "登录异常";
    } else {
      if (data.code != 200) {
        Util.info(this, data.msg);
      } else {
        // Util.info(this, data.data);
        this.momentData = data.data;
        //快排
        this.momentData = this.quickSort(this.momentData);
      }
    }
    // 隐藏
    this.$vux.loading.hide()
  },
  computed: {
    ...mapState(["loginMan"])
  }
};
</script>

<style lang="less" scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  .main-refresh-btn {
    margin-left: 10px;
    fill: #fff;
    cursor: pointer;
  }
  .main-back-btn {
    fill: #fff;
    margin: 0 10px;
    cursor: pointer;
  }
  .main-writebox-btn {
    fill: #fff;
    margin: 0 10px;
    cursor: pointer;
  }
}
.main-background {
  width: 100%;
  height: 400px;
  margin-bottom: 100px;
  position: relative;
  background: #67b26f; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #4ca2cd,
    #67b26f
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #4ca2cd,
    #67b26f
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  .main-mes {
    position: absolute;
    right: 20px;
    bottom: -40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    span {
      margin: 0 20px;
    }
  }
}
</style>
