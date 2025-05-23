<template>
	<view class="container">
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
					:indicator-dots="specialty.images && specialty.images.length > 1"
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
					<!-- 实际项目中应该使用真实地图组件，这里用静态图片模拟 -->
					<image src="https://api.map.baidu.com/staticimage/v2?ak=E4805d16520de693a3fe707cdc962045&width=390&height=180&center={{specialty.longitude || 116.4074}},{{specialty.latitude || 39.9042}}&zoom=13" mode="aspectFill" class="w-full h-full"></image>
					<view class="location-marker">
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
		
		<!-- 底部操作栏 -->
		<view class="bg-white border-t border-gray-200 p-3 flex items-center justify-between">
			<!-- 收藏按钮 -->
			<view class="flex-1 flex flex-col items-center" @tap="toggleCollection">
				<text class="fas" :class="isCollected ? 'fa-heart text-red-500' : 'fa-heart text-gray-400'"></text>
				<text class="text-xs mt-1 text-gray-500">{{isCollected ? '已收藏' : '收藏'}}</text>
			</view>
			
			<!-- 分享按钮 -->
			<view class="flex-1 flex flex-col items-center" @tap="shareSpecialty">
				<text class="fas fa-share-alt text-gray-400"></text>
				<text class="text-xs mt-1 text-gray-500">分享</text>
			</view>
			
			<!-- 坐标按钮 -->
			<view v-if="specialty.longitude && specialty.latitude" class="flex-1 flex flex-col items-center" @tap="openMap">
				<text class="fas fa-location-arrow text-gray-400"></text>
				<text class="text-xs mt-1 text-gray-500">导航</text>
			</view>
			
			<!-- 客服按钮 -->
			<button open-type="contact" class="flex-1 flex flex-col items-center bg-transparent p-0 m-0">
				<text class="fas fa-headset text-gray-400"></text>
				<text class="text-xs mt-1 text-gray-500">客服</text>
			</button>
		</view>
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
				}
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
		},
		methods: {
			// 获取特产详情
			async getSpecialtyDetail() {
				try {
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
				} catch (e) {
					console.error('获取相关特产失败:', e);
				}
			},
			
			// 记录足迹
			async recordFootprint() {
				try {
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
				} catch (e) {
					console.error('记录足迹失败:', e);
				}
			},
			
			// 检查收藏状态
			async checkCollectionStatus() {
				try {
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
				} catch (e) {
					console.error('检查收藏状态失败:', e);
				}
			},
			
			// 切换收藏状态
			async toggleCollection() {
				try {
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
	
	&::after {
		border: none;
	}
}

.tag {
	border-radius: 10px;
	font-size: 10px;
	padding: 1px 6px;
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
	
	.fas {
		color: #D83931;
	}
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
	
	.fas {
		color: #D83931;
		font-size: 14px;
	}
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
	
	&::after {
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
}

.related-location {
	font-size: 10px;
	color: #666;
}

.content-detail {
	white-space: pre-line;
}
</style> 