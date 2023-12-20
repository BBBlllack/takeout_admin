<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="sidebar">
        <el-avatar
          style="margin-top: 5vh"
          size="large"
          src="https://cdn.applysquare.net/a2/institute/cn.hebut/logo.png"
        />
        <h2>河工外卖</h2>
        <el-menu
          router
          active-text-color="#ffd04b"
          background-color="#545c64"
          text-color="#fff"
          :default-active="router.currentRoute.value.path"
        >
          <el-menu-item index="/category">
            <el-icon>
              <Menu />
            </el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/dish">
            <el-icon>
              <dish />
            </el-icon>
            <span>菜品管理</span>
          </el-menu-item>
          <el-menu-item index="/order">
            <el-icon>
              <List />
            </el-icon>
            <span>订单明细</span>
          </el-menu-item>
          <el-menu-item index="/setting">
            <el-icon>
              <Setting />
            </el-icon>
            <span>店铺设置</span>
          </el-menu-item>
          <el-menu-item index="#" @click="logout()">
            <el-icon>
              <DArrowLeft />
            </el-icon>
            <span>退出登陆</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="main">
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import router from '@/router'
import { DArrowLeft } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
function logout() {
  // 弹窗询问是否退出
  ElMessageBox.confirm('确认退出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 确认退出
    localStorage.removeItem('token')
    router.push('/login')
  })
}
</script>
<style scoped>
.common-layout {
  background-color: #fff;
  width: 100%;
  height: 100%;
  text-align: center;
}

.sidebar {
  width: 15vw;
  height: 100vh;
  background-color: #545c64;
  color: #fff;
  text-align: center;
}
.main {
  /* 超出滚动 */
  overflow: auto;
  height: 100vh;
}
</style>
