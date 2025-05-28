<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="footprint-gradient pt-10 pb-3 px-4">
			<view class="flex items-center">
				<navigator open-type="navigateBack" class="text-white">
					<text class="fas fa-arrow-left"></text>
				</navigator>
				<text class="text-lg font-bold text-white ml-4 flex-1">我的收藏</text>
			</view>
		</view>
		
		<!-- 筛选标签 -->
		<view class="filter-section">
			<view class="flex justify-between items-center filter-header">
				<view class="category-title">
					<text class="text-base font-medium">特产分类</text>
				</view>
				
				<view class="view-mode-toggle flex-shrink-0">
					<view class="view-mode-btn" :class="{'active': viewMode === 'list'}" @tap="switchViewMode('list')">列表</view>
					<view class="view-mode-btn" :class="{'active': viewMode === 'grid'}" @tap="switchViewMode('grid')">网格</view>
				</view>
			</view>
			
			<!-- 标签式分类列表 - 网格布局 -->
			<view class="category-wrap">
				<view 
					v-for="(category, key) in categories" 
					:key="key"
					class="category-btn" 
					:class="{'active': currentCategory === key}"
					@tap="filterByCategory(key)">
					{{category.name}}
				</view>
			</view>
		</view>
		
		<!-- 收藏列表 -->
		<scroll-view scroll-y="true" class="scrollable-content" @scrolltolower="loadMore">
			<view v-if="loading && filteredCollections.length === 0" class="flex justify-center items-center py-10">
				<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
			</view>
			
			<view v-else-if="filteredCollections.length === 0" class="empty-state">
				<view class="empty-icon">
					<text class="fas fa-heart text-[#D83931] text-3xl"></text>
				</view>
				<text class="font-medium mb-2" v-if="currentCategory === 'all'">暂无收藏内容</text>
				<text class="font-medium mb-2" v-else>没有找到{{categories[currentCategory].name}}类特产</text>
				<text class="text-sm text-gray-500 mb-4" v-if="currentCategory === 'all'">您可以收藏喜欢的特产，方便以后查找</text>
				<text class="text-sm text-gray-500 mb-4" v-else>您暂时没有收藏{{categories[currentCategory].name}}类特产，可以继续浏览发现更多</text>
				<navigator url="/pages/index/index" class="px-4 py-2 bg-[#D83931] text-white rounded-full text-sm">
					去发现特产
				</navigator>
			</view>
			
			<!-- 列表视图 -->
			<view v-else-if="viewMode === 'list'" class="px-4 pb-4">
				<view 
					v-for="(item, index) in filteredCollections" 
					:key="index"
					class="collection-item mb-4">
					<!-- 图片 -->
					<image :src="item.image" mode="aspectFill" class="w-full object-cover"></image>
					
					<!-- 收藏和分享按钮 -->
					<view class="collection-actions">
						<button class="action-btn heart-btn" @tap.stop="cancelCollection(item.id)">
							<view class="icon-heart"></view>
						</button>
						<button class="action-btn share-btn" @tap.stop="shareSpecialty(item)">
							<view class="icon-share"></view>
						</button>
					</view>
					
					<!-- 内容区域 -->
					<view class="p-3">
						<view class="title-row">
							<text class="item-title">{{item.name}}</text>
							<text class="item-location">{{item.province}}·{{item.city}}</text>
						</view>
						<view class="mb-2 category-container">
							<text class="item-category" :class="getCategoryClass(item.category)">{{item.categoryName || '特产'}}</text>
						</view>
						<text class="item-desc">{{item.description || '暂无描述'}}</text>
						<view class="flex justify-between items-center mt-2">
							<view class="view-count">
								<view class="icon-eye"></view>
								<text>{{item.viewCount || '0'}}</text>
							</view>
							<navigator :url="`/pages/detail/detail?id=${item.id}`" class="detail-btn">
								查看详情
							</navigator>
						</view>
					</view>
				</view>
				
				<view v-if="loading" class="py-4">
					<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
				</view>
				
				<view v-else-if="!hasMore" class="py-4">
					<uni-load-more status="noMore" :contentText="{ contentnomore: '没有更多了' }"></uni-load-more>
				</view>
			</view>
			
			<!-- 网格视图 -->
			<view v-else class="pb-4">
				<view class="grid-view-container">
					<navigator
						v-for="(item, index) in filteredCollections"
						:key="index"
						:url="`/pages/detail/detail?id=${item.id}`"
						class="grid-item">
						<image :src="item.image" mode="aspectFill"></image>
						<button class="favorite-btn" @tap.stop="cancelCollection(item.id)">
							<view class="icon-heart"></view>
						</button>
						<view class="grid-info">
							<text class="text-sm font-medium mb-1 text-ellipsis">{{item.name}}</text>
							<view class="flex justify-between items-center">
								<text class="text-xs text-gray-500 text-ellipsis">{{item.province}}·{{item.city}}</text>
								<text class="item-category" :class="getCategoryClass(item.category)">{{item.categoryName || '特产'}}</text>
							</view>
						</view>
					</navigator>
				</view>
				
				<view v-if="loading" class="py-4 text-center">
					<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
				</view>
				
				<view v-else-if="!hasMore" class="py-4 text-center">
					<uni-load-more status="noMore" :contentText="{ contentnomore: '没有更多了' }"></uni-load-more>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collections: [],
				filteredCollections: [],
				page: 1,
				pageSize: 10,
				loading: false,
				hasMore: true,
				viewMode: 'list', // 默认列表视图
				currentCategory: 'all',
				categories: {
					all: { name: "全部", color: "#D83931", icon: "fa-th-large" },
					food: { name: "主食", color: "#F7C873", icon: "fa-bowl-rice" },
					material: { name: "副食", color: "#9B59B6", icon: "fa-jar" },
					snack: { name: "小吃", color: "#58D68D", icon: "fa-cookie" },
					dessert: { name: "零食", color: "#E74C3C", icon: "fa-candy-bar" },
					alcohol: { name: "烟酒", color: "#7F8C8D", icon: "fa-wine-bottle" },
					tea: { name: "茶叶", color: "#1ABC9C", icon: "fa-mug-hot" },
					drink: { name: "饮料", color: "#3498DB", icon: "fa-glass" },
					fruit: { name: "水果", color: "#2ECC71", icon: "fa-apple-whole" },
					vegetable: { name: "蔬菜", color: "#16A085", icon: "fa-carrot" },
					seafood: { name: "水产海鲜", color: "#0E6EAE", icon: "fa-fish" },
					craft: { name: "工艺品", color: "#8E44AD", icon: "fa-scissors" },
					medicine: { name: "药材", color: "#D35400", icon: "fa-mortar-pestle" },
					flower: { name: "花卉", color: "#27AE60", icon: "fa-seedling" }
				}
			}
		},
		onLoad() {
			this.getCollections();
		},
		methods: {
			// 获取收藏列表
			async getCollections() {
				try {
					this.loading = true;
					
					// 调用云函数 - 使用 uniCloud.callFunction 代替 this.$cloud.callFunction
					const { result } = await uniCloud.callFunction({
						name: 'profile',
						data: {
							action: 'getCollections',
							page: this.page,
							pageSize: this.pageSize,
							category: this.currentCategory !== 'all' ? this.currentCategory : undefined
						}
					});
					
					if (result.code === 0) {
						if (this.page === 1) {
							this.collections = result.data.list;
						} else {
							this.collections = [...this.collections, ...result.data.list];
						}
						
						this.filterCollections();
						this.hasMore = result.data.hasMore;
					} else {
						uni.showToast({
							title: result.msg || '获取收藏失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('获取收藏失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 筛选收藏
			filterCollections() {
				if (this.currentCategory === 'all') {
					this.filteredCollections = [...this.collections];
					return;
				}
				
				this.filteredCollections = this.collections.filter(item => 
					item.category === this.currentCategory
				);
			},
			
			// 按分类筛选
			filterByCategory(category) {
				if (this.currentCategory === category) return;
				
				this.currentCategory = category;
				this.page = 1;
				this.collections = [];
				this.filteredCollections = [];
				this.hasMore = true;
				this.getCollections();
			},
			
			// 切换视图模式
			switchViewMode(mode) {
				this.viewMode = mode;
			},
			
			// 获取分类样式类
			getCategoryClass(category) {
				const categoryMap = {
					'food': 'food-tag',
					'material': 'food-tag',
					'snack': 'food-tag',
					'dessert': 'food-tag',
					'craft': 'craft-tag',
					'tea': 'drink-tag',
					'drink': 'drink-tag',
					'fruit': 'fresh-tag',
					'vegetable': 'fresh-tag',
					'seafood': 'fresh-tag'
				};
				
				return categoryMap[category] || 'food-tag';
			},
			
			// 加载更多
			loadMore() {
				if (!this.loading && this.hasMore) {
					this.page++;
					this.getCollections();
				}
			},
			
			// 取消收藏
			cancelCollection(id) {
				uni.showModal({
					title: '提示',
					content: '确定要取消收藏吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 调用云函数取消收藏
								const { result } = await uniCloud.callFunction({
									name: 'profile',
									data: {
										action: 'cancelCollection',
										id
									}
								});
								
								if (result.code === 0) {
									// 从列表中移除
									this.collections = this.collections.filter(item => item.id !== id);
									this.filterCollections();
									uni.showToast({
										title: '已取消收藏',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: result.msg || '取消收藏失败',
										icon: 'none'
									});
								}
							} catch (e) {
								console.error('取消收藏失败:', e);
								uni.showToast({
									title: '网络错误，请稍后重试',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			
			// 分享特产
			shareSpecialty(item) {
				uni.showToast({
					title: '分享功能开发中...',
					icon: 'none'
				});
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
.container {
	position: relative;
	width: 100%;
	height: 100vh;
	background-color: #F8F5F1;
	display: flex;
	flex-direction: column;
}

/* 顶部导航栏样式 */
.footprint-gradient {
    background: linear-gradient(135deg, #D83931, #A82825);
    width: 100%;
    position: relative;
    z-index: 100;
}

.text-white {
    color: #ffffff;
}

.text-lg {
    font-size: 18px;
}

.font-bold {
    font-weight: 700;
}

.ml-4 {
    margin-left: 16px;
}

.pt-10 {
    padding-top: 40px; /* 适配状态栏高度 */
}

.pb-3 {
    padding-bottom: 12px;
}

.px-4 {
    padding-left: 16px;
    padding-right: 16px;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.flex-1 {
    flex: 1;
}

.fas.fa-arrow-left {
    font-size: 20px;
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

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	text-align: center;
}

.empty-icon {
	width: 80px;
	height: 80px;
	border-radius: 40px;
	background-color: rgba(216, 57, 49, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16px;
}

.view-mode-toggle {
	background-color: #EEEEEE;
	border-radius: 20px;
	padding: 2px;
	display: flex;
	width: 96px;
	height: 32px;
	overflow: hidden;
}

.view-mode-btn {
	flex: 1;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	color: #666;
	
	&.active {
		background-color: #D83931;
		color: white;
		font-weight: 500;
		border-radius: 18px;
	}
}

.filter-section {
	padding: 16px 16px 8px;
	background-color: #F8F5F1;
	border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.filter-header {
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.category-title {
	position: relative;
}

.text-base.font-medium {
	font-size: 16px;
	font-weight: 600;
	color: #333;
	position: relative;
	padding-left: 10px;
	
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		height: 16px;
		background-color: #D83931;
		border-radius: 2px;
	}
}

.category-wrap {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -4px;
}

.category-btn {
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 14px;
	background-color: #F0ECE6;
	color: #666666;
	margin: 0 4px 10px 4px;
	transition: all 0.2s ease;
	
	&.active {
		background-color: #D83931;
		color: white;
		font-weight: 500;
	}
	
	&:first-child {
		background-color: #D83931;
		color: white;
	}
}

.collection-item {
	position: relative;
	background-color: #fff;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	margin-bottom: 16px;
}

.card {
	border-radius: 12px;
	background: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.collection-actions {
	position: absolute;
	top: 12px;
	right: 12px;
	display: flex;
	gap: 8px;
	z-index: 100;
}

.action-btn {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	padding: 0;
	border: none;
	
	&::after {
		border: none;
		display: none;
	}
}

.heart-btn {
	color: #D83931;
}

.share-btn {
	color: #666;
}

/* 收藏按钮心形图标 */
.action-btn .fa-heart {
	font-size: 18px;
	color: #D83931;
}

/* 分享按钮图标 */
.action-btn .fa-share-alt {
	font-size: 18px;
	color: #666;
}

.action-btn:active {
	transform: scale(0.95);
	background-color: rgba(255, 255, 255, 0.8);
}

.item-category {
	display: inline-block;
	font-size: 10px;
	padding: 2px 8px;
	border-radius: 12px;
	background-color: #9B59B6;
	color: white;
}

.food-tag {
	background-color: #FFD166;
	color: #8B5000;
}

.craft-tag {
	background-color: #9B59B6;
	color: white;
}

.fresh-tag {
	background-color: #58D68D;
	color: #1D6640;
}

.drink-tag {
	background-color: #3498DB;
	color: white;
}

.grid-view-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
	padding: 0 12px;
}

.grid-item {
	position: relative;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	background-color: #fff;
	
	image {
		width: 100%;
		height: 140px;
		object-fit: cover;
	}
}

.grid-info {
	padding: 8px;
	background-color: white;
}

/* 网格视图中的位置文本样式调整 */
.grid-info .text-xs.text-gray-500 {
	font-size: 9px; /* 将地址文本字体缩小 */
	color: #999; /* 稍微降低对比度 */
	max-width: 65%; /* 限制最大宽度，为分类标签留出空间 */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 网格视图中的分类标签调整 */
.grid-info .item-category {
	margin-left: auto; /* 将分类标签推到右侧 */
	font-size: 9px; /* 确保字体大小一致 */
	padding: 1px 6px; /* 调整内边距使标签更小巧 */
	border-radius: 10px;
}

/* 调整网格项中的底部行布局 */
.grid-info .flex.justify-between.items-center {
	display: flex;
	justify-content: space-between; /* 确保两端对齐 */
	align-items: center;
	margin-top: 4px; /* 与上方标题保持适当间距 */
	width: 100%;
}

.favorite-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
	padding: 0;
	
	&::after {
		border: none;
		display: none;
	}
	
	.icon-heart {
		width: 16px;
		height: 16px;
	}
	
	&:active {
		transform: scale(0.95);
		background-color: rgba(255, 255, 255, 0.85);
	}
}

.text-ellipsis {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.collection-item .p-3 {
	padding: 16px;
}

.collection-item .text-xs.text-gray-500 {
	font-size: 10px;
	line-height: 1.2;
}

.collection-item .font-medium {
	font-size: 15px;
	line-height: 1.3;
}

.collection-item .text-xs.text-gray-600 {
	font-size: 11px;
	line-height: 1.4;
	max-height: 2.8em;
	overflow: hidden;
}

.collection-item image {
	width: 100%;
	height: 180px;
	object-fit: cover;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
}

.collection-item .flex.justify-between.items-center {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-top: 8px;
}

.detail-btn {
	padding: 4px 12px;
	border-radius: 16px;
	color: #D83931;
	background-color: rgba(216, 57, 49, 0.1);
	font-size: 12px;
	text-align: center;
	margin-left: auto;
}

.collection-item.card {
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	
	&:active {
		transform: scale(0.98);
	}
}

.title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
	width: 100%;
}

.item-title {
	font-size: 16px;
	font-weight: 500;
	color: #333;
	flex: 1;
}

.item-location {
	font-size: 12px;
	color: #888;
	text-align: right;
}

.item-desc {
	font-size: 12px;
	line-height: 1.4;
	color: #666;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	max-height: 2.8em;
	margin-top: 4px;
}

.view-count {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: #888;
}

.view-count .fas {
	margin-right: 4px;
}

/* 心形图标 */
.icon-heart {
	width: 18px;
	height: 18px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23D83931' d='M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z'%3E%3C/path%3E%3C/svg%3E") no-repeat center center;
	background-size: contain;
}

/* 分享图标 */
.icon-share {
	width: 18px;
	height: 18px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='%23666666' d='M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841l-102.486 64.054C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z'%3E%3C/path%3E%3C/svg%3E") no-repeat center center;
	background-size: contain;
}

/* 眼睛图标 */
.icon-eye {
	width: 16px;
	height: 16px;
	margin-right: 4px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%23888888' d='M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z'%3E%3C/path%3E%3C/svg%3E") no-repeat center center;
	background-size: contain;
	display: inline-block;
}

.view-count {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: #888;
}

.mb-2 {
	margin-bottom: 12px;
}

.collection-item .mb-2 {
	margin-bottom: 12px;
}

.category-container {
	margin-top: 8px;
	margin-bottom: 12px;
}
</style> 