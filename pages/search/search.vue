<template>
	<view class="app-container">
		<!-- 顶部搜索栏 (固定在顶部) -->
		<view class="search-header bg-[#F8F5F1] px-4 pt-10 pb-3">
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
						@confirm="onSearchConfirm"
						focus>
					<text class="fas fa-xmark text-gray-400 mx-2" 
						v-if="searchKeyword"
						@tap="clearSearch"></text>
				</view>
			</view>
		</view>
		
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 历史搜索 -->
			<view class="history-section">
				<view class="section-header">
					<text class="section-title">历史搜索</text>
					<view class="clear-btn" @tap="clearHistory">
						<text class="fas fa-trash-can mr-1"></text>
						<text>清除</text>
					</view>
				</view>
				
				<view class="tag-container">
					<text 
						v-for="(item, index) in searchHistory" 
						:key="index" 
						class="history-tag"
						@tap="useHistoryKeyword(item)">
						{{item}}
					</text>
				</view>
			</view>
			
			<!-- 搜索结果 -->
			<view class="p-4" v-if="searching">
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
						class="search-result p-3 flex items-start mb-3"
						@tap="navigateToDetail(item.id)">
						<image v-if="item.image" :src="item.image" class="w-16 h-16 object-cover rounded-lg"></image>
						<view v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
							<text class="fas fa-image text-gray-400"></text>
						</view>
						<view class="ml-3 flex-1">
							<view class="flex items-center mb-1">
								<text class="font-medium text-sm">{{item.name}}</text>
								<view class="tag food-tag ml-2">
									{{item.categoryName || '食品类'}}
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
					
					<!-- 加载更多或结束提示 -->
					<view class="text-center mt-4 mb-5">
						<view v-if="hasMore" 
							class="text-sm text-gray-500 px-4 py-2 rounded-full border border-gray-200 inline-block load-more-btn"
							@tap="loadMore">
							加载更多
						</view>
						<view v-else class="text-sm text-gray-400 px-4 py-2">
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
				searchKeyword: '', // 默认为空，显示历史搜索和热门搜索
				searching: false, // 默认不显示搜索结果
				loading: false, 
				searchResults: [], 
				page: 1, 
				pageSize: 10, 
				hasMore: false, 
				totalResults: 0,
				timer: null,
				searchHistory: [] // 初始为空数组
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
					// 模拟搜索延迟
					await new Promise(resolve => setTimeout(resolve, 300));
					
					// 使用与图片一致的模拟数据
					const mockData = {
						list: [
							{
								id: 'pxdb001',
								name: '郫县豆瓣酱',
								categoryName: '食品类',
								description: '四川省成都市郫都区特产，川菜的灵魂调料之一',
								province: '四川省',
								viewCount: 8600
							},
							{
								id: 'hnds001',
								name: '湖南豆豉',
								categoryName: '食品类',
								description: '湖南地区常见调味品，由黑豆发酵制成',
								province: '湖南省',
								viewCount: 5200
							},
							{
								id: 'lgm001',
								name: '老干妈辣椒酱',
								categoryName: '食品类',
								description: '贵州省贵阳市特产，以油辣椒为主料的复合调味料',
								province: '贵州省',
								viewCount: 12000
							}
						],
						total: 3,
						page: 1,
						pageSize: 10
					};
					
					this.searchResults = mockData.list;
					this.totalResults = mockData.total;
					this.hasMore = false; // 设置为false，显示"没有更多结果了"
					
					// 保存到搜索历史
					this.saveSearchHistory(this.searchKeyword);
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
					// 模拟加载延迟
					await new Promise(resolve => setTimeout(resolve, 500));
					
					// 模拟没有更多数据
					this.hasMore = false;
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
			
			// 清除当前搜索
			clearSearch() {
				this.searchKeyword = '';
				this.searching = false;
				this.searchResults = [];
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
			},
			
			// 使用历史关键词
			useHistoryKeyword(keyword) {
				this.searchKeyword = keyword;
				this.doSearch();
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
					this.searchHistory = []; // 发生错误时设为空数组
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
			
			// 清除历史搜索
			clearHistory() {
				uni.showModal({
					title: '提示',
					content: '确定要清除所有搜索历史吗？',
					success: (res) => {
						if (res.confirm) {
							this.searchHistory = [];
							uni.removeStorageSync('searchHistory'); // 从本地存储中移除
							uni.showToast({
								title: '已清除搜索历史',
								icon: 'none'
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
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
}

.search-header {
    position: sticky;
    top: 0;
    z-index: 10;
}

.scrollable-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
}

.search-bar {
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 历史搜索样式 */
.history-section {
    padding: 16px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.section-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.clear-btn {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
}

.tag-container {
    display: flex;
    flex-wrap: wrap;
}

.history-tag {
    background-color: #F0ECE6;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 12px;
    color: #666666;
    margin-right: 8px;
    margin-bottom: 8px;
    display: inline-block;
}

.history-tag:active {
    background-color: #E6E0D9;
}

/* 搜索结果样式 */
.search-result {
    border-radius: 12px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.search-result:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

/* 加载更多按钮样式优化 */
.load-more-btn {
    transition: all 0.2s ease;
}

.load-more-btn:active {
    background-color: #f3f4f6;
    transform: scale(0.98);
}

/* Tailwind 类实现 */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.bg-white { background-color: white; }
.bg-\[\#F0ECE6\] { background-color: #F0ECE6; }
.bg-\[\#F8F5F1\] { background-color: #F8F5F1; }
.bg-gray-200 { background-color: #e5e7eb; }
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-medium { font-weight: 500; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.pt-10 { padding-top: 2.5rem; }
.pb-3 { padding-bottom: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mr-1 { margin-right: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }
.ml-2 { margin-left: 0.5rem; }
.ml-3 { margin-left: 0.75rem; }
.mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
.mx-1\.5 { margin-left: 0.375rem; margin-right: 0.375rem; }
.w-8 { width: 2rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.h-3 { height: 0.75rem; }
.h-8 { height: 2rem; }
.h-16 { height: 4rem; }
.h-20 { height: 5rem; }
.w-px { width: 1px; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }
.border { border-width: 1px; }
.border-gray-200 { border-color: #e5e7eb; }
.bg-gray-300 { background-color: #d1d5db; }
.inline-block { display: inline-block; }
.flex-1 { flex: 1 1 0%; }
.object-cover { object-fit: cover; }
.opacity-70 { opacity: 0.7; }
.text-center { text-align: center; }
.outline-none { outline: 2px solid transparent; outline-offset: 2px; }
.bg-transparent { background-color: transparent; }
</style> 