'use strict';

// 云函数入口
exports.main = async (event, context) => {
	const userInfo = context.OPENID ? {
		userOpenId: context.OPENID
	} : {
		userOpenId: '123456' // 模拟用户ID，实际应该从context中获取
	};
	
	console.log('云函数search请求参数：', event);
	
	// 根据不同的action分发到不同的处理函数
	switch(event.action) {
		case 'searchSpecialties':
			return await searchSpecialties(event, userInfo);
		case 'getHotSearchKeywords':
			return await getHotSearchKeywords();
		default:
			return {
				code: -1,
				msg: '未知的action类型'
			}
	}
};

/**
 * 搜索特产
 * @param {Object} params 搜索参数
 * @param {Object} userInfo 用户信息
 */
async function searchSpecialties(params, userInfo) {
	try {
		// 检查参数
		const { keyword, page = 1, pageSize = 10 } = params;
		
		if (!keyword) {
			return {
				code: -1,
				msg: '关键词不能为空'
			};
		}
		
		// 模拟数据库查询延迟
		await new Promise(resolve => setTimeout(resolve, 500));
		
		// 模拟特产数据
		const specialties = [
			{
				id: 'pxdb001',
				name: '郫县豆瓣酱',
				category: 'food',
				categoryName: '食品类',
				description: '四川省成都市郫都区特产，川菜的灵魂调料之一',
				province: '四川省',
				viewCount: 8600,
				image: 'https://images.unsplash.com/photo-1605197181726-e3bd08490ba1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'hnds001',
				name: '湖南豆豉',
				category: 'food',
				categoryName: '食品类',
				description: '湖南地区常见调味品，由黑豆发酵制成',
				province: '湖南省',
				viewCount: 5200,
				image: 'https://images.unsplash.com/photo-1615870123253-f3de8aa89e24?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1NDA3MTY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'lgm001',
				name: '老干妈辣椒酱',
				category: 'food',
				categoryName: '食品类',
				description: '贵州省贵阳市特产，以油辣椒为主料的复合调味料',
				province: '贵州省',
				viewCount: 12000,
				image: 'https://images.unsplash.com/photo-1614528767034-5593321e8c8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsc2F1Y2V8fHx8fHwxNjQ5NTQ0MDY4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'xhlj001',
				name: '西湖龙井茶',
				category: 'fresh',
				categoryName: '生鲜类',
				description: '浙江省杭州市特产，中国传统名茶',
				province: '浙江省',
				viewCount: 15000,
				image: 'https://images.unsplash.com/photo-1558160074-bb57ea354a5f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTU0NDEyMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'mtj001',
				name: '茅台酒',
				category: 'food',
				categoryName: '食品类',
				description: '贵州省仁怀市特产，中国传统名酒',
				province: '贵州省',
				viewCount: 18000,
				image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsYWxjb2hvbHx8fHx8fDE2NDk1NDQxNTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'szcs001',
				name: '苏州刺绣',
				category: 'craft',
				categoryName: '工艺类',
				description: '江苏省苏州市特产，中国四大名绣之一',
				province: '江苏省',
				viewCount: 9500,
				image: 'https://images.unsplash.com/photo-1513189643435-49f97650b367?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZW1icm9pZGVyeXx8fHx8fDE2NDk1NDQxODA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'acdzx001',
				name: '阿城大豆腐',
				category: 'food',
				categoryName: '食品类',
				description: '黑龙江省哈尔滨市阿城区特产，豆腐品种',
				province: '黑龙江省',
				viewCount: 4300,
				image: 'https://images.unsplash.com/photo-1564707967-faa7be87f3a3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1NDQyMTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'njyj001',
				name: '南京云锦',
				category: 'craft',
				categoryName: '工艺类',
				description: '江苏省南京市特产，中国传统名锦',
				province: '江苏省',
				viewCount: 8900,
				image: 'https://images.unsplash.com/photo-1581349847766-33819c7d9a3c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZmFicmljfHx8fHx8MTY0OTU0NDI0MA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'acdxb001',
				name: '阳澄湖大闸蟹',
				category: 'fresh',
				categoryName: '生鲜类',
				description: '江苏省苏州市特产，中国著名水产品',
				province: '江苏省',
				viewCount: 16000,
				image: 'https://images.unsplash.com/photo-1534671260208-cc77f03c068e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3JhYnx8fHx8fDE2NDk1NDQyNzA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'sxlp001',
				name: '陕西凉皮',
				category: 'food',
				categoryName: '食品类',
				description: '陕西省特产，传统面食小吃',
				province: '陕西省',
				viewCount: 10500,
				image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1NDQzMDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'ynpec001',
				name: '云南普洱茶',
				category: 'fresh',
				categoryName: '生鲜类',
				description: '云南省特产，中国传统名茶',
				province: '云南省',
				viewCount: 14000,
				image: 'https://images.unsplash.com/photo-1563514953260-1981d015aa78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTU0NDMzMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'jdzc001',
				name: '景德镇瓷器',
				category: 'craft',
				categoryName: '工艺类',
				description: '江西省景德镇市特产，中国传统名瓷',
				province: '江西省',
				viewCount: 12000,
				image: 'https://images.unsplash.com/photo-1588868478777-15683d523799?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEscG9yY2VsYWlufHx8fHx8MTY0OTU0NDM2MA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			},
			{
				id: 'nxgq001',
				name: '宁夏枸杞',
				category: 'fresh',
				categoryName: '生鲜类',
				description: '宁夏回族自治区特产，中国传统药材',
				province: '宁夏回族自治区',
				viewCount: 9000,
				image: 'https://images.unsplash.com/photo-1593477568399-38faba6dd764?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsaGVyYnx8fHx8fDE2NDk1NDQzOTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=120'
			}
		];
		
		// 模拟搜索匹配，实际项目中应该使用数据库的模糊查询
		const searchResults = specialties.filter(item => {
			return item.name.includes(keyword) || 
				   item.description.includes(keyword) || 
				   item.province.includes(keyword) ||
				   item.categoryName.includes(keyword);
		});
		
		// 计算分页数据
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		const total = searchResults.length;
		const list = searchResults.slice(start, end);
		
		// 记录热门搜索词（实际项目中应保存到数据库中）
		// ...省略实现...
		
		return {
			code: 0,
			msg: '搜索成功',
			data: {
				list,
				total,
				page,
				pageSize
			}
		};
	} catch (e) {
		console.error('searchSpecialties Error:', e);
		return {
			code: -1,
			msg: '搜索失败'
		};
	}
}

/**
 * 获取热门搜索关键词
 */
async function getHotSearchKeywords() {
	try {
		// 模拟数据库查询延迟
		await new Promise(resolve => setTimeout(resolve, 300));
		
		// 模拟热门搜索关键词数据
		const hotKeywords = [
			'阳澄湖大闸蟹',
			'茅台酒',
			'陕西凉皮',
			'云南普洱茶',
			'景德镇瓷器',
			'宁夏枸杞'
		];
		
		return {
			code: 0,
			msg: '获取成功',
			data: hotKeywords
		};
	} catch (e) {
		console.error('getHotSearchKeywords Error:', e);
		return {
			code: -1,
			msg: '获取热门搜索关键词失败'
		};
	}
} 