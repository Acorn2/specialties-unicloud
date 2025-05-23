<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="brand-gradient">
			<view class="flex items-center px-4 py-3">
				<view @tap="goBack" class="text-white mr-3">
					<text class="fas fa-arrow-left text-lg"></text>
				</view>
				<text class="text-lg font-bold text-white flex-1">热门目的地</text>
			</view>
			
			<view class="px-4 pb-3">
				<view class="flex search-bar bg-white p-2.5 items-center">
					<text class="fas fa-search text-gray-400 mx-2"></text>
					<input type="text" placeholder="搜索目的地..." class="flex-1 outline-none text-sm" v-model="searchKeyword" @input="onSearchInput">
				</view>
			</view>
		</view>
		
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 筛选标签 -->
			<view class="px-4 pt-4 pb-2 overflow-x-auto">
				<scroll-view scroll-x="true" class="whitespace-nowrap" show-scrollbar="false">
					<view class="flex space-x-2 whitespace-nowrap">
						<view v-for="(region, index) in regions" :key="index" 
							class="tag" :class="{'active': selectedRegion === region.code}" 
							@tap="selectRegion(region.code)">
							{{region.name}}
						</view>
					</view>
				</scroll-view>
			</view>
			
			<!-- 省市切换 -->
			<view class="px-4 mt-5 mb-5">
				<view class="flex space-x-3 bg-gray-100 rounded-lg p-2">
					<view 
						class="flex-1 py-2 px-3 rounded-lg text-center" 
						:class="currentTab === 'province' ? 'bg-white text-red-500 font-medium shadow-sm' : 'text-gray-600'"
						@tap="switchTab('province')">
						省份
					</view>
					<view 
						class="flex-1 py-2 px-3 rounded-lg text-center" 
						:class="currentTab === 'city' ? 'bg-white text-red-500 font-medium shadow-sm' : 'text-gray-600'"
						@tap="switchTab('city')">
						城市
					</view>
				</view>
			</view>
			
			<!-- 省份展示区域 -->
			<view v-if="currentTab === 'province'" class="px-4 mb-20">
				<view class="flex justify-between items-center mb-3">
					<text class="text-lg font-bold">{{selectedRegion === 'all' ? '全部省份' : regionNameMap[selectedRegion] + '省份'}}</text>
					<text v-if="filteredProvinces.length > 0" class="text-xs text-gray-500">共{{filteredProvinces.length}}个省份</text>
				</view>
				
				<view v-if="filteredProvinces.length > 0" class="grid grid-cols-2 gap-3">
					<view 
						v-for="(province, index) in filteredProvinces" 
						:key="index" 
						class="destination-card destination-md"
						@tap="navigateToMapSpecialty(province.code)">
						<image :src="province.image" mode="aspectFill" class="w-full h-full"></image>
						<view class="destination-name">{{province.name}}</view>
						<view class="destination-count">{{province.specialtyCount}}个特产</view>
					</view>
				</view>
				
				<view v-else class="flex justify-center items-center py-10">
					<text class="text-gray-500">暂无数据</text>
				</view>
			</view>
			
			<!-- 城市展示区域 -->
			<view v-if="currentTab === 'city'" class="px-4 mb-20">
				<view class="flex justify-between items-center mb-3">
					<text class="text-lg font-bold">城市特产</text>
					<text v-if="filteredCities.length > 0" class="text-xs text-gray-500">共{{filteredCities.length}}个城市</text>
				</view>
				
				<view v-if="filteredCities.length > 0" class="space-y-3">
					<view 
						v-for="(city, index) in filteredCities" 
						:key="index" 
						class="card p-3 flex items-center"
						@tap="navigateToMapSpecialty(city.code, true)">
						<image :src="city.image" mode="aspectFill" class="w-16 h-16 object-cover rounded-lg"></image>
						<view class="ml-3 flex-1">
							<view class="flex items-center justify-between">
								<text class="font-medium">{{city.name}}</text>
								<view class="text-xs text-red-500 flex items-center">
									<text>{{city.specialtyCount}}个特产</text>
									<text class="fas fa-chevron-right ml-1"></text>
								</view>
							</view>
							<text class="text-xs text-gray-500 mt-1">{{city.provinceName}}</text>
							<view class="flex flex-wrap mt-1">
								<view 
									v-for="(tag, tagIndex) in city.tags" 
									:key="tagIndex" 
									class="text-xs rounded px-1.5 py-0.5 mr-1 mb-1"
									:style="{
										backgroundColor: getTagColor(tag).bgColor,
										color: getTagColor(tag).textColor
									}">
									{{tag}}
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view v-else class="flex justify-center items-center py-10">
					<text class="text-gray-500">暂无数据</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTab: 'city', // 默认显示城市标签
				selectedRegion: 'all', // 默认选择全部区域
				searchKeyword: '', // 搜索关键词
				regions: [
					{ name: '全部', code: 'all' },
					{ name: '华东', code: 'east' },
					{ name: '华南', code: 'south' },
					{ name: '华中', code: 'central' },
					{ name: '华北', code: 'north' },
					{ name: '西南', code: 'southwest' },
					{ name: '西北', code: 'northwest' },
					{ name: '东北', code: 'northeast' }
				],
				regionNameMap: {
					'all': '全部',
					'east': '华东',
					'south': '华南',
					'central': '华中',
					'north': '华北',
					'southwest': '西南',
					'northwest': '西北',
					'northeast': '东北'
				},
				tagColors: {
					'川菜': { bgColor: '#F7C873', textColor: '#8B5000' },
					'火锅': { bgColor: '#58D68D', textColor: '#1D6640' },
					'小吃': { bgColor: '#9B59B6', textColor: '#FFFFFF' },
					'茶叶': { bgColor: '#F7C873', textColor: '#8B5000' },
					'丝绸': { bgColor: '#58D68D', textColor: '#1D6640' },
					'点心': { bgColor: '#9B59B6', textColor: '#FFFFFF' },
					'粤菜': { bgColor: '#F7C873', textColor: '#8B5000' },
					'药材': { bgColor: '#9B59B6', textColor: '#FFFFFF' },
					'其他': { bgColor: '#3498DB', textColor: '#FFFFFF' }
				},
				provinces: [], // 省份数据
				cities: [] // 城市数据
			};
		},
		computed: {
			// 根据区域筛选省份
			filteredProvinces() {
				let filtered = this.provinces;
				
				// 区域筛选
				if (this.selectedRegion !== 'all') {
					filtered = filtered.filter(province => province.region === this.selectedRegion);
				}
				
				// 关键字搜索
				if (this.searchKeyword.trim()) {
					const keyword = this.searchKeyword.trim().toLowerCase();
					filtered = filtered.filter(province => 
						province.name.toLowerCase().includes(keyword) || 
						province.pinyin.toLowerCase().includes(keyword)
					);
				}
				
				return filtered;
			},
			
			// 根据区域筛选城市
			filteredCities() {
				let filtered = this.cities;
				
				// 区域筛选
				if (this.selectedRegion !== 'all') {
					filtered = filtered.filter(city => city.region === this.selectedRegion);
				}
				
				// 关键字搜索
				if (this.searchKeyword.trim()) {
					const keyword = this.searchKeyword.trim().toLowerCase();
					filtered = filtered.filter(city => 
						city.name.toLowerCase().includes(keyword) || 
						city.pinyin.toLowerCase().includes(keyword) || 
						city.provinceName.toLowerCase().includes(keyword)
					);
				}
				
				return filtered;
			}
		},
		onLoad() {
			// 加载数据
			this.loadDestinationData();
		},
		methods: {
			// 加载目的地数据
			async loadDestinationData() {
				try {
					uni.showLoading({
						title: '加载中...'
					});
					
					const { data: res } = await this.$cloud.callFunction({
						name: 'destination',
						data: {
							action: 'getDestinations'
						}
					});
					
					if (res.code === 0) {
						this.provinces = res.data.provinces;
						this.cities = res.data.cities;
					} else {
						uni.showToast({
							title: res.msg || '获取数据失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('获取目的地数据失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			
			// 切换省市标签
			switchTab(tab) {
				this.currentTab = tab;
			},
			
			// 选择区域
			selectRegion(region) {
				this.selectedRegion = region;
			},
			
			// 搜索输入
			onSearchInput(e) {
				this.searchKeyword = e.detail.value;
			},
			
			// 获取标签颜色
			getTagColor(tag) {
				return this.tagColors[tag] || { bgColor: '#3498DB', textColor: '#FFFFFF' };
			},
			
			// 导航到地图特产页面
			navigateToMapSpecialty(code, isCity = false) {
				const params = isCity ? `city=${code}` : `province=${code}`;
				uni.navigateTo({
					url: `/pages/map-specialty/map-specialty?${params}`
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

.brand-gradient {
	background: linear-gradient(135deg, #D83931, #A82825);
	position: sticky;
	top: 0;
	z-index: 10;
}

.scrollable-content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
}

.search-bar {
	border-radius: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tag {
	display: inline-block;
	padding: 6px 12px;
	border-radius: 16px;
	font-size: 13px;
	margin-right: 8px;
	margin-bottom: 8px;
	background-color: #F0ECE6;
	color: #666666;
	transition: all 0.2s ease;
}

.tag.active {
	background-color: #D83931;
	color: white;
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

.destination-card {
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
	position: relative;
	margin-bottom: 8px;
	
	&:active {
		transform: scale(0.98);
	}
}

.destination-md {
	height: 130px;
}

.destination-name {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 8px;
	background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
	color: white;
	font-weight: 600;
	border-bottom-left-radius: 16px;
	border-bottom-right-radius: 16px;
}

.destination-count {
	position: absolute;
	top: 8px;
	right: 8px;
	background: rgba(216, 57, 49, 0.8);
	color: white;
	padding: 2px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: bold;
}
</style>