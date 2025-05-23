'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const $ = db.command.aggregate;
	const _ = db.command;

	const { action, provinceId, categoryId, page = 1, pageSize = 10 } = event;

	switch (action) {
		case 'getMapPageData':
			try {
				// These would normally come from database collections
				const regions = [
                    { id: 'huadong', name: '华东' }, { id: 'huanan', name: '华南' }, 
                    { id: 'huazhong', name: '华中' }, { id: 'huabei', name: '华北' }, 
                    { id: 'xinan', name: '西南' }
                ];
                const moreRegions = [
                    { id: 'dongbei', name: '东北' }, { id: 'xibei', name: '西北' }, 
                    { id: 'gangaotai', name: '港澳台' }
                ];
				const allProvinces = [ // Add more province details like geoCode, regionId
					{ id: 'hubei', name: '湖北', regionId: 'huazhong', geoCode: '420000', center: [112.29, 30.98] }, 
					{ id: 'sichuan', name: '四川', regionId: 'xinan', geoCode: '510000', center: [102.71, 30.65] },
					{ id: 'guangdong', name: '广东', regionId: 'huanan', geoCode: '440000', center: [113.28, 23.13] },
                    { id: 'hunan', name: '湖南', regionId: 'huazhong' }, { id: 'henan', name: '河南', regionId: 'huazhong' },
                    { id: 'guangxi', name: '广西', regionId: 'huanan' },
                    { id: 'yunnan', name: '云南', regionId: 'xinan' },
                    { id: 'zhejiang', name: '浙江', regionId: 'huadong'}, { id: 'jiangsu', name: '江苏', regionId: 'huadong'}
				];
				const allCategories = [ // Add icon details from your mapping if stored in DB
                    { id: 'all', name: '全部', icon: 'map-pin-ellipse', iconColor: '#D83931', iconBgColor: '#D839311A', activeIconColor: '#FFF', activeIconBgColor: '#D83931' },
                    { id: 'food', name: '主食', icon: 'medal', iconColor: '#F7C873', iconBgColor: '#F7C8731A', activeIconColor: '#FFF', activeIconBgColor: '#F7C873' },
                    { id: 'material', name: '副食', icon: 'flag', iconColor: '#9B59B6', iconBgColor: '#9B59B61A', activeIconColor: '#FFF', activeIconBgColor: '#9B59B6'},
                    { id: 'snack', name: '小吃', icon: 'gift', iconColor: '#58D68D', iconBgColor: '#58D68D1A', activeIconColor: '#FFF', activeIconBgColor: '#58D68D' },
                    { id: 'dessert', name: '零食', icon: 'pyramid', iconColor: '#E74C3C', iconBgColor: '#E74C3C1A', activeIconColor: '#FFF', activeIconBgColor: '#E74C3C'  },
                    { id: 'alcohol', name: '烟酒', icon: 'settings', iconColor: '#7F8C8D', iconBgColor: '#7F8C8D1A', activeIconColor: '#FFF', activeIconBgColor: '#7F8C8D' },
                    { id: 'tea', name: '茶叶', icon: 'paperplane', iconColor: '#1ABC9C', iconBgColor: '#1ABC9C1A', activeIconColor: '#FFF', activeIconBgColor: '#1ABC9C' },
				];

				return { code: 0, data: { regions, moreRegions, allProvinces, allCategories } };
			} catch (error) {
				return { code: 500, msg: '获取地图页面初始数据失败', error: error.message };
			}

		case 'getSpecialtiesByFilter':
			try {
				let query = {};
				if (provinceId) {
					// Assuming provinces are stored by 'id' (e.g., 'hubei') or 'name'
                    // In a real DB, you'd query where province_id_ref == provinceId or province_name == currentProvinceName
                    const provinceObj = await db.collection('provinces').where({id: provinceId}).limit(1).get();
                    // For mock, we filter by name if ID is not directly in specialty:
                    // This part needs to align with your actual 'specialties' schema.
                    // If 'specialties' has a 'provinceName' field:
                    // query.provinceName = (await db.collection('provinces').doc(provinceId).get()).data[0].name;
                    // Or, if 'specialties' stores provinceId directly:
                    // query.province_id = provinceId;
                    // For mock, let's assume provinceId is like 'hubei', and specialties have a provinceName '湖北'
                    // This is a simplification.
                    if(provinceId === 'hubei') query.province = '湖北';
                    else if(provinceId === 'sichuan') query.province = '四川';
                    else if(provinceId === 'guangdong') query.province = '广东';
                    // ... and so on, or fetch province name from a 'provinces' collection using provinceId
				}
				if (categoryId && categoryId !== 'all') {
					query.categoryCode = categoryId; // Assuming 'specialties' has 'categoryCode'
				}

				// const specialtiesCollection = db.collection('specialties');
				// const countResult = await specialtiesCollection.where(query).count();
				// const total = countResult.total;
				// const res = await specialtiesCollection.where(query)
				// 	.skip((page - 1) * pageSize)
				// 	.limit(pageSize)
				// 	.get();
                
                // Mocking database fetch:
                const mockAllSpecialtiesDb = [
                    {id: 'hb001', name: '武昌鱼', province: '湖北', city: '武汉', categoryCode: 'food', description: '肉质鲜嫩，营养丰富', image: 'https://images.unsplash.com/photo-1534766471485-18e1e52bee8c?h=90&w=90', location: {lng: 114.30, lat: 30.59}},
                    {id: 'hb002', name: '热干面', province: '湖北', city: '武汉', categoryCode: 'food', description: '武汉名小吃，香、咸、辣', image: 'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?h=90&w=90', location: {lng: 114.28, lat: 30.58}},
                    {id: 'hb003', name: '鄂州莲藕', province: '湖北', city: '鄂州', categoryCode: 'vegetable', description: '肉质细嫩，色白如玉', image: 'https://images.unsplash.com/photo-1544467468-9ad659372f66?h=90&w=90', location: {lng: 114.89, lat: 30.38}},
                    {id: 'sc001', name: '郫县豆瓣', province: '四川', city: '成都', categoryCode: 'material', description: '川菜之魂', image: 'https://via.placeholder.com/90', location: {lng:103.90 , lat:30.81}},
                    {id: 'gd001', name: '沙糖桔', province: '广东', city: '江门', categoryCode: 'fruit', description: '皮薄汁多、甜酸适口', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?h=90&w=90', location: {lng: 113.08, lat: 22.57}},
                ];

                let filtered = mockAllSpecialtiesDb;
                if (query.province) {
                    filtered = filtered.filter(s => s.province === query.province);
                }
                if (query.categoryCode) {
                    filtered = filtered.filter(s => s.categoryCode === query.categoryCode);
                }
                const total = filtered.length;
                const list = filtered.slice((page - 1) * pageSize, page * pageSize);


				return { 
					code: 0, 
					data: { 
						list: list, //res.data
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