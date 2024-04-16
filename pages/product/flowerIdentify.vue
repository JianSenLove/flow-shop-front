<template>
  <view class="container">
    <view class="image-preview" v-if="imagePath">
      <image :src="imagePath" mode="aspectFit" style="width: 300px; height: 200px;"></image>
    </view>
    <view class="upload-btn">
      <button @click="chooseImage">上传图片</button>
    </view>
    <view class="recognize-btn">
      <button @click="recognizeImage" :disabled="!imagePath">识别图片</button>
    </view>
    <view class="result">
      <text>{{ resultName }}</text>
    </view>
  </view>
</template>

<script>
import { recognize } from '@/common/restApi.js';
export default {
  data() {
    return {
      imagePath: '', // 存储选择的图片路径，用于回显
      resultName: '请上传并识别图片', // 初始提示文本
    };
  },
  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1, // 默认9，这里只选择一张图片
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // 获取图片路径，并更新数据，以回显图片
          this.imagePath = res.tempFilePaths[0];
        },
      });
    },
    // 识别图片
    async recognizeImage() {
      if (!this.imagePath) {
        uni.showToast({
          title: '请先上传图片',
          icon: 'none',
        });
        return;
      }

      const result = await recognize(this.imagePath);
      this.resultName = result;
    }
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;
}
.image-preview {
  margin-bottom: 20px;
}
.upload-btn, .recognize-btn {
  margin: 10px;
}
.result {
  margin-top: 20px;
}
</style>
