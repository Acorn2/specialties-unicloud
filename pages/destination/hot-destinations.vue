<template>
	<view class="app-container">
		<!-- 顶部导航栏 -->
		<view class="sticky top-0 z-10 brand-gradient">
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
			<view class="px-4 pt-4 pb-2 overflow-x-auto hide-scrollbar">
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
			<view v-if="currentTab === 'province'" class="px-4 mb-20" id="provinceSection">
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
			<view v-if="currentTab === 'city'" class="px-4 mb-20" id="citySection">
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
					'面食': { bgColor: '#F7C873', textColor: '#8B5000' },
					'肉类': { bgColor: '#E74C3C', textColor: '#FFFFFF' },
					'海鲜': { bgColor: '#3498DB', textColor: '#FFFFFF' },
					'啤酒': { bgColor: '#7F8C8D', textColor: '#FFFFFF' },
					'鲜花': { bgColor: '#27AE60', textColor: '#FFFFFF' },
					'云锦': { bgColor: '#8E44AD', textColor: '#FFFFFF' },
					'烤鸭': { bgColor: '#E74C3C', textColor: '#FFFFFF' },
					'宫廷菜': { bgColor: '#F7C873', textColor: '#8B5000' },
					'热干面': { bgColor: '#F7C873', textColor: '#8B5000' },
					'鲜食': { bgColor: '#58D68D', textColor: '#1D6640' },
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
					
					// 使用模拟数据
					const res = this.getMockDestinationData();
					
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
			
			// 模拟数据方法
			getMockDestinationData() {
				// 模拟省份数据
				const provinces = [
					{
						code: 'guangdong',
						name: '广东省',
						pinyin: 'guangdong',
						region: 'south',
						specialtyCount: 98,
						image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'zhejiang',
						name: '浙江省',
						pinyin: 'zhejiang',
						region: 'east',
						specialtyCount: 92,
						image: 'https://images.unsplash.com/photo-1529883406927-7de37457a0cf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1MzgyODY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'shandong',
						name: '山东省',
						pinyin: 'shandong',
						region: 'east',
						specialtyCount: 87,
						image: 'https://images.unsplash.com/photo-1558637845-c8b7ead71a3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgzNDE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'jiangsu',
						name: '江苏省',
						pinyin: 'jiangsu',
						region: 'east',
						specialtyCount: 81,
						image: 'https://images.unsplash.com/photo-1553210126-a39e0bdfd4a5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1MzgzNzU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'fujian',
						name: '福建省',
						pinyin: 'fujian',
						region: 'east',
						specialtyCount: 75,
						image: 'https://images.unsplash.com/photo-1517309230475-6736d926b979?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1Mzg0MDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'anhui',
						name: '安徽省',
						pinyin: 'anhui',
						region: 'east',
						specialtyCount: 69,
						image: 'https://images.unsplash.com/photo-1510332981392-36692ea3a195?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1Mzg0MzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'hubei',
						name: '湖北省',
						pinyin: 'hubei',
						region: 'central',
						specialtyCount: 76,
						image: 'https://images.unsplash.com/photo-1522547902298-51566e4fb383?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1Mzg0MzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					},
					{
						code: 'hunan',
						name: '湖南省',
						pinyin: 'hunan',
						region: 'central',
						specialtyCount: 72,
						image: 'https://images.unsplash.com/photo-1522547902298-51566e4fb383?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1Mzg0MzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
					}
				];
				
				// 模拟城市数据
				const cities = [
					{
						code: 'chengdu',
						name: '成都市',
						pinyin: 'chengdu',
						provinceCode: 'sichuan',
						provinceName: '四川省',
						region: 'southwest',
						specialtyCount: 56,
						tags: ['川菜', '火锅', '小吃'],
						image: 'https://images.unsplash.com/photo-1542190891-2093d38760f2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg0ODE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
					},
					{
						code: 'hangzhou',
						name: '杭州市',
						pinyin: 'hangzhou',
						provinceCode: 'zhejiang',
						provinceName: '浙江省',
						region: 'east',
						specialtyCount: 48,
						tags: ['茶叶', '丝绸', '点心'],
						image: 'https://images.unsplash.com/photo-1517309230475-6736d926b979?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg1NTI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
					},
					{
						code: 'guangzhou',
						name: '广州市',
						pinyin: 'guangzhou',
						provinceCode: 'guangdong',
						provinceName: '广东省',
						region: 'south',
						specialtyCount: 42,
						tags: ['粤菜', '点心', '药材'],
						image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2MjA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
					}
				];
				
				return {
					code: 0,
					msg: '获取成功',
					data: {
						provinces,
						cities
					}
				};
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

<style>
body {
    font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
    background-color: #F8F5F1;
    color: #333333;
    margin: 0;
    padding: 0;
}

.app-container {
    max-width: 750rpx;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #FFFFFF;
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

.brand-gradient {
    background: linear-gradient(135deg, #D83931, #A82825);
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

.search-bar {
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.destination-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    margin-bottom: 8px;
}

.destination-card:active {
    transform: scale(0.98);
}

.destination-card image {
    object-fit: cover;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
}

.destination-card:active image {
    transform: scale(1.05);
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

.destination-md {
    height: 130px;
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

.tag:active {
    transform: scale(0.95);
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    scrollbar-width: none;
}

/* 顶部固定样式 */
.sticky {
    position: sticky;
    top: 0;
    z-index: 10;
}

.top-0 {
    top: 0;
}

.z-10 {
    z-index: 10;
}

/* 间距样式 */
.px-4 {
    padding-left: 16px;
    padding-right: 16px;
}

.py-3 {
    padding-top: 12px;
    padding-bottom: 12px;
}

.pb-3 {
    padding-bottom: 12px;
}

.pt-4 {
    padding-top: 16px;
}

.pb-2 {
    padding-bottom: 8px;
}

.mt-5 {
    margin-top: 20px;
}

.mb-5 {
    margin-bottom: 20px;
}

.mb-3 {
    margin-bottom: 12px;
}

.mb-20 {
    margin-bottom: 80px;
}

.mr-3 {
    margin-right: 12px;
}

.ml-3 {
    margin-left: 12px;
}

.ml-1 {
    margin-left: 4px;
}

.mt-1 {
    margin-top: 4px;
}

.mr-1 {
    margin-right: 4px;
}

.mb-1 {
    margin-bottom: 4px;
}

/* 弹性布局 */
.flex {
    display: flex;
}

.flex-1 {
    flex: 1;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.justify-center {
    justify-content: center;
}

.flex-wrap {
    flex-wrap: wrap;
}

.space-x-2 > view:not(:first-child) {
    margin-left: 8px;
}

.space-x-3 > view:not(:first-child) {
    margin-left: 12px;
}

.space-y-3 > view:not(:first-child) {
    margin-top: 12px;
}

/* 文本样式 */
.text-lg {
    font-size: 18px;
}

.text-sm {
    font-size: 14px;
}

.text-xs {
    font-size: 12px;
}

.font-bold {
    font-weight: 700;
}

.font-medium {
    font-weight: 500;
}

.text-white {
    color: #FFFFFF;
}

.text-gray-400 {
    color: #9CA3AF;
}

.text-gray-500 {
    color: #6B7280;
}

.text-gray-600 {
    color: #4B5563;
}

.text-red-500 {
    color: #D83931;
}

/* 背景色 */
.bg-white {
    background-color: #FFFFFF;
}

.bg-gray-100 {
    background-color: #F3F4F6;
}

/* 边框样式 */
.rounded-lg {
    border-radius: 8px;
}

/* 阴影 */
.shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 宽度和高度 */
.w-full {
    width: 100%;
}

.h-full {
    height: 100%;
}

.w-16 {
    width: 64px;
}

.h-16 {
    height: 64px;
}

/* 对象适应 */
.object-cover {
    object-fit: cover;
}

/* 显示相关 */
.whitespace-nowrap {
    white-space: nowrap;
}

/* 网格布局 */
.grid {
    display: grid;
}

.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-3 {
    gap: 12px;
}

/* 内边距 */
.p-2 {
    padding: 8px;
}

.p-2\.5 {
    padding: 10px;
}

.p-3 {
    padding: 12px;
}

.py-2 {
    padding-top: 8px;
    padding-bottom: 8px;
}

.py-10 {
    padding-top: 40px;
    padding-bottom: 40px;
}

.px-1\.5 {
    padding-left: 6px;
    padding-right: 6px;
}

.px-3 {
    padding-left: 12px;
    padding-right: 12px;
}

.py-0\.5 {
    padding-top: 2px;
    padding-bottom: 2px;
}

/* 外边距 */
.mx-2 {
    margin-left: 8px;
    margin-right: 8px;
}

/* 溢出处理 */
.overflow-x-auto {
    overflow-x: auto;
}

.outline-none {
    outline: none;
}
</style>