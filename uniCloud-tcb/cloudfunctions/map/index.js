'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const $ = db.command.aggregate;
	const _ = db.command;

	const { action, provinceId, categoryId, page = 1, pageSize = 10 } = event;

	switch (action) {
		case 'getMapPageData':
			try {
				// 这些数据通常来自数据库集合
				const regions = [
                    { id: 'huadong', name: '华东' }, { id: 'huanan', name: '华南' }, 
                    { id: 'huazhong', name: '华中' }, { id: 'huabei', name: '华北' }, 
                    { id: 'xinan', name: '西南' }
                ];
                const moreRegions = [
                    { id: 'dongbei', name: '东北' }, { id: 'xibei', name: '西北' }, 
                    { id: 'gangaotai', name: '港澳台' }
                ];
				const allProvinces = [ // 省份详细信息
					{ id: 'hubei', name: '湖北', regionId: 'huazhong', geoCode: '420000', center: [112.29, 30.98] }, 
					{ id: 'sichuan', name: '四川', regionId: 'xinan', geoCode: '510000', center: [102.71, 30.65] },
					{ id: 'guangdong', name: '广东', regionId: 'huanan', geoCode: '440000', center: [113.28, 23.13] },
                    { id: 'hunan', name: '湖南', regionId: 'huazhong', geoCode: '430000', center: [112.98, 28.19] }, 
                    { id: 'henan', name: '河南', regionId: 'huazhong', geoCode: '410000', center: [113.75, 34.76] },
                    { id: 'guangxi', name: '广西', regionId: 'huanan', geoCode: '450000', center: [108.32, 22.82] },
                    { id: 'yunnan', name: '云南', regionId: 'xinan', geoCode: '530000', center: [102.71, 25.04] },
                    { id: 'zhejiang', name: '浙江', regionId: 'huadong', geoCode: '330000', center: [120.15, 30.28] }, 
                    { id: 'jiangsu', name: '江苏', regionId: 'huadong', geoCode: '320000', center: [118.76, 32.04] },
                    { id: 'shanghai', name: '上海', regionId: 'huadong', geoCode: '310000', center: [121.47, 31.23] },
                    { id: 'anhui', name: '安徽', regionId: 'huadong', geoCode: '340000', center: [117.27, 31.86] },
                    { id: 'fujian', name: '福建', regionId: 'huadong', geoCode: '350000', center: [119.30, 26.08] },
                    { id: 'jiangxi', name: '江西', regionId: 'huadong', geoCode: '360000', center: [115.89, 28.68] },
                    { id: 'shandong', name: '山东', regionId: 'huadong', geoCode: '370000', center: [117.00, 36.65] },
                    { id: 'beijing', name: '北京', regionId: 'huabei', geoCode: '110000', center: [116.40, 39.90] },
                    { id: 'tianjin', name: '天津', regionId: 'huabei', geoCode: '120000', center: [117.20, 39.13] },
                    { id: 'hebei', name: '河北', regionId: 'huabei', geoCode: '130000', center: [114.52, 38.04] },
                    { id: 'shanxi', name: '山西', regionId: 'huabei', geoCode: '140000', center: [112.56, 37.87] },
                    { id: 'neimenggu', name: '内蒙古', regionId: 'huabei', geoCode: '150000', center: [111.65, 40.82] },
                    { id: 'chongqing', name: '重庆', regionId: 'xinan', geoCode: '500000', center: [106.55, 29.56] },
                    { id: 'guizhou', name: '贵州', regionId: 'xinan', geoCode: '520000', center: [106.71, 26.57] },
                    { id: 'xizang', name: '西藏', regionId: 'xinan', geoCode: '540000', center: [91.11, 29.97] },
                    { id: 'liaoning', name: '辽宁', regionId: 'dongbei', geoCode: '210000', center: [123.43, 41.80] },
                    { id: 'jilin', name: '吉林', regionId: 'dongbei', geoCode: '220000', center: [125.32, 43.89] },
                    { id: 'heilongjiang', name: '黑龙江', regionId: 'dongbei', geoCode: '230000', center: [126.63, 45.75] },
                    { id: 'shaanxi', name: '陕西', regionId: 'xibei', geoCode: '610000', center: [108.95, 34.26] },
                    { id: 'gansu', name: '甘肃', regionId: 'xibei', geoCode: '620000', center: [103.82, 36.06] },
                    { id: 'qinghai', name: '青海', regionId: 'xibei', geoCode: '630000', center: [101.78, 36.62] },
                    { id: 'ningxia', name: '宁夏', regionId: 'xibei', geoCode: '640000', center: [106.27, 38.47] },
                    { id: 'xinjiang', name: '新疆', regionId: 'xibei', geoCode: '650000', center: [87.62, 43.79] },
                    { id: 'hainan', name: '海南', regionId: 'huanan', geoCode: '460000', center: [110.35, 20.02] },
                    { id: 'xianggang', name: '香港', regionId: 'gangaotai', geoCode: '810000', center: [114.17, 22.28] },
                    { id: 'aomen', name: '澳门', regionId: 'gangaotai', geoCode: '820000', center: [113.54, 22.19] },
                    { id: 'taiwan', name: '台湾', regionId: 'gangaotai', geoCode: '710000', center: [121.50, 25.04] }
				];
				const allCategories = [ // 分类信息
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
				];

				return { code: 0, data: { regions, moreRegions, allProvinces, allCategories } };
			} catch (error) {
				return { code: 500, msg: '获取地图页面初始数据失败', error: error.message };
			}

		case 'getSpecialtiesByFilter':
			try {
				let query = {};
				
				// 真实数据库查询实现
				/*
				if (provinceId) {
					// 查询province_id字段
					const province = await db.collection('provinces').where({id: provinceId}).limit(1).get();
					if (province.data && province.data.length > 0) {
						query.province = province.data[0].name;
					}
				}
				
				if (categoryId && categoryId !== 'all') {
					query.categoryCode = categoryId;
				}

				const specialtiesCollection = db.collection('specialties');
				const countResult = await specialtiesCollection.where(query).count();
				const total = countResult.total;
				const result = await specialtiesCollection.where(query)
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.get();
                
                return { 
					code: 0, 
					data: { 
						list: result.data,
						hasMore: (page * pageSize) < total
					}
				};
				*/
                
                // 模拟数据库查询
                const mockAllSpecialtiesDb = [
                    {id: 'hb001', name: '武昌鱼', province: '湖北', city: '武汉', categoryCode: 'food', description: '肉质鲜嫩，营养丰富', image: 'https://images.unsplash.com/photo-1534766471485-18e1e52bee8c?h=90&w=90', location: {lng: 114.30, lat: 30.59}},
                    {id: 'hb002', name: '热干面', province: '湖北', city: '武汉', categoryCode: 'food', description: '武汉名小吃，香、咸、辣', image: 'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?h=90&w=90', location: {lng: 114.28, lat: 30.58}},
                    {id: 'hb003', name: '鄂州莲藕', province: '湖北', city: '鄂州', categoryCode: 'vegetable', description: '肉质细嫩，色白如玉', image: 'https://images.unsplash.com/photo-1544467468-9ad659372f66?h=90&w=90', location: {lng: 114.89, lat: 30.38}},
                    {id: 'hb004', name: '宜昌柑橘', province: '湖北', city: '宜昌', categoryCode: 'fruit', description: '色泽金黄，汁多味甜', image: 'https://images.unsplash.com/photo-1591183137550-fd9c8ff4a485?h=90&w=90', location: {lng: 111.28, lat: 30.69}},
                    {id: 'hb005', name: '十堰太极泉酒', province: '湖北', city: '十堰', categoryCode: 'alcohol', description: '清澈透明，醇厚爽口', image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?h=90&w=90', location: {lng: 110.79, lat: 32.65}},
                    {id: 'hb006', name: '恩施玉露茶', province: '湖北', city: '恩施', categoryCode: 'tea', description: '清香持久，滋味醇厚', image: 'https://images.unsplash.com/photo-1582542734256-c0d3fea2500b?h=90&w=90', location: {lng: 109.48, lat: 30.27}},
                    {id: 'sc001', name: '郫县豆瓣酱', province: '四川', city: '成都', categoryCode: 'material', description: '川菜之魂', image: 'https://via.placeholder.com/90', location: {lng:103.90 , lat:30.81}},
                    {id: 'sc002', name: '担担面', province: '四川', city: '成都', categoryCode: 'food', description: '麻辣爽口', image: 'https://via.placeholder.com/90', location: {lng:104.06 , lat:30.67}},
                    {id: 'sc003', name: '川北凉粉', province: '四川', city: '广元', categoryCode: 'snack', description: '清爽可口', image: 'https://via.placeholder.com/90', location: {lng:105.84 , lat:32.44}},
                    {id: 'gd001', name: '沙糖桔', province: '广东', city: '江门', categoryCode: 'fruit', description: '皮薄汁多、甜酸适口', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?h=90&w=90', location: {lng: 113.08, lat: 22.57}},
                    {id: 'gd002', name: '新会陈皮', province: '广东', city: '江门', categoryCode: 'material', description: '药食两用，具有理气健脾功效', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?h=90&w=90', location: {lng: 113.02, lat: 22.45}},
                    {id: 'gd003', name: '肠粉', province: '广东', city: '广州', categoryCode: 'snack', description: '薄如蝉翼，口感滑嫩', image: 'https://via.placeholder.com/90', location: {lng: 113.26, lat: 23.13}}
                ];

                // 根据条件筛选
                let filtered = mockAllSpecialtiesDb;
                
                if (provinceId) {
                    // 从省份数据中查找对应的省份名称
                    const province = allProvinces.find(p => p.id === provinceId);
                    if (province) {
                        filtered = filtered.filter(s => s.province === province.name);
                    }
                }
                
                if (categoryId && categoryId !== 'all') {
                    filtered = filtered.filter(s => s.categoryCode === categoryId);
                }
                
                // 分页处理
                const total = filtered.length;
                const list = filtered.slice((page - 1) * pageSize, page * pageSize);

				return { 
					code: 0, 
					data: { 
						list: list,
						hasMore: (page * pageSize) < total
					}
				};
			} catch (error) {
				return { code: 500, msg: '获取特产列表失败', error: error.message };
			}
			
		default:
			return { code: 404, msg: '请求的action不存在' };
	}
}; 