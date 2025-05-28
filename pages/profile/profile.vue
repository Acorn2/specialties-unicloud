<template>
	<view class="app-container">
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 顶部个人信息 -->
			<view style="background: linear-gradient(135deg, #D83931, #A82825); border-radius: 0 0 24px 24px;" class="pt-10 pb-6 px-4">
				
				<!-- 设置和消息按钮 -->
				<view style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
					<view style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2);" @tap="goToSettings">
						<!-- 使用uni-icons -->
						<uni-icons type="gear" size="18" color="#FFFFFF"></uni-icons>
					</view>
				</view>
				
				<!-- 用户资料 -->
				<view style="display: flex; align-items: center;">
					<image :src="userInfo.avatar || defaultAvatar" mode="aspectFill" style="width: 70px; height: 70px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); object-fit: cover;"></image>
					
					<view style="margin-left: 16px;">
						<text style="color: #FFFFFF; font-size: 18px; font-weight: bold;">{{userInfo.nickname || '未登录'}}</text>
						<view style="display: flex; align-items: center; margin-top: 4px;">
							<text style="color: rgba(255, 255, 255, 0.9); font-size: 12px; margin-right: 12px;">ID: {{userInfo.userId || '未登录'}}</text>
							<view style="display: flex; align-items: center; padding: 2px 8px; background-color: rgba(255, 255, 255, 0.2); border-radius: 9999px;">
								<uni-icons type="location" size="12" color="#FFFFFF"></uni-icons>
								<text style="color: rgba(255, 255, 255, 0.9); font-size: 12px; margin-left: 4px;">{{userInfo.location || '未设置'}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 数据统计 -->
				<view style="display: flex; justify-content: space-around; align-items: center; margin-top: 24px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 16px 0;">
					<view style="display: flex; flex-direction: column; align-items: center; width: 45%; text-align: center;">
						<navigator url="/pages/profile/collections" style="width: 100%; text-align: center;">
							<view style="font-size: 18px; color: #FFFFFF; margin-bottom: 8px; font-weight: normal; text-align: center;">
								{{userInfo.collectCount || 0}}
							</view>
							<view style="font-size: 18px; color: rgba(255, 255, 255, 0.8); text-align: center;">
								收藏
							</view>
						</navigator>
					</view>
					
					<view style="width: 1px; height: 40px; background-color: rgba(255, 255, 255, 0.3);"></view>
					
					<view style="display: flex; flex-direction: column; align-items: center; width: 45%; text-align: center;">
						<navigator url="/pages/profile/footprints" style="width: 100%; text-align: center;">
							<view style="font-size: 18px; color: #FFFFFF; margin-bottom: 8px; font-weight: normal; text-align: center;">
								{{userInfo.footprintCount || 0}}
							</view>
							<view style="font-size: 18px; color: rgba(255, 255, 255, 0.8); text-align: center;">
								足迹
							</view>
						</navigator>
					</view>
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
				
				<scroll-view scroll-x="true" class="flex overflow-x-auto hide-scrollbar pb-2">
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
				defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8cG9ydHJhaXR8fHx8fHwxNjQ5NTQyODUz&ixlib=rb-1.2.1&q=80',
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
					// 使用模拟数据
					const mockUserInfo = {
						userId: '20240501',
						nickname: '寻味探索者',
						avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8cG9ydHJhaXR8fHx8fHwxNjQ5NTQyODUz&ixlib=rb-1.2.1&q=80',
						location: '北京',
						collectCount: 26,
						footprintCount: 48
					};
					
					this.userInfo = mockUserInfo;
					
					// 云函数调用（暂时注释）
					/*
					const { result } = await uniCloud.callFunction({
						name: 'profile',
						data: {
							action: 'getUserInfo'
						}
					});
					
					if (result && result.code === 0) {
						this.userInfo = result.data;
					} else {
						uni.showToast({
							title: result?.msg || '获取用户信息失败',
							icon: 'none'
						});
					}
					*/
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
					// 使用模拟数据
					const mockFootprints = [
						{
							id: 'fp001',
							name: '郫县豆瓣酱',
							image: 'https://images.unsplash.com/photo-1605197181726-e3bd08490ba1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80',
							visitTime: '今天 10:30'
						},
						{
							id: 'fp002',
							name: '苏州刺绣',
							image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3JhZnR8fHx8fHwxNjQ5NTQwMTYy&ixlib=rb-1.2.1&q=80',
							visitTime: '昨天 16:45'
						},
						{
							id: 'fp003',
							name: '西湖龙井',
							image: 'https://images.unsplash.com/photo-1613614210474-4960ab6b3eb5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTU0MDQxMQ&ixlib=rb-1.2.1&q=80',
							visitTime: '3天前'
						}
					];
					
					this.footprints = mockFootprints;
					
					// 云函数调用（暂时注释）
					/*
					const { result } = await uniCloud.callFunction({
						name: 'profile',
						data: {
							action: 'getRecentFootprints'
						}
					});
					
					if (result && result.code === 0) {
						this.footprints = result.data;
					} else {
						uni.showToast({
							title: result?.msg || '获取足迹失败',
							icon: 'none'
						});
					}
					*/
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
				uni.navigateTo({
					url: '/pages/about/about'
				});
			}
		}
	}
</script>

<style>
/* 全局样式定义 */
page {
    background-color: #F8F5F1;
}

body {
    font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
    background-color: #F8F5F1;
    color: #333333;
    margin: 0;
    padding: 0;
}

.app-container {
    max-width: 750px;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #F8F5F1;
}

.scrollable-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
    position: relative;
}

/* 设置滚动条样式 */
.scrollable-content::-webkit-scrollbar {
    width: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.profile-gradient {
    background: linear-gradient(135deg, #D83931, #A82825);
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
}

.card {
    border-radius: 12px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.card:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Tailwind 样式类 */
.flex { display: flex; }
.flex-1 { flex: 1; }
.flex-col { flex-direction: column; }
.flex-shrink-0 { flex-shrink: 0; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.overflow-x-auto { overflow-x: auto; }
.overflow-hidden { overflow: hidden; }
.whitespace-nowrap { white-space: nowrap; }
.rounded-full { border-radius: 9999px; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-t-xl { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; }
.rounded-b-\[24px\] { border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; }
.bg-white { background-color: white; }
.bg-opacity-10 { --tw-bg-opacity: 0.1; }
.bg-opacity-20 { --tw-bg-opacity: 0.2; }
.bg-red-50 { background-color: rgba(254, 242, 242, 1); }
.bg-blue-50 { background-color: rgba(239, 246, 255, 1); }
.bg-orange-50 { background-color: rgba(255, 247, 237, 1); }
.bg-gray-50 { background-color: rgba(249, 250, 251, 1); }
.text-white { color: white; }
.text-opacity-80 { --tw-text-opacity: 0.8; }
.text-opacity-90 { --tw-text-opacity: 0.9; }
.text-\[\#D83931\] { color: #D83931; }
.text-gray-300 { color: #d1d5db; }
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-blue-500 { color: #3b82f6; }
.text-orange-500 { color: #f97316; }
.text-lg { font-size: 1.125rem; }
.text-base { font-size: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.pt-10 { padding-top: 2.5rem; }
.pb-6 { padding-bottom: 1.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.p-2 { padding: 0.5rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-5 { margin-bottom: 1.25rem; }
.ml-1 { margin-left: 0.25rem; }
.ml-4 { margin-left: 1rem; }
.mr-1 { margin-right: 0.25rem; }
.mr-3 { margin-right: 0.75rem; }
.mx-4 { margin-left: 1rem; margin-right: 1rem; }
.w-8 { width: 2rem; }
.h-8 { height: 2rem; }
.w-40 { width: 10rem; }
.h-24 { height: 6rem; }
.w-full { width: 100%; }
.object-cover { object-fit: cover; }
</style> 