<template>
	<view class="app-container">
		<!-- 顶部导航栏 -->
		<view class="detail-gradient pt-10 pb-3 px-4">
			<view class="flex items-center">
				<view @tap="goBack" class="text-white">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="text-lg font-bold text-white ml-4 flex-1">特产详情</text>
			</view>
		</view>
		
		<!-- 可滚动内容区域 -->
		<scroll-view scroll-y="true" class="scrollable-content">
			<!-- 图片轮播 -->
			<view class="relative">
				<swiper 
					class="image-gallery" 
					:indicator-dots="false"
					:autoplay="true" 
					:interval="3000" 
					:duration="500"
					@change="onSwiperChange">
					<swiper-item v-if="specialty.images && specialty.images.length > 0" v-for="(image, index) in specialty.images" :key="index">
						<image :src="image" mode="aspectFill" class="gallery-image"></image>
					</swiper-item>
					<swiper-item v-else>
						<image src="https://img.yzcdn.cn/vant/cat.jpeg" mode="aspectFill" class="gallery-image"></image>
					</swiper-item>
				</swiper>
				
				<view class="gallery-indicator" v-if="specialty.images && specialty.images.length > 1">
					<view 
						v-for="(_, index) in specialty.images" 
						:key="index" 
						class="indicator-dot" 
						:class="{'active': currentSwiperIndex === index}">
					</view>
				</view>
				
				<button class="share-button" @tap="shareSpecialty">
					<text class="fas fa-share-alt text-gray-600"></text>
				</button>
			</view>
			
			<!-- 特产基本信息 -->
			<view class="p-4">
				<text class="text-xl font-bold mb-2 block">{{specialty.name || '特产名称'}}</text>
				
				<view class="flex items-center mb-3">
					<view class="flex items-center">
						<text class="fas fa-map-marker-alt text-red-500 text-xs mr-1"></text>
						<text class="text-sm text-gray-600">
							{{specialty.province || ''}} {{specialty.location && specialty.location.address ? specialty.location.address.replace(new RegExp(`^${specialty.province}(省)?`), '') : ''}}
						</text>
					</view>
					<view class="flex items-center ml-4">
						<text class="fas fa-eye text-gray-400 text-xs mr-1"></text>
						<text class="text-sm text-gray-500">{{specialty.viewCount || '0'}}</text>
					</view>
				</view>
				
				<view class="flex flex-wrap mb-4">
					<!-- 分类标签 -->
					<view 
						v-if="specialty.category" 
						class="tag mr-2 mb-1" 
						:style="{
							backgroundColor: getCategoryInfo(specialty.category).color,
							color: specialty.category === '主食' ? '#8B5000' : 'white'
						}">
						<text class="fas" :class="getCategoryInfo(specialty.category).icon"></text>
						<text class="ml-1">{{getCategoryInfo(specialty.category).name || specialty.category}}</text>
					</view>
					
					<!-- 荣誉标签 -->
					<view 
						v-for="(honor, index) in specialty.honors" 
						:key="'honor-'+index" 
						class="tag heritage-tag mr-2 mb-1">
						<text class="fas fa-award mr-1"></text>
						<text>{{honor}}</text>
					</view>
					
					<!-- 自定义标签 -->
					<view 
						v-for="(tag, index) in specialty.tags" 
						:key="'tag-'+index" 
						class="tag geo-tag mr-2 mb-1">
						<text class="fas fa-tag mr-1"></text>
						<text>{{tag}}</text>
					</view>
				</view>
				
				<text class="text-sm text-gray-700 leading-relaxed mb-4 block">{{specialty.description || '特产描述加载中...'}}</text>
			</view>
			
			<!-- 基本信息 -->
			<view class="p-4 bg-white mb-3">
				<view class="section-title">
					<text class="fas fa-info-circle"></text>
					<text class="ml-2">基本信息</text>
				</view>
				
				<view v-if="specialty.category || specialty.location || (specialty.honors && specialty.honors.length) || (specialty.tags && specialty.tags.length)">
					<!-- 分类信息 -->
					<view v-if="specialty.category" class="feature-item">
						<view class="feature-icon">
							<text class="fas fa-tag"></text>
						</view>
						<view>
							<view class="text-xs text-gray-500">分类</view>
							<view class="text-sm">{{specialty.category}}</view>
						</view>
					</view>
					
					<!-- 产地信息 -->
					<view 
						v-if="specialty.province || (specialty.location && specialty.location.address)" 
						class="feature-item">
						<view class="feature-icon">
							<text class="fas fa-map-marker-alt"></text>
						</view>
						<view>
							<view class="text-xs text-gray-500">产地</view>
							<view class="text-sm">
								{{specialty.province || ''}} 
								{{specialty.location && specialty.location.address ? specialty.location.address.replace(new RegExp(`^${specialty.province}(省)?`), '') : ''}}
							</view>
						</view>
					</view>
					
					<!-- 荣誉信息 -->
					<view v-if="specialty.honors && specialty.honors.length > 0" class="feature-item">
						<view class="feature-icon">
							<text class="fas fa-award"></text>
						</view>
						<view>
							<view class="text-xs text-gray-500">荣誉</view>
							<view class="text-sm">{{specialty.honors.join('、')}}</view>
						</view>
					</view>
					
					<!-- 标签信息 -->
					<view v-if="specialty.tags && specialty.tags.length > 0" class="feature-item">
						<view class="feature-icon">
							<text class="fas fa-tags"></text>
						</view>
						<view>
							<view class="text-xs text-gray-500">标签</view>
							<view class="text-sm">{{specialty.tags.join('、')}}</view>
						</view>
					</view>
				</view>
				
				<!-- 没有任何信息的情况 -->
				<view v-else>
					<text class="text-sm text-gray-500">暂无基本信息</text>
				</view>
			</view>
			
			<!-- 详细描述 -->
			<view v-if="specialty.content" class="p-4 bg-white mb-3">
				<view class="section-title">
					<text class="fas fa-info-circle"></text>
					<text class="ml-2">详细描述</text>
				</view>
				
				<view class="text-sm text-gray-700 leading-relaxed content-detail">
					<text>{{specialty.content}}</text>
				</view>
			</view>
			
			<!-- 产地位置 -->
			<view class="p-4 bg-white mb-3">
				<view class="section-title">
					<text class="fas fa-map-marked-alt"></text>
					<text class="ml-2">产地位置</text>
				</view>
				
				<view class="location-map">
					<!-- #ifdef H5 -->
					<!-- 高德地图容器 (仅在H5环境) -->
					<view id="amap-container" style="width: 100%; height: 100%;"></view>
					<!-- #endif -->
					
					<!-- #ifdef MP-WEIXIN -->
					<!-- 微信小程序地图组件 -->
					<map 
						id="map" 
						style="width: 100%; height: 100%;" 
						:latitude="specialty.latitude || 39.9042" 
						:longitude="specialty.longitude || 116.4074" 
						:markers="[{
							id: 1,
							latitude: specialty.latitude || 39.9042,
							longitude: specialty.longitude || 116.4074,
							title: specialty.name
						}]"
						:show-location="true"
						scale="13"
					></map>
					<!-- #endif -->
					
					<!-- 地图加载前的占位标记 -->
					<view class="location-marker" v-if="!mapLoaded">
						<text class="fas fa-map-pin"></text>
					</view>
				</view>
				
				<view class="mt-3 text-sm text-gray-700">
					<text>{{specialty.location && specialty.location.address ? specialty.location.address : '地理位置加载中...'}}</text>
				</view>
			</view>
			
			<!-- 相关特产 -->
			<view class="p-4 bg-white mb-5">
				<view class="section-title">
					<text class="fas fa-th-large"></text>
					<text class="ml-2">相关特产</text>
				</view>
				
				<view v-if="relatedSpecialties.length > 0" class="flex overflow-x-auto pb-2">
					<view
						v-for="(item, index) in relatedSpecialties"
						:key="index"
						class="related-item"
						@tap="navigateToDetail(item.id)">
						<image :src="item.image" mode="aspectFill" class="related-image"></image>
						<text class="related-title">{{item.name}}</text>
						<text class="related-location">{{item.province}}·{{item.city || ''}}</text>
					</view>
				</view>
				
				<view v-else class="py-4">
					<text class="text-sm text-gray-500 block text-center">暂无相关特产推荐</text>
				</view>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				specialty: {},
				relatedSpecialties: [],
				id: '',
				currentSwiperIndex: 0,
				isCollected: false,
				categoryMapping: {
					"全部": { name: "全部", color: "#D83931", icon: "fa-th-large" },
					"主食": { name: "主食", color: "#F7C873", icon: "fa-bowl-rice" },
					"副食": { name: "副食", color: "#9B59B6", icon: "fa-jar" },
					"小吃": { name: "小吃", color: "#58D68D", icon: "fa-cookie" },
					"零食": { name: "零食", color: "#E74C3C", icon: "fa-candy-bar" },
					"烟酒": { name: "烟酒", color: "#7F8C8D", icon: "fa-wine-bottle" },
					"茶叶": { name: "茶叶", color: "#1ABC9C", icon: "fa-mug-hot" },
					"饮料": { name: "饮料", color: "#3498DB", icon: "fa-glass" },
					"水果": { name: "水果", color: "#2ECC71", icon: "fa-apple-whole" },
					"蔬菜": { name: "蔬菜", color: "#16A085", icon: "fa-carrot" },
					"水产海鲜": { name: "水产海鲜", color: "#0E6EAE", icon: "fa-fish" },
					"工艺品": { name: "工艺品", color: "#8E44AD", icon: "fa-scissors" },
					"药材": { name: "药材", color: "#D35400", icon: "fa-mortar-pestle" },
					"花卉": { name: "花卉", color: "#27AE60", icon: "fa-seedling" },
					"生鲜": { name: "生鲜", color: "#58D68D", icon: "fa-leaf" }
				},
				map: null,
				mapLoaded: false
			}
		},
		onLoad(option) {
			if (option.id) {
				this.id = option.id;
				this.getSpecialtyDetail();
				this.checkCollectionStatus();
			} else {
				uni.showToast({
					title: '参数错误',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		onShow() {
			// 记录足迹
			if (this.id && this.specialty.name) {
				this.recordFootprint();
			}
			
			// 初始化地图
			if (this.specialty.longitude && this.specialty.latitude) {
				this.$nextTick(() => {
					this.loadAMapScript();
				});
			}
		},
		methods: {
			// 获取特产详情
			async getSpecialtyDetail() {
				try {
					// 模拟数据
					const mockData = {
						id: '1',
						name: '龙井茶',
						images: [
							'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=480&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=720',
							'https://img.cdn.sugarat.top/mdImg/MTY1MDQ4NzI2Njk1MA==650487266950',
							'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423'
						],
						province: '浙江省',
						city: '杭州市',
						location: {
							address: '浙江省杭州市西湖区龙井路1号',
							longitude: 120.1494,
							latitude: 30.2288
						},
						longitude: 120.1494,
						latitude: 30.2288,
						viewCount: '1234',
						category: '茶叶',
						categoryName: '茶叶',
						description: '龙井茶，中国传统名茶，属于绿茶类，已有1200多年历史。龙井茶产于浙江杭州西湖龙井村周围群山，其品质特点：色翠、香郁、味甘、形美。',
						content: '龙井茶（英语：Longjing tea）为中国十大名茶之一，属于绿茶类，是中国绿茶的代表品种。原产于浙江西湖龙井村一带，已有一千二百余年历史，后种植范围逐步扩大至杭州市西湖区的一带山区，并演变出西湖龙井、钱塘龙井、越州龙井等多种西湖系龙井茶。\n\n龙井茶外形扁平挺直，色泽嫩绿光润，香气鲜嫩清高，滋味鲜爽甘醇，叶底嫩绿明亮。传统的龙井茶品质特色概括为"色绿、香郁、味甘、形美"。龙井自古被称为"绿茶皇后"。',
						honors: ['中国国家地理标志产品', '国家级非物质文化遗产'],
						tags: [],
						related: ['2', '3', '4', '5']
					};
					
					this.specialty = mockData;
					
					// 获取相关特产
					if (this.specialty.related && this.specialty.related.length > 0) {
						this.getRelatedSpecialties();
					}
					
					// 初始化地图
					this.$nextTick(() => {
						this.loadAMapScript();
					});
					
					/* 
					// 实际云函数调用，先注释掉
					const { data: res } = await this.$cloud.callFunction({
						name: 'detail',
						data: {
							action: 'getSpecialtyDetail',
							id: this.id
						}
					});
					
					if (res.code === 0) {
						this.specialty = res.data;
						
						// 获取相关特产
						if (this.specialty.related && this.specialty.related.length > 0) {
							this.getRelatedSpecialties();
						}
					} else {
						uni.showToast({
							title: res.msg || '获取特产详情失败',
							icon: 'none'
						});
					}
					*/
				} catch (e) {
					console.error('获取特产详情失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				}
			},
			
			// 获取相关特产
			async getRelatedSpecialties() {
				try {
					// 模拟数据
					const mockData = [
						{
							id: '2',
							name: '西湖藕粉',
							image: 'https://img.cdn.sugarat.top/mdImg/MTY3ODg4NDIyMTkwNA==678884221904',
							province: '浙江',
							city: '杭州',
							category: '副食'
						},
						{
							id: '3',
							name: '杭州丝绸',
							image: 'https://img.cdn.sugarat.top/mdImg/MTY1MDQ4NzE2NTE4MQ==650487165181',
							province: '浙江',
							city: '杭州',
							category: '工艺品'
						},
						{
							id: '4',
							name: '金华火腿',
							image: 'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
							province: '浙江',
							city: '金华',
							category: '生鲜'
						}
					];
					
					this.relatedSpecialties = mockData;
					
					/*
					// 实际云函数调用，先注释掉
					const { data: res } = await this.$cloud.callFunction({
						name: 'detail',
						data: {
							action: 'getRelatedSpecialties',
							ids: this.specialty.related
						}
					});
					
					if (res.code === 0) {
						this.relatedSpecialties = res.data;
					}
					*/
				} catch (e) {
					console.error('获取相关特产失败:', e);
				}
			},
			
			// 记录足迹
			async recordFootprint() {
				try {
					console.log('记录足迹:', this.id);
					/*
					// 实际云函数调用，先注释掉
					await this.$cloud.callFunction({
						name: 'detail',
						data: {
							action: 'recordFootprint',
							specialtyId: this.id,
							specialtyInfo: {
								name: this.specialty.name,
								image: this.specialty.images ? this.specialty.images[0] : this.specialty.image,
								province: this.specialty.province,
								city: this.specialty.city || (this.specialty.location ? this.specialty.location.address.split('市')[0].replace(/^.*省/, '') : ''),
								category: this.specialty.category,
								categoryName: this.specialty.categoryName || this.specialty.category,
								description: this.specialty.description
							}
						}
					});
					*/
				} catch (e) {
					console.error('记录足迹失败:', e);
				}
			},
			
			// 检查收藏状态
			async checkCollectionStatus() {
				try {
					// 模拟数据
					this.isCollected = ['1', '3', '5', '7'].includes(this.id);
					
					/*
					// 实际云函数调用，先注释掉
					const { data: res } = await this.$cloud.callFunction({
						name: 'detail',
						data: {
							action: 'checkCollectionStatus',
							specialtyId: this.id
						}
					});
					
					if (res.code === 0) {
						this.isCollected = res.data.isCollected;
					}
					*/
				} catch (e) {
					console.error('检查收藏状态失败:', e);
				}
			},
			
			// 切换收藏状态
			async toggleCollection() {
				try {
					// 模拟切换收藏状态
					this.isCollected = !this.isCollected;
					uni.showToast({
						title: this.isCollected ? '收藏成功' : '已取消收藏',
						icon: 'success'
					});
					
					/*
					// 实际云函数调用，先注释掉
					const action = this.isCollected ? 'cancelCollection' : 'addCollection';
					
					const { data: res } = await this.$cloud.callFunction({
						name: 'detail',
						data: {
							action,
							specialtyId: this.id,
							specialtyInfo: !this.isCollected ? {
								name: this.specialty.name,
								image: this.specialty.images ? this.specialty.images[0] : this.specialty.image,
								province: this.specialty.province,
								city: this.specialty.city || (this.specialty.location ? this.specialty.location.address.split('市')[0].replace(/^.*省/, '') : ''),
								category: this.specialty.category,
								categoryName: this.specialty.categoryName || this.specialty.category,
								description: this.specialty.description
							} : undefined
						}
					});
					
					if (res.code === 0) {
						this.isCollected = !this.isCollected;
						uni.showToast({
							title: this.isCollected ? '收藏成功' : '已取消收藏',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.msg || (this.isCollected ? '取消收藏失败' : '收藏失败'),
							icon: 'none'
						});
					}
					*/
				} catch (e) {
					console.error('操作收藏失败:', e);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					});
				}
			},
			
			// 分享特产
			shareSpecialty() {
				uni.showToast({
					title: '分享功能开发中...',
					icon: 'none'
				});
			},
			
			// 打开地图
			openMap() {
				if (this.specialty.longitude && this.specialty.latitude) {
					uni.openLocation({
						longitude: parseFloat(this.specialty.longitude),
						latitude: parseFloat(this.specialty.latitude),
						name: this.specialty.name,
						address: this.specialty.location ? this.specialty.location.address : (this.specialty.province + this.specialty.city || '')
					});
				} else {
					uni.showToast({
						title: '暂无位置信息',
						icon: 'none'
					});
				}
			},
			
			// 轮播图切换事件
			onSwiperChange(e) {
				this.currentSwiperIndex = e.detail.current;
			},
			
			// 获取分类信息
			getCategoryInfo(category) {
				return this.categoryMapping[category] || { name: category, color: "#999", icon: "fa-circle" };
			},
			
			// 导航到其他特产详情页
			navigateToDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				});
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 初始化高德地图
			initAMap() {
				if (!this.specialty.longitude || !this.specialty.latitude) {
					return;
				}
				
				// 确保页面上有地图容器
				const mapContainer = document.getElementById('amap-container');
				if (!mapContainer) {
					setTimeout(() => this.initAMap(), 300);
					return;
				}
				
				// 创建地图实例
				this.map = new AMap.Map('amap-container', {
					zoom: 13,
					center: [this.specialty.longitude, this.specialty.latitude],
					resizeEnable: true
				});
				
				// 创建自定义标记
				const markerContent = document.createElement('div');
				markerContent.className = 'custom-marker';
				markerContent.innerHTML = `
					<div class="marker-inner">
						<i class="fas fa-map-marker-alt"></i>
					</div>
				`;
				
				// 创建标记
				const marker = new AMap.Marker({
					position: new AMap.LngLat(this.specialty.longitude, this.specialty.latitude),
					title: this.specialty.name,
					content: markerContent, // 使用自定义内容
					anchor: 'bottom-center', // 设置锚点为底部中心
					offset: new AMap.Pixel(0, 0)
				});
				
				// 将标记添加到地图
				this.map.add(marker);
				
				// 添加信息窗体
				const infoWindow = new AMap.InfoWindow({
					content: `<div style="padding: 10px;">
								<h4 style="margin: 0 0 5px; font-size: 14px; color: #D83931;">${this.specialty.name}</h4>
								<p style="margin: 0; font-size: 12px; color: #666;">${this.specialty.location ? this.specialty.location.address : ''}</p>
							 </div>`,
					offset: new AMap.Pixel(0, -30),
					closeWhenClickMap: true, // 点击地图关闭信息窗体
					autoMove: true // 自动调整窗体到视野内
				});
				
				// 点击标记时打开信息窗体
				marker.on('click', () => {
					infoWindow.open(this.map, marker.getPosition());
				});
				
				// 添加控件
				AMap.plugin(['AMap.Scale'], () => {
					// 添加比例尺控件
					const scale = new AMap.Scale();
					this.map.addControl(scale);
				});
				
				// 地图加载完成后，自动触发一次点击，显示信息窗体
				this.map.on('complete', () => {
					this.mapLoaded = true;
					infoWindow.open(this.map, marker.getPosition());
				});
			},
			
			// 加载高德地图脚本
			loadAMapScript() {
				if (window.AMap) {
					this.initAMap();
					return;
				}
				
				const script = document.createElement('script');
				script.type = 'text/javascript';
				// 添加plugin参数，预加载Scale插件
				script.src = 'https://webapi.amap.com/maps?v=2.0&key=01683ea78abef3395c2b3e4a73c6f6c3&plugin=AMap.Scale&callback=initAMap';
				script.onerror = () => {
					console.error('高德地图脚本加载失败');
				};
				document.body.appendChild(script);
				
				// 设置全局回调函数
				window.initAMap = () => {
					this.initAMap();
				};
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
    max-width: 750px;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.detail-gradient {
    background: linear-gradient(135deg, #D83931, #A82825);
}

.scrollable-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
}

.image-gallery {
    width: 100%;
    height: 240px;
}

.gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gallery-indicator {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 1;
}

.indicator-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 0 3px;
}

.indicator-dot.active {
    background-color: white;
    width: 8px;
    height: 8px;
}

.share-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    padding: 0;
    margin: 0;
}

.share-button::after {
    border: none;
}

.tag {
    border-radius: 10px;
    font-size: 10px;
    padding: 1px 6px;
    display: inline-flex;
    align-items: center;
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

.festival-tag {
    background-color: #E74C3C;
    color: white;
}

.geo-tag {
    background-color: #2980B9;
    color: white;
}

.heritage-tag {
    background-color: #9B59B6;
    color: white;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.section-title .fas {
    color: #D83931;
}

.feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.feature-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: rgba(216, 57, 49, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    flex-shrink: 0;
}

.feature-icon .fas {
    color: #D83931;
    font-size: 14px;
}

.location-map {
    width: 100%;
    height: 180px;
    background-color: #e9e9e9;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

.location-marker {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 36px;
    height: 36px;
    background-color: rgba(216, 57, 49, 0.9);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.location-marker::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(216, 57, 49, 0.9);
}

.related-item {
    width: 120px;
    flex-shrink: 0;
    margin-right: 10px;
}

.related-image {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 6px;
}

.related-title {
    font-size: 12px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}

.related-location {
    font-size: 10px;
    color: #666;
    display: block;
}

.content-detail {
    white-space: pre-line;
}

/* Tailwind 样式类 */
.flex { display: flex; }
.flex-1 { flex: 1; }
.flex-col { flex-direction: column; }
.flex-shrink-0 { flex-shrink: 0; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.overflow-x-auto { overflow-x: auto; }
.overflow-hidden { overflow: hidden; }
.relative { position: relative; }
.absolute { position: absolute; }
.w-full { width: 100%; }
.h-full { height: 100%; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-t-xl { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; }
.bg-white { background-color: white; }
.bg-opacity-10 { --tw-bg-opacity: 0.1; }
.bg-opacity-20 { --tw-bg-opacity: 0.2; }
.text-white { color: white; }
.text-red-500 { color: #ef4444; }
.text-gray-300 { color: #d1d5db; }
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-xl { font-size: 1.25rem; }
.text-lg { font-size: 1.125rem; }
.text-base { font-size: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.pt-10 { padding-top: 2.5rem; }
.pb-3 { padding-bottom: 0.75rem; }
.pb-2 { padding-bottom: 0.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-1.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.p-4 { padding: 1rem; }
.p-0 { padding: 0; }
.mt-0.5 { margin-top: 0.125rem; }
.mt-3 { margin-top: 0.75rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-5 { margin-bottom: 1.25rem; }
.ml-1 { margin-left: 0.25rem; }
.ml-2 { margin-left: 0.5rem; }
.ml-4 { margin-left: 1rem; }
.mr-1 { margin-right: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }
.border-t { border-top-width: 1px; }
.border-gray-200 { border-color: #e5e7eb; }
.bg-transparent { background-color: transparent; }
.m-0 { margin: 0; }
.leading-relaxed { line-height: 1.625; }
.block { display: block; }
.text-center { text-align: center; }

/* 自定义地图标记样式 */
.custom-marker {
    position: relative;
}

.marker-inner {
    background-color: #D83931;
    border: 2px solid white;
    border-radius: 50%;
    color: white;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    font-size: 16px;
}

.marker-inner::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>