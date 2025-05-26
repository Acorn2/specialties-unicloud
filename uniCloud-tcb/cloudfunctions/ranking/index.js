'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const $ = db.command.aggregate;
	const _ = db.command;

	const { action, provinceId, province, page = 1, pageSize = 10 } = event;

	switch (action) {
		case 'getRankingPageData':
			try {
				// 这些数据在实际应用中应该从数据库集合中获取
				const regions = [
					{ id: 'huadong', name: '华东' }, { id: 'huanan', name: '华南' }, 
					{ id: 'huazhong', name: '华中' }, { id: 'huabei', name: '华北' }, 
					{ id: 'xinan', name: '西南' }
				];
				const moreRegions = [
					{ id: 'dongbei', name: '东北' }, { id: 'xibei', name: '西北' }, 
					{ id: 'gangaotai', name: '港澳台' }
				];
				const allProvinces = [
					{ id: 'hubei', name: '湖北', regionId: 'huazhong' }, 
					{ id: 'hunan', name: '湖南', regionId: 'huazhong' }, 
					{ id: 'henan', name: '河南', regionId: 'huazhong' },
					{ id: 'sichuan', name: '四川', regionId: 'xinan' },
					{ id: 'yunnan', name: '云南', regionId: 'xinan' },
					{ id: 'guizhou', name: '贵州', regionId: 'xinan' },
					{ id: 'guangdong', name: '广东', regionId: 'huanan' },
					{ id: 'guangxi', name: '广西', regionId: 'huanan' },
					{ id: 'hainan', name: '海南', regionId: 'huanan' },
					{ id: 'zhejiang', name: '浙江', regionId: 'huadong' },
					{ id: 'jiangsu', name: '江苏', regionId: 'huadong' },
					{ id: 'shandong', name: '山东', regionId: 'huadong' },
					{ id: 'anhui', name: '安徽', regionId: 'huadong' },
					{ id: 'fujian', name: '福建', regionId: 'huadong' },
					{ id: 'jiangxi', name: '江西', regionId: 'huadong' },
					{ id: 'shanghai', name: '上海', regionId: 'huadong' },
					{ id: 'beijing', name: '北京', regionId: 'huabei' },
					{ id: 'tianjin', name: '天津', regionId: 'huabei' },
					{ id: 'hebei', name: '河北', regionId: 'huabei' },
					{ id: 'shanxi', name: '山西', regionId: 'huabei' },
					{ id: 'neimenggu', name: '内蒙古', regionId: 'huabei' },
					{ id: 'liaoning', name: '辽宁', regionId: 'dongbei' },
					{ id: 'jilin', name: '吉林', regionId: 'dongbei' },
					{ id: 'heilongjiang', name: '黑龙江', regionId: 'dongbei' },
					{ id: 'shaanxi', name: '陕西', regionId: 'xibei' },
					{ id: 'gansu', name: '甘肃', regionId: 'xibei' },
					{ id: 'qinghai', name: '青海', regionId: 'xibei' },
					{ id: 'ningxia', name: '宁夏', regionId: 'xibei' },
					{ id: 'xinjiang', name: '新疆', regionId: 'xibei' },
					{ id: 'xizang', name: '西藏', regionId: 'xinan' },
					{ id: 'chongqing', name: '重庆', regionId: 'xinan' },
					{ id: 'hongkong', name: '香港', regionId: 'gangaotai' },
					{ id: 'macao', name: '澳门', regionId: 'gangaotai' },
					{ id: 'taiwan', name: '台湾', regionId: 'gangaotai' }
				];
				const categoryMapping = {
					"all": { name: "全部", color: "#D83931", icon: "map-pin-ellipse" },
					"food": { name: "主食", color: "#F7C873", icon: "medal" },
					"material": { name: "副食", color: "#9B59B6", icon: "flag" },
					"snack": { name: "小吃", color: "#58D68D", icon: "gift" },
					"dessert": { name: "零食", color: "#E74C3C", icon: "pyramid" },
					"alcohol": { name: "烟酒", color: "#7F8C8D", icon: "settings" },
					"tea": { name: "茶叶", color: "#1ABC9C", icon: "paperplane" },
					"drink": { name: "饮料", color: "#3498DB", icon: "glass" },
					"fruit": { name: "水果", color: "#2ECC71", icon: "apple" },
					"vegetable": { name: "蔬菜", color: "#16A085", icon: "carrot" },
					"seafood": { name: "水产海鲜", color: "#0E6EAE", icon: "fish" },
					"craft": { name: "工艺品", color: "#8E44AD", icon: "scissors" },
					"medicine": { name: "药材", color: "#D35400", icon: "pill" },
					"flower": { name: "花卉", color: "#27AE60", icon: "flower" },
					"fresh": { name: "生鲜", color: "#58D68D", icon: "leaf" }
				};

				return { code: 0, data: { regions, moreRegions, allProvinces, categoryMapping } };
			} catch (error) {
				return { code: 500, msg: '获取榜单页面初始数据失败', error: error.message };
			}

		case 'getProvinceRanking':
			try {
				if (!provinceId) {
					return { code: 400, msg: '缺少省份ID参数' };
				}

				// 在实际应用中，应该从数据库中查询特产榜单
				// const specialtiesCollection = db.collection('specialties');
				// const res = await specialtiesCollection.where({
				// 	province_id: provinceId
				// }).orderBy('view_count', 'desc').limit(10).get();
				
				// 模拟数据
				const mockRankingData = {
					"hubei": [
						{
							id: "hb001",
							name: "热干面",
							province: "湖北",
							city: "武汉",
							category: "主食类",
							description: "武汉名小吃，香、咸、辣、甜，回味悠长",
							image: "https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "food",
							viewCount: "21.5万",
							trend: "up",
							trendValue: "1",
							geo: true,
							heritage: false
						},
						{
							id: "hb002",
							name: "武昌鱼",
							province: "湖北",
							city: "武汉",
							category: "主食类",
							description: "肉质鲜嫩，营养丰富，蛋白质含量高",
							image: "https://images.unsplash.com/photo-1534766471485-18e1e52bee8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "food",
							viewCount: "18.9万",
							trend: "down",
							trendValue: "1",
							geo: true,
							heritage: true
						},
						{
							id: "hb003",
							name: "鄂州莲藕",
							province: "湖北",
							city: "鄂州",
							category: "生鲜类",
							description: "肉质细嫩，色白如玉，风味独特",
							image: "https://images.unsplash.com/photo-1544467468-9ad659372f66?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "fresh",
							viewCount: "16.7万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "hb004",
							name: "宜昌柑橘",
							province: "湖北",
							city: "宜昌",
							category: "生鲜类",
							description: "色泽金黄，汁多味甜，果肉细嫩",
							image: "https://images.unsplash.com/photo-1591183137550-fd9c8ff4a485?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "fresh",
							viewCount: "15.3万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: false
						},
						{
							id: "hb005",
							name: "恩施玉露茶",
							province: "湖北",
							city: "恩施",
							category: "饮品类",
							description: "清香持久，滋味醇厚，叶底嫩绿",
							image: "https://images.unsplash.com/photo-1582542734256-c0d3fea2500b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "drink",
							viewCount: "14.2万",
							trend: "up",
							trendValue: "3",
							geo: true,
							heritage: true
						},
						{
							id: "hb006",
							name: "十堰太极泉酒",
							province: "湖北",
							city: "十堰",
							category: "饮品类",
							description: "清澈透明，醇厚爽口，回味悠长",
							image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "drink",
							viewCount: "12.8万",
							trend: "down",
							trendValue: "2",
							geo: false,
							heritage: false
						},
						{
							id: "hb007",
							name: "洪湖藕带",
							province: "湖北",
							city: "洪湖",
							category: "生鲜类",
							description: "肉质鲜嫩，口感爽脆，富含矿物质和膳食纤维",
							image: "https://images.unsplash.com/photo-1611564494260-fae07242e7ed?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "fresh",
							viewCount: "11.8万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "hb008",
							name: "云梦小龙虾",
							province: "湖北",
							city: "云梦",
							category: "生鲜类",
							description: "个体壮硕，肉质饱满，鲜香麻辣，回味无穷",
							image: "https://images.unsplash.com/photo-1588485256313-f095810cf537?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "fresh",
							viewCount: "10.5万",
							trend: "up",
							trendValue: "5",
							geo: false,
							heritage: false
						},
						{
							id: "hb009",
							name: "麻城福白菊",
							province: "湖北",
							city: "麻城",
							category: "药材类",
							description: "菊香浓郁，入药养生，有清热解毒、明目降压等功效",
							image: "https://images.unsplash.com/photo-1584820229002-37e8cb888bdc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsaGVyYnx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "medicine",
							viewCount: "9.8万",
							trend: "down",
							trendValue: "1",
							geo: true,
							heritage: true
						},
						{
							id: "hb010",
							name: "通城银针茶",
							province: "湖北",
							city: "通城",
							category: "饮品类",
							description: "色泽银白，香气清高，滋味鲜爽，叶芽挺直似针",
							image: "https://images.unsplash.com/photo-1566192091758-7141fb0676a0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTUzOTY2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "drink",
							viewCount: "8.6万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: false
						}
					],
					"guangdong": [
						{
							id: "gd001",
							name: "沙糖桔",
							province: "广东",
							city: "江门",
							category: "生鲜类",
							description: "皮薄汁多、甜酸适口，富含维生素C",
							image: "https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "fresh",
							viewCount: "12.5万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "gd002",
							name: "新会陈皮",
							province: "广东",
							city: "江门",
							category: "副食类",
							description: "药食两用，具有理气健脾、燥湿化痰功效",
							image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "material",
							viewCount: "11.3万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: true
						}
					],
					"sichuan": [
						{
							id: "sc001",
							name: "郫县豆瓣酱",
							province: "四川",
							city: "成都",
							category: "副食类",
							description: "四川郫县特产，色泽红亮，香辣浓郁，被誉为川菜的灵魂",
							image: "https://images.unsplash.com/photo-1605197181726-e3bd08490ba1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=90&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=90",
							categoryCode: "material",
							viewCount: "18.2万",
							trend: "up",
							trendValue: "1",
							geo: true,
							heritage: false
						}
					]
				};

				// 获取指定省份的榜单数据
				const list = mockRankingData[provinceId] || [];

				return { code: 0, data: { list } };
			} catch (error) {
				return { code: 500, msg: '获取省份榜单数据失败', error: error.message };
			}

		case 'getProvinceSpecialties':
			try {
				if (!province) {
					return { code: 400, msg: '缺少省份参数' };
				}
				
				// 补充完整的测试数据，参考ranking.html文件
				const mockRankingData = {
					"hubei": [
						{
							id: "hb001",
							name: "热干面",
							province: "hubei",
							provinceName: "湖北",
							city: "武汉",
							category: "主食类",
							categoryCode: "food",
							description: "武汉名小吃，香、咸、辣、甜，回味悠长",
							image: "https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "21.5万",
							trend: "up",
							trendValue: "1",
							geo: true,
							heritage: false
						},
						{
							id: "hb002",
							name: "武昌鱼",
							province: "hubei",
							provinceName: "湖北",
							city: "武汉",
							category: "主食类",
							categoryCode: "food",
							description: "肉质鲜嫩，营养丰富，蛋白质含量高",
							image: "https://images.unsplash.com/photo-1534766471485-18e1e52bee8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "18.9万",
							trend: "down",
							trendValue: "1",
							geo: true,
							heritage: true
						},
						{
							id: "hb003",
							name: "鄂州莲藕",
							province: "hubei",
							provinceName: "湖北",
							city: "鄂州",
							category: "生鲜类",
							categoryCode: "fresh",
							description: "肉质细嫩，色白如玉，风味独特",
							image: "https://images.unsplash.com/photo-1544467468-9ad659372f66?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "16.7万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "hb004",
							name: "宜昌柑橘",
							province: "hubei",
							provinceName: "湖北",
							city: "宜昌",
							category: "生鲜类",
							categoryCode: "fresh",
							description: "色泽金黄，汁多味甜，果肉细嫩",
							image: "https://images.unsplash.com/photo-1591183137550-fd9c8ff4a485?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "15.3万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: false
						},
						{
							id: "hb005",
							name: "恩施玉露茶",
							province: "hubei",
							provinceName: "湖北",
							city: "恩施",
							category: "饮品类",
							categoryCode: "drink",
							description: "清香持久，滋味醇厚，叶底嫩绿",
							image: "https://images.unsplash.com/photo-1582542734256-c0d3fea2500b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "14.2万",
							trend: "up",
							trendValue: "3",
							geo: true,
							heritage: true
						},
						{
							id: "hb006",
							name: "十堰太极泉酒",
							province: "hubei",
							provinceName: "湖北",
							city: "十堰",
							category: "饮品类",
							categoryCode: "alcohol",
							description: "清澈透明，醇厚爽口，回味悠长",
							image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "12.8万",
							trend: "down",
							trendValue: "2",
							geo: false,
							heritage: false
						},
						{
							id: "hb007",
							name: "洪湖藕带",
							province: "hubei",
							provinceName: "湖北",
							city: "洪湖",
							category: "生鲜类",
							categoryCode: "fresh",
							description: "肉质鲜嫩，口感爽脆，富含矿物质和膳食纤维",
							image: "https://images.unsplash.com/photo-1611564494260-fae07242e7ed?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "11.8万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "hb008",
							name: "云梦小龙虾",
							province: "hubei",
							provinceName: "湖北",
							city: "云梦",
							category: "生鲜类",
							categoryCode: "seafood",
							description: "个体壮硕，肉质饱满，鲜香麻辣，回味无穷",
							image: "https://images.unsplash.com/photo-1588485256313-f095810cf537?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "10.5万",
							trend: "up",
							trendValue: "5",
							geo: false,
							heritage: false
						},
						{
							id: "hb009",
							name: "麻城福白菊",
							province: "hubei",
							provinceName: "湖北",
							city: "麻城",
							category: "药材类",
							categoryCode: "medicine",
							description: "菊香浓郁，入药养生，有清热解毒、明目降压等功效",
							image: "https://images.unsplash.com/photo-1584820229002-37e8cb888bdc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsaGVyYnx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "9.8万",
							trend: "down",
							trendValue: "1",
							geo: true,
							heritage: true
						},
						{
							id: "hb010",
							name: "通城银针茶",
							province: "hubei",
							provinceName: "湖北",
							city: "通城",
							category: "饮品类",
							categoryCode: "tea",
							description: "色泽银白，香气清高，滋味鲜爽，叶芽挺直似针",
							image: "https://images.unsplash.com/photo-1566192091758-7141fb0676a0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTUzOTY2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "8.6万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: false
						}
					],
					"guangdong": [
						{
							id: "gd001",
							name: "沙糖桔",
							province: "guangdong",
							provinceName: "广东",
							city: "江门",
							category: "生鲜类",
							categoryCode: "fresh",
							description: "皮薄汁多、甜酸适口，富含维生素C",
							image: "https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "12.5万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "gd002",
							name: "新会陈皮",
							province: "guangdong",
							provinceName: "广东",
							city: "江门",
							category: "副食类",
							categoryCode: "material",
							description: "药食两用，具有理气健脾、燥湿化痰功效",
							image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1MzgyNDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "11.3万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: true
						},
						{
							id: "gd003",
							name: "潮州凤凰单丛茶",
							province: "guangdong",
							provinceName: "广东",
							city: "潮州",
							category: "饮品类",
							categoryCode: "tea",
							description: "香气馥郁，滋味甘醇，带有天然的兰花香和蜜桃香",
							image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTUzOTY2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "10.7万",
							trend: "up",
							trendValue: "3",
							geo: true,
							heritage: true
						}
					],
					"sichuan": [
						{
							id: "sc001",
							name: "郫县豆瓣酱",
							province: "sichuan",
							provinceName: "四川",
							city: "成都",
							category: "副食类",
							categoryCode: "material",
							description: "四川郫县特产，色泽红亮，香辣浓郁，被誉为川菜的灵魂",
							image: "https://images.unsplash.com/photo-1605197181726-e3bd08490ba1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "18.2万",
							trend: "up",
							trendValue: "1",
							geo: true,
							heritage: false
						},
						{
							id: "sc002",
							name: "宜宾燃面",
							province: "sichuan",
							provinceName: "四川",
							city: "宜宾",
							category: "主食类",
							categoryCode: "food",
							description: "麻辣鲜香，劲道爽滑，口感独特，回味悠长",
							image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsbm9vZGxlfHx8fHx8MTY0OTUzOTY2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "16.9万",
							trend: "up",
							trendValue: "2",
							geo: true,
							heritage: false
						},
						{
							id: "sc003",
							name: "乐山甜皮鸭",
							province: "sichuan",
							provinceName: "四川",
							city: "乐山",
							category: "主食类",
							categoryCode: "food",
							description: "外酥里嫩，甜中带香，回味无穷",
							image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZHVja3x8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "15.3万",
							trend: "down",
							trendValue: "1",
							geo: false,
							heritage: false
						},
						{
							id: "sc004",
							name: "泸州老窖",
							province: "sichuan",
							provinceName: "四川",
							city: "泸州",
							category: "饮品类",
							categoryCode: "alcohol",
							description: "窖香浓郁，绵柔甘洌，回味悠长",
							image: "https://images.unsplash.com/photo-1649578474542-d8cec4d88720?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsYWxjb2hvbHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "14.8万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: true
						}
					],
					"zhejiang": [
						{
							id: "zj001",
							name: "西湖龙井",
							province: "zhejiang",
							provinceName: "浙江",
							city: "杭州",
							category: "饮品类",
							categoryCode: "tea",
							description: "色泽翠绿，香气清高，滋味鲜爽，形美味佳",
							image: "https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTUzOTY2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "19.6万",
							trend: "up",
							trendValue: "1",
							geo: true,
							heritage: true
						},
						{
							id: "zj002",
							name: "金华火腿",
							province: "zhejiang",
							provinceName: "浙江",
							city: "金华",
							category: "副食类",
							categoryCode: "material",
							description: "色泽红润，咸甜适口，肉质细嫩，香气独特",
							image: "https://images.unsplash.com/photo-1636333936063-35856955468e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsaGFtfHx8fHx8MTY0OTUzOTY2MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "16.7万",
							trend: "same",
							trendValue: "0",
							geo: true,
							heritage: false
						}
					],
					"jiangsu": [
						{
							id: "js001",
							name: "苏州桂花糖藕",
							province: "jiangsu",
							provinceName: "江苏",
							city: "苏州",
							category: "小吃类",
							categoryCode: "snack",
							description: "色泽莹白，香甜爽口，软糯清凉",
							image: "https://images.unsplash.com/photo-1591814868095-d828552eefd3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "14.2万",
							trend: "up",
							trendValue: "2",
							geo: false,
							heritage: false
						},
						{
							id: "js002",
							name: "南京盐水鸭",
							province: "jiangsu",
							provinceName: "江苏",
							city: "南京",
							category: "主食类",
							categoryCode: "food",
							description: "皮色红亮，肉质细嫩，咸香适口",
							image: "https://images.unsplash.com/photo-1551892375-cf8c5115bc8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=160&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZHVja3x8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=160",
							viewCount: "15.8万",
							trend: "down",
							trendValue: "1",
							geo: true,
							heritage: true
						}
					]
				};
				
				// 获取指定省份的榜单数据
				const list = mockRankingData[province] || [];
				
				// 进行分页处理
				const start = (page - 1) * pageSize;
				const end = start + pageSize;
				const pageList = list.slice(start, end);
				
				return { 
					code: 0, 
					message: '获取成功',
					data: pageList,
					total: list.length,
					page,
					pageSize
				};
			} catch (error) {
				return { code: 500, msg: '获取省份特产数据失败', error: error.message };
			}

		default:
			return { code: 404, msg: '请求的action不存在' };
	}
}; 