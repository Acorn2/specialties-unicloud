<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar bg-white shadow-sm">
			<view class="flex items-center h-full px-4">
				<view class="nav-back" @tap="goBack">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="nav-title">我的收藏</text>
				<view class="w-5"></view> <!-- 占位元素，保持标题居中 -->
			</view>
		</view>
		
		<!-- 筛选标签 -->
		<view class="p-4 pb-2">
			<view class="flex justify-between items-center mb-3">
				<text class="text-base font-medium">特产分类</text>
				
				<view class="view-mode-toggle flex-shrink-0">
					<view class="view-mode-btn" :class="{'active': viewMode === 'list'}" @tap="switchViewMode('list')">列表</view>
					<view class="view-mode-btn" :class="{'active': viewMode === 'grid'}" @tap="switchViewMode('grid')">网格</view>
				</view>
			</view>
			
			<!-- 标签式分类列表 -->
			<view class="flex flex-wrap">
				<view 
					v-for="(category, key) in categories" 
					:key="key"
					class="list-category-btn" 
					:class="{'active': currentCategory === key}"
					@tap="filterByCategory(key)">
					{{category.name}}
				</view>
			</view>
		</view>
		
		<!-- 收藏列表 -->
		<scroll-view scroll-y="true" class="collection-list" @scrolltolower="loadMore">
			<view v-if="loading && filteredCollections.length === 0" class="flex justify-center items-center py-10">
				<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
			</view>
			
			<view v-else-if="filteredCollections.length === 0" class="flex flex-col justify-center items-center py-16">
				<text class="fas fa-heart text-gray-300 text-5xl mb-4"></text>
				<text class="text-gray-500 mb-2" v-if="currentCategory === 'all'">暂无收藏记录</text>
				<text class="text-gray-500 mb-2" v-else>没有找到{{categories[currentCategory].name}}类特产</text>
				<text class="text-gray-400 text-xs" v-if="currentCategory === 'all'">在特产详情页点击收藏按钮添加收藏</text>
				<text class="text-gray-400 text-xs" v-else>您暂时没有收藏{{categories[currentCategory].name}}类特产，可以继续浏览发现更多</text>
			</view>
			
			<!-- 列表视图 -->
			<view v-else-if="viewMode === 'list'" class="px-4 pb-4">
				<view 
					v-for="(item, index) in filteredCollections" 
					:key="index"
					class="collection-item card mb-4">
					<image :src="item.image" mode="aspectFill" class="w-full h-36 object-cover rounded-t-xl"></image>
					
					<view class="collection-actions">
						<button class="action-btn" @tap.stop="cancelCollection(item.id)">
							<text class="fas fa-heart text-[#D83931]"></text>
						</button>
						<button class="action-btn" @tap.stop="shareSpecialty(item)">
							<text class="fas fa-share-alt text-gray-600"></text>
						</button>
					</view>
					
					<view class="p-3">
						<view class="flex justify-between mb-2">
							<text class="font-medium">{{item.name}}</text>
							<text class="text-xs text-gray-500">{{item.province}}·{{item.city}}</text>
						</view>
						<view class="mb-2">
							<text class="item-category" :class="getCategoryClass(item.category)">{{item.categoryName || '特产'}}</text>
						</view>
						<text class="text-xs text-gray-600">{{item.description || '暂无描述'}}</text>
						<view class="flex justify-between items-center mt-2">
							<text class="text-xs text-gray-500">
								<text class="fas fa-eye mr-1"></text> {{item.viewCount || '0'}}
							</text>
							<navigator :url="`/pages/detail/detail?id=${item.id}`" class="text-xs text-[#D83931] bg-red-50 px-3 py-1 rounded-full">
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
							<text class="fas fa-heart text-[#D83931]"></text>
						</button>
						<view class="grid-info">
							<text class="text-sm font-medium mb-1 text-ellipsis">{{item.name}}</text>
							<view class="flex justify-between items-center">
								<text class="text-xs text-gray-500 text-ellipsis">{{item.province}}·{{item.city}}</text>
								<text class="item-category text-[9px]" :class="getCategoryClass(item.category)">{{item.categoryName || '特产'}}</text>
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
				viewMode: 'grid', // 默认网格视图
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
					const { data: res } = await this.$cloud.callFunction({
						name: 'profile',
						data: {
							action: 'getCollections',
							page: this.page,
							pageSize: this.pageSize,
							category: this.currentCategory !== 'all' ? this.currentCategory : undefined
						}
					});
					
					if (res.code === 0) {
						if (this.page === 1) {
							this.collections = res.data.list;
						} else {
							this.collections = [...this.collections, ...res.data.list];
						}
						
						this.filterCollections();
						this.hasMore = res.data.hasMore;
					} else {
						uni.showToast({
							title: res.msg || '获取收藏失败',
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
								const { data: result } = await this.$cloud.callFunction({
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

.nav-bar {
	height: 44px;
	width: 100%;
	padding-top: var(--status-bar-height);
	position: sticky;
	top: 0;
	z-index: 100;
	
	.nav-back {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
	}
	
	.nav-title {
		flex: 1;
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		color: #333;
	}
}

.collection-list {
	flex: 1;
	overflow-y: auto;
}

.view-mode-toggle {
	background-color: white;
	border-radius: 20px;
	padding: 4px;
	display: flex;
	width: 80px;
	margin-left: auto;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.view-mode-btn {
	flex: 1;
	text-align: center;
	padding: 2px 0;
	border-radius: 16px;
	font-size: 12px;
	color: #666;
}

.view-mode-btn.active {
	background-color: #D83931;
	color: white;
}

.list-category-btn {
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 13px;
	background-color: #F0ECE6;
	color: #666666;
	margin-right: 8px;
	margin-bottom: 8px;
	transition: all 0.2s ease;
}

.list-category-btn.active {
	background-color: #D83931;
	color: white;
}

.collection-item {
	position: relative;
	background-color: #fff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.collection-actions {
	position: absolute;
	top: 10px;
	right: 10px;
	display: flex;
	gap: 8px;
}

.action-btn {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.2s ease;
	
	&::after {
		border: none;
	}
}

.action-btn:active {
	transform: scale(0.95);
	background-color: rgba(255, 255, 255, 0.8);
}

.item-category {
	display: inline-block;
	font-size: 10px;
	padding: 1px 6px;
	border-radius: 10px;
	margin-right: 6px;
}

.food-tag {
	background-color: #F7C873;
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

.favorite-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	
	&::after {
		border: none;
	}
}

.text-ellipsis {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
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
</style> 