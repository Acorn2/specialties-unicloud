<template>
	<view class="map-app-container">
		<!-- 顶部标题栏 -->
		<view class="top-nav-bar map-gradient">
			<view class="status-bar"></view>
			<view class="nav-header">
				<view class="back-button" @tap="navigateBack">
					<uni-icons type="left" size="22" color="#FFFFFF"></uni-icons>
				</view>
				<text class="nav-title">特产地图</text>
				<view class="placeholder-view"></view> <!-- For centering title -->
			</view>
		</view>

		<!-- 筛选区域 -->
		<view class="filters-container">
			<!-- 区域选择 -->
			<view class="region-filter-bar">
				<scroll-view scroll-x class="filter-scroll-view hide-scrollbar" show-scrollbar="false">
					<view class="filter-pill" :class="{active: currentRegion === region.id}"
						v-for="region in regions" :key="region.id" @tap="selectRegion(region)">
						{{ region.name }}
					</view>
					<view class="filter-pill" @tap="openMoreRegionsModal" :class="{active: isMoreRegionActive}">
						<uni-icons type="more-filled" size="14" :color="isMoreRegionActive ? '#FFF' : '#666'" v-if="!selectedMoreRegionName"></uni-icons>
						{{ selectedMoreRegionName || '更多' }}
					</view>
				</scroll-view>
			</view>

			<!-- 省份选择器 -->
			<view class="province-selector">
				<view class="province-selector-header">
					<text class="current-province-label">当前省份</text>
					<view class="view-all-provinces" @tap="openProvinceModal">
						<text>查看全部省份</text>
						<uni-icons type="right" size="12" color="#D83931"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-x class="province-scroll-view hide-scrollbar" show-scrollbar="false">
					<button class="province-btn" :class="{active: currentProvince.id === prov.id}"
						v-for="prov in currentRegionProvinces" :key="prov.id" @tap="selectProvince(prov)">
						{{ prov.name }}
					</button>
				</scroll-view>
			</view>
		</view>
		
		<!-- 特产分类选择 -->
		<view class="category-filter-container">
			<view class="category-header">
				<text class="category-title">特产分类</text>
				<view class="toggle-view-btn" @tap="toggleCategoryView">
					<text>{{ categoryViewType === 'grid' ? '列表视图' : '网格视图' }}</text>
					<uni-icons :type="categoryViewType === 'grid' ? 'list' : 'bars'" size="16" color="#D83931" class="ml-1"></uni-icons>
				</view>
			</view>

			<!-- 网格视图 -->
			<view v-if="categoryViewType === 'grid'" class="category-grid-view">
				<view class="category-grid-item" :class="{active: currentCategory.id === cat.id}"
					v-for="cat in commonCategories" :key="cat.id" @tap="selectCategory(cat)">
					<view class="cat-icon-wrapper" :style="{backgroundColor: cat.id === currentCategory.id ? cat.activeIconBgColor : cat.iconBgColor}">
						<uni-icons custom-prefix="custom-icon" :type="cat.icon" size="22" :color="cat.id === currentCategory.id ? cat.activeIconColor : cat.iconColor"></uni-icons>
					</view>
					<text class="cat-name">{{ cat.name }}</text>
				</view>
				<view class="category-grid-item" @tap="openCategoryModal">
					<view class="cat-icon-wrapper" style="background-color: #f0f0f0;">
						<uni-icons type="more-filled" size="22" color="#666"></uni-icons>
					</view>
					<text class="cat-name">更多</text>
				</view>
			</view>

			<!-- 列表视图 -->
			<view v-if="categoryViewType === 'list'" class="category-list-view">
				<scroll-view scroll-x class="hide-scrollbar" show-scrollbar="false">
					<button class="list-category-btn" :class="{active: currentCategory.id === cat.id}"
						v-for="cat in allCategories" :key="cat.id" @tap="selectCategory(cat)">
						{{ cat.name }}
					</button>
				</scroll-view>
			</view>
		</view>

		<!-- 可滚动主体内容 -->
		<scroll-view scroll-y class="main-scrollable-content">
			<!-- 地图容器 -->
			<view class="map-display-container">
				<!-- 
				  uni-app 地图组件集成说明:
				  您需要在此处集成适合uni-app的地图组件，例如 uCharts (qiun-data-charts) 或通过 web-view 嵌入 ECharts。
				  下面的 <view id="mapPlaceholder"> 仅为占位。
				  您需要获取或生成对应省份的GeoJSON数据，并传递给地图组件。
				  地图组件应能显示省份边界、市级区域，并支持标记特产点。
				-->
				<view id="mapPlaceholder" class="echarts-map-placeholder">
					<text>地图组件占位符</text>
					<text v-if="currentProvince.name">当前省份: {{ currentProvince.name }}</text>
					 <!-- TODO: Integrate uni-app map component here (e.g., uCharts) -->
					 <!-- Example with uCharts (pseudo-code):
					 <qiun-data-charts type="map" :opts="mapOpts" :chartData="mapChartData" />
					 -->
				</view>
			</view>

			<!-- 当前省份特产列表 -->
			<view class="specialty-list-section">
				<view class="list-header">
					<text class="list-title">{{ currentProvince.name }}特产</text>
					<text class="list-count">共{{ filteredSpecialties.length }}种特产</text>
				</view>
				<view v-if="loadingSpecialties" class="loading-state">加载中...</view>
				<view v-if="!loadingSpecialties && filteredSpecialties.length === 0" class="empty-state">暂无特产</view>
				<view class="specialty-items-wrapper space-y-3">
					<view class="specialty-item card" v-for="item in filteredSpecialties" :key="item.id" @tap="navigateToSpecialtyDetail(item.id)">
						<image :src="item.image" mode="aspectFill" class="item-image"></image>
						<view class="item-info">
							<view class="item-header">
								<text class="item-name">{{ item.name }}</text>
								<text class="item-city">{{ item.city }}</text>
							</view>
							<view class="item-tags">
								<text class="specialty-tag" :style="{backgroundColor: getCategoryTagColor(item.categoryCode).bg, color: getCategoryTagColor(item.categoryCode).text}">
									<uni-icons custom-prefix="custom-icon" :type="getCategoryTagColor(item.categoryCode).icon" size="10" :color="getCategoryTagColor(item.categoryCode).text" style="margin-right: 2px;"></uni-icons>
									{{ getCategoryName(item.categoryCode) }}
								</text>
							</view>
							<text class="item-description">{{ item.description }}</text>
						</view>
					</view>
				</view>
				<view v-if="!loadingSpecialties && hasMoreSpecialties" class="load-more-btn" @tap="loadMoreSpecialties">
					加载更多特产 <uni-icons type="bottom" size="14" color="#666"></uni-icons>
				</view>
			</view>
		</scroll-view>

		<!-- 省份选择模态框 -->
		<uni-popup ref="provinceModal" type="bottom" background-color="#FFF" border-radius="10px 10px 0 0">
			<view class="modal-container">
				<view class="modal-header">
					<text class="modal-title">选择省份</text>
					<uni-icons type="closeempty" size="20" color="#999" @tap="closeProvinceModal"></uni-icons>
				</view>
				<scroll-view scroll-y class="modal-scroll-content">
					<view v-for="regionGroup in groupedProvinces" :key="regionGroup.regionName" class="province-group">
						<text class="region-group-title">{{ regionGroup.regionName }}</text>
						<view class="province-grid">
							<button class="province-grid-btn" :class="{active: currentProvince.id === prov.id}"
								v-for="prov in regionGroup.provinces" :key="prov.id" @tap="selectProvinceFromModal(prov)">
								{{ prov.name }}
							</button>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<!-- 更多区域选择模态框 -->
		<uni-popup ref="moreRegionsModal" type="bottom" background-color="#FFF" border-radius="10px 10px 0 0">
			 <view class="modal-container">
				<view class="modal-header">
					<text class="modal-title">选择区域</text>
					<uni-icons type="closeempty" size="20" color="#999" @tap="$refs.moreRegionsModal.close()"></uni-icons>
				</view>
				<view class="region-modal-list">
					<view class="region-modal-item" :class="{active: currentRegion.id === region.id}" v-for="region in moreRegions" :key="region.id" @tap="selectMoreRegion(region)">
						{{region.name}}
					</view>
				</view>
			 </view>
		</uni-popup>


		<!-- 分类选择模态框 -->
		<uni-popup ref="categoryModal" type="bottom" background-color="#FFF" border-radius="10px 10px 0 0">
			<view class="modal-container">
				<view class="modal-header">
					<text class="modal-title">全部分类</text>
					<uni-icons type="closeempty" size="20" color="#999" @tap="closeCategoryModal"></uni-icons>
				</view>
				<scroll-view scroll-y class="modal-scroll-content">
					<view class="category-modal-grid">
						<view class="category-modal-item" :class="{active: currentCategory.id === cat.id}"
							v-for="cat in allCategories" :key="cat.id" @tap="selectCategoryFromModal(cat)">
							<view class="cat-icon-wrapper-lg" :style="{backgroundColor: cat.id === currentCategory.id ? cat.activeIconBgColor : cat.iconBgColor}">
								<uni-icons custom-prefix="custom-icon" :type="cat.icon" size="28" :color="cat.id === currentCategory.id ? cat.activeIconColor : cat.iconColor"></uni-icons>
							</view>
							<text class="cat-name">{{ cat.name }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
// 模拟的分类颜色和图标，实际项目中您可能需要更完善的映射
const categoryStyleMapping = {
    'all': { name: '全部', bg: '#D839311A', text: '#D83931', icon: 'map-pin-ellipse' }, // Placeholder
    'food': { name: '主食', bg: '#F7C87333', text: '#F7C873', icon: 'medal' }, // Placeholder
    'snack': { name: '小吃', bg: '#58D68D33', text: '#58D68D', icon: 'gift' }, // Placeholder
    'dessert': { name: '零食', bg: '#E74C3C33', text: '#E74C3C', icon: 'pyramid' }, // Placeholder
    'material': { name: '副食', bg: '#9B59B633', text: '#9B59B6', icon: 'flag' }, // Placeholder
	  'alcohol': { name: '烟酒', bg: '#7F8C8D33', text: '#7F8C8D', icon: 'settings' },
    'tea': { name: '茶叶', bg: '#1ABC9C33', text: '#1ABC9C', icon: 'paperplane' },
    'drink': { name: '饮料', bg: '#3498DB33', text: '#3498DB', icon: 'color' },
    'fruit': { name: '水果', bg: '#2ECC7133', text: '#2ECC71', icon: 'hand-up' },
    'vegetable': { name: '蔬菜', bg: '#16A08533', text: '#16A085', icon: 'star' },
    'seafood': { name: '水产海鲜', bg: '#0E6EAE33', text: '#0E6EAE', icon: 'refresh' },
    'craft': { name: '工艺品', bg: '#8E44AD33', text: '#8E44AD', icon: 'smallcircle' },
    'medicine': { name: '药材', bg: '#D3540033', text: '#D35400', icon: 'staff' },
    'flower': { name: '花卉', bg: '#27AE6033', text: '#27AE60', icon: 'vip' },
    // Add other categories as needed
};


export default {
	data() {
		return {
			regions: [ // 区域数据应该从云函数获取
				{ id: 'huadong', name: '华东' },
				{ id: 'huanan', name: '华南' },
				{ id: 'huazhong', name: '华中' },
				{ id: 'huabei', name: '华北' },
				{ id: 'xinan', name: '西南' },
			],
			moreRegions: [ // 更多区域
				{ id: 'dongbei', name: '东北' },
				{ id: 'xibei', name: '西北' },
				{ id: 'gangaotai', name: '港澳台' },
			],
			selectedMoreRegionName: '',
			isMoreRegionActive: false,
			allProvinces: [], // 所有省份数据，从云函数获取
			currentRegion: { id: 'huazhong', name: '华中' }, // 默认选中区域
			currentProvince: { id: 'hubei', name: '湖北' }, // 默认省份，应从云函数获取或URL参数
			
			commonCategories: [ // 常用分类，从云函数获取
				{ id: 'all', name: '全部', icon: 'map-pin-ellipse', iconColor: '#D83931', iconBgColor: '#D839311A', activeIconColor: '#FFF', activeIconBgColor: '#D83931' },
				{ id: 'food', name: '主食', icon: 'medal', iconColor: '#F7C873', iconBgColor: '#F7C8731A', activeIconColor: '#FFF', activeIconBgColor: '#F7C873' },
				{ id: 'snack', name: '小吃', icon: 'gift', iconColor: '#58D68D', iconBgColor: '#58D68D1A', activeIconColor: '#FFF', activeIconBgColor: '#58D68D' },
				{ id: 'dessert', name: '零食', icon: 'pyramid', iconColor: '#E74C3C', iconBgColor: '#E74C3C1A', activeIconColor: '#FFF', activeIconBgColor: '#E74C3C'  },
			],
			allCategories: [], // 所有分类，从云函数获取
			currentCategory: { id: 'all', name: '全部' },
			categoryViewType: 'grid', // 'grid' or 'list'
			
			specialties: [], // 当前省份的所有特产
			filteredSpecialties: [], // 根据分类筛选后的特产
			loadingSpecialties: false,
			hasMoreSpecialties: false, // 用于分页加载
			specialtyPage: 1,
			specialtyPageSize: 10,

			mapOpts: {}, // ECharts map options
			mapChartData: {}, // ECharts map data
		};
	},
	computed: {
		currentRegionProvinces() {
			// 根据当前选中区域筛选省份列表，应从 allProvinces 中处理
			// This is a simplified version. Real logic would filter allProvinces.
			if (this.currentRegion.id === 'hubei_region_placeholder') { // Example
				return this.allProvinces.filter(p => p.regionId === this.currentRegion.id);
			}
			// For now, return a few common ones or related to Hubei if currentRegion is '华中'
			if (this.currentRegion.id === 'huazhong') {
				return this.allProvinces.filter(p => ['湖北', '湖南', '河南'].includes(p.name)).slice(0, 6);
			}
			return this.allProvinces.filter(p => p.regionId === this.currentRegion.id).slice(0,6); // Placeholder
		},
		groupedProvinces() {
			// 将 allProvinces 按区域分组，用于省份选择模态框
			const groups = {};
			this.allProvinces.forEach(prov => {
				const regionName = this.regions.find(r => r.id === prov.regionId)?.name || this.moreRegions.find(r => r.id === prov.regionId)?.name || '其他';
				if (!groups[regionName]) {
					groups[regionName] = { regionName, provinces: [] };
				}
				groups[regionName].provinces.push(prov);
			});
			return Object.values(groups);
		}
	},
	onLoad(options) {
		if (options && options.province) {
			// 根据URL参数设置当前省份，需要查找省份对象
			const foundProvince = this.allProvinces.find(p => p.id === options.province) || this.allProvinces.find(p => p.name === options.province);
			if(foundProvince) this.currentProvince = foundProvince;
			else this.currentProvince = { id: options.province, name: options.province }; // Fallback
		}
		this.fetchInitialData();
	},
	methods: {
		async fetchInitialData() {
			uni.showLoading({ title: '加载中...' });
			try {
				// const res = await uniCloud.callFunction({
				// 	name: 'map',
				// 	data: { action: 'getMapPageData' }
				// });
				// Mock data for now
				const res = { result: { code: 0, data: {
					regions: [ { id: 'huadong', name: '华东' }, { id: 'huanan', name: '华南' }, { id: 'huazhong', name: '华中' }, { id: 'huabei', name: '华北' }, { id: 'xinan', name: '西南' } ],
					moreRegions: [ { id: 'dongbei', name: '东北' }, { id: 'xibei', name: '西北' }, { id: 'gangaotai', name: '港澳台' }],
					allProvinces: [
						{ id: 'hubei', name: '湖北', regionId: 'huazhong', geoCode: '420000' }, { id: 'hunan', name: '湖南', regionId: 'huazhong' }, { id: 'henan', name: '河南', regionId: 'huazhong' },
						{ id: 'guangdong', name: '广东', regionId: 'huanan' }, { id: 'guangxi', name: '广西', regionId: 'huanan' },
						{ id: 'sichuan', name: '四川', regionId: 'xinan' }, { id: 'yunnan', name: '云南', regionId: 'xinan' },
                        { id: 'zhejiang', name: '浙江', regionId: 'huadong'}, { id: 'jiangsu', name: '江苏', regionId: 'huadong'}
					],
					allCategories: [
						{ id: 'all', name: '全部', icon: 'map-pin-ellipse', iconColor: '#D83931', iconBgColor: '#D839311A', activeIconColor: '#FFF', activeIconBgColor: '#D83931' },
						{ id: 'food', name: '主食', icon: 'medal', iconColor: '#F7C873', iconBgColor: '#F7C8731A', activeIconColor: '#FFF', activeIconBgColor: '#F7C873' },
						{ id: 'material', name: '副食', icon: 'flag', iconColor: '#9B59B6', iconBgColor: '#9B59B61A', activeIconColor: '#FFF', activeIconBgColor: '#9B59B6'},
						{ id: 'snack', name: '小吃', icon: 'gift', iconColor: '#58D68D', iconBgColor: '#58D68D1A', activeIconColor: '#FFF', activeIconBgColor: '#58D68D' },
						{ id: 'dessert', name: '零食', icon: 'pyramid', iconColor: '#E74C3C', iconBgColor: '#E74C3C1A', activeIconColor: '#FFF', activeIconBgColor: '#E74C3C'  },
						{ id: 'alcohol', name: '烟酒', icon: 'settings', iconColor: '#7F8C8D', iconBgColor: '#7F8C8D1A', activeIconColor: '#FFF', activeIconBgColor: '#7F8C8D' },
						{ id: 'tea', name: '茶叶', icon: 'paperplane', iconColor: '#1ABC9C', iconBgColor: '#1ABC9C1A', activeIconColor: '#FFF', activeIconBgColor: '#1ABC9C' },
					],
				}}};

				if (res.result && res.result.code === 0) {
					this.regions = res.result.data.regions;
					this.moreRegions = res.result.data.moreRegions;
					this.allProvinces = res.result.data.allProvinces;
					this.allCategories = res.result.data.allCategories;
					this.commonCategories = this.allCategories.slice(0, 4); // First 4 as common
					this.commonCategories.unshift(this.allCategories.find(c => c.id === 'all')); // Ensure 'All' is first

					// Set default currentProvince if not set by onLoad options, or find full object
                    const defaultProv = this.allProvinces.find(p => p.id === this.currentProvince.id || p.name === this.currentProvince.name);
                    if (defaultProv) {
                        this.currentProvince = defaultProv;
                        const regionOfProv = this.regions.find(r => r.id === defaultProv.regionId) || this.moreRegions.find(r => r.id === defaultProv.regionId);
                        if(regionOfProv) this.currentRegion = regionOfProv;
												if(this.moreRegions.some(r => r.id === defaultProv.regionId)) {
                            this.selectedMoreRegionName = regionOfProv.name;
                            this.isMoreRegionActive = true;
                        } else {
                            this.selectedMoreRegionName = '';
                            this.isMoreRegionActive = false;
                        }
                    }


					this.fetchSpecialtiesByFilter();
					// this.initMap(); // Call your map initialization
				} else {
					uni.showToast({ title: res.result.msg || '数据加载失败', icon: 'none' });
				}
			} catch (e) {
				console.error("fetchInitialData error:", e);
				uni.showToast({ title: '网络请求失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		},
		async fetchSpecialtiesByFilter(loadMore = false) {
			this.loadingSpecialties = true;
			if (!loadMore) {
				this.specialtyPage = 1;
				this.specialties = [];
				this.filteredSpecialties = [];
			}
			
			// uni.showLoading({title: '加载特产...'});
			try {
				// const res = await uniCloud.callFunction({
				// 	name: 'map',
				// 	data: { 
				// 		action: 'getSpecialtiesByFilter',
				// 		provinceId: this.currentProvince.id,
				// 		categoryId: this.currentCategory.id,
				// 		page: this.specialtyPage,
				// 		pageSize: this.specialtyPageSize
				// 	}
				// });

				// Mock Data
				const mockAllSpecialties = [
					{id: 'hb001', name: '武昌鱼', province: '湖北', city: '武汉', categoryCode: 'food', description: '肉质鲜嫩，营养丰富', image: 'https://images.unsplash.com/photo-1534766471485-18e1e52bee8c?h=90&w=90', location: {lng: 114.30, lat: 30.59}},
					{id: 'hb002', name: '热干面', province: '湖北', city: '武汉', categoryCode: 'food', description: '武汉名小吃，香、咸、辣', image: 'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?h=90&w=90', location: {lng: 114.28, lat: 30.58}},
					{id: 'hb003', name: '鄂州莲藕', province: '湖北', city: '鄂州', categoryCode: 'vegetable', description: '肉质细嫩，色白如玉', image: 'https://images.unsplash.com/photo-1544467468-9ad659372f66?h=90&w=90', location: {lng: 114.89, lat: 30.38}},
					{id: 'gd001', name: '沙糖桔', province: '广东', city: '江门', categoryCode: 'fruit', description: '皮薄汁多、甜酸适口', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?h=90&w=90', location: {lng: 113.08, lat: 22.57}},
				];
				let items = mockAllSpecialties.filter(s => s.province === this.currentProvince.name);
				if (this.currentCategory.id !== 'all') {
					items = items.filter(s => s.categoryCode === this.currentCategory.id);
				}
				const paginatedItems = items.slice((this.specialtyPage - 1) * this.specialtyPageSize, this.specialtyPage * this.specialtyPageSize);
				const res = {result: {code: 0, data: { list: paginatedItems, hasMore: items.length > this.specialtyPage * this.specialtyPageSize }}};
				// End Mock Data

				if (res.result && res.result.code === 0) {
					if (loadMore) {
						this.filteredSpecialties = [...this.filteredSpecialties, ...res.result.data.list];
					} else {
						this.filteredSpecialties = res.result.data.list;
					}
					this.hasMoreSpecialties = res.result.data.hasMore;
					// Update map markers if map is integrated
				} else {
					uni.showToast({ title: res.result.msg || '加载特产失败', icon: 'none' });
				}
			} catch (e) {
				console.error("fetchSpecialtiesByFilter error:", e);
				uni.showToast({ title: '网络请求失败', icon: 'none' });
			} finally {
				this.loadingSpecialties = false;
				// uni.hideLoading();
			}
		},
		loadMoreSpecialties() {
			if (this.hasMoreSpecialties && !this.loadingSpecialties) {
				this.specialtyPage++;
				this.fetchSpecialtiesByFilter(true);
			}
		},
		selectRegion(region) {
			this.currentRegion = region;
			this.selectedMoreRegionName = '';
			this.isMoreRegionActive = false;
			// 默认选中该区域的第一个省份
			const firstProvinceInRegion = this.allProvinces.find(p => p.regionId === region.id);
			if (firstProvinceInRegion) {
				this.selectProvince(firstProvinceInRegion);
			}
		},
		openMoreRegionsModal() {
			this.$refs.moreRegionsModal.open();
		},
		selectMoreRegion(region) {
			this.currentRegion = region; // Technically 'moreRegion' acts as a region now
			this.selectedMoreRegionName = region.name;
			this.isMoreRegionActive = true;
			this.$refs.moreRegionsModal.close();
			const firstProvinceInMoreRegion = this.allProvinces.find(p => p.regionId === region.id);
			if (firstProvinceInMoreRegion) {
				this.selectProvince(firstProvinceInMoreRegion);
			}
		},
		selectProvince(province) {
			if (this.currentProvince.id !== province.id) {
				this.currentProvince = province;
				this.fetchSpecialtiesByFilter();
				// this.updateMapForProvince(province); // Update map display
			}
		},
		selectProvinceFromModal(province) {
			this.selectProvince(province);
			// Also update currentRegion if the province belongs to a different active region
			const regionOfProv = this.regions.find(r => r.id === province.regionId) || this.moreRegions.find(r => r.id === province.regionId);
			if(regionOfProv && regionOfProv.id !== this.currentRegion.id){
				this.currentRegion = regionOfProv;
				if(this.moreRegions.some(r => r.id === province.regionId)) {
					this.selectedMoreRegionName = regionOfProv.name;
					this.isMoreRegionActive = true;
				} else {
					this.selectedMoreRegionName = '';
					this.isMoreRegionActive = false;
				}
			}
			this.closeProvinceModal();
		},
		selectCategory(category) {
			if (this.currentCategory.id !== category.id) {
				this.currentCategory = category;
				this.fetchSpecialtiesByFilter();
			}
		},
		selectCategoryFromModal(category) {
			this.selectCategory(category);
			this.closeCategoryModal();
		},
		getCategoryTagColor(categoryCode) {
            return categoryStyleMapping[categoryCode] || { bg: '#CCCCCC33', text: '#666666', icon: 'circle' };
        },
        getCategoryName(categoryCode) {
            const cat = this.allCategories.find(c => c.id === categoryCode);
            return cat ? cat.name : categoryCode;
        },
		toggleCategoryView() {
			this.categoryViewType = this.categoryViewType === 'grid' ? 'list' : 'grid';
		},
		openProvinceModal() { this.$refs.provinceModal.open(); },
		closeProvinceModal() { this.$refs.provinceModal.close(); },
		openCategoryModal() { this.$refs.categoryModal.open(); },
		closeCategoryModal() { this.$refs.categoryModal.close(); },
		navigateBack() { uni.navigateBack(); },
		navigateToSpecialtyDetail(id) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${id}` }); // Assume detail page exists
		},
		initMap() {
			// Placeholder for ECharts map initialization
			// You would get GeoJSON for this.currentProvince.geoCode (e.g., '420000' for Hubei)
			// And then use it with your chosen map component.
			console.log("Map initialization for province:", this.currentProvince.name);
			// Example: this.mapChartData = { series: [{ map: this.currentProvince.name, data: [...] }] };
			// Add markers for this.filteredSpecialties
		},
		updateMapForProvince(province) {
			// Placeholder for updating map when province changes
			console.log("Updating map for province:", province.name);
			// Re-fetch GeoJSON if necessary, update map series and markers
			// this.initMap();
		}
	},
	watch: {
		currentProvince(newVal, oldVal) {
			if (newVal && oldVal && newVal.id !== oldVal.id) {
				// this.initMap(); // Re-initialize or update map
			}
		}
	}
};
</script>

<style lang="scss">
// Import FontAwesome or use uni-icons for custom icons if needed
// @import "@/static/custom-icons.css"; 

.map-app-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #F8F5F1; // Body background
}

.map-gradient {
	background: linear-gradient(135deg, #D83931, #A82825);
}

.status-bar {
	height: var(--status-bar-height);
	width: 100%;
}

.top-nav-bar {
	.nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx; // 44px
		padding: 0 30rpx;
		.back-button {
			width: 50rpx;
		}
		.nav-title {
			font-size: 36rpx; // 18px
			font-weight: bold;
			color: white;
		}
		.placeholder-view {
			width: 50rpx;
		}
	}
}

.filters-container {
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx; // Space before map/list
}

.region-filter-bar {
	padding: 20rpx 30rpx 10rpx;
	border-bottom: 1rpx solid #f0f0f0;
	.filter-scroll-view {
		white-space: nowrap;
		.filter-pill {
			display: inline-block;
			padding: 12rpx 24rpx;
			border-radius: 32rpx; // 16px
			font-size: 24rpx; // 12px
			background-color: #F0ECE6;
			color: #666666;
			margin-right: 16rpx;
			transition: all 0.3s ease;
			&.active {
				background-color: #D83931;
				color: white;
			}
		}
	}
}

.province-selector {
	padding: 20rpx 30rpx;
	.province-selector-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
		.current-province-label {
			font-size: 24rpx; // 12px
			color: #999;
		}
		.view-all-provinces {
			display: flex;
			align-items: center;
			font-size: 24rpx; // 12px
			color: #D83931;
			text {
				margin-right: 4rpx;
			}
		}
	}
	.province-scroll-view {
		white-space: nowrap;
		padding-bottom: 10rpx; // For scrollbar space if visible
		.province-btn {
			display: inline-block;
			padding: 12rpx 20rpx;
			border-radius: 32rpx; // 16px
			font-size: 24rpx; // 12px
			background-color: white;
			color: #333;
			box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
			margin-right: 16rpx;
			border: 1rpx solid #eee;
			transition: all 0.3s ease;
			&:last-child {
				margin-right: 0;
			}
			&.active {
				background-color: #D83931;
				color: white;
				border-color: #D83931;
			}
		}
	}
}

.category-filter-container {
	background-color: #FFFFFF;
	padding: 20rpx 30rpx;
	margin-bottom: 20rpx;
	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		.category-title {
			font-size: 28rpx; // 14px
			font-weight: 500;
			color: #333;
		}
		.toggle-view-btn {
			display: flex;
			align-items: center;
			font-size: 24rpx; // 12px
			color: #D83931;
			.ml-1 { margin-left: 4rpx; }
		}
	}
	.category-grid-view {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 16rpx; // ~8px
		.category-grid-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10rpx 0;
			border-radius: 16rpx; // 8px
			transition: background-color 0.2s;
			&.active { // Style for active category
				// background-color: #F0ECE6; 
			}
			.cat-icon-wrapper {
				width: 72rpx; // 36px
				height: 72rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 8rpx;
			}
			.cat-name {
				font-size: 20rpx; // 10px
				color: #666;
			}
			&.active .cat-name {
				color: #333;
				font-weight: 500;
			}
		}
	}
	.category-list-view {
		.list-category-btn {
			display: inline-block;
			padding: 10rpx 20rpx;
			border-radius: 28rpx; // 14px
			font-size: 24rpx; // 12px
			background-color: #F0ECE6;
			color: #666;
			margin-right: 16rpx;
			margin-bottom: 16rpx;
			transition: all 0.3s ease;
			&.active {
				background-color: #D83931;
				color: white;
			}
		}
	}
}

.main-scrollable-content {
	flex: 1;
	height: 0; // Important for flex item to scroll
}

.map-display-container {
	margin: 0 30rpx 30rpx;
	border-radius: 24rpx; // 12px
	overflow: hidden;
	border: 1rpx solid #e0e0e0;
	.echarts-map-placeholder {
		width: 100%;
		height: 500rpx; // 250px - adjust as needed
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #999;
		font-size: 28rpx;
	}
}

.specialty-list-section {
	padding: 0 30rpx 30rpx;
	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		.list-title {
			font-size: 32rpx; // 16px
			font-weight: bold;
			color: #333;
		}
		.list-count {
			font-size: 24rpx; // 12px
			color: #999;
		}
	}
	.loading-state, .empty-state {
		text-align: center;
		color: #999;
		padding: 40rpx 0;
	}
	.specialty-items-wrapper {
		.specialty-item {
			background-color: white;
			padding: 20rpx;
			display: flex;
			align-items: flex-start; // Align items to the start for better text flow
			border-radius: 24rpx; // 12px
			box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
			.item-image {
				width: 140rpx; // 70px
				height: 140rpx;
				border-radius: 16rpx; // 8px
				margin-right: 20rpx;
				flex-shrink: 0;
			}
			.item-info {
				flex: 1;
				min-width: 0; // Prevent overflow issues with flex
				.item-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 8rpx;
					.item-name {
						font-size: 28rpx; // 14px
						font-weight: 500;
						color: #333;
						// Ellipsis for long names
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-right: 10rpx;
					}
					.item-city {
						font-size: 22rpx; // 11px
						color: #999;
						flex-shrink: 0;
					}
				}
				.item-tags {
					margin-bottom: 8rpx;
					.specialty-tag {
						display: inline-flex;
						align-items: center;
						padding: 4rpx 12rpx;
						border-radius: 20rpx; // 10px
						font-size: 20rpx; // 10px
						margin-right: 8rpx;
						margin-bottom: 8rpx;
					}
				}
				.item-description {
					font-size: 24rpx; // 12px
					color: #666;
					line-height: 1.4;
					// Multi-line ellipsis
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
	.load-more-btn {
		text-align: center;
		font-size: 26rpx; // 13px
		color: #666;
		padding: 20rpx;
		margin-top: 20rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 40rpx; // 20px
		background-color: #fff;
	}
}

// Modal styles
.modal-container {
	padding: 30rpx;
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		.modal-title {
			font-size: 32rpx; // 16px
			font-weight: bold;
		}
	}
	.modal-scroll-content {
		max-height: 60vh; // Limit modal height
	}
}
.region-modal-list {
    .region-modal-item {
        padding: 24rpx 10rpx;
        font-size: 28rpx;
        border-bottom: 1rpx solid #f0f0f0;
        &:last-child {
            border-bottom: none;
        }
        &.active {
            color: #D83931;
            font-weight: bold;
        }
    }
}

.province-group {
	margin-bottom: 30rpx;
	.region-group-title {
		font-size: 26rpx; // 13px
		color: #999;
		margin-bottom: 16rpx; // 8px
		display: block;
	}
	.province-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16rpx; // ~8px
		.province-grid-btn {
			padding: 16rpx 8rpx;
			border-radius: 16rpx; // 8px
			font-size: 26rpx; // 13px
			background-color: #F0ECE6;
			color: #333;
			text-align: center;
			&.active {
				background-color: #D83931;
				color: white;
			}
		}
	}
}

.category-modal-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx; // ~10px
	.category-modal-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 10rpx;
		border-radius: 16rpx; // 8px
		&.active {
			// background-color: #F0ECE6;
		}
		.cat-icon-wrapper-lg {
			width: 96rpx; // 48px
			height: 96rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 8rpx;
		}
		.cat-name {
			font-size: 24rpx; // 12px
			color: #666;
		}
		&.active .cat-name {
			color: #333;
			font-weight: 500;
		}
	}
}

.hide-scrollbar::-webkit-scrollbar { display: none; width: 0 !important; height: 0 !important; -webkit-appearance: none; background: transparent; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.card:active { transform: scale(0.98); } // Generic active state
.filter-pill:active, .province-btn:active, .list-category-btn:active, .category-grid-item:active, .province-grid-btn:active, .category-modal-item:active {
	opacity: 0.8;
}

.ml-1 { margin-left: 4rpx; }
.space-y-3 > view + view { margin-top: 20rpx; } // Simplified version of space-y-3

</style> 