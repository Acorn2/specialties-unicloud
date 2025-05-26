<template>
  <view class="agreement-container">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="navbar-title">隐私政策</view>
      <view class="navbar-right"></view>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view class="agreement-content" scroll-y>
      <view class="content-wrapper">
        <view class="section">
          <view class="section-title">引言</view>
          <view class="section-text">
            风物舆图（以下简称"我们"）非常重视用户的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和共享您的个人信息，以及您享有的相关权利。请您在使用我们的服务前，仔细阅读并了解本隐私政策。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">1. 我们收集的信息</view>
          <view class="section-text">
            1.1 您提供的信息：当您注册账号、使用我们的服务时，我们会收集您提供的相关个人信息，包括但不限于：
          </view>
          <view class="section-text indent">
            (1) 账号信息：当您通过微信登录时，我们会收集您的微信昵称、头像等公开信息；<br>
            (2) 用户行为信息：包括您在使用我们服务时的浏览记录、搜索记录、收藏记录等。
          </view>
          <view class="section-text">
            1.2 我们自动收集的信息：当您使用我们的服务时，我们可能会自动收集以下信息：
          </view>
          <view class="section-text indent">
            (1) 设备信息：如设备型号、操作系统版本、设备设置、唯一设备标识符等；<br>
            (2) 日志信息：如IP地址、浏览器类型、访问日期和时间、访问的页面等；<br>
            (3) 位置信息：如果您授权我们访问您的位置，我们会收集您的地理位置信息，以便为您提供基于位置的服务。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">2. 我们如何使用收集的信息</view>
          <view class="section-text">
            2.1 提供、维护和改进我们的服务，例如：
          </view>
          <view class="section-text indent">
            (1) 创建和维护您的账号；<br>
            (2) 向您提供个性化的内容和推荐；<br>
            (3) 处理您的搜索请求和提供搜索结果；<br>
            (4) 开发新的服务和功能；<br>
            (5) 进行内部分析和研究，以改进我们的服务。
          </view>
          <view class="section-text">
            2.2 与您沟通，例如：
          </view>
          <view class="section-text indent">
            (1) 回复您的咨询和请求；<br>
            (2) 通知您有关我们服务的更新和变化；<br>
            (3) 向您提供与我们服务相关的营销和推广信息（您可以随时选择退订）。
          </view>
          <view class="section-text">
            2.3 确保服务安全和防止欺诈，例如：
          </view>
          <view class="section-text indent">
            (1) 验证您的身份；<br>
            (2) 检测和防止欺诈、滥用和其他有害活动；<br>
            (3) 保护我们和用户的安全。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">3. 信息共享与披露</view>
          <view class="section-text">
            除以下情形外，未经您同意，我们不会与任何第三方分享您的个人信息：
          </view>
          <view class="section-text indent">
            (1) 在法律要求或允许的情况下，如响应法院命令、传票或其他法律程序；<br>
            (2) 在必要的情况下，保护我们的权利、财产或安全，以及我们的用户或公众的权利、财产或安全；<br>
            (3) 如果我们的业务发生并购、重组等变更，您的个人信息可能会作为资产的一部分被转让，但我们会要求新的持有者继续受本隐私政策的约束；<br>
            (4) 经您明确同意的其他情形。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">4. 信息存储与安全</view>
          <view class="section-text">
            4.1 我们采取各种安全技术和程序，以防止您的个人信息遭到未经授权的访问、使用或泄露。
          </view>
          <view class="section-text">
            4.2 我们会在中华人民共和国境内存储您的个人信息。如需跨境传输，我们会严格遵守相关法律法规的规定。
          </view>
          <view class="section-text">
            4.3 我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非法律要求或允许在更长的期限内保留这些信息。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">5. 您的权利</view>
          <view class="section-text">
            根据适用的法律法规，您可能享有以下权利：
          </view>
          <view class="section-text indent">
            (1) 访问权：您有权访问我们持有的关于您的个人信息；<br>
            (2) 更正权：如果您认为我们持有的关于您的个人信息不准确或不完整，您有权要求我们更正或补充；<br>
            (3) 删除权：在特定情况下，您有权要求我们删除您的个人信息；<br>
            (4) 限制处理权：在特定情况下，您有权要求我们限制对您个人信息的处理；<br>
            (5) 反对权：在特定情况下，您有权反对我们处理您的个人信息；<br>
            (6) 数据可携带权：在技术可行的情况下，您有权以结构化、常用和机器可读的格式接收您提供给我们的个人信息，并有权将这些信息传输给另一个控制者。
          </view>
          <view class="section-text">
            如果您想行使上述任何权利，请通过本政策末尾提供的联系方式与我们联系。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">6. 儿童隐私</view>
          <view class="section-text">
            我们的服务不面向16岁以下的儿童。如果您是父母或监护人，并且发现您的孩子向我们提供了个人信息，请联系我们，我们将采取措施删除相关信息。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">7. 隐私政策的更新</view>
          <view class="section-text">
            我们可能会不时更新本隐私政策。当我们进行重大更改时，我们会在应用内发布通知，并更新"最后更新日期"。我们建议您定期查看本隐私政策，以了解我们如何保护您的信息。
          </view>
        </view>
        
        <view class="section">
          <view class="section-title">8. 联系我们</view>
          <view class="section-text">
            如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式与我们联系：
          </view>
          <view class="section-text">
            电子邮件：privacy@fengwuyutu.com
          </view>
          <view class="section-text">
            我们将在收到您的请求后30天内回复。
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