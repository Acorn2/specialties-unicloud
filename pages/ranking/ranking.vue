 <template>
  <view class="app-container">
    
    <!-- 区域选择栏 -->
    <view class="region-container">
      <!-- 区域选择标签 -->
      <view class="region-tab-container">
        <scroll-view class="region-scroll" scroll-x show-scrollbar="false">
          <view class="region-list">
            <view 
              v-for="(region, index) in regions" 
              :key="index" 
              :class="['filter-pill', {'active': currentRegion === region.code}]"
              @click="switchRegion(region.code)">
              {{ region.name }}
            </view>
            <view class="filter-pill" @click="toggleMoreRegions">
              <text class="iconfont icon-more"></text>更多
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 省份选择器 -->
      <view class="province-container">
        <view class="province-header">
          <text class="province-header-text">当前省份</text>
          <view class="view-all-btn" @click="openProvinceModal">
            <text class="view-all-text">查看全部省份</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
        <scroll-view class="province-scroll" scroll-x show-scrollbar="false">
          <view class="province-list">
            <view 
              v-for="(province, index) in filteredProvinces" 
              :key="index" 
              :class="['province-btn', {'active': currentProvince === province.code}]"
              @click="switchProvince(province.code)">
              {{ province.name }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 可滚动内容区域 -->
    <scroll-view class="scrollable-content" scroll-y @scrolltolower="loadMore">
      <!-- 省份特产标题 -->
      <view class="specialty-header">
        <text class="specialty-title">{{ provinceName }}十大特产</text>
        <text class="specialty-count">共{{ specialtyList.length }}种特产</text>
      </view>
      
      <!-- 特产榜单列表 -->
      <view class="specialty-list">
        <view 
          v-for="(item, index) in specialtyList" 
          :key="item.id"
          class="rank-card"
          @click="goToDetail(item.id)">
          <view :class="['rank-badge', getRankClass(index)]">{{ index + 1 }}</view>
          <view class="specialty-image">
            <image :src="item.image" mode="aspectFill"></image>
          </view>
          <view class="specialty-info">
            <view class="specialty-top">
              <text class="specialty-name">{{ item.name }}</text>
              <view class="trend-container">
                <text :class="['iconfont', getTrendIcon(item.trend)]"></text>
                <text :class="['trend-text', getTrendTextClass(item.trend)]">{{ getTrendText(item) }}</text>
              </view>
            </view>
            <view class="tags-container">
              <view 
                v-for="(tag, tagIndex) in getItemTags(item)" 
                :key="tagIndex"
                :class="['tag', `${tag.code}-tag`]">
                {{ tag.name }}
              </view>
            </view>
            <text class="specialty-desc">{{ item.description }}</text>
            <view class="specialty-bottom">
              <text class="specialty-location">{{ item.city }}</text>
              <view class="view-count">
                <text class="iconfont icon-eye"></text>
                <text class="view-count-text">{{ item.viewCount }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 加载更多或无数据提示 -->
        <view v-if="specialtyList.length === 0" class="empty-container">
          <text class="iconfont icon-empty"></text>
          <text class="empty-text">暂无{{ provinceName }}特产数据</text>
          <text class="empty-subtext">我们正在努力收集更多特产信息</text>
        </view>
        <view v-else-if="loading" class="loading-container">
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="noMore" class="no-more-container">
          <text class="no-more-text">已经到底了~</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 省份选择模态框 -->
    <view v-if="showProvinceModal" class="modal-mask" @click="closeProvinceModal">
      <view class="province-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择省份</text>
          <view class="close-btn" @click="closeProvinceModal">
            <text class="iconfont icon-close"></text>
          </view>
        </view>
        
        <!-- 区域分组的省份列表 -->
        <scroll-view class="modal-content" scroll-y>
          <view 
            v-for="(regionGroup, regionIndex) in regionProvinces" 
            :key="regionIndex"
            class="region-group">
            <text class="region-group-title">{{ regionGroup.name }}</text>
            <view class="province-grid">
              <view 
                v-for="(province, provinceIndex) in regionGroup.provinces" 
                :key="provinceIndex"
                :class="['province-grid-btn', {'active': currentProvince === province.code}]"
                @click="selectProvince(province.code)">
                {{ province.name }}
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 更多区域弹出菜单 -->
    <view v-if="showMoreRegions" class="region-dropdown" :style="moreRegionsStyle">
      <view 
        v-for="(region, index) in moreRegions" 
        :key="index"
        class="region-dropdown-item"
        @click="selectMoreRegion(region.code)">
        {{ region.name }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 当前选中的区域和省份
      currentRegion: 'central',
      currentProvince: 'hubei',
      provinceName: '湖北省',
      
      // 区域数据
      regions: [
        { name: '华东', code: 'east' },
        { name: '华南', code: 'south' },
        { name: '华中', code: 'central' },
        { name: '华北', code: 'north' },
        { name: '西南', code: 'southwest' }
      ],
      
      // 更多区域
      moreRegions: [
        { name: '东北', code: 'northeast' },
        { name: '西北', code: 'northwest' },
        { name: '港澳台', code: 'hmt' }
      ],
      
      // 区域省份映射
      regionProvinces: [
        {
          name: '华东',
          code: 'east',
          provinces: [
            { name: '上海', code: 'shanghai' },
            { name: '江苏', code: 'jiangsu' },
            { name: '浙江', code: 'zhejiang' },
            { name: '安徽', code: 'anhui' },
            { name: '福建', code: 'fujian' },
            { name: '江西', code: 'jiangxi' },
            { name: '山东', code: 'shandong' }
          ]
        },
        {
          name: '华南',
          code: 'south',
          provinces: [
            { name: '广东', code: 'guangdong' },
            { name: '广西', code: 'guangxi' },
            { name: '海南', code: 'hainan' }
          ]
        },
        {
          name: '华中',
          code: 'central',
          provinces: [
            { name: '湖北', code: 'hubei' },
            { name: '湖南', code: 'hunan' },
            { name: '河南', code: 'henan' }
          ]
        },
        {
          name: '华北',
          code: 'north',
          provinces: [
            { name: '北京', code: 'beijing' },
            { name: '天津', code: 'tianjin' },
            { name: '河北', code: 'hebei' },
            { name: '山西', code: 'shanxi' },
            { name: '内蒙古', code: 'neimenggu' }
          ]
        },
        {
          name: '西南',
          code: 'southwest',
          provinces: [
            { name: '重庆', code: 'chongqing' },
            { name: '四川', code: 'sichuan' },
            { name: '贵州', code: 'guizhou' },
            { name: '云南', code: 'yunnan' },
            { name: '西藏', code: 'xizang' }
          ]
        },
        {
          name: '东北',
          code: 'northeast',
          provinces: [
            { name: '辽宁', code: 'liaoning' },
            { name: '吉林', code: 'jilin' },
            { name: '黑龙江', code: 'heilongjiang' }
          ]
        },
        {
          name: '西北',
          code: 'northwest',
          provinces: [
            { name: '陕西', code: 'shaanxi' },
            { name: '甘肃', code: 'gansu' },
            { name: '青海', code: 'qinghai' },
            { name: '宁夏', code: 'ningxia' },
            { name: '新疆', code: 'xinjiang' }
          ]
        },
        {
          name: '港澳台',
          code: 'hmt',
          provinces: [
            { name: '香港', code: 'hongkong' },
            { name: '澳门', code: 'macao' },
            { name: '台湾', code: 'taiwan' }
          ]
        }
      ],
      
      // 特产列表
      specialtyList: [],
      
      // 加载状态
      loading: false,
      noMore: false,
      page: 1,
      pageSize: 10,
      
      // 显示状态
      showProvinceModal: false,
      showMoreRegions: false,
      moreRegionsStyle: {},
      
      // 分类映射
      categoryMapping: {
        "food": { name: "主食类", code: "food" },
        "material": { name: "副食类", code: "material" },
        "snack": { name: "小吃", code: "snack" },
        "dessert": { name: "零食", code: "dessert" },
        "alcohol": { name: "烟酒", code: "alcohol" },
        "tea": { name: "茶叶", code: "tea" },
        "drink": { name: "饮料", code: "drink" },
        "fruit": { name: "水果", code: "fruit" },
        "vegetable": { name: "蔬菜", code: "vegetable" },
        "seafood": { name: "水产海鲜", code: "seafood" },
        "craft": { name: "工艺品", code: "craft" },
        "medicine": { name: "药材", code: "medicine" },
        "flower": { name: "花卉", code: "flower" },
        "fresh": { name: "生鲜", code: "fresh" }
      }
    }
  },
  computed: {
    // 根据当前区域筛选省份
    filteredProvinces() {
      const regionObj = this.regionProvinces.find(r => r.code === this.currentRegion);
      return regionObj ? regionObj.provinces : [];
    }
  },
  onLoad() {
    // 加载特产数据
    this.loadSpecialtyData();
  },
  methods: {
    // 切换区域
    switchRegion(regionCode) {
      this.currentRegion = regionCode;
      // 默认选中该区域的第一个省份
      if (this.filteredProvinces.length > 0) {
        this.switchProvince(this.filteredProvinces[0].code);
      }
      this.showMoreRegions = false;
    },
    
    // 切换省份
    switchProvince(provinceCode) {
      if (this.currentProvince !== provinceCode) {
        this.currentProvince = provinceCode;
        this.page = 1;
        this.noMore = false;
        this.specialtyList = [];
        this.loadSpecialtyData();
      }
      this.showProvinceModal = false;
    },
    
    // 显示更多区域菜单
    toggleMoreRegions(event) {
      // 计算位置
      const rect = event.target.getBoundingClientRect();
      this.moreRegionsStyle = {
        top: `${rect.bottom + 5}px`,
        left: `${rect.left}px`
      };
      this.showMoreRegions = !this.showMoreRegions;
    },
    
    // 选择更多区域菜单中的区域
    selectMoreRegion(regionCode) {
      this.switchRegion(regionCode);
      this.showMoreRegions = false;
    },
    
    // 打开省份模态框
    openProvinceModal() {
      this.showProvinceModal = true;
    },
    
    // 关闭省份模态框
    closeProvinceModal() {
      this.showProvinceModal = false;
    },
    
    // 在模态框中选择省份
    selectProvince(provinceCode) {
      this.switchProvince(provinceCode);
      this.closeProvinceModal();
    },
    
    // 获取排名样式
    getRankClass(index) {
      if (index === 0) return 'rank-1';
      if (index === 1) return 'rank-2';
      if (index === 2) return 'rank-3';
      return 'rank-other';
    },
    
    // 获取趋势图标
    getTrendIcon(trend) {
      if (trend === 'up') return 'icon-up';
      if (trend === 'down') return 'icon-down';
      if (trend === 'new') return 'icon-up';
      return 'icon-minus';
    },
    
    // 获取趋势文本样式
    getTrendTextClass(trend) {
      if (trend === 'up' || trend === 'new') return 'trend-up';
      if (trend === 'down') return 'trend-down';
      return 'trend-same';
    },
    
    // 获取趋势文本
    getTrendText(item) {
      if (item.trend === 'up') return `上升${item.trendValue}位`;
      if (item.trend === 'down') return `下降${item.trendValue}位`;
      if (item.trend === 'new') return '新上榜';
      return '持平';
    },
    
    // 获取特产标签
    getItemTags(item) {
      const tags = [];
      // 添加分类标签
      if (item.categoryCode && this.categoryMapping[item.categoryCode]) {
        tags.push({
          name: this.categoryMapping[item.categoryCode].name,
          code: item.categoryCode
        });
      }
      
      // 添加地理标志标签
      if (item.geo) {
        tags.push({
          name: '地理标志',
          code: 'geo'
        });
      }
      
      // 添加非遗标签
      if (item.heritage) {
        tags.push({
          name: '非遗文化',
          code: 'heritage'
        });
      }
      
      return tags;
    },
    
    // 跳转到详情页
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    },
    
    // 加载更多
    loadMore() {
      if (!this.loading && !this.noMore) {
        this.page++;
        this.loadSpecialtyData();
      }
    },
    
    // 加载特产数据
    loadSpecialtyData() {
      if (this.loading) return;
      
      this.loading = true;
      
      // 获取省份名称
      const provinceObj = this.getProvinceByCode(this.currentProvince);
      this.provinceName = provinceObj ? provinceObj.name : '未知';
      
      // 调用云函数获取数据
      uniCloud.callFunction({
        name: 'ranking',
        data: {
          action: 'getProvinceSpecialties',
          province: this.currentProvince,
          page: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.loading = false;
        
        if (res.result && res.result.code === 0) {
          const data = res.result.data || [];
          
          if (this.page === 1) {
            this.specialtyList = data;
          } else {
            this.specialtyList = [...this.specialtyList, ...data];
          }
          
          this.noMore = data.length < this.pageSize;
        } else {
          this.handleError(res.result && res.result.message || '获取特产数据失败');
        }
      }).catch(err => {
        this.loading = false;
        this.handleError('网络异常，请稍后重试');
        console.error('获取特产数据失败:', err);
      });
    },
    
    // 根据省份代码获取省份对象
    getProvinceByCode(code) {
      for (const region of this.regionProvinces) {
        const province = region.provinces.find(p => p.code === code);
        if (province) return province;
      }
      return null;
    },
    
    // 处理错误
    handleError(message) {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #F8F5F1;
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

/* 顶部标题样式 */
.ranking-gradient {
  background: linear-gradient(135deg, #E74C3C, #C0392B);
  padding-top: calc(var(--status-bar-height) + 20rpx);
  padding-bottom: 20rpx;
  border-bottom-left-radius: 48rpx;
  border-bottom-right-radius: 48rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

/* 区域选择栏 */
.region-container {
  background-color: #FFFFFF;
  border-bottom: 2rpx solid #F0F0F0;
}

.region-tab-container {
  padding: 20rpx 30rpx 10rpx;
}

.region-scroll {
  white-space: nowrap;
}

.region-list {
  display: flex;
}

.filter-pill {
  border-radius: 32rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  background-color: #F0ECE6;
  color: #666666;
  margin-right: 16rpx;
  display: inline-block;
  transition: all 0.3s;
}

.filter-pill.active {
  background-color: #E74C3C;
  color: #FFFFFF;
  font-weight: 500;
}

/* 省份选择器 */
.province-container {
  padding: 16rpx 30rpx;
  border-top: 2rpx solid #F0F0F0;
}

.province-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.province-header-text {
  font-size: 24rpx;
  color: #999999;
}

.view-all-btn {
  display: flex;
  align-items: center;
}

.view-all-text {
  font-size: 24rpx;
  color: #E74C3C;
}

.province-scroll {
  white-space: nowrap;
}

.province-list {
  display: flex;
  padding: 4rpx 0;
}

.province-btn {
  padding: 12rpx 20rpx;
  border-radius: 32rpx;
  font-size: 24rpx;
  background-color: #FFFFFF;
  color: #333333;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  display: inline-block;
  transition: all 0.3s;
}

.province-btn.active {
  background-color: #E74C3C;
  color: #FFFFFF;
}

/* 内容区域 */
.scrollable-content {
  flex: 1;
}

.specialty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
}

.specialty-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.specialty-count {
  font-size: 24rpx;
  color: #999999;
}

.specialty-list {
  padding: 0 30rpx 30rpx;
}

/* 特产卡片 */
.rank-card {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 24rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  position: relative;
}

.rank-badge {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26rpx;
  font-weight: bold;
  font-size: 28rpx;
  margin-right: 20rpx;
  align-self: center;
  flex-shrink: 0;
}

.rank-1 {
  background-color: #FFD700;
  color: #8B5000;
  box-shadow: 0 4rpx 8rpx rgba(255, 215, 0, 0.3);
}

.rank-2 {
  background-color: #C0C0C0;
  color: #666666;
  box-shadow: 0 4rpx 8rpx rgba(192, 192, 192, 0.3);
}

.rank-3 {
  background-color: #CD7F32;
  color: #FFFFFF;
  box-shadow: 0 4rpx 8rpx rgba(205, 127, 50, 0.3);
}

.rank-other {
  background-color: #F0ECE6;
  color: #666666;
}

.specialty-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.specialty-image image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.specialty-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.specialty-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.specialty-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
}

.trend-container {
  display: flex;
  align-items: center;
}

.trend-text {
  font-size: 24rpx;
  margin-left: 4rpx;
}

.trend-up {
  color: #E74C3C;
}

.trend-down {
  color: #999999;
}

.trend-same {
  color: #999999;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8rpx;
}

.tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
  margin-right: 12rpx;
  margin-bottom: 8rpx;
}

.food-tag {
  background-color: #F7C873;
  color: #8B5000;
}

.material-tag {
  background-color: #9B59B6;
  color: #FFFFFF;
}

.snack-tag {
  background-color: #58D68D;
  color: #1D6640;
}

.dessert-tag {
  background-color: #E74C3C;
  color: #FFFFFF;
}

.alcohol-tag {
  background-color: #7F8C8D;
  color: #FFFFFF;
}

.tea-tag {
  background-color: #1ABC9C;
  color: #FFFFFF;
}

.drink-tag {
  background-color: #3498DB;
  color: #FFFFFF;
}

.fruit-tag {
  background-color: #2ECC71;
  color: #FFFFFF;
}

.vegetable-tag {
  background-color: #16A085;
  color: #FFFFFF;
}

.seafood-tag {
  background-color: #0E6EAE;
  color: #FFFFFF;
}

.craft-tag {
  background-color: #8E44AD;
  color: #FFFFFF;
}

.medicine-tag {
  background-color: #D35400;
  color: #FFFFFF;
}

.flower-tag {
  background-color: #27AE60;
  color: #FFFFFF;
}

.fresh-tag {
  background-color: #58D68D;
  color: #1D6640;
}

.geo-tag {
  background-color: #2980B9;
  color: #FFFFFF;
}

.heritage-tag {
  background-color: #9B59B6;
  color: #FFFFFF;
}

.specialty-desc {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.specialty-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
  margin-top: auto;
}

.specialty-location {
  font-size: 24rpx;
  color: #999999;
}

.view-count {
  display: flex;
  align-items: center;
}

.view-count-text {
  font-size: 24rpx;
  color: #999999;
  margin-left: 4rpx;
}

/* 省份选择模态框 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.province-modal {
  width: 100%;
  max-height: 70vh;
  background-color: #FFFFFF;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 30rpx;
  border-bottom: 2rpx solid #F0F0F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  flex: 1;
  padding: 30rpx;
  max-height: 60vh;
}

.region-group {
  margin-bottom: 30rpx;
}

.region-group-title {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 16rpx;
}

.province-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.province-grid-btn {
  padding: 16rpx 8rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  background-color: #F0ECE6;
  color: #333333;
  text-align: center;
  transition: all 0.2s ease;
}

.province-grid-btn.active {
  background-color: #E74C3C;
  color: #FFFFFF;
}

/* 更多区域弹出菜单 */
.region-dropdown {
  position: fixed;
  z-index: 50;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
  padding: 8rpx 0;
  min-width: 180rpx;
}

.region-dropdown-item {
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  color: #333333;
}

.region-dropdown-item:active {
  background-color: #F5F5F5;
}

/* 空状态和加载状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-text {
  font-size: 30rpx;
  color: #999999;
  margin-top: 20rpx;
}

.empty-subtext {
  font-size: 24rpx;
  color: #CCCCCC;
  margin-top: 10rpx;
}

.loading-container, .no-more-container {
  text-align: center;
  padding: 30rpx 0;
}

.loading-text, .no-more-text {
  font-size: 24rpx;
  color: #999999;
}

/* 图标字体 */
@font-face {
  font-family: 'iconfont';
  src: url('data:font/woff2;charset=utf-8;base64,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');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 28rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-eye:before {
  content: "\e78f";
}

.icon-up:before {
  content: "\e7ee";
}

.icon-down:before {
  content: "\e7ed";
}

.icon-minus:before {
  content: "\e7fd";
}

.icon-more:before {
  content: "\e64d";
}

.icon-right:before {
  content: "\e7eb";
}

.icon-close:before {
  content: "\e7fc";
}

.icon-empty:before {
  content: "\e6a6";
  font-size: 80rpx;
  color: #CCCCCC;
}
</style>