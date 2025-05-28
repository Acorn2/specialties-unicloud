<template>
	<view class="app-container">
		<!-- 顶部导航栏 -->
		<view class="about-gradient pt-10 pb-3 px-4">
			<view class="flex items-center">
				<view @tap="goBack" class="text-white">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="text-lg font-bold text-white ml-4 flex-1">关于我们</text>
			</view>
		</view>
		
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 应用简介 -->
			<view class="p-4">
				<view class="flex flex-col items-center mb-6">
					<view class="w-20 h-20 rounded-2xl overflow-hidden mb-3 shadow-lg">
						<image src="/static/images/app-logo.jpg" mode="aspectFill" class="w-full h-full object-cover"></image>
					</view>
					<text class="text-xl font-bold mb-1">风物舆图</text>
					<text class="text-sm text-gray-500">中国特产美食地图导览平台</text>
					<text class="text-sm text-gray-500 mt-1">版本 {{appVersion}}</text>
				</view>
				
				<view class="card p-4 mb-4">
					<view class="section-title">
						<text class="fas fa-seedling"></text>
						<text class="ml-2">我们的愿景</text>
					</view>
					<text class="text-sm text-gray-700 leading-relaxed">
						"风物舆图"致力于成为中国特产文化与美食地图的集大成者，我们希望通过收集与整理全国各地的特色美食和特产，让用户便捷地了解中国丰富多彩的地域文化，为对中国美食文化感兴趣的用户提供一站式的信息检索和分享平台。
					</text>
				</view>
				
				<!-- 核心特色 -->
				<view class="card p-4 mb-4">
					<view class="section-title">
						<text class="fas fa-star"></text>
						<text class="ml-2">核心特色</text>
					</view>
					
					<view v-for="(feature, index) in features" :key="index" class="feature-item" :class="{'mb-0': index === features.length - 1}">
						<view class="feature-icon">
							<text :class="feature.icon"></text>
						</view>
						<view>
							<text class="text-sm font-medium mb-1 block">{{feature.title}}</text>
							<text class="text-xs text-gray-600">{{feature.description}}</text>
						</view>
					</view>
				</view>
				
				<!-- 联系我们 -->
				<view class="card p-4 mb-4">
					<view class="section-title">
						<text class="fas fa-phone-alt"></text>
						<text class="ml-2">联系我们</text>
					</view>
					
					<view v-for="(contact, index) in contacts" :key="index" class="contact-item" :class="{'border-b-0': index === contacts.length - 1}">
						<view class="contact-icon">
							<text :class="contact.icon"></text>
						</view>
						<view>
							<text class="text-sm font-medium mb-1 block">{{contact.title}}</text>
							<text class="text-xs text-gray-600">{{contact.value}}</text>
						</view>
					</view>
				</view>
				
				<!-- 版权信息 -->
				<view class="footer-text">
					<text class="block">© {{currentYear}} 风物舆图 版权所有</text>
					<text class="block">保护非物质文化遗产，弘扬中华美食文化</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appVersion: '1.0.0',
				currentYear: new Date().getFullYear(),
				features: [
					{
						icon: 'fas fa-map-marked-alt',
						title: '特产地图',
						description: '覆盖全国31个省市自治区的特产分布图，支持按地区和品类筛选，快速定位心仪的地方特产。'
					},
					{
						icon: 'fas fa-tags',
						title: '特产分类',
						description: '细致的特产分类系统，包括主食、副食、小吃、茶饮、工艺品等多个类别，满足多元化的探索需求。'
					},
					{
						icon: 'fas fa-compass',
						title: '足迹记录',
						description: '自动记录用户浏览轨迹，形成专属美食地图，方便回顾与分享。'
					},
					{
						icon: 'fas fa-heart',
						title: '个人收藏',
						description: '收藏喜爱的特产，建立属于自己的特产清单，规划下一站的美食之旅。'
					}
				],
				contacts: [
					{
						icon: 'fas fa-envelope',
						title: '邮箱',
						value: 'contact@xunweizhonghua.com'
					},
					{
						icon: 'fab fa-weixin',
						title: '微信公众号',
						value: '风物舆图探索'
					},
					{
						icon: 'fas fa-map-marker-alt',
						title: '地址',
						value: '北京市海淀区中关村南大街5号'
					}
				]
			}
		},
		onLoad() {
			this.getAppInfo();
		},
		methods: {
			// 获取应用信息
			async getAppInfo() {
				try {
					const { result } = await uniCloud.callFunction({
						name: 'about',
						data: {
							action: 'getAppInfo'
						}
					});
					
					if (result && result.code === 0) {
						this.appVersion = result.data.version;
					}
				} catch (e) {
					console.error('获取应用信息失败:', e);
				}
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
/* 页面全局样式 */
page {
    background-color: #F8F5F1;
    font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
    color: #333333;
}

.app-container {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #F8F5F1;
}

.scrollable-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
}

.scrollable-content::-webkit-scrollbar {
    width: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.about-gradient {
    background: linear-gradient(135deg, #D83931, #A82825);
}

.card {
    border-radius: 12px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.section-title .fas {
    color: #D83931;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
}

.feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: rgba(216, 57, 49, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
}

.feature-icon .fas, .feature-icon .fab {
    color: #D83931;
}

.contact-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F0ECE6;
}

.contact-icon {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: rgba(216, 57, 49, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
}

.contact-icon .fas, .contact-icon .fab {
    color: #D83931;
}

.footer-text {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
}

/* Tailwind 样式类 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-white { color: white; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-sm { font-size: 14px; }
.text-xs { font-size: 12px; }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.pt-10 { padding-top: 40px; }
.pb-3 { padding-bottom: 12px; }
.px-4 { padding-left: 16px; padding-right: 16px; }
.p-4 { padding: 16px; }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 4px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.mt-1 { margin-top: 4px; }
.ml-2 { margin-left: 8px; }
.ml-4 { margin-left: 16px; }
.w-20 { width: 80px; }
.h-20 { height: 80px; }
.w-full { width: 100%; }
.h-full { height: 100%; }
.rounded-2xl { border-radius: 16px; }
.overflow-hidden { overflow: hidden; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.object-cover { object-fit: cover; }
.leading-relaxed { line-height: 1.625; }
.block { display: block; }
.border-b-0 { border-bottom: 0; }
</style>
