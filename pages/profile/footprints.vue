<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="footprint-gradient pt-10 pb-3 px-4">
			<view class="flex items-center">
				<view @tap="goBack" class="text-white">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="text-lg font-bold text-white ml-4 flex-1">我的足迹</text>
			</view>
		</view>
		
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content" @scrolltolower="loadMore">
			<!-- 视图切换标签 -->
			<view class="p-4">
				<view class="tab-container">
					<view 
						v-for="(tab, index) in tabs" 
						:key="index"
						class="tab" 
						:class="{'active': currentView === tab.value}"
						@tap="switchView(tab.value)">
						{{tab.name}}
					</view>
				</view>
			</view>
			
			<!-- 类别筛选区域 -->
			<view class="p-4 pb-2">
				<view class="flex justify-between items-center mb-3">
					<text class="text-base font-medium">特产分类</text>
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
			
			<!-- 列表视图 -->
			<view v-if="currentView === 'list'" class="px-4 pb-4">
				<view v-if="loading && filteredFootprints.length === 0" class="flex justify-center items-center py-10">
					<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
				</view>
				
				<view v-else-if="filteredFootprints.length === 0" class="empty-state">
					<view class="empty-icon">
						<text class="fas fa-shoe-prints text-[#D83931] text-3xl"></text>
					</view>
					<text class="font-medium mb-2" v-if="currentCategory === 'all'">暂无足迹记录</text>
					<text class="font-medium mb-2" v-else>没有找到{{categories[currentCategory].name}}类足迹</text>
					<text class="text-sm text-gray-500 mb-4" v-if="currentCategory === 'all'">探索特产并查看详情页，系统会自动记录您的足迹哦</text>
					<text class="text-sm text-gray-500 mb-4" v-else>您暂时没有浏览过{{categories[currentCategory].name}}类特产，可以继续探索发现更多</text>
					<navigator url="/pages/map/map" class="px-4 py-2 bg-[#D83931] text-white rounded-full text-sm">
						开始探索特产
					</navigator>
				</view>
				
				<view v-else>
					<!-- 足迹项目 -->
					<view 
						v-for="(item, index) in filteredFootprints" 
						:key="index"
						class="footprint-item card">
						<image :src="item.image" mode="aspectFill" class="w-full h-36 object-cover rounded-t-xl"></image>
						<view class="footprint-date">{{item.visitTime}}</view>
						<view class="footprint-info">
							<view class="flex justify-between mb-2">
								<text class="font-medium">{{item.name}}</text>
								<text class="text-xs text-gray-500">{{item.province}}·{{item.city}}</text>
							</view>
							<view class="mb-2">
								<text class="footprint-category" :class="getCategoryClass(item.category)">{{item.categoryName}}</text>
							</view>
							<text class="text-xs text-gray-600">{{item.description}}</text>
						</view>
					</view>
					
					<view v-if="loading" class="py-4">
						<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
					</view>
					
					<view v-else-if="!hasMore" class="py-4">
						<uni-load-more status="noMore" :contentText="{ contentnomore: '没有更多了' }"></uni-load-more>
					</view>
				</view>
			</view>
			
			<!-- 时间轴视图 -->
			<view v-else-if="currentView === 'timeline'" class="px-4 pb-4">
				<view v-if="loading && filteredFootprints.length === 0" class="flex justify-center items-center py-10">
					<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
				</view>
				
				<view v-else-if="filteredFootprints.length === 0" class="empty-state">
					<view class="empty-icon">
						<text class="fas fa-shoe-prints text-[#D83931] text-3xl"></text>
					</view>
					<text class="font-medium mb-2" v-if="currentCategory === 'all'">暂无足迹记录</text>
					<text class="font-medium mb-2" v-else>没有找到{{categories[currentCategory].name}}类足迹</text>
					<text class="text-sm text-gray-500 mb-4" v-if="currentCategory === 'all'">探索特产并查看详情页，系统会自动记录您的足迹哦</text>
					<text class="text-sm text-gray-500 mb-4" v-else>您暂时没有浏览过{{categories[currentCategory].name}}类特产，可以继续探索发现更多</text>
					<navigator url="/pages/map/map" class="px-4 py-2 bg-[#D83931] text-white rounded-full text-sm">
						开始探索特产
					</navigator>
				</view>
				
				<view v-else>
					<!-- 按时间分组 -->
					<view 
						v-for="(group, groupIndex) in timelineGroups" 
						:key="groupIndex" 
						class="timeline-container">
						<view class="timeline-line"></view>
						<view class="timeline-dot"></view>
						<view class="timeline-date">{{group.date}}</view>
						
						<view
							v-for="(item, itemIndex) in group.items"
							:key="itemIndex"
							class="footprint-item card ml-2 mb-6">
							<image :src="item.image" mode="aspectFill" class="w-full h-36 object-cover rounded-t-xl"></image>
							<view class="footprint-info">
								<view class="flex justify-between mb-2">
									<text class="font-medium">{{item.name}}</text>
									<text class="text-xs text-gray-500">{{item.province}}·{{item.city}}</text>
								</view>
								<view class="mb-2">
									<text class="footprint-category" :class="getCategoryClass(item.category)">{{item.categoryName}}</text>
								</view>
								<text class="text-xs text-gray-600">{{item.description}}</text>
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
			</view>
			
			<!-- 地图视图 -->
			<view v-else-if="currentView === 'map'" class="px-4 pb-4">
				<view v-if="loading && filteredFootprints.length === 0" class="flex justify-center items-center py-10">
					<uni-load-more status="loading" :contentText="{ contentdown: '加载中...' }"></uni-load-more>
				</view>
				
				<view v-else-if="filteredFootprints.length === 0" class="empty-state">
					<view class="empty-icon">
						<text class="fas fa-shoe-prints text-[#D83931] text-3xl"></text>
					</view>
					<text class="font-medium mb-2" v-if="currentCategory === 'all'">暂无足迹记录</text>
					<text class="font-medium mb-2" v-else>没有找到{{categories[currentCategory].name}}类足迹</text>
					<text class="text-sm text-gray-500 mb-4" v-if="currentCategory === 'all'">探索特产并查看详情页，系统会自动记录您的足迹哦</text>
					<text class="text-sm text-gray-500 mb-4" v-else>您暂时没有浏览过{{categories[currentCategory].name}}类特产，可以继续探索发现更多</text>
					<navigator url="/pages/map/map" class="px-4 py-2 bg-[#D83931] text-white rounded-full text-sm">
						开始探索特产
					</navigator>
				</view>
				
				<view v-else>
					<!-- 地图容器 -->
					<view class="map-container">
						<!-- 实际项目中应使用真实地图组件，这里使用图片模拟 -->
						<image src="https://images.unsplash.com/photo-1578827833595-5cb30eeb9a41?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" mode="aspectFill" class="w-full h-full object-cover"></image>
						
						<!-- 地图标记点 -->
						<view
							v-for="(province, index) in mapMarkers"
							:key="index"
							class="map-marker"
							:style="{top: province.top, left: province.left}">
							{{province.abbr}}
						</view>
					</view>
					
					<!-- 足迹列表 -->
					<text class="font-medium mb-3 block mt-4">我的足迹列表</text>
					
					<view class="space-y-3">
						<view 
							v-for="(item, index) in filteredFootprints" 
							:key="index"
							class="card p-3 flex items-center">
							<image :src="item.image" mode="aspectFill" class="w-12 h-12 object-cover rounded-lg"></image>
							
							<view class="ml-3 flex-1">
								<view class="flex items-center justify-between">
									<text class="text-sm font-medium">{{item.name}}</text>
									<text class="text-xs text-gray-500">{{item.visitTime}}</text>
								</view>
								<view class="flex items-center mt-1">
									<text class="text-xs text-gray-600">{{item.province}}·{{item.city}}</text>
									<text class="footprint-category ml-2" :class="getCategoryClass(item.category)" style="font-size: 9px; padding: 0px 4px;">{{item.categoryName}}</text>
								</view>
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
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				footprints: [],
				filteredFootprints: [],
				page: 1,
				pageSize: 10,
				loading: false,
				hasMore: true,
				currentView: 'list', // 默认列表视图
				currentCategory: 'all', // 默认选中所有分类
				tabs: [
					{name: '列表', value: 'list'},
					{name: '时间轴', value: 'timeline'},
					{name: '地图', value: 'map'}
				],
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
				},
				mapMarkers: [
					{abbr: '川', top: '40%', left: '30%'},
					{abbr: '苏', top: '45%', left: '70%'},
					{abbr: '浙', top: '38%', left: '75%'},
					{abbr: '鄂', top: '42%', left: '57%'}
				]
			}
		},
		computed: {
			// 时间轴分组
			timelineGroups() {
				// 按日期分组
				const groups = {};
				this.filteredFootprints.forEach(item => {
					// 提取日期部分
					const datePart = item.visitTime.split(' ')[0];
					if (!groups[datePart]) {
						groups[datePart] = {
							date: datePart,
							items: []
						};
					}
					groups[datePart].items.push(item);
				});
				
				// 转换为数组
				return Object.values(groups);
			}
		},
		onLoad() {
			this.getFootprints();
		},
		methods: {
			// 获取足迹列表
			async getFootprints() {
				try {
					this.loading = true;
					const { data: res } = await this.$cloud.callFunction({
						name: 'profile',
						data: {
							action: 'getAllFootprints',
							page: this.page,
							pageSize: this.pageSize,
							category: this.currentCategory !== 'all' ? this.currentCategory : undefined
						}
					});
					
					if (res.code === 0) {
						if (this.page === 1) {
							this.footprints = res.data.list;
						} else {
							this.footprints = [...this.footprints, ...res.data.list];
						}
						
						this.filteredFootprints = [...this.footprints];
						this.hasMore = res.data.hasMore;
					} else {
						uni.showToast({
							title: res.msg || '获取足迹失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('获取足迹失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 按分类筛选
			filterByCategory(category) {
				if (this.currentCategory === category) return;
				
				this.currentCategory = category;
				this.page = 1;
				this.footprints = [];
				this.filteredFootprints = [];
				this.hasMore = true;
				this.getFootprints();
			},
			
			// 切换视图
			switchView(view) {
				this.currentView = view;
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
					this.getFootprints();
				}
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

.footprint-gradient {
	background: linear-gradient(135deg, #D83931, #A82825);
}

.scrollable-content {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.tab-container {
	display: flex;
	border-radius: 8px;
	background-color: #F0ECE6;
	padding: 4px;
	margin-bottom: 16px;
}

.tab {
	flex: 1;
	padding: 8px 0;
	text-align: center;
	font-size: 14px;
	border-radius: 6px;
	transition: all 0.3s ease;
}

.tab.active {
	background-color: white;
	color: #D83931;
	font-weight: 500;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

.footprint-item {
	position: relative;
	margin-bottom: 20px;
	background-color: white;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.footprint-date {
	position: absolute;
	top: 10px;
	right: 10px;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 10px;
}

.footprint-info {
	padding: 12px;
}

.footprint-category {
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

.timeline-container {
	padding-left: 20px;
	position: relative;
}

.timeline-line {
	position: absolute;
	left: 8px;
	top: 0;
	bottom: 0;
	width: 2px;
	background-color: #E0E0E0;
}

.timeline-dot {
	position: absolute;
	left: 4px;
	top: 15px;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #D83931;
	z-index: 1;
}

.timeline-date {
	font-size: 12px;
	color: #666;
	margin-bottom: 10px;
	font-weight: 500;
}

.map-container {
	height: 200px;
	background-color: #e5e5e5;
	margin-bottom: 16px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
}

.map-marker {
	position: absolute;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: #D83931;
	color: white;
	font-size: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	z-index: 10;
	transform: translate(-50%, -50%);
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