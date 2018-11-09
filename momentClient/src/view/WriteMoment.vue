<template>
  <div class="writeBox">
    <x-header :left-options="{backText: ''}">发表文字<a slot="right"
         class="writeBox-text"
         @click="send">发表</a></x-header>
    <group>
      <x-textarea :max="100"
                  name="description"
                  placeholder="这一刻的想法..."
                  v-model="momentMessage"></x-textarea>
    </group>
    <div class="writeBox-uploadImg">
      <label class="writeBox-addImg"
             for="writeBox-upload-img">
        <x-icon type="ios-plus-empty"
                size="60"></x-icon>
      </label>
      <input id="writeBox-upload-img"
             type="file"
             @change="upload_img">
      <div class="writBox-imgList">
        <div class="writeBox-imgItem"
             v-for="(imgItem,index)  in uploadImgList"
             :key="index">
          <img :src="imgItem"
               alt="等待上传图片"
               width="200"
               height="200">
          <x-icon class="writeBox-img-close"
                  type="ios-close-empty"
                  size="30"
                  @click="closeImg(index)"></x-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { XHeader, XTextarea } from "vux";
import Util from '../util/util'
import { postImage, addMoment } from "../api";
export default {
  name: "WriteMoment",
  components: {
    XHeader,
    XTextarea
  },
  data () {
    return {
      uploadImgList: [],
      momentMessage: ""
    };
  },
  computed: {
    ...mapState(["loginMan"])
  },
  methods: {
    async send () {
      let momentId = "";
      if (this.uploadImgList.length <= 0 || this.uploadImgList.length >= 9) {
        alert("too little or too much !!");
        return;
      }
      for (let i = 0, total = this.uploadImgList.length; i < total; i++) {
        let params = new URLSearchParams();
        params.append("username", this.loginMan.username);
        params.append("imageData", this.uploadImgList[i]);
        params.append("message", this.momentMessage);
        params.append("total", total);
        params.append("current", i + 1);
        params.append("momentId", momentId);
        console.log(momentId);
        let responseValue = await addMoment(params);
        console.log(responseValue);
        let { status, data } = responseValue;

        momentId = data.data.momentId;

        if (status !== 200) {
          throw data.msg || "发表异常";
        } else {
          if (data.code != 200) {
            Util.info(data.msg)
            return;
          } else {
            if (i == total - 1) {
              Util.info(this,data.data);
              this.momentMessage = "";
              this.$router.push(`/main`);
            }
          }
        }
      }
      //清空上传数组
      this.uploadImgList.splice(0);
    },
    upload_img (e) {
      let obj = e.target;
      let file = obj.files[0];
      let temArr = file.name.split(".");
      let file_suffix = temArr[temArr.length - 1];
      if (
        file_suffix != "jpg" &&
        file_suffix != "png" &&
        file_suffix != "jpeg"
      ) {
        alert("上传图片失败，目前只支持jpg,png,jpeg的图片!");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let own = this;
      reader.onload = function (e) {
        own.uploadImgList.push(reader.result);
      };
    },
    closeImg (index) {
      this.uploadImgList.splice(index, 1);
    }
  }
};
</script>
<style lang="less" scoped>
.writeBox {
  .writeBox-text {
    cursor: pointer;
  }
  .writeBox-uploadImg {
    display: flex;
    .writeBox-addImg {
      border: 1px dotted #bca;
      width: 200px;
      height: 200px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    input {
      opacity: 0;
      display: none;
    }
    .writBox-imgList {
      margin: 0 10px;
      flex-grow: 1;
      border: 1px solid #2c3e50;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .writeBox-imgItem {
        width: 30%;
        margin: 10px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        position: relative;
        img {
          width: auto;
          max-width: 100%;
          height: auto;
          max-height: 100%;
        }
        .writeBox-img-close {
          position: absolute;
          top: 4px;
          right: 4px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>
