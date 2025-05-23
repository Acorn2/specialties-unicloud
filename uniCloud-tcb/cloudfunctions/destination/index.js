'use strict';

// 云函数入口
exports.main = async (event, context) => {
	const userInfo = context.OPENID ? {
		userOpenId: context.OPENID
	} : {
		userOpenId: '123456' // 模拟用户ID，实际应该从context中获取
	};
	
	console.log('云函数destination请求参数：', event);
	
	// 根据不同的action分发到不同的处理函数
	switch(event.action) {
		case 'getDestinations':
			return await getDestinations();
		default:
			return {
				code: -1,
				msg: '未知的action类型'
			}
	}
};

/**
 * 获取目的地数据（省份和城市）
 */
async function getDestinations() {
	try {
		// 模拟数据库查询延迟
		await new Promise(resolve => setTimeout(resolve, 500));
		
		// 构造模拟省份数据
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
			},
			{
				code: 'sichuan',
				name: '四川省',
				pinyin: 'sichuan',
				region: 'southwest',
				specialtyCount: 89,
				image: 'https://images.unsplash.com/photo-1505857231560-ec212fad5b80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzg0NzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			},
			{
				code: 'yunnan',
				name: '云南省',
				pinyin: 'yunnan',
				region: 'southwest',
				specialtyCount: 85,
				image: 'https://images.unsplash.com/photo-1517900347-0db362251acd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEscGxhY2V8fHx8fHwxNjQ5NTM4NDk1&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			},
			{
				code: 'hebei',
				name: '河北省',
				pinyin: 'hebei',
				region: 'north',
				specialtyCount: 68,
				image: 'https://images.unsplash.com/photo-1547495827-f26765c7abab?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEscGxhY2V8fHx8fHwxNjQ5NTM4NTE1&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			},
			{
				code: 'shanxi',
				name: '山西省',
				pinyin: 'shanxi',
				region: 'north',
				specialtyCount: 63,
				image: 'https://images.unsplash.com/photo-1507765042886-6df4205be2fc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEscGxhY2V8fHx8fHwxNjQ5NTM4NTMz&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			},
			{
				code: 'shaanxi',
				name: '陕西省',
				pinyin: 'shaanxi',
				region: 'northwest',
				specialtyCount: 77,
				image: 'https://images.unsplash.com/photo-1517509520264-7225e5cf2eda?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3VsdHVyZXx8fHx8fDE2NDk1Mzg1NzI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			},
			{
				code: 'liaoning',
				name: '辽宁省',
				pinyin: 'liaoning',
				region: 'northeast',
				specialtyCount: 67,
				image: 'https://images.unsplash.com/photo-1555176018-9c2c2c2b2b83?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzg1OTQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			},
			{
				code: 'guangxi',
				name: '广西壮族自治区',
				pinyin: 'guangxi',
				region: 'south',
				specialtyCount: 72,
				image: 'https://images.unsplash.com/photo-1518733934697-e8d1b19b6a5a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzg2MTI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400'
			}
		];
		
		// 构造模拟城市数据
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
			},
			{
				code: 'suzhou',
				name: '苏州市',
				pinyin: 'suzhou',
				provinceCode: 'jiangsu',
				provinceName: '江苏省',
				region: 'east',
				specialtyCount: 39,
				tags: ['丝绸', '点心', '小吃'],
				image: 'https://images.unsplash.com/photo-1510332981392-36692ea3a195?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2MzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'xian',
				name: '西安市',
				pinyin: 'xian',
				provinceCode: 'shaanxi',
				provinceName: '陕西省',
				region: 'northwest',
				specialtyCount: 37,
				tags: ['小吃', '面食', '肉类'],
				image: 'https://images.unsplash.com/photo-1528201907966-4032e43339a6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2NDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'qingdao',
				name: '青岛市',
				pinyin: 'qingdao',
				provinceCode: 'shandong',
				provinceName: '山东省',
				region: 'east',
				specialtyCount: 35,
				tags: ['海鲜', '啤酒', '小吃'],
				image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2NTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'kunming',
				name: '昆明市',
				pinyin: 'kunming',
				provinceCode: 'yunnan',
				provinceName: '云南省',
				region: 'southwest',
				specialtyCount: 34,
				tags: ['茶叶', '鲜花', '药材'],
				image: 'https://images.unsplash.com/photo-1517900347-0db362251acd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2NjA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'shenzhen',
				name: '深圳市',
				pinyin: 'shenzhen',
				provinceCode: 'guangdong',
				provinceName: '广东省',
				region: 'south',
				specialtyCount: 32,
				tags: ['粤菜', '海鲜', '点心'],
				image: 'https://images.unsplash.com/photo-1575738869402-9b796ef63b26?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2NzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'wuhan',
				name: '武汉市',
				pinyin: 'wuhan',
				provinceCode: 'hubei',
				provinceName: '湖北省',
				region: 'central',
				specialtyCount: 31,
				tags: ['热干面', '小吃', '鲜食'],
				image: 'https://images.unsplash.com/photo-1513415564515-fef26e71a5fc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2ODA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'nanjing',
				name: '南京市',
				pinyin: 'nanjing',
				provinceCode: 'jiangsu',
				provinceName: '江苏省',
				region: 'east',
				specialtyCount: 29,
				tags: ['云锦', '点心', '小吃'],
				image: 'https://images.unsplash.com/photo-1535756377588-75e83291d582?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg2OTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'shanghai',
				name: '上海市',
				pinyin: 'shanghai',
				provinceCode: 'shanghai',
				provinceName: '上海市',
				region: 'east',
				specialtyCount: 43,
				tags: ['点心', '小吃', '丝绸'],
				image: 'https://images.unsplash.com/photo-1465639091255-5b383ecb9321?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY2l0eXx8fHx8fDE2NDk1Mzg3MDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
			},
			{
				code: 'beijing',
				name: '北京市',
				pinyin: 'beijing',
				provinceCode: 'beijing',
				provinceName: '北京市',
				region: 'north',
				specialtyCount: 46,
				tags: ['烤鸭', '小吃', '宫廷菜'],
				image: 'https://images.unsplash.com/photo-1563990262971-695bc4cb7e69?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8YmVpamluZ3x8fHx8fDE2NDk1Mzg3MTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=100'
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
	} catch (e) {
		console.error('getDestinations Error:', e);
		return {
			code: -1,
			msg: '获取目的地数据失败'
		};
	}
} 