<template>
	<view class="app-container">
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 顶部个人信息 -->
			<view class="profile-gradient pt-10 pb-6 px-4 rounded-b-[24px]">
				<!-- 设置和消息按钮 -->
				<view class="flex justify-end mb-2">
					<view class="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20" @tap="goToSettings">
						<text class="fas fa-gear text-white text-sm"></text>
					</view>
				</view>
				
				<!-- 用户资料 -->
				<view class="flex items-center">
					<image :src="userInfo.avatar || defaultAvatar" mode="aspectFill" class="avatar"></image>
					
					<view class="ml-4">
						<text class="text-white text-lg font-bold">{{userInfo.nickname || '未登录'}}</text>
						<view class="flex items-center mt-1">
							<text class="text-white text-opacity-90 text-xs mr-3">ID: {{userInfo.userId || '未登录'}}</text>
							<view class="flex items-center px-2 py-1 bg-white bg-opacity-20 rounded-full">
								<text class="fas fa-map-marker-alt text-white text-opacity-90 text-xs mr-1"></text>
								<text class="text-white text-opacity-90 text-xs">{{userInfo.location || '未设置'}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 数据统计 -->
				<view class="flex justify-around mt-6 bg-white bg-opacity-10 rounded-lg py-3">
					<navigator url="/pages/profile/collections" class="flex flex-col items-center">
						<text class="text-white font-medium">{{userInfo.collectCount || 0}}</text>
						<text class="text-white text-opacity-80 text-xs mt-1">收藏</text>
					</navigator>
					
					<view class="stat-border"></view>
					
					<navigator url="/pages/profile/footprints" class="flex flex-col items-center">
						<text class="text-white font-medium">{{userInfo.footprintCount || 0}}</text>
						<text class="text-white text-opacity-80 text-xs mt-1">足迹</text>
					</navigator>
				</view>
			</view>
			
			<!-- 我的足迹 -->
			<view class="mx-4 mt-6">
				<view class="flex justify-between items-center mb-3">
					<text class="text-base font-bold">我的足迹</text>
					<navigator url="/pages/profile/footprints" class="text-sm text-gray-500 flex items-center">
						查看全部 <text class="fas fa-chevron-right text-xs ml-1"></text>
					</navigator>
				</view>
				
				<scroll-view scroll-x="true" class="whitespace-nowrap hide-scrollbar pb-2">
					<view v-if="footprints.length === 0" class="flex justify-center items-center py-6 w-full">
						<text class="text-gray-400">暂无足迹记录</text>
					</view>
					<view v-else class="flex">
						<navigator 
							v-for="(item, index) in footprints" 
							:key="index"
							:url="`/pages/detail/detail?id=${item.id}`"
							class="card mr-3 w-40 flex-shrink-0">
							<image :src="item.image" mode="aspectFill" class="w-full h-24 object-cover rounded-t-xl"></image>
							<view class="p-2">
								<text class="text-sm font-medium">{{item.name}}</text>
								<view class="text-xs text-gray-500 mt-1">{{item.visitTime}}</view>
							</view>
						</navigator>
					</view>
				</scroll-view>
			</view>
			
			<!-- 功能区 -->
			<view class="divider mt-6"></view>
			
			<view class="bg-white">
				<navigator url="/pages/profile/collections" class="menu-item">
					<view class="menu-icon bg-red-50">
						<text class="fas fa-heart text-[#D83931]"></text>
					</view>
					<text class="flex-1">我的收藏</text>
					<text class="fas fa-chevron-right text-gray-300"></text>
				</navigator>
			</view>
			
			<view class="divider"></view>
			
			<view class="bg-white mb-5">
				<view class="menu-item" @tap="contactCustomerService">
					<view class="menu-icon bg-blue-50">
						<text class="fas fa-headset text-blue-500"></text>
					</view>
					<text class="flex-1">在线客服</text>
					<text class="fas fa-chevron-right text-gray-300"></text>
				</view>
				
				<view class="menu-item" @tap="reportError">
					<view class="menu-icon bg-orange-50">
						<text class="fas fa-lightbulb text-orange-500"></text>
					</view>
					<text class="flex-1">信息纠错</text>
					<text class="fas fa-chevron-right text-gray-300"></text>
				</view>
				
				<view class="menu-item" @tap="goToAbout">
					<view class="menu-icon bg-gray-50">
						<text class="fas fa-circle-info text-gray-500"></text>
					</view>
					<text class="flex-1">关于我们</text>
					<text class="fas fa-chevron-right text-gray-300"></text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
				userInfo: {
					userId: '',
					nickname: '未登录',
					avatar: '',
					location: '未设置',
					collectCount: 0,
					footprintCount: 0
				},
				footprints: []
			}
		},
		onLoad() {
			this.getUserInfo();
			this.getRecentFootprints();
		},
		methods: {
			// 获取用户信息
			async getUserInfo() {
				try {
					const { data: res } = await this.$cloud.callFunction({
						name: 'profile',
						data: {
							action: 'getUserInfo'
						}
					});
					
					if (res.code === 0 && res.data) {
						this.userInfo = res.data;
					} else {
						// 使用默认数据
						console.log('获取用户信息失败，使用默认数据');
					}
				} catch (e) {
					console.error('获取用户信息失败:', e);
					uni.showToast({
						title: '获取用户信息失败',
						icon: 'none'
					});
				}
			},
			
			// 获取最近足迹
			async getRecentFootprints() {
				try {
					const { data: res } = await this.$cloud.callFunction({
						name: 'profile',
						data: {
							action: 'getRecentFootprints'
						}
					});
					
					if (res.code === 0) {
						this.footprints = res.data;
					} else {
						console.log('获取足迹失败:', res.msg);
					}
				} catch (e) {
					console.error('获取足迹失败:', e);
					uni.showToast({
						title: '获取足迹失败',
						icon: 'none'
					});
				}
			},
			
			// 跳转到设置页面
			goToSettings() {
				uni.navigateTo({
					url: '/pages/profile/settings'
				});
			},
			
			// 联系客服
			contactCustomerService() {
				uni.showToast({
					title: '正在连接客服...',
					icon: 'none'
				});
				// 实际项目中可以接入第三方客服系统
			},
			
			// 信息纠错
			reportError() {
				uni.showToast({
					title: '纠错功能开发中...',
					icon: 'none'
				});
			},
			
			// 关于我们
			goToAbout() {
				uni.showToast({
					title: '关于页面开发中...',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
.app-container {
	position: relative;
	width: 100%;
	height: 100vh;
	background-color: #F8F5F1;
	display: flex;
	flex-direction: column;
}

.scrollable-content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
	position: relative;
}

.profile-gradient {
	background: linear-gradient(135deg, #D83931, #A82825);
}

.avatar {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	border: 3px solid white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	object-fit: cover;
}

.stat-border {
	width: 1px;
	height: 24px;
	background: rgba(255, 255, 255, 0.3);
}

.card {
	border-radius: 12px;
	background: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
}

.divider {
	height: 8px;
	background-color: #F0ECE6;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #F0ECE6;
}

.menu-icon {
	width: 36px;
	height: 36px;
	border-radius: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
}

.hide-scrollbar {
	::-webkit-scrollbar {
		display: none;
	}
	scrollbar-width: none;
}
</style> 