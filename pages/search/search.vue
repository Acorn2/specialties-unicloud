<template>
	<view class="container">
		<!-- 顶部搜索栏 (固定在顶部) -->
		<view class="bg-white px-4 pt-10 pb-3 shadow-sm">
			<view class="flex items-center">
				<view @tap="goBack" class="w-8 h-8 flex items-center justify-center mr-2">
					<text class="fas fa-arrow-left text-gray-600"></text>
				</view>
				
				<view class="flex search-bar bg-[#F0ECE6] p-2 items-center flex-1">
					<text class="fas fa-search text-gray-400 mx-2"></text>
					<input type="text" 
						placeholder="搜索地方特产、美食..." 
						class="flex-1 outline-none text-sm bg-transparent" 
						v-model="searchKeyword"
						@input="onSearchInput"
						@confirm="onSearchConfirm">
					<text class="fas fa-xmark text-gray-400 mx-2" 
						v-if="searchKeyword"
						@tap="clearSearch"></text>
				</view>
			</view>
		</view>
		
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 搜索历史 -->
			<view class="px-4 pt-4" v-if="!searching">
				<view class="flex justify-between items-center mb-3">
					<text class="text-sm font-medium">历史搜索</text>
					<view class="text-xs text-gray-500" @tap="clearHistory">
						<text class="fas fa-trash-can mr-1"></text>
						<text>清除</text>
					</view>
				</view>
				
				<view class="flex flex-wrap">
					<view 
						v-for="(item, index) in searchHistory" 
						:key="index" 
						class="search-tag"
						@tap="useHistoryKeyword(item)">
						{{item}}
					</view>
				</view>
			</view>
			
			<!-- 热门搜索 -->
			<view class="px-4 pt-6" v-if="!searching">
				<view class="flex justify-between items-center mb-3">
					<text class="text-sm font-medium">热门搜索</text>
				</view>
				
				<view class="flex flex-wrap">
					<view 
						v-for="(item, index) in hotSearchKeywords" 
						:key="index" 
						class="search-tag"
						@tap="useHistoryKeyword(item)">
						{{item}}
					</view>
				</view>
			</view>
			
			<!-- 搜索结果 -->
			<view class="p-4 mt-4 mb-5" v-if="searching">
				<view class="flex justify-between items-center mb-3">
					<text class="text-sm font-medium">搜索结果</text>
					<text v-if="totalResults > 0" class="text-xs text-gray-500">共{{totalResults}}个结果</text>
				</view>
				
				<view v-if="loading" class="flex justify-center items-center py-8">
					<view class="loading-circle"></view>
				</view>
				
				<view v-else-if="searchResults.length === 0" class="flex flex-col justify-center items-center py-12">
					<image src="/static/images/empty-search.png" mode="aspectFit" class="w-20 h-20 mb-3 opacity-70"></image>
					<text class="text-gray-500">未找到相关结果</text>
				</view>
				
				<block v-else>
					<!-- 结果项列表 -->
					<view 
						v-for="(item, index) in searchResults" 
						:key="index" 
						class="search-result p-3 flex items-center mb-3"
						@tap="navigateToDetail(item.id)">
						<image :src="item.image" class="w-16 h-16 object-cover rounded-lg"></image>
						<view class="ml-3 flex-1">
							<view class="flex items-center mb-1">
								<text class="font-medium text-sm">{{item.name}}</text>
								<view :class="['tag', getCategoryClass(item.category)]" class="ml-2">
									{{item.categoryName}}
								</view>
							</view>
							<text class="text-xs text-gray-600 mb-1 line-clamp-2">{{item.description}}</text>
							<view class="flex items-center">
								<text class="text-xs text-gray-500">{{item.province}}</text>
								<view class="mx-1.5 h-3 w-px bg-gray-300"></view>
								<view class="flex items-center">
									<text class="fas fa-eye text-xs text-gray-400 mr-1"></text>
									<text class="text-xs text-gray-500">{{formatViewCount(item.viewCount)}}</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 加载更多 -->
					<view class="text-center mt-4">
						<view 
							class="text-sm text-gray-500 px-4 py-2 rounded-full border border-gray-200 inline-block"
							@tap="loadMore"
							v-if="hasMore">
							加载更多
						</view>
						<view class="text-sm text-gray-400 px-4 py-2" v-else>
							没有更多结果了
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyword: '', // 搜索关键字
				searching: false, // 是否正在搜索
				loading: false, // 是否加载中
				searchHistory: [], // 搜索历史
				hotSearchKeywords: [], // 热门搜索关键字
				searchResults: [], // 搜索结果
				page: 1, // 当前页码
				pageSize: 10, // 每页数量
				hasMore: false, // 是否有更多结果
				totalResults: 0, // 总结果数量
				timer: null // 防抖定时器
			};
		},
		onLoad(options) {
			// 检查是否有传入的搜索关键字
			if (options.keyword) {
				this.searchKeyword = options.keyword;
				this.doSearch();
			}
			
			// 加载搜索历史
			this.loadSearchHistory();
			
			// 获取热门搜索关键字
			this.getHotSearchKeywords();
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 输入框值变化
			onSearchInput(e) {
				this.searchKeyword = e.detail.value;
				
				// 如果清空了搜索词，停止搜索
				if (!this.searchKeyword.trim()) {
					this.searching = false;
					return;
				}
				
				// 防抖处理，输入停止300ms后执行搜索
				if (this.timer) clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.doSearch();
				}, 300);
			},
			
			// 确认搜索
			onSearchConfirm() {
				if (!this.searchKeyword.trim()) return;
				this.doSearch();
			},
			
			// 执行搜索
			async doSearch() {
				if (!this.searchKeyword.trim()) return;
				
				this.searching = true;
				this.loading = true;
				this.page = 1;
				this.searchResults = [];
				
				try {
					const { data: res } = await this.$cloud.callFunction({
						name: 'search',
						data: {
							action: 'searchSpecialties',
							keyword: this.searchKeyword.trim(),
							page: this.page,
							pageSize: this.pageSize
						}
					});
					
					if (res.code === 0) {
						this.searchResults = res.data.list;
						this.totalResults = res.data.total;
						this.hasMore = res.data.list.length < res.data.total;
						
						// 保存到搜索历史
						this.saveSearchHistory(this.searchKeyword);
					} else {
						uni.showToast({
							title: res.msg || '搜索失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('搜索失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 加载更多
			async loadMore() {
				if (!this.hasMore || this.loading) return;
				
				this.loading = true;
				this.page++;
				
				try {
					const { data: res } = await this.$cloud.callFunction({
						name: 'search',
						data: {
							action: 'searchSpecialties',
							keyword: this.searchKeyword.trim(),
							page: this.page,
							pageSize: this.pageSize
						}
					});
					
					if (res.code === 0) {
						this.searchResults = [...this.searchResults, ...res.data.list];
						this.hasMore = this.searchResults.length < res.data.total;
					} else {
						uni.showToast({
							title: res.msg || '加载更多失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('加载更多失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 加载搜索历史
			loadSearchHistory() {
				try {
					const history = uni.getStorageSync('searchHistory');
					if (history) {
						this.searchHistory = JSON.parse(history);
					}
				} catch (e) {
					console.error('读取搜索历史失败:', e);
					this.searchHistory = [];
				}
			},
			
			// 保存搜索历史
			saveSearchHistory(keyword) {
				try {
					// 如果已存在，则移到最前面
					const index = this.searchHistory.indexOf(keyword);
					if (index > -1) {
						this.searchHistory.splice(index, 1);
					}
					
					// 添加到最前面
					this.searchHistory.unshift(keyword);
					
					// 限制历史记录数量为10条
					if (this.searchHistory.length > 10) {
						this.searchHistory = this.searchHistory.slice(0, 10);
					}
					
					// 保存到本地存储
					uni.setStorageSync('searchHistory', JSON.stringify(this.searchHistory));
				} catch (e) {
					console.error('保存搜索历史失败:', e);
				}
			},
			
			// 清除搜索历史
			clearHistory() {
				uni.showModal({
					title: '提示',
					content: '确定要清除所有搜索历史吗？',
					success: (res) => {
						if (res.confirm) {
							this.searchHistory = [];
							uni.removeStorageSync('searchHistory');
							uni.showToast({
								title: '已清除搜索历史',
								icon: 'none'
							});
						}
					}
				});
			},
			
			// 清除当前搜索
			clearSearch() {
				this.searchKeyword = '';
				this.searching = false;
				this.searchResults = [];
			},
			
			// 使用历史关键字
			useHistoryKeyword(keyword) {
				this.searchKeyword = keyword;
				this.doSearch();
			},
			
			// 获取热门搜索关键字
			async getHotSearchKeywords() {
				try {
					const { data: res } = await this.$cloud.callFunction({
						name: 'search',
						data: {
							action: 'getHotSearchKeywords'
						}
					});
					
					if (res.code === 0) {
						this.hotSearchKeywords = res.data;
					}
				} catch (e) {
					console.error('获取热门搜索关键字失败:', e);
				}
			},
			
			// 获取分类样式类名
			getCategoryClass(category) {
				const categoryClasses = {
					'food': 'food-tag',
					'craft': 'craft-tag',
					'fresh': 'fresh-tag',
					'heritage': 'heritage-tag',
					'geo': 'geo-tag'
				};
				
				return categoryClasses[category] || 'food-tag';
			},
			
			// 格式化查看次数
			formatViewCount(count) {
				if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万';
				}
				if (count >= 1000) {
					return (count / 1000).toFixed(1) + '千';
				}
				return count;
			},
			
			// 导航到详情页
			navigateToDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				});
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

.scrollable-content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
}

.search-bar {
	border-radius: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-tag {
	background-color: #F0ECE6;
	border-radius: 16px;
	padding: 6px 12px;
	font-size: 12px;
	color: #666666;
	margin-right: 8px;
	margin-bottom: 8px;
	display: inline-block;
	
	&:active {
		background-color: #E6E0D9;
	}
}

.search-result {
	border-radius: 12px;
	background: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
}

.tag {
	border-radius: 10px;
	font-size: 10px;
	padding: 1px 6px;
	display: inline-flex;
	align-items: center;
	margin-right: 4px;
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

.heritage-tag {
	background-color: #9B59B6;
	color: white;
}

.geo-tag {
	background-color: #2980B9;
	color: white;
}

.loading-circle {
	width: 30px;
	height: 30px;
	border: 3px solid #F0ECE6;
	border-top-color: #D83931;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style> 