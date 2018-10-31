<template>
  <div class="moment-register">
    <div>
      <h3>用户注册</h3>
    </div>
    <div class="form-item-avatar">
      <div class="avatar-box">
        <img class="avatar-show"
             alt="上传头像"
             :src=registerForm.avatar>
        <label class="upload-img-btn"
               for="upload-img">上传图片</label>
        <input id="upload-img"
               type="file"
               @change="upload_img">
      </div>
    </div>
    <group label-margin-right="2em"
           label-align="justify">
      <x-input title="姓名"
               name="username"
               placeholder="请输入姓名"
               v-model="registerForm.account"></x-input>
    </group>

    <group label-margin-right="2em"
           label-align="justify">
      <x-input title="邮箱"
               name="email"
               placeholder="请输入邮箱地址"
               is-type="email"
               v-model="registerForm.email"></x-input>
    </group>

    <group label-margin-right="2em"
           label-align="justify">
      <x-input title="密码"
               placeholder="设置一个最小6位的密码"
               type="password"
               :min="6"
               v-model="registerForm.checkPass"></x-input>
    </group>

    <group label-margin-right="2em"
           label-align="justify">
      <x-input title="确认"
               type="password"
               v-model="password2"
               :equal-with="registerForm.checkPass"></x-input>
    </group>

    <div style="padding:15px;">
      <x-button @click.native="handleRegister"
                type="primary">注册</x-button>
    </div>
    <div style="padding:15px;"
         v-show="false">
      <x-button @click.native="handleFormData"
                type="primary">图片测试</x-button>
    </div>

    <div class="cropper-img-box"
         v-if="cropper_box_mark == true">
      <vueCropper ref="cropper"
                  :img="cropperData.img"
                  :autoCrop="cropperData.autoCrop"
                  :autoCropWidth="cropperData.autoCropWidth"
                  :autoCropHeight="cropperData.autoCropHeight"
                  :fixedBox="cropperData.fixedBox"></vueCropper>
      <div class="cropper-img-tool">
        <button class="cropper-img-tool-btn"
                @click="rotateRight">顺时针90°</button>
        <button class="cropper-img-tool-btn"
                @click="finish">确认</button>
        <button class="cropper-img-tool-btn"
                @click="cropper_box_mark = false">取消</button>
        <button class="cropper-img-tool-btn"
                @click="rotateLeft">逆时针90°</button>
      </div>
    </div>
  </div>
</template>
<script>
import { register, postImage } from "../api";
import VueCropper from "vue-cropper";
export default {
  name: "Register",
  components: { VueCropper },
  data () {
    return {
      cropperData: {
        img: "",
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      cropper_box_mark: false,
      img_base64: "",
      registerForm: {
        account: "",
        checkPass: "",
        email: "",
        avatar: "/static/avatar.jpg"
      },
      password2: ""
    };
  },
  methods: {
    async handleFormData () {
      var params = new FormData()
      var file = document.getElementById("upload-img").files[0];
      params.append('file', file)
      let responseValue = await postImage(params);
    },
    async handleRegister () {
      let params = new URLSearchParams();
      params.append("username", this.registerForm.account);
      params.append("email", this.registerForm.email);
      params.append("password", this.registerForm.checkPass);
      let avatarTemp =
        this.registerForm.avatar.substring(
          this.registerForm.avatar.length - 3
        ) === "jpg"
          ? ""
          : this.registerForm.avatar;
      params.append("avatar", avatarTemp);
      let responseValue = await register(params);
      let { status, data } = responseValue;
      if (status !== 200) {
        throw data.msg || "注册异常";
      } else {
        if (data.code != 200) {
          this.$vux.alert.show({
            title: '提示',
            content: data.msg
          })
          return;
        }
        this.$vux.alert.show({
          title: '提示',
          content: '注册成功'
        })
        this.$router.push(`/`);
      }
    },
    rotateRight () {
      this.$refs.cropper.rotateRight();
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft();
    },
    finish () {
      this.$refs.cropper.getCropData(data => {
        this.registerForm.avatar = data;
        this.cropper_box_mark = false;
      });
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
      let _self = this;
      reader.onload = function (ev) {
        _self.cropperData.img = ev.target.result;
        _self.cropper_box_mark = true;
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>
<style lang="less" scoped>
.moment-register {
  .avatar-box {
    flex: 1;
  }
  #upload-img {
    opacity: 0;
    display: none;
  }
  .upload-img-btn {
    width: 100px;
    border: 1px solid #ccc;
    display: block;
    padding: 5px 15px;
    transform: translateY(40%);
    margin: 5px auto;
    cursor: pointer;
  }
  .form-itme-avatar {
    height: auto;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .avatar-show {
    margin: 0 auto;
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .cropper-img-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .cropper-img-tool {
    position: absolute;
    z-index: 2;
    bottom: 20px;
    left: 0;
    text-align: center;
    width: 100%;
    .cropper-img-tool-btn {
      width: 140px;
      height: 50px;
      font-size: 18px;
      cursor: pointer;
      & + .cropper-img-tool-btn {
        margin-left: 50px;
      }
    }
  }
}
</style>

