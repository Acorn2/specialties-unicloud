<template>
	<view class="app-container">
		<!-- 顶部搜索 (固定在顶部) -->
		<view class="top-bar sticky-top">
			<view class="status-bar"></view>
			<view class="header">
				<text class="title">风物舆图</text>
			</view>
			<view class="search-section">
				<view class="search-bar" @tap="navigateToSearch">
					<uni-icons type="search" size="18" color="#999"></uni-icons>
					<text class="search-placeholder">搜索地方特产、美食...</text>
				</view>
			</view>
		</view>

		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y class="scrollable-content">
			<!-- 热门目的地 -->
			<view class="section-container">
				<view class="section-header">
					<text class="section-title">热门目的地</text>
					<view class="section-more" @tap="navigateToHotDestinations">
						<text>查看全部</text>
						<uni-icons type="right" size="14" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-x class="horizontal-scroll-view" show-scrollbar="false">
					<view class="destination-card" v-for="(item, index) in hotDestinations" :key="index" @tap="navigateToMapSpecialty(item.province)">
						<image :src="item.image" mode="aspectFill" class="destination-image"></image>
						<view class="destination-name-wrapper">
							<text class="destination-name">{{ item.name }}</text>
						</view>
					</view>
					<view class="destination-card more-card" @tap="navigateToHotDestinations">
						<view class="more-card-content">
							<uni-icons type="map-pin-ellipse" size="28" color="#999"></uni-icons>
							<text class="more-card-text">更多地区</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 特产分类 -->
			<view class="section-container category-section">
				<view class="section-header">
					<text class="section-title">特产分类</text>
					<view class="section-more" @tap="navigateToCategory">
						<text>查看全部</text>
						<uni-icons type="right" size="14" color="#999"></uni-icons>
					</view>
				</view>
				<view class="category-grid">
					<view class="category-item" v-for="(item, index) in specialtyCategories" :key="index" @tap="navigateToCategory(item.id)">
						<view class="category-icon-wrapper" :style="{backgroundColor: item.iconBgColor}">
							<uni-icons :type="item.icon" size="24" :color="item.iconColor"></uni-icons>
						</view>
						<text class="category-name">{{ item.name }}</text>
					</view>
					<view class="category-item" @tap="navigateToCategory()">
						<view class="category-icon-wrapper" style="background-color: #f0f0f0;">
							<uni-icons type="more-filled" size="24" color="#666"></uni-icons>
						</view>
						<text class="category-name">更多分类</text>
					</view>
				</view>
			</view>

			<!-- 推荐特产 -->
			<view class="section-container recommended-section">
				<view class="section-header">
					<text class="section-title">推荐特产</text>
					<view class="section-more" @tap="navigateToMapSpecialty()">
						<text>查看更多</text>
						<uni-icons type="right" size="14" color="#999"></uni-icons>
					</view>
				</view>
				<view class="recommended-list">
					<view class="recommend-item card" v-for="(item, index) in recommendedSpecialties" :key="index" @tap="navigateToDetail(item.id)">
						<image :src="item.image" mode="aspectFill" class="recommend-image"></image>
						<view class="recommend-info">
							<view class="recommend-title-tag">
								<text class="recommend-name">{{ item.name }}</text>
								<text class="recommend-tag" :style="{backgroundColor: item.tagBgColor, color: item.tagColor}">{{ item.tag }}</text>
							</view>
							<text class="recommend-desc">{{ item.description }}</text>
							<text class="recommend-location">{{ item.location }}</text>
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
			hotDestinations: [
				{ name: '湖北', image: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75ef6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgxMDM&ixlib=rb-1.2.1&q=80&w=200', province: 'hubei' },
				{ name: '四川', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgxNDI&ixlib=rb-1.2.1&q=80&w=200', province: 'sichuan' },
				{ name: '广东', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&w=200', province: 'guangdong' },
				{ name: '浙江', image: 'https://images.unsplash.com/photo-1529883406927-7de37457a0cf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1MzgyODY&ixlib=rb-1.2.1&q=80&w=200', province: 'zhejiang' },
			],
			specialtyCategories: [
				{ id: 'staple', name: '主食', icon: 'medal', iconColor: '#F7C873', iconBgColor: '#FFF8E1'}, // medal as placeholder for bowl-rice
				{ id: 'non-staple', name: '副食', icon: 'pyramid', iconColor: '#9B59B6', iconBgColor: '#F3E5F5'}, // pyramid as placeholder for jar
				{ id: 'snack', name: '小吃', icon: 'gift', iconColor: '#58D68D', iconBgColor: '#E8F5E9'}, // gift as placeholder for cookie
				{ id: 'tea', name: '茶叶', icon: 'flag', iconColor: '#1ABC9C', iconBgColor: '#E0F2F1'}, // flag as placeholder for mug-hot
				{ id: 'fruit', name: '水果', icon: 'hand-up', iconColor: '#2ECC71', iconBgColor: '#E8F5E9'}, // hand-up as placeholder for apple
			],
			recommendedSpecialties: [
				{ id: 'hb002', name: '热干面', tag: '主食', tagBgColor: '#F7C873', tagColor: '#8B5000', description: '武汉名小吃，香、咸、辣、甜，回味悠长...', location: '湖北省·武汉', image: 'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&w=120' },
				{ id: 'hb004', name: '宜昌柑橘', tag: '生鲜', tagBgColor: '#58D68D', tagColor: '#1D6640', description: '色泽金黄，汁多味甜，果肉细嫩...', location: '湖北省·宜昌', image: 'https://images.unsplash.com/photo-1591183137550-fd9c8ff4a485?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&w=120' },
				{ id: 'gd001', name: '沙糖桔', tag: '生鲜', tagBgColor: '#58D68D', tagColor: '#1D6640', description: '皮薄汁多、甜酸适口，富含维生素C...', location: '广东省·江门', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&w=120' },
			]
		};
	},
	onLoad() {
		// 在这里可以调用云函数获取动态数据
		// this.fetchHomeData();
	},
	methods: {
		async fetchHomeData() {
			// uni.showLoading({ title: '加载中...' });
			// try {
			// 	const res = await uniCloud.callFunction({
			// 		name: 'home', // 假设云函数名为 'home'
			// 		data: { action: 'getHomeData' }
			// 	});
			// 	if (res.result && res.result.code === 0) {
			// 		this.hotDestinations = res.result.data.hotDestinations;
			// 		this.specialtyCategories = res.result.data.specialtyCategories;
			// 		this.recommendedSpecialties = res.result.data.recommendedSpecialties;
			// 	} else {
			// 		uni.showToast({ title: res.result.msg || '数据加载失败', icon: 'none' });
			// 	}
			// } catch (e) {
			// 	uni.showToast({ title: '网络错误', icon: 'none' });
			// 	console.error(e);
			// } finally {
			// 	uni.hideLoading();
			// }
		},
		navigateToSearch() {
			uni.navigateTo({ url: '/pages/search/search' });
		},
		navigateToHotDestinations() {
			uni.navigateTo({ url: '/pages/destination/hot-destinations' });
		},
		navigateToMapSpecialty(province) {
			let url = '/pages/map-specialty/map-specialty';
			if (province) {
				url += `?province=${province}`;
			}
			uni.switchTab({ url: '/pages/map-specialty/map-specialty' }); // 假设地图页是 Tab
            // 如果不是Tab，则使用 uni.navigateTo
            // uni.navigateTo({ url });
		},
		navigateToCategory(categoryId) {
			let url = '/pages/map-specialty/map-specialty'; // 假设分类列表页
			if (categoryId) {
				// url += `?id=${categoryId}`;
			}
			uni.switchTab({ url });
		},
		navigateToDetail(id) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
		}
	}
};
</script>

<style lang="scss">
// 状态栏高度适配
.status-bar {
	height: var(--status-bar-height);
	width: 100%;
	background: linear-gradient(135deg, #D83931, #A82825);
}

.app-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #F8F5F1;
}

.sticky-top {
	position: sticky;
	top: 0;
	z-index: 100;
}

.top-bar {
	background: linear-gradient(135deg, #D83931, #A82825);
	padding-bottom: 10rpx;
}

.header {
	padding: 0 30rpx;
	height: 88rpx; // 44px
	display: flex;
	align-items: center;
	.title {
		font-size: 36rpx; // 18px
		font-weight: bold;
		color: white;
		flex: 1;
	}
}

.search-section {
	padding: 10rpx 30rpx 20rpx;
}
.search-bar {
	display: flex;
	align-items: center;
	background-color: white;
	border-radius: 40rpx;
	padding: 15rpx 25rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	.search-placeholder {
		margin-left: 15rpx;
		font-size: 28rpx; // 14px
		color: #999;
		flex: 1;
	}
}

.scrollable-content {
	flex: 1;
	overflow-y: auto;
	padding-bottom: 20rpx; // 为底部内容留出空间
}

.section-container {
	padding: 0 30rpx;
	margin-top: 30rpx; // 从40rpx减小到30rpx
	&.recommended-section {
		margin-bottom: 40rpx; // 20px
	}
}

.section-container.category-section {
	margin-top: 20rpx; // 特产分类与热门目的地之间的间距更小
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx; // 10px
	.section-title {
		font-size: 36rpx; // 18px
		font-weight: bold;
		color: #333;
	}
	.section-more {
		display: flex;
		align-items: center;
		font-size: 28rpx; // 14px
		color: #999;
		text {
			margin-right: 5rpx;
		}
	}
}

.horizontal-scroll-view {
	white-space: nowrap; // 关键，使内部元素横向排列
	height: 260rpx; // 添加固定高度，与卡片高度一致
	overflow: hidden; // 确保不会溢出
	margin-bottom: 0; // 确保底部没有多余的边距
	padding-bottom: 0; // 确保底部没有多余的内边距
	.destination-card {
		display: inline-block; // 使卡片横向排列
		width: 220rpx; // 110px
		height: 260rpx; // 从300rpx减小到260rpx
		border-radius: 32rpx; // 16px
		overflow: hidden;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
		margin-right: 20rpx; // 10px
		position: relative;
		&:last-child {
			margin-right: 0;
		}
		.destination-image {
			width: 100%;
			height: 100%;
		}
		.destination-name-wrapper {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 16rpx; // 8px
			background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
			border-bottom-left-radius: 32rpx;
			border-bottom-right-radius: 32rpx;
			.destination-name {
				color: white;
				font-weight: 600;
				font-size: 28rpx; // 14px
			}
		}
	}
	.more-card {
		background-color: #f7f7f7;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		.more-card-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.more-card-text {
				font-size: 26rpx; // 13px
				color: #666;
				margin-top: 10rpx;
			}
		}
	}
}
/* 隐藏滚动条，uni-app中通常在scroll-view组件属性设置 */
.horizontal-scroll-view ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
}


.category-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx; // 10px
	.category-item {
		background-color: white;
		border-radius: 24rpx; // 12px
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0; // 10px
		.category-icon-wrapper {
			width: 96rpx; // 48px
			height: 96rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 10rpx;
			box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);
		}
		.category-name {
			font-size: 24rpx; // 12px
			color: #333;
		}
	}
}

.recommended-list {
	.recommend-item {
		background-color: white;
		border-radius: 24rpx; // 12px
		padding: 20rpx; // 10px
		display: flex;
		align-items: center;
		margin-bottom: 20rpx; // 10px
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		&:last-child {
			margin-bottom: 0;
		}
		.recommend-image {
			width: 160rpx; // 80px
			height: 160rpx;
			border-radius: 16rpx; // 8px
			object-fit: cover;
			margin-right: 20rpx;
		}
		.recommend-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			.recommend-title-tag {
				display: flex;
				align-items: center;
				margin-bottom: 8rpx;
				.recommend-name {
					font-size: 30rpx; // 15px
					font-weight: 500;
					color: #333;
				}
				.recommend-tag {
					font-size: 20rpx; // 10px
					padding: 4rpx 10rpx;
					border-radius: 8rpx;
					margin-left: 10rpx;
				}
			}
			.recommend-desc {
				font-size: 24rpx; // 12px
				color: #666;
				margin-bottom: 10rpx;
				// 多行省略
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.recommend-location {
				font-size: 24rpx; // 12px
				color: #999;
			}
		}
	}
}

// 通用卡片激活样式
.card:active, .destination-card:active, .category-item:active {
	opacity: 0.8;
}

</style>
