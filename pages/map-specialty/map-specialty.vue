<template>
	<view class="app-container">
		
		<!-- 省份选择栏 -->
		<view class="bg-white border-b border-gray-100">
			<!-- 区域选择标签 -->
			<view class="px-4 pt-3 pb-2">
				<scroll-view scroll-x="true" class="flex overflow-x-auto hide-scrollbar pb-1" show-scrollbar="false">
					<view 
						v-for="(region, index) in regions" 
						:key="index"
						class="filter-pill" 
						:class="{'active': currentRegion === region.id}"
						@tap="selectRegion(region.id)">
						{{region.name}}
					</view>
					<view class="filter-pill" :class="{'active': isMoreRegionActive}" @tap="toggleMoreRegionsDropdown">
						<text class="fas fa-ellipsis mr-1" v-if="!selectedMoreRegionName"></text>
						{{selectedMoreRegionName || '更多'}}
					</view>
				</scroll-view>
			</view>
			
			<!-- 省份选择器 -->
			<view class="p-3 border-t border-gray-100">
				<view class="flex justify-between mb-2">
					<text class="text-xs text-gray-500">当前省份</text>
					<view class="text-xs text-red flex items-center" @tap="openProvinceModal">
						查看全部省份 <text class="fas fa-chevron-right ml-1"></text>
					</view>
				</view>
				<scroll-view scroll-x="true" class="flex whitespace-nowrap py-1" show-scrollbar="false">
					<button 
						v-for="(province, index) in currentRegionProvinces" 
						:key="index"
						class="province-btn" 
						:class="{'active': currentProvince === province.id}"
						@tap="selectProvince(province.id)">
						{{province.name}}
					</button>
				</scroll-view>
			</view>
		</view>
		
		<!-- 更多区域下拉菜单 (默认隐藏) -->
		<view v-if="showMoreRegionsDropdown" class="region-dropdown">
			<view 
				v-for="(region, index) in moreRegions" 
				:key="index"
				class="region-dropdown-item" 
				@tap="selectMoreRegion(region)">
				{{region.name}}
			</view>
		</view>
		
		<!-- 特产分类选择方案 -->
		<view class="bg-white mb-3">
			<view class="px-4 pt-3">
				<view class="flex justify-between items-center mb-2">
					<text class="text-sm font-medium">特产分类</text>
					<view class="text-xs text-red" @tap="toggleCategoryView">
						<text id="viewTypeText">{{categoryViewType === 'grid' ? '列表视图' : '网格视图'}}</text> 
						<text :class="['fas', categoryViewType === 'grid' ? 'fa-bars' : 'fa-th', 'ml-1']"></text>
					</view>
				</view>
				
				<!-- 网格视图 -->
				<view v-if="categoryViewType === 'grid'" class="mb-3">
					<!-- 常用分类 -->
					<view class="grid grid-cols-5 gap-2 mb-2">
						<view 
							v-for="(category, index) in commonCategories" 
							:key="index"
							class="category-btn" 
							:class="{'active': currentCategory === category.id}"
							@tap="selectCategory(category.id)">
							<view class="category-icon" :style="{backgroundColor: category.iconBgColor}">
								<text :class="['fas', category.icon]" :style="{color: category.iconColor}"></text>
							</view>
							<text class="cat-name">{{category.name}}</text>
						</view>
						
						<view class="category-btn" @tap="openCategoryModal">
							<view class="category-icon" style="background-color: rgba(149, 165, 166, 0.1);">
								<text class="fas fa-ellipsis text-gray-500"></text>
							</view>
							<text class="cat-name">更多</text>
						</view>
					</view>
				</view>
				
				<!-- 列表视图 -->
				<view v-if="categoryViewType === 'list'" class="mb-3">
					<scroll-view scroll-x="true" class="flex flex-wrap" show-scrollbar="false">
						<button 
							v-for="(category, index) in allCategories" 
							:key="index"
							class="list-category-btn" 
							:class="{'active': currentCategory === category.id}"
							@tap="selectCategory(category.id)">
							{{category.name}}
						</button>
					</scroll-view>
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 中国地图 - ECharts 地图 -->
			<view class="map-container mb-4">
				<view id="mapContainer" class="w-full h-full"></view>
			</view>
			
			<!-- 当前省份特产列表 -->
			<view class="px-4">
				<view class="flex justify-between items-center mb-3">
					<text class="text-base font-bold">{{currentProvinceName}}特产</text>
					<text class="text-xs text-gray-500">共{{filteredSpecialties.length}}种特产</text>
				</view>
				
				<view class="space-y-3 mb-4">
					<view 
						v-for="(item, index) in filteredSpecialties" 
						:key="index"
						class="card p-3 flex items-start"
						@tap="navigateToSpecialtyDetail(item.id)">
						<image :src="item.image" mode="aspectFill" class="w-16 h-16 object-cover rounded-lg flex-shrink-0"></image>
						<view class="ml-3 flex-1">
							<view class="flex items-center justify-between">
								<text class="font-medium text-sm">{{item.name}}</text>
								<text class="text-xs text-gray-500">{{item.city}}</text>
							</view>
							<view class="flex flex-wrap mt-1">
								<text class="specialty-tag" :style="{
									backgroundColor: getCategoryTagColor(item.categoryCode).bg, 
									color: getCategoryTagColor(item.categoryCode).text
								}">
									<text :class="['fas', getCategoryTagColor(item.categoryCode).icon]"></text>
									{{getCategoryName(item.categoryCode)}}
								</text>
							</view>
							<text class="text-xs text-gray-600 mt-1">{{item.description}}</text>
						</view>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view class="text-center" v-if="hasMoreSpecialties">
					<button class="text-sm text-gray-600 px-4 py-2 rounded-full border border-gray-200" @tap="loadMoreSpecialties">
						加载更多特产 <text class="fas fa-chevron-down ml-1"></text>
					</button>
				</view>
			</view>
		</scroll-view>
		
		<!-- 省份选择模态框 (默认隐藏) -->
		<uni-popup ref="provinceModal" type="bottom" background-color="#FFF" border-radius="10px 10px 0 0">
			<view class="modal-container">
				<view class="p-4 border-b border-gray-100">
					<view class="flex justify-between items-center">
						<text class="font-bold">选择省份</text>
						<view @tap="closeProvinceModal" class="p-1">
							<text class="fas fa-times text-gray-500"></text>
						</view>
					</view>
				</view>
				
				<!-- 区域分组的省份列表 -->
				<scroll-view scroll-y="true" class="p-4 modal-content">
					<view v-for="(regionGroup, index) in groupedProvinces" :key="index" class="mb-4">
						<text class="text-sm text-gray-500 mb-2 block">{{regionGroup.regionName}}</text>
						<view class="grid grid-cols-4 gap-2">
							<button 
								v-for="(province, pIndex) in regionGroup.provinces" 
								:key="pIndex"
								class="province-grid-btn" 
								:class="{'active': currentProvince === province.id}"
								@tap="selectProvinceFromModal(province)">
								{{province.name}}
							</button>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<!-- 更多分类模态框 (默认隐藏) -->
		<uni-popup ref="categoryModal" type="bottom" background-color="#FFF" border-radius="10px 10px 0 0">
			<view class="modal-container">
				<view class="p-4 border-b border-gray-100">
					<view class="flex justify-between items-center">
						<text class="font-bold">全部分类</text>
						<view @tap="closeCategoryModal" class="p-1">
							<text class="fas fa-times text-gray-500"></text>
						</view>
					</view>
				</view>
				
				<scroll-view scroll-y="true" class="p-4 grid grid-cols-4 gap-3 modal-content">
					<view 
						v-for="(category, index) in allCategories" 
						:key="index"
						class="category-modal-btn" 
						:class="{'active': currentCategory === category.id}"
						@tap="selectCategoryFromModal(category.id)">
						<view class="category-icon-lg" :style="{backgroundColor: category.iconBgColor}">
							<text :class="['fas', category.icon]" :style="{color: category.iconColor}"></text>
						</view>
						<text class="cat-modal-name">{{category.name}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
// 按需引入
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts';
import { 
	TooltipComponent, 
	VisualMapComponent, 
	GridComponent, 
	TitleComponent,
	MarkPointComponent,
	GeoComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必要的组件
echarts.use([
	MapChart, 
	TooltipComponent, 
	VisualMapComponent, 
	GridComponent, 
	TitleComponent, 
	MarkPointComponent,
	GeoComponent,
	CanvasRenderer
]);

export default {
	data() {
		return {
			// 区域数据
			regions: [
				{ id: 'huadong', name: '华东' },
				{ id: 'huanan', name: '华南' },
				{ id: 'huazhong', name: '华中' },
				{ id: 'huabei', name: '华北' },
				{ id: 'xinan', name: '西南' }
			],
			moreRegions: [
				{ id: 'dongbei', name: '东北' },
				{ id: 'xibei', name: '西北' },
				{ id: 'gangaotai', name: '港澳台' }
			],
			// 当前选中的区域和省份
			currentRegion: 'huazhong',
			currentProvince: 'hubei',
			currentProvinceName: '湖北省',
			selectedMoreRegionName: '',
			isMoreRegionActive: false,
			showMoreRegionsDropdown: false,
			
			// 省份数据
			allProvinces: [
				{ id: 'hubei', name: '湖北', regionId: 'huazhong', geoCode: '420000', center: [112.29, 30.98] },
				{ id: 'hunan', name: '湖南', regionId: 'huazhong' },
				{ id: 'henan', name: '河南', regionId: 'huazhong' },
				{ id: 'guangdong', name: '广东', regionId: 'huanan', geoCode: '440000', center: [113.28, 23.13] },
				{ id: 'guangxi', name: '广西', regionId: 'huanan' },
				{ id: 'sichuan', name: '四川', regionId: 'xinan', geoCode: '510000', center: [102.71, 30.65] },
				{ id: 'yunnan', name: '云南', regionId: 'xinan' },
				{ id: 'zhejiang', name: '浙江', regionId: 'huadong' },
				{ id: 'jiangsu', name: '江苏', regionId: 'huadong' },
				{ id: 'shanghai', name: '上海', regionId: 'huadong' },
				{ id: 'anhui', name: '安徽', regionId: 'huadong' },
				{ id: 'fujian', name: '福建', regionId: 'huadong' },
				{ id: 'jiangxi', name: '江西', regionId: 'huadong' },
				{ id: 'shandong', name: '山东', regionId: 'huadong' },
				{ id: 'beijing', name: '北京', regionId: 'huabei' },
				{ id: 'tianjin', name: '天津', regionId: 'huabei' },
				{ id: 'hebei', name: '河北', regionId: 'huabei' },
				{ id: 'shanxi', name: '山西', regionId: 'huabei' },
				{ id: 'neimenggu', name: '内蒙古', regionId: 'huabei' },
				{ id: 'chongqing', name: '重庆', regionId: 'xinan' },
				{ id: 'guizhou', name: '贵州', regionId: 'xinan' },
				{ id: 'xizang', name: '西藏', regionId: 'xinan' },
				{ id: 'liaoning', name: '辽宁', regionId: 'dongbei' },
				{ id: 'jilin', name: '吉林', regionId: 'dongbei' },
				{ id: 'heilongjiang', name: '黑龙江', regionId: 'dongbei' },
				{ id: 'shaanxi', name: '陕西', regionId: 'xibei' },
				{ id: 'gansu', name: '甘肃', regionId: 'xibei' },
				{ id: 'qinghai', name: '青海', regionId: 'xibei' },
				{ id: 'ningxia', name: '宁夏', regionId: 'xibei' },
				{ id: 'xinjiang', name: '新疆', regionId: 'xibei' },
				{ id: 'hainan', name: '海南', regionId: 'huanan' },
				{ id: 'xianggang', name: '香港', regionId: 'gangaotai' },
				{ id: 'aomen', name: '澳门', regionId: 'gangaotai' },
				{ id: 'taiwan', name: '台湾', regionId: 'gangaotai' }
			],
			
			// 分类数据
			commonCategories: [
				{ id: 'all', name: '全部', icon: 'fa-th-large', iconColor: '#D83931', iconBgColor: 'rgba(216, 57, 49, 0.1)' },
				{ id: 'food', name: '主食', icon: 'fa-bowl-rice', iconColor: '#F7C873', iconBgColor: 'rgba(247, 200, 115, 0.1)' },
				{ id: 'snack', name: '小吃', icon: 'fa-cookie', iconColor: '#58D68D', iconBgColor: 'rgba(88, 214, 141, 0.1)' },
				{ id: 'dessert', name: '零食', icon: 'fa-candy-bar', iconColor: '#E74C3C', iconBgColor: 'rgba(231, 76, 60, 0.1)' }
			],
			allCategories: [
				{ id: 'all', name: '全部', icon: 'fa-th-large', iconColor: '#D83931', iconBgColor: 'rgba(216, 57, 49, 0.1)' },
				{ id: 'food', name: '主食', icon: 'fa-bowl-rice', iconColor: '#F7C873', iconBgColor: 'rgba(247, 200, 115, 0.1)' },
				{ id: 'material', name: '副食', icon: 'fa-jar', iconColor: '#9B59B6', iconBgColor: 'rgba(155, 89, 182, 0.1)' },
				{ id: 'snack', name: '小吃', icon: 'fa-cookie', iconColor: '#58D68D', iconBgColor: 'rgba(88, 214, 141, 0.1)' },
				{ id: 'dessert', name: '零食', icon: 'fa-candy-bar', iconColor: '#E74C3C', iconBgColor: 'rgba(231, 76, 60, 0.1)' },
				{ id: 'alcohol', name: '烟酒', icon: 'fa-wine-bottle', iconColor: '#7F8C8D', iconBgColor: 'rgba(127, 140, 141, 0.1)' },
				{ id: 'tea', name: '茶叶', icon: 'fa-mug-hot', iconColor: '#1ABC9C', iconBgColor: 'rgba(26, 188, 156, 0.1)' },
				{ id: 'drink', name: '饮料', icon: 'fa-glass', iconColor: '#3498DB', iconBgColor: 'rgba(52, 152, 219, 0.1)' },
				{ id: 'fruit', name: '水果', icon: 'fa-apple-whole', iconColor: '#2ECC71', iconBgColor: 'rgba(46, 204, 113, 0.1)' },
				{ id: 'vegetable', name: '蔬菜', icon: 'fa-carrot', iconColor: '#16A085', iconBgColor: 'rgba(22, 160, 133, 0.1)' },
				{ id: 'seafood', name: '水产海鲜', icon: 'fa-fish', iconColor: '#0E6EAE', iconBgColor: 'rgba(14, 110, 174, 0.1)' },
				{ id: 'craft', name: '工艺品', icon: 'fa-scissors', iconColor: '#8E44AD', iconBgColor: 'rgba(142, 68, 173, 0.1)' },
				{ id: 'medicine', name: '药材', icon: 'fa-mortar-pestle', iconColor: '#D35400', iconBgColor: 'rgba(211, 84, 0, 0.1)' },
				{ id: 'flower', name: '花卉', icon: 'fa-seedling', iconColor: '#27AE60', iconBgColor: 'rgba(39, 174, 96, 0.1)' }
			],
			currentCategory: 'all',
			categoryViewType: 'grid', // 'grid' 或 'list'
			
			// 特产数据
			specialties: [],
			filteredSpecialties: [],
			specialtyPage: 1,
			specialtyPageSize: 10,
			hasMoreSpecialties: false,
			
			// 地图相关
			myChart: null,
			currentMapName: '420000', // 默认湖北省地图编码
			specialtyMarkers: [],
			mapCenter: { lat: 30.98, lng: 112.29 }, // 默认湖北中心
			mapMarkers: [],
			mapError: null
		};
	},
	computed: {
		// 当前区域的省份
		currentRegionProvinces() {
			return this.allProvinces.filter(p => p.regionId === this.currentRegion);
		},
		// 按区域分组的省份
		groupedProvinces() {
			const groups = {};
			
			// 添加主要区域
			this.regions.forEach(region => {
				groups[region.id] = {
					regionName: region.name,
					provinces: this.allProvinces.filter(p => p.regionId === region.id)
				};
			});
			
			// 添加更多区域
			this.moreRegions.forEach(region => {
				groups[region.id] = {
					regionName: region.name,
					provinces: this.allProvinces.filter(p => p.regionId === region.id)
				};
			});
			
			return Object.values(groups);
		}
	},
	onLoad(options) {
		// 从URL参数获取省份
		if (options && options.province) {
			this.currentProvince = options.province;
			const province = this.allProvinces.find(p => p.id === options.province);
			if (province) {
				this.currentProvinceName = province.name + '省';
				this.currentRegion = province.regionId;
				
				// 如果是更多区域中的省份
				const moreRegion = this.moreRegions.find(r => r.id === province.regionId);
				if (moreRegion) {
					this.selectedMoreRegionName = moreRegion.name;
					this.isMoreRegionActive = true;
				}
			}
		}
		
		// 加载特产数据
		this.fetchSpecialtiesByFilter();
	},
	onReady() {
		// 初始化地图
		this.initEChartsMap();
	},
	methods: {
		// 修改初始化方法
		initEChartsMap() {
			// 清除可能存在的旧实例
			if (this.myChart) {
				this.myChart.dispose();
				this.myChart = null;
			}
			
			// 确保DOM已经渲染完成
			setTimeout(() => {
				try {
					const mapContainer = document.getElementById('mapContainer');
					if (!mapContainer) {
						console.error('找不到地图容器元素');
						return;
					}
					
					console.log('初始化地图容器尺寸:', mapContainer.offsetWidth, mapContainer.offsetHeight);
					
					// 初始化 ECharts 实例
					this.myChart = echarts.init(mapContainer);
					
					// 添加错误监听
					this.myChart.on('error', (error) => {
						console.error('ECharts 错误事件:', error);
					});
					
					// 加载省份地图
					this.loadProvinceMap(this.currentProvince);
				} catch (error) {
					console.error('初始化ECharts失败:', error);
					this.showMapError('初始化地图失败: ' + error.message);
				}
			}, 500);
		},
		
		// 修改加载地图数据方法
		async loadProvinceMap(provinceId) {
			try {
				// 获取省份信息
				const province = this.allProvinces.find(p => p.id === provinceId);
				if (!province || !province.geoCode) {
					console.error('未找到省份地图数据:', provinceId);
					this.showMapError(`未找到${provinceId}的地图数据`);
					return;
				}
				
				// 更新当前地图名称
				this.currentMapName = province.geoCode;
				
				// 直接使用简化版地图进行测试
				const simpleMapOption = {
					series: [{
						type: 'map',
						map: 'china',  // 使用内置的中国地图
						roam: true,
						label: {
							show: true
						},
						data: [
							{name: '北京', value: Math.random() * 100},
							{name: '上海', value: Math.random() * 100},
							{name: '广东', value: Math.random() * 100}
						]
					}]
				};
				
				// 先设置一个简单地图测试 ECharts 是否正常工作
				if (this.myChart) {
					console.log('设置简单地图测试');
					// this.myChart.setOption(simpleMapOption);
				}
				
				// 加载地图数据
				const geoJsonUrl = `https://geo.datav.aliyun.com/areas_v3/bound/${province.geoCode}_full.json`;
				console.log('加载地图数据URL:', geoJsonUrl);
				
				// 使用 uni.request 加载地图数据
				uni.request({
					url: geoJsonUrl,
					success: (res) => {
						try {
							const geoJsonData = res.data;
							
							if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
								console.error('地图数据格式错误:', geoJsonData);
								this.showMapError('地图数据格式错误');
								return;
							}
							
							console.log('成功加载地图数据，特征数量:', geoJsonData.features.length);
							
							// 注册地图 - 使用唯一标识符避免冲突
							const mapKey = province.geoCode + '_' + Date.now();
							console.log('注册地图:', mapKey);
							echarts.registerMap(mapKey, geoJsonData);
							
							// 渲染地图 - 确保使用相同的 mapKey
							this.renderMap(mapKey, province.geoCode);
						} catch (registerError) {
							console.error('注册地图数据失败:', registerError);
							this.showMapError('注册地图数据失败: ' + registerError.message);
						}
					},
					fail: (err) => {
						console.error(`加载${province.name}地图数据失败:`, err);
						this.showMapError(`加载${province.name}地图失败`);
					}
				});
			} catch (error) {
				console.error('loadProvinceMap 错误:', error);
				this.showMapError('加载地图失败: ' + error.message);
			}
		},
		
		// 修改渲染地图方法
		renderMap(mapKey, pid) {
			try {
				console.log('开始渲染地图:', mapKey, pid);
				
				if (!this.myChart) {
					console.error('ECharts 实例不存在');
					this.showMapError('地图组件未初始化');
					return;
				}
				
				// 获取省份名称
				const province = this.allProvinces.find(p => p.id === this.currentProvince);
				const provinceName = province ? province.name : '湖北';
				
				// 配置项 - 简化配置，减少可能的错误点
				const option = {
					series: [
						{
							name: `${provinceName}特产`,
							type: 'map',
							map: mapKey,  // 使用注册时的唯一标识符
							roam: true,
							zoom: 1.2,
							label: {
								show: true,
								fontSize: 12
							},
							itemStyle: {
								areaColor: '#dde6f3',
								borderColor: '#8abce2',
								borderWidth: 0.5
							},
							emphasis: {
								label: {
									show: true,
									fontSize: 14,
									fontWeight: 'bold'
								},
								itemStyle: {
									areaColor: '#ffc107'
								}
							},
							data: []  // 初始为空数据
						}
					]
				};
				
				console.log('设置地图选项');
				this.myChart.setOption(option, true);
				
				// 加载行政区数据
				console.log('加载行政区数据');
				uni.request({
					url: `https://geo.datav.aliyun.com/areas_v3/bound/${pid}.json`,
					success: (res) => {
						try {
							const data = res.data;
							
							// 获取子区域
							const features = data.features || [];
							const mapData = features.map(feature => {
								const properties = feature.properties || {};
								return {
									name: properties.name,
									value: Math.random() * 1000,
									id: properties.adcode
								};
							});
							
							console.log('更新地图数据，区域数量:', mapData.length);
							
							// 更新数据 - 使用 setOption 而不是直接修改 series
							this.myChart.setOption({
								series: [{
									data: mapData
								}]
							});
							
							// 绑定地图区域点击事件
							console.log('绑定地图点击事件');
							this.myChart.off('click');
							this.myChart.on('click', (params) => {
								console.log('地图点击:', params);
								// 只处理地图区域的点击
								if (params.componentType === 'series' && params.seriesType === 'map') {
									console.log("点击地图区域:", params.name);
									this.filterSpecialtiesByCity(params.name);
								}
							});
							
							// 添加特产标记点
							this.addSpecialtyMarkers();
						} catch (dataError) {
							console.error('处理行政区数据失败:', dataError);
						}
					},
					fail: (err) => {
						console.error(`加载行政区数据失败:`, err);
					}
				});
			} catch (error) {
				console.error('renderMap 错误:', error);
				this.showMapError('渲染地图失败: ' + error.message);
			}
		},
		
		// 修改添加标记点方法
		addSpecialtyMarkers() {
			try {
				console.log('添加特产标记点');
				
				// 筛选当前省份且有位置信息的特产
				const markableSpecialties = this.filteredSpecialties.filter(item => 
					item.location && item.location.lng && item.location.lat
				);
				
				console.log('可标记的特产数量:', markableSpecialties.length);
				
				if (markableSpecialties.length === 0) {
					console.log('没有可标记的特产点');
					return;
				}
				
				// 创建标记点数据
				const markPoints = markableSpecialties.map(specialty => {
					// 获取分类颜色
					const categoryInfo = this.getCategoryTagColor(specialty.categoryCode);
					
					return {
						name: specialty.name,
						coord: [specialty.location.lng, specialty.location.lat],
						value: 100,
						specialty: specialty,
						itemStyle: {
							color: categoryInfo.bg
						}
					};
				});
				
				// 添加标记点到地图 - 使用单独的 setOption 调用
				if (this.myChart) {
					console.log('设置标记点');
					this.myChart.setOption({
						series: [{
							markPoint: {
								symbol: 'pin',
								symbolSize: 30,
								itemStyle: {
									color: function(params) {
										return params.data.itemStyle?.color || '#D83931';
									}
								},
								label: {
									formatter: '{b}',
									position: 'right',
									distance: 5,
									fontSize: 10,
									color: '#000'
								},
								emphasis: {
									itemStyle: {
										borderColor: '#fff',
										borderWidth: 2
									}
								},
								data: markPoints
							}
						}]
					});
				}
			} catch (error) {
				console.error('添加标记点失败:', error);
			}
		},
		
		// 改进错误显示方法
		showMapError(message) {
			console.error('地图错误:', message);
			
			// 获取地图容器
			const mapContainer = document.getElementById('mapContainer');
			if (mapContainer) {
				mapContainer.innerHTML = `
					<div style="text-align:center; padding:20px; color:#D83931;">
						<div style="font-size:16px; margin-bottom:10px;">
							<i class="fas fa-exclamation-triangle"></i> ${message}
						</div>
						<button onclick="window.location.reload()" style="padding:5px 10px; background:#4CAF50; color:white; border:none; border-radius:4px; cursor:pointer;">
							刷新页面
						</button>
					</div>
				`;
			}
		},
		
		// 加载特产数据
		async fetchSpecialtiesByFilter(loadMore = false) {
			try {
				if (!loadMore) {
					this.specialtyPage = 1;
					this.specialties = [];
					this.filteredSpecialties = [];
				}
				
				uni.showLoading({
					title: '加载中...'
				});
				
				// 云函数调用 (暂时注释，使用模拟数据)
				/*
				const { result } = await uniCloud.callFunction({
					name: 'map',
					data: { 
						action: 'getSpecialtiesByFilter',
						provinceId: this.currentProvince,
						categoryId: this.currentCategory,
						page: this.specialtyPage,
						pageSize: this.specialtyPageSize
					}
				});
				
				if (result && result.code === 0) {
					if (loadMore) {
						this.filteredSpecialties = [...this.filteredSpecialties, ...result.data.list];
					} else {
						this.filteredSpecialties = result.data.list;
					}
					this.hasMoreSpecialties = result.data.hasMore;
					
					// 重新渲染标记点
					if (this.myChart) {
						this.addSpecialtyMarkers();
					}
				} else {
					uni.showToast({
						title: result?.msg || '获取特产数据失败',
						icon: 'none'
					});
				}
				*/
				
				// 使用模拟数据
				const mockData = this.getMockSpecialtyData();
				
				// 筛选数据
				let filtered = mockData;
				
				// 按省份筛选
				if (this.currentProvince) {
					const province = this.allProvinces.find(p => p.id === this.currentProvince);
					if (province) {
						filtered = filtered.filter(item => item.province === province.name);
					}
				}
				
				// 按分类筛选
				if (this.currentCategory && this.currentCategory !== 'all') {
					filtered = filtered.filter(item => item.categoryCode === this.currentCategory);
				}
				
				// 分页处理
				const total = filtered.length;
				const startIndex = (this.specialtyPage - 1) * this.specialtyPageSize;
				const endIndex = this.specialtyPage * this.specialtyPageSize;
				const pageItems = filtered.slice(startIndex, endIndex);
				
				// 更新数据
				if (loadMore) {
					this.filteredSpecialties = [...this.filteredSpecialties, ...pageItems];
				} else {
					this.filteredSpecialties = pageItems;
				}
				
				this.hasMoreSpecialties = endIndex < total;
				
				// 重新渲染标记点
				if (this.myChart) {
					this.addSpecialtyMarkers();
				}
				
			} catch (error) {
				console.error('fetchSpecialtiesByFilter 错误:', error);
				uni.showToast({
					title: '获取特产数据失败',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		
		// 模拟特产数据
		getMockSpecialtyData() {
			return [
				{id: 'hb001', name: '武昌鱼', province: '湖北', city: '武汉', categoryCode: 'food', description: '肉质鲜嫩，营养丰富，蛋白质含量高', image: 'https://images.unsplash.com/photo-1534766471485-18e1e52bee8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 114.305458, lat: 30.592788}},
				{id: 'hb002', name: '热干面', province: '湖北', city: '武汉', categoryCode: 'food', description: '武汉名小吃，香、咸、辣、甜，回味悠长', image: 'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 114.280938, lat: 30.589361}},
				{id: 'hb003', name: '鄂州莲藕', province: '湖北', city: '鄂州', categoryCode: 'vegetable', description: '肉质细嫩，色白如玉，风味独特', image: 'https://images.unsplash.com/photo-1544467468-9ad659372f66?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 114.894902, lat: 30.384439}},
				{id: 'hb004', name: '宜昌柑橘', province: '湖北', city: '宜昌', categoryCode: 'fruit', description: '色泽金黄，汁多味甜，果肉细嫩', image: 'https://images.unsplash.com/photo-1591183137550-fd9c8ff4a485?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 111.286958, lat: 30.691967}},
				{id: 'hb005', name: '十堰太极泉酒', province: '湖北', city: '十堰', categoryCode: 'alcohol', description: '清澈透明，醇厚爽口，回味悠长', image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 110.787969, lat: 32.649294}},
				{id: 'hb006', name: '恩施玉露茶', province: '湖北', city: '恩施', categoryCode: 'tea', description: '清香持久，滋味醇厚，叶底嫩绿', image: 'https://images.unsplash.com/photo-1582542734256-c0d3fea2500b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 109.486862, lat: 30.272156}},
				{id: 'gd001', name: '沙糖桔', province: '广东', city: '江门', categoryCode: 'fruit', description: '皮薄汁多、甜酸适口，富含维生素C', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 113.081901, lat: 22.578738}},
				{id: 'gd002', name: '新会陈皮', province: '广东', city: '江门', categoryCode: 'material', description: '药食两用，具有理气健脾、燥湿化痰功效', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 113.022739, lat: 22.458450}},
				{id: 'gd004', name: '梅州客家酿豆腐', province: '广东', city: '梅州', categoryCode: 'food', description: '外酥里嫩，香味四溢', image: 'https://images.unsplash.com/photo-1569058242272-4b99c5f3174a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 116.122673, lat: 24.288442}},
				{id: 'sc001', name: '郫县豆瓣酱', province: '四川', city: '成都', categoryCode: 'material', description: '四川郫县特产，色泽红亮，香辣浓郁，被誉为川菜的灵魂', image: 'https://images.unsplash.com/photo-1605197181726-e3bd08490ba1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90', location: {lng: 103.899169, lat: 30.810239}}
			];
		},
		
		// 根据城市筛选特产
		filterSpecialtiesByCity(cityName) {
			// 获取所有特产
			const allSpecialties = this.getMockSpecialtyData();
			
			// 筛选当前省份的特产
			const provinceSpecialties = allSpecialties.filter(item => {
				const province = this.allProvinces.find(p => p.id === this.currentProvince);
				return province && item.province === province.name;
			});
			
			// 筛选当前城市的特产
			const citySpecialties = provinceSpecialties.filter(item => 
				item.city === cityName || 
				cityName.includes(item.city) || 
				item.city.includes(cityName)
			);
			
			// 更新特产列表
			this.filteredSpecialties = citySpecialties;
			
			// 更新标题
			this.currentProvinceName = `${cityName}`;
		},
		
		// 加载更多特产
		loadMoreSpecialties() {
			if (this.hasMoreSpecialties) {
				this.specialtyPage++;
				this.fetchSpecialtiesByFilter(true);
			}
		},
		
		// 选择区域
		selectRegion(regionId) {
			this.currentRegion = regionId;
			this.isMoreRegionActive = false;
			this.selectedMoreRegionName = '';
			this.showMoreRegionsDropdown = false;
			
			// 默认选择该区域的第一个省份
			const firstProvince = this.currentRegionProvinces[0];
			if (firstProvince) {
				this.selectProvince(firstProvince.id);
			}
		},
		
		// 选择省份
		selectProvince(provinceId) {
			if (this.currentProvince !== provinceId) {
				this.currentProvince = provinceId;
				
				// 更新省份名称
				const province = this.allProvinces.find(p => p.id === provinceId);
				if (province) {
					this.currentProvinceName = province.name + '省';
					
					// 特殊处理：直辖市和特别行政区
					if (['北京', '上海', '天津', '重庆', '香港', '澳门'].includes(province.name)) {
						this.currentProvinceName = province.name;
					}
					// 自治区
					else if (['内蒙古', '广西', '西藏', '宁夏', '新疆'].includes(province.name)) {
						this.currentProvinceName = province.name + '自治区';
					}
					// 台湾
					else if (province.name === '台湾') {
						this.currentProvinceName = '台湾省';
					}
					
					// 更新地图中心点
					if (province.center) {
						this.mapCenter = { lat: province.center[1], lng: province.center[0] };
					}
				}
				
				// 重新加载地图和特产数据
				if (this.myChart) {
					this.loadProvinceMap(provinceId);
				}
				this.fetchSpecialtiesByFilter();
			}
		},
		
		// 选择更多区域
		selectMoreRegion(region) {
			this.currentRegion = region.id;
			this.selectedMoreRegionName = region.name;
			this.isMoreRegionActive = true;
			this.showMoreRegionsDropdown = false;
			
			// 默认选择该区域的第一个省份
			const firstProvince = this.allProvinces.find(p => p.regionId === region.id);
			if (firstProvince) {
				this.selectProvince(firstProvince.id);
			}
		},
		
		// 切换更多区域下拉菜单
		toggleMoreRegionsDropdown() {
			this.showMoreRegionsDropdown = !this.showMoreRegionsDropdown;
		},
		
		// 选择分类
		selectCategory(categoryId) {
			if (this.currentCategory !== categoryId) {
				this.currentCategory = categoryId;
				this.fetchSpecialtiesByFilter();
			}
		},
		
		// 切换分类视图类型
		toggleCategoryView() {
			this.categoryViewType = this.categoryViewType === 'grid' ? 'list' : 'grid';
		},
		
		// 获取分类标签颜色
		getCategoryTagColor(categoryCode) {
			const tagColors = {
				'all': { bg: 'rgba(216, 57, 49, 0.1)', text: '#D83931', icon: 'fa-th-large' },
				'food': { bg: '#F7C873', text: '#8B5000', icon: 'fa-bowl-rice' },
				'material': { bg: '#9B59B6', text: 'white', icon: 'fa-jar' },
				'snack': { bg: '#58D68D', text: '#1D6640', icon: 'fa-cookie' },
				'dessert': { bg: '#E74C3C', text: 'white', icon: 'fa-candy-bar' },
				'alcohol': { bg: '#7F8C8D', text: 'white', icon: 'fa-wine-bottle' },
				'tea': { bg: '#1ABC9C', text: 'white', icon: 'fa-mug-hot' },
				'drink': { bg: '#3498DB', text: 'white', icon: 'fa-glass' },
				'fruit': { bg: '#2ECC71', text: 'white', icon: 'fa-apple-whole' },
				'vegetable': { bg: '#16A085', text: 'white', icon: 'fa-carrot' },
				'seafood': { bg: '#0E6EAE', text: 'white', icon: 'fa-fish' },
				'craft': { bg: '#8E44AD', text: 'white', icon: 'fa-scissors' },
				'medicine': { bg: '#D35400', text: 'white', icon: 'fa-mortar-pestle' },
				'flower': { bg: '#27AE60', text: 'white', icon: 'fa-seedling' }
			};
			
			return tagColors[categoryCode] || { bg: '#CCCCCC', text: '#666666', icon: 'fa-circle' };
		},
		
		// 获取分类名称
		getCategoryName(categoryCode) {
			const category = this.allCategories.find(c => c.id === categoryCode);
			return category ? category.name : categoryCode;
		},
		
		// 从省份模态框中选择省份
		selectProvinceFromModal(province) {
			this.selectProvince(province.id);
			
			// 更新当前区域
			if (province.regionId !== this.currentRegion) {
				this.currentRegion = province.regionId;
				
				// 判断是否是更多区域
				const moreRegion = this.moreRegions.find(r => r.id === province.regionId);
				if (moreRegion) {
					this.selectedMoreRegionName = moreRegion.name;
					this.isMoreRegionActive = true;
				} else {
					this.selectedMoreRegionName = '';
					this.isMoreRegionActive = false;
				}
			}
			
			this.closeProvinceModal();
		},
		
		// 从分类模态框中选择分类
		selectCategoryFromModal(categoryId) {
			this.selectCategory(categoryId);
			this.closeCategoryModal();
		},
		
		// 打开省份模态框
		openProvinceModal() {
			this.$refs.provinceModal.open();
		},
		
		// 关闭省份模态框
		closeProvinceModal() {
			this.$refs.provinceModal.close();
		},
		
		// 打开分类模态框
		openCategoryModal() {
			this.$refs.categoryModal.open();
		},
		
		// 关闭分类模态框
		closeCategoryModal() {
			this.$refs.categoryModal.close();
		},
		
		// 导航到特产详情页
		navigateToSpecialtyDetail(id) {
			uni.navigateTo({
				url: `/pages/detail/detail?id=${id}`
			});
		},
		
		// 返回上一页
		navigateBack() {
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

.map-gradient {
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

.specialty-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    margin-right: 4px;
    margin-bottom: 4px;
    transition: all 0.3s ease;
}

.specialty-tag:active {
    transform: scale(0.95);
}

.filter-pill {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 13px;
    background-color: #F0ECE6;
    color: #666666;
    margin-right: 8px;
    transition: all 0.2s ease;
}

.filter-pill.active {
    background-color: #D83931;
    color: white;
}

.filter-pill:active {
    transform: scale(0.95);
}

.province-btn {
    padding: 6px 10px;
    border-radius: 16px;
    font-size: 12px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-right: 8px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    border: none;
}

.province-btn.active {
    background-color: #D83931;
    color: white;
}

.province-btn:active {
    transform: scale(0.95);
}

.province-grid-btn {
    padding: 8px 4px;
    border-radius: 8px;
    font-size: 13px;
    background-color: #F0ECE6;
    color: #333;
    transition: all 0.2s ease;
    border: none;
}

.province-grid-btn.active {
    background-color: #D83931;
    color: white;
}

.category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.category-btn.active {
    background-color: #F0ECE6;
}

.category-icon {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
}

.category-icon-lg {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
}

.cat-name {
    font-size: 10px;
    color: #666;
}

.cat-modal-name {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.category-btn.active .cat-name {
    color: #333;
    font-weight: 500;
}

.list-category-btn {
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    background-color: #F0ECE6;
    color: #666666;
    margin-right: 8px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
    border: none;
}

.list-category-btn.active {
    background-color: #D83931;
    color: white;
}

.category-modal-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.category-modal-btn.active {
    background-color: #F0ECE6;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.map-container {
    position: relative;
    width: 100%;
    height: 250px;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    margin: 0 30rpx;
}

#mapContainer {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
}

.region-dropdown {
    position: absolute;
    top: 110px;
    right: 16px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    overflow: hidden;
    width: 160rpx;
}

.region-dropdown-item {
    padding: 12px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
}

.region-dropdown-item:last-child {
    border-bottom: none;
}

.region-dropdown-item:active {
    background-color: #f5f5f5;
}

.modal-container {
    width: 100%;
    max-height: 70vh;
}

.modal-content {
    max-height: 60vh;
}

/* 布局辅助类 */
.flex {
    display: flex;
}

.flex-1 {
    flex: 1;
}

.items-start {
    align-items: flex-start;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.flex-wrap {
    flex-wrap: wrap;
}

/* 间距类 */
.pt-10 {
    padding-top: 40px;
}

.pb-4 {
    padding-bottom: 16px;
}

.px-4 {
    padding-left: 16px;
    padding-right: 16px;
}

.pt-3 {
    padding-top: 12px;
}

.pb-2 {
    padding-bottom: 8px;
}

.pb-1 {
    padding-bottom: 4px;
}

.p-3 {
    padding: 12px;
}

.p-4 {
    padding: 16px;
}

.p-1 {
    padding: 4px;
}

.py-1 {
    padding-top: 4px;
    padding-bottom: 4px;
}

.py-2 {
    padding-top: 8px;
    padding-bottom: 8px;
}

.px-3 {
    padding-left: 12px;
    padding-right: 12px;
}

.mb-2 {
    margin-bottom: 8px;
}

.mb-3 {
    margin-bottom: 12px;
}

.mb-4 {
    margin-bottom: 16px;
}

.mr-1 {
    margin-right: 4px;
}

.ml-1 {
    margin-left: 4px;
}

.ml-3 {
    margin-left: 12px;
}

.mt-1 {
    margin-top: 4px;
}

/* 尺寸类 */
.w-5 {
    width: 20px;
}

.w-16 {
    width: 64px;
}

.h-16 {
    height: 64px;
}

.w-full {
    width: 100%;
}

.h-full {
    height: 100%;
}

/* 边框类 */
.border-b {
    border-bottom-width: 1px;
}

.border-t {
    border-top-width: 1px;
}

.border-gray-100 {
    border-color: #f7fafc;
}

.border {
    border-width: 1px;
}

.border-gray-200 {
    border-color: #edf2f7;
}

.rounded-lg {
    border-radius: 8px;
}

.rounded-full {
    border-radius: 9999px;
}

/* 文本类 */
.text-white {
    color: #ffffff;
}

.text-lg {
    font-size: 18px;
}

.text-sm {
    font-size: 14px;
}

.text-xs {
    font-size: 12px;
}

.text-base {
    font-size: 16px;
}

.font-bold {
    font-weight: 700;
}

.font-medium {
    font-weight: 500;
}

.text-gray-500 {
    color: #718096;
}

.text-gray-600 {
    color: #4a5568;
}

.text-red {
    color: #D83931;
}

/* 背景类 */
.bg-white {
    background-color: #ffffff;
}

/* 显示类 */
.block {
    display: block;
}

.whitespace-nowrap {
    white-space: nowrap;
}

/* 网格类 */
.grid {
    display: grid;
}

.grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
}

.grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-2 {
    gap: 8px;
}

.gap-3 {
    gap: 12px;
}

/* 图片相关 */
.object-cover {
    object-fit: cover;
}

/* 间距通用类 */
.space-y-3 > view:not(:first-child) {
    margin-top: 12px;
}

/* 响应式支持 */
@media (max-width: 320px) {
    .grid-cols-5 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    
    .grid-cols-4 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* 公共状态类 */
.active {
    background-color: #D83931;
    color: white;
}

/* 修复特殊UI组件 */
/* 修复uni-popup组件样式 */
/deep/ .uni-popup .uni-popup__wrapper {
    border-radius: 16px 16px 0 0;
}

/deep/ .uni-popup .uni-popup__wrapper-bottom {
    border-radius: 16px 16px 0 0;
}
</style>