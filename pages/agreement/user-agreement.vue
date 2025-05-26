<template>
  <view class="agreement-container">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="navbar-title">用户服务协议</view>
      <view class="navbar-right"></view>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view class="agreement-content" scroll-y>
      <view class="content-wrapper">
        <view class="section">
          <view class="section-title">欢迎使用风物舆图</view>
          <view class="section-text">
            感谢您使用风物舆图服务。本协议是您与风物舆图（以下简称"我们"）之间关于您使用风物舆图服务所订立的协议。请您仔细阅读本协议，如果您不同意本协议的任何内容，请勿注册或使用风物舆图服务。当您注册、使用风物舆图服务时，即表示您已充分阅读、理解并接受本协议的全部内容。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">1. 服务内容</view>
          <view class="section-text">
            风物舆图是一款专注于中国地方特产展示、分享和交流的应用。我们为用户提供特产信息浏览、地图查询、榜单排名、收藏分享等功能，帮助用户探索和了解中国各地的特色美食和产品。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">2. 账号注册与使用</view>
          <view class="section-text">
            2.1 您需要使用微信账号登录使用本服务。您承诺提供的所有注册信息是真实、完整、准确的，并承诺及时更新相关信息。
          </view>
          <view class="section-text">
            2.2 您应当妥善保管账号信息，对您账号下的所有行为负责。如发现任何未经授权使用您账号的情况，应立即通知我们。
          </view>
          <view class="section-text">
            2.3 我们有权根据实际情况，在必要时对账号进行封禁、限制或终止服务。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">3. 用户行为规范</view>
          <view class="section-text">
            3.1 您在使用本服务时必须遵守中华人民共和国相关法律法规。
          </view>
          <view class="section-text">
            3.2 您不得利用本服务从事以下行为：
          </view>
          <view class="section-text indent">
            (1) 发布、传送、传播违反国家法律法规的信息；<br>
            (2) 发布虚假、误导性信息，或冒充他人身份；<br>
            (3) 侵犯他人知识产权、商业秘密或其他合法权益；<br>
            (4) 干扰本服务的正常运行，或对服务进行任何形式的破坏；<br>
            (5) 其他违反法律法规、社会公德或损害他人合法权益的行为。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">4. 知识产权</view>
          <view class="section-text">
            4.1 本应用的所有内容，包括但不限于文字、图片、音频、视频、图表、标识、版面设计、专栏目录与名称等，均受中华人民共和国著作权法、商标法及其他相关法律法规的保护。
          </view>
          <view class="section-text">
            4.2 未经我们或相关权利人书面许可，您不得以任何方式擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表本应用的内容。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">5. 用户内容</view>
          <view class="section-text">
            5.1 您通过本应用发布的内容（包括但不限于评论、点评、图片等）仍归您所有，但您授予我们在全球范围内免费、非独家、可转授权的许可，允许我们使用、复制、修改、改编、出版、翻译、创作衍生作品、分发和展示此类内容。
          </view>
          <view class="section-text">
            5.2 您保证对您发布的内容拥有合法权利，且内容符合本协议及相关法律法规的规定。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">6. 免责声明</view>
          <view class="section-text">
            6.1 本应用提供的特产信息仅供参考，我们无法保证信息的完全准确性和时效性。
          </view>
          <view class="section-text">
            6.2 对于因网络状况、通讯线路、第三方服务等任何原因导致的服务中断或不能满足用户要求的情况，我们不承担任何责任。
          </view>
          <view class="section-text">
            6.3 对于用户因使用本服务而产生的任何直接、间接、偶然、特殊及后续的损害，我们不承担任何责任。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">7. 协议修改</view>
          <view class="section-text">
            我们保留随时修改本协议的权利。协议修改后，我们会在应用内显著位置发布通知。如您继续使用本服务，即表示您接受修改后的协议。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">8. 法律适用与争议解决</view>
          <view class="section-text">
            8.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
          </view>
          <view class="section-text">
            8.2 如双方就本协议内容或执行发生争议，应友好协商解决；协商不成的，任何一方均有权将争议提交至有管辖权的人民法院诉讼解决。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">9. 其他条款</view>
          <view class="section-text">
            9.1 本协议中的标题仅为方便阅读而设，不影响对协议本身的解释。
          </view>
          <view class="section-text">
            9.2 本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效并且有约束力。
          </view>
        </view>
        
        <view class="section last-updated">
          <view class="section-text">最后更新日期：2023年12月1日</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
  height: 100%;
}

.agreement-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 自定义导航栏 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--status-bar-height) 30rpx 0;
  background-color: #FFFFFF;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.navbar-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
}

.navbar-right {
  width: 60rpx;
}

/* 内容区域 */
.agreement-content {
  flex: 1;
  padding-top: calc(90rpx + var(--status-bar-height));
  box-sizing: border-box;
}

.content-wrapper {
  padding: 30rpx;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
}

.section-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.indent {
  padding-left: 40rpx;
}

.last-updated {
  border-top: 1px solid #EEEEEE;
  padding-top: 30rpx;
  color: #999999;
}

/* 图标样式 */
.iconfont.icon-back:before {
  content: '\e6db'; /* 这里使用的是示例，需要根据实际的图标库调整 */
  font-size: 40rpx;
  color: #333333;
}
</style> 