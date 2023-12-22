<template>
  <div class="login_ct">
    <el-card class="login_card">
      <!-- 登陆 -->
      <p
        style="
          font-size: 20px;
          text-align: center;
          font-weight: bold;
          margin-bottom: 10%;
          margin-top: 20%;
        "
      >
        登陆店铺管理
      </p>
      <el-form label-position="top">
        <el-form-item label="">
          <el-input v-model="loginForm.phone" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%; background: linear-gradient(to right, #0089ba, #b15db9)"
            color="#626aef"
            @click="login(loginForm)"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <div class="login_footer">作者：阿里开发小分队</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { loginType } from '@/types'
import { login } from '@/api'

const loginForm = ref<loginType>({
  phone: '',
  password: ''
})
</script>

<style scoped>
.login_ct {
  /* background-image: url(@/assets/login_bg.jpg); */
  /* 背景颜色从上到下渐变，由浅黄变深 */
  background: linear-gradient(to right, #845ec2, #d65db1);
  /* background-color: gray; */
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 左右排列元素 */
  flex-direction: column;
}
.login_card {
  width: 25vw;
  height: 60vh;
  /* 内部元素居中 */
  /* display: flex;
  justify-content: center; */
  /* align-items: center; */
  border-radius: 10px;
}
.login_footer {
  color: #f1f1f1;
  background: linear-gradient(to right, #0089ba, #b15db9);
  opacity: 0.5;
  /* background-color: aqua; */
  margin-top: 50px;
}
</style>
