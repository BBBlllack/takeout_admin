<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">
        <p>店铺信息修改</p>
        <div>
          <el-tag type="warning" effect="dark" style="margin-left: 10px">
            评分:{{ form.mark }}
          </el-tag>
          <el-tag type="success" effect="dark" style="margin-left: 10px">
            总销量:{{ form.sale }}
          </el-tag>
          <el-tag effect="dark" style="margin-left: 10px"> 开张于{{ form.regtime }} </el-tag>
        </div>
      </div>
    </template>

    <div class="card_body">
      <el-form :model="form" label-width="80px" autocomplete="off">
        <el-form-item label="店铺封面">
          <el-upload class="avatar-uploader" :show-file-list="false" :http-request="onUploadCover">
            <img v-if="form.cover" :src="form.cover" class="avatar-uploader-img" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="form.name" placeholder="为店铺起个朗朗上口的名字" />
        </el-form-item>
        <el-form-item label="店铺电话">
          <el-input v-model="form.phone" placeholder="食客怎么联系您呢？" />
        </el-form-item>
        <el-form-item label="店铺密码">
          <el-input v-model="form.password" type="password" placeholder="不更改留空" />
        </el-form-item>
        <el-form-item label="营业状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
          <el-tag
            :type="form.status == 1 ? 'success' : 'danger'"
            effect="dark"
            style="margin-left: 10px"
          >
            {{ form.status == 1 ? '营业' : '停业' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="form.address" type="textarea" placeholder="线下探店来这里！" />
        </el-form-item>
        <el-form-item label="店铺通知">
          <el-input v-model="form.announce" type="textarea" placeholder="想告诉进店的用户什么？" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存变更</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import type { restaurantType } from '@/types'
import { updateRestaurantInfo, getRestaurantInfo } from '@/api'
import axios from 'axios'

onMounted(() => {
  refreshRestaurantInfo()
})

const form = ref<restaurantType>({})

// 刷新页面时，获取店铺信息
const refreshRestaurantInfo = async () => {
  console.log('刷新店铺信息')
  const restaurant = await getRestaurantInfo()
  form.value = restaurant
}

// 提交更新
const onSubmit = async () => {
  console.log('submit!')
  // 更新店铺信息
  const status = await updateRestaurantInfo(form.value)
  if (status) {
    refreshRestaurantInfo()
  }
}

interface pictureBadRes {
  success: boolean
  code: string
  message: string
  images?: string
  data: { url: string }
}

// 上传头像
const onUploadCover = async (file: any) => {
  ElMessage.success('上传中...')
  console.log('上传头像')
  console.log(file)
  // 将图片上传到sm.ms图床
  const formData = new FormData()
  formData.append('smfile', file.file)
  const res = await axios.post('/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'EbGJXCofcjs7WYDGf1KN5p6JuxJew8pJ'
    }
  })
  const resData = res.data as pictureBadRes
  if (resData.success) {
    // 如果上传成功
    console.log(res)
    const pic = resData.data.url
    form.value.cover = pic
  } else {
    // 如果重复上传
    form.value.cover = resData.images
  }
  ElMessage.success('头像上传成功')
}
</script>
<style scoped>
.card {
  text-align: left;
}

.card_body {
  margin: 15px;
  width: 80%;
}
.card-header {
  /* 元素垂直排布 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  background-color: #eee;
  overflow: hidden;
}

.avatar-uploader-img {
  /* 拉伸图片适应父容器大小 */
  width: 150px;
  height: 150px;
}
</style>
