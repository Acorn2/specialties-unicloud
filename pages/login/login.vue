<template>
  <view class="app-container">
    <!-- 气泡状背景装饰 -->
    <view class="bg-decoration">
      <!-- 顶部气泡 -->
      <view class="bubble-top-1"></view>
      <view class="bubble-top-2"></view>
      <view class="bubble-top-3"></view>
      <view class="bubble-top-4"></view>
      
      <!-- 中部气泡 -->
      <view class="bubble-middle-1"></view>
      <view class="bubble-middle-2"></view>
      
      <!-- 底部气泡 -->
      <view class="bubble-bottom-1"></view>
      <view class="bubble-bottom-2"></view>
      <view class="bubble-bottom-3"></view>
      <view class="bubble-bottom-4"></view>
      <view class="bubble-bottom-5"></view>
      <view class="bubble-bottom-6"></view>
    </view>
    
    <!-- 可滚动内容区域 -->
    <scroll-view class="scrollable-content" scroll-y>
      <view class="login-content">
        <!-- 应用Logo和名称 -->
        <view class="logo-container">
          <view class="app-logo">
            <text class="iconfont icon-utensils"></text>
          </view>
          <text class="app-name">风物舆图</text>
          <text class="app-slogan">探索地方特产，品味中华美食</text>
        </view>
        
        <!-- 登录按钮和隐私政策 -->
        <view>
          <button class="wechat-btn" :disabled="!privacyChecked" :class="{'opacity-50': !privacyChecked}" @click="handleWechatLogin">
            <text class="iconfont icon-weixin mr-2"></text>
            微信一键登录
          </button>
          
          <view class="privacy-container" @click="togglePrivacyCheck">
            <view class="privacy-checkbox">
              <text class="iconfont icon-check" v-if="privacyChecked"></text>
            </view>
            <view class="privacy-text">
              登录即表示您已阅读并同意
              <text class="privacy-link" @click.stop="openPrivacyAgreement">《用户服务协议》</text> 和
              <text class="privacy-link" @click.stop="openPrivacyPolicy">《隐私政策》</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      privacyChecked: true
    }
  },
  onLoad() {
    // 检查是否已登录
    this.checkLoginStatus();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token');
      if (token) {
        // 已登录，跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
    },
    
    // 微信登录
    handleWechatLogin() {
      if (!this.privacyChecked) {
        return;
      }
      
      uni.showLoading({
        title: '登录中...'
      });
      
      // 微信登录
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          if (loginRes.code) {
            // 调用云函数进行登录
            uniCloud.callFunction({
              name: 'login',
              data: {
                code: loginRes.code
              },
              success: (res) => {
                uni.hideLoading();
                if (res.result && res.result.code === 0) {
                  // 存储用户信息和token
                  uni.setStorageSync('token', res.result.token);
                  uni.setStorageSync('userInfo', res.result.userInfo);
                  
                  // 跳转到首页
                  uni.switchTab({
                    url: '/pages/index/index'
                  });
                } else {
                  this.showLoginError(res.result && res.result.message || '登录失败，请重试');
                }
              },
              fail: (err) => {
                uni.hideLoading();
                this.showLoginError('登录失败，请检查网络后重试');
                console.error('登录失败:', err);
              }
            });
          } else {
            uni.hideLoading();
            this.showLoginError('微信授权失败，请重试');
          }
        },
        fail: (err) => {
          uni.hideLoading();
          this.showLoginError('微信授权失败，请重试');
          console.error('微信登录失败:', err);
        }
      });
    },
    
    // 显示登录错误
    showLoginError(message) {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    },
    
    // 切换隐私政策勾选状态
    togglePrivacyCheck() {
      this.privacyChecked = !this.privacyChecked;
    },
    
    // 打开用户服务协议
    openPrivacyAgreement(e) {
      // 阻止事件冒泡
      e && e.stopPropagation();
      
      uni.navigateTo({
        url: '/pages/agreement/user-agreement'
      });
    },
    
    // 打开隐私政策
    openPrivacyPolicy(e) {
      // 阻止事件冒泡
      e && e.stopPropagation();
      
      uni.navigateTo({
        url: '/pages/agreement/privacy-policy'
      });
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background-color: #FFFFFF;
  color: #333333;
}

.app-container {
  max-width: 750rpx;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  background-color: #FFFFFF;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 背景装饰 - 气泡效果 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 顶部气泡装饰 */
.bubble-top-1 {
  position: absolute;
  top: -80rpx;
  left: -80rpx;
  width: 360rpx;
  height: 360rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(216, 57, 49, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-top-2 {
  position: absolute;
  top: 60rpx;
  left: 120rpx;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(216, 57, 49, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-top-3 {
  position: absolute;
  top: 20rpx;
  right: 40rpx;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(216, 57, 49, 0.06) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-top-4 {
  position: absolute;
  top: 160rpx;
  right: 100rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(216, 57, 49, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
}

/* 底部气泡装饰 */
.bubble-bottom-1 {
  position: absolute;
  bottom: -120rpx;
  right: -60rpx;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.09) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-bottom-2 {
  position: absolute;
  bottom: 80rpx;
  right: 160rpx;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.07) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-bottom-3 {
  position: absolute;
  bottom: 40rpx;
  left: 60rpx;
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.06) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-bottom-4 {
  position: absolute;
  bottom: 200rpx;
  left: -40rpx;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-bottom-5 {
  position: absolute;
  bottom: 320rpx;
  right: 60rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-bottom-6 {
  position: absolute;
  bottom: 400rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
}

/* 中部装饰气泡 - 混合颜色 */
.bubble-middle-1 {
  position: absolute;
  top: 50%;
  left: -80rpx;
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(216, 57, 49, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
}

.bubble-middle-2 {
  position: absolute;
  top: 45%;
  right: -40rpx;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(93, 158, 148, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 48rpx;
  position: relative;
  z-index: 1;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 120rpx;
}

.app-logo {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  background-color: #D83931;
  box-shadow: 0 12rpx 32rpx rgba(216, 57, 49, 0.25);
  position: relative;
  overflow: hidden;
}

.app-logo .iconfont {
  color: white;
  font-size: 100rpx;
  position: relative;
  z-index: 1;
}

.app-name {
  font-size: 56rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #333333;
}

.app-slogan {
  font-size: 32rpx;
  color: #666666;
  text-align: center;
}

.wechat-btn {
  background: linear-gradient(135deg, #D83931, #A82825);
  color: white;
  border-radius: 48rpx;
  padding: 28rpx 0;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 16rpx rgba(216, 57, 49, 0.2);
}

.wechat-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 8rpx rgba(216, 57, 49, 0.2);
}

.privacy-container {
  display: flex;
  align-items: flex-start;
  margin-top: 32rpx;
}

.privacy-checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #D83931;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.privacy-text {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}

.privacy-link {
  color: #D83931;
  text-decoration: none;
}

.mr-2 {
  margin-right: 8rpx;
}

.opacity-50 {
  opacity: 0.5;
}
</style>