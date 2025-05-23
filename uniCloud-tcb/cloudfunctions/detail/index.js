'use strict';

// 云函数入口
exports.main = async (event, context) => {
	const userInfo = context.OPENID ? {
		userOpenId: context.OPENID
	} : {
		userOpenId: '123456' // 模拟用户ID，实际应该从context中获取
	};
	const { userOpenId } = userInfo;
	
	console.log('云函数detail请求参数：', event);
	
	// 根据不同的action分发到不同的处理函数
	switch(event.action) {
		case 'getSpecialtyDetail':
			return await getSpecialtyDetail(event.id);
		case 'getRelatedSpecialties':
			return await getRelatedSpecialties(event.ids);
		case 'recordFootprint':
			return await recordFootprint(userOpenId, event.specialtyId, event.specialtyInfo);
		case 'checkCollectionStatus':
			return await checkCollectionStatus(userOpenId, event.specialtyId);
		case 'addCollection':
			return await addCollection(userOpenId, event.specialtyId, event.specialtyInfo);
		case 'cancelCollection':
			return await cancelCollection(userOpenId, event.specialtyId);
		default:
			return {
				code: -1,
				msg: '未知的action类型'
			}
	}
};

/**
 * 获取特产详情
 * @param {String} id 特产ID
 */
async function getSpecialtyDetail(id) {
	try {
		// 实际项目中应该查询数据库获取详情数据
		// 这里使用模拟数据
		
		// 模拟数据库查询延迟
		await new Promise(resolve => setTimeout(resolve, 500));
		
		// 根据ID查询不同的特产数据
		// 模拟特产数据
		const specialties = [
			{
				id: '1',
				name: '龙井茶',
				images: [
					'https://img.yzcdn.cn/vant/cat.jpeg',
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
				viewCount: 1234,
				category: '茶叶',
				categoryName: '茶叶',
				description: '龙井茶，中国传统名茶，属于绿茶类，已有1200多年历史。龙井茶产于浙江杭州西湖龙井村周围群山，其品质特点：色翠、香郁、味甘、形美。',
				content: '龙井茶（英语：Longjing tea）为中国十大名茶之一，属于绿茶类，是中国绿茶的代表品种。原产于浙江西湖龙井村一带，已有一千二百余年历史，后种植范围逐步扩大至杭州市西湖区的一带山区，并演变出西湖龙井、钱塘龙井、越州龙井等多种西湖系龙井茶。\n\n龙井茶外形扁平挺直，色泽嫩绿光润，香气鲜嫩清高，滋味鲜爽甘醇，叶底嫩绿明亮。传统的龙井茶品质特色概括为"色绿、香郁、味甘、形美"。龙井自古被称为"绿茶皇后"。',
				honors: ['中国国家地理标志产品', '国家级非物质文化遗产'],
				tags: ['传统工艺', '地理标志', '历史名茶'],
				related: ['2', '3', '4', '5']
			},
			{
				id: '2',
				name: '西湖藕粉',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY3ODg4NDIyMTkwNA==678884221904',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423'
				],
				province: '浙江省',
				city: '杭州市',
				location: {
					address: '浙江省杭州市西湖区断桥附近',
					longitude: 120.1589,
					latitude: 30.2476
				},
				longitude: 120.1589,
				latitude: 30.2476,
				viewCount: 921,
				category: '副食',
				categoryName: '副食',
				description: '西湖藕粉，杭州著名特产，取良种藕去皮取粉，晾晒而成。洁白细腻，香气清新，营养丰富，有"济世之珍品"之美誉。',
				content: '杭州藕粉，中国浙江省杭州市特产，中国国家地理标志产品。杭州藕粉是用西湖、西溪一带的藕制成，取良种藕加工，剔除藕节，制作过程全部为纯手工制作，流程长，工序繁，且藕粉精细剔出的最终比例小，因此产量低，属名贵食品。杭州藕粉色泽洁白，质地细腻绵软，稠薄适度，滑润爽口，唇齿留香。富含矿物质，维生素以及植物纤维，易消化，是老幼皆宜的滋补佳品。',
				honors: ['中国国家地理标志产品'],
				tags: ['传统工艺', '健康食品'],
				related: ['1', '3', '6']
			},
			{
				id: '3',
				name: '杭州丝绸',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY1MDQ4NzE2NTE4MQ==650487165181',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423'
				],
				province: '浙江省',
				city: '杭州市',
				location: {
					address: '浙江省杭州市西湖区丝绸博物馆',
					longitude: 120.1245,
					latitude: 30.2489
				},
				longitude: 120.1245,
				latitude: 30.2489,
				viewCount: 752,
				category: '工艺品',
				categoryName: '工艺品',
				description: '杭州丝绸是中国传统丝绸的代表，以其精美的工艺、华丽的色彩和柔软的质地闻名。被誉为"云裳天衣"，是浙江省重要的传统工艺之一。',
				content: '杭州丝绸以其精美的工艺、华丽的色彩和柔软的质地闻名于世。杭州自古就是"丝绸之府"，杭州丝绸织造历史悠久，早在南朝时期就已经出现了织造机构，隋朝大业年间，杭州设置了"錦署"。唐代在杭州设"锦院"、南宋"杭州丝绸局"。\n\n杭州丝绸的织造工艺精湛，品种繁多，其中以丝绸缎为代表，如：宋锦、丝绒、贡缎、云锦等。尤以宋锦最负盛名，宋锦是中国著名的三大名锦之一，与南京云锦、蜀锦齐名，至今已有1600多年历史。',
				honors: ['中国国家地理标志产品', '国家级非物质文化遗产'],
				tags: ['传统工艺', '丝绸之府'],
				related: ['1', '2', '7']
			},
			{
				id: '4',
				name: '金华火腿',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTIxNzY5NjczNw==679217696737'
				],
				province: '浙江省',
				city: '金华市',
				location: {
					address: '浙江省金华市婺城区',
					longitude: 119.6501,
					latitude: 29.0825
				},
				longitude: 119.6501,
				latitude: 29.0825,
				viewCount: 632,
				category: '生鲜',
				categoryName: '生鲜',
				description: '金华火腿以瘦肉多、肥肉少、色泽红润、香气浓郁、味道鲜美而著称，有"腿中之王"的美誉，是中国传统的高档腌腊制品。',
				content: '金华火腿是中国传统的特色腌腊制品，其生产历史可以追溯到唐朝以前。金华火腿因产于浙江省金华市而得名，"腌腊肉品中之王"的美誉，是中国特色的高档腌腊肉制品。\n\n金华火腿的品质特点是："色泽鲜艳，香味浓郁，鲜咸适口，瘦肉细嫩，肥肉香醇，咸中微甜，回味无穷"，具有"低盐少腥，甜中透咸，油而不腻"的特色。金华火腿风味独特，是世界名腿之一，与意大利帕尔玛火腿、西班牙赛拉诺火腿齐名。',
				honors: ['中国国家地理标志产品'],
				tags: ['传统工艺', '地理标志'],
				related: ['5', '6', '8']
			},
			{
				id: '5',
				name: '绍兴黄酒',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTIxNzY5NjczNw==679217696737'
				],
				province: '浙江省',
				city: '绍兴市',
				location: {
					address: '浙江省绍兴市越城区',
					longitude: 120.5842,
					latitude: 30.0023
				},
				longitude: 120.5842,
				latitude: 30.0023,
				viewCount: 843,
				category: '烟酒',
				categoryName: '烟酒',
				description: '绍兴黄酒，中国传统名酒，有着2500多年的历史，以糯米为主要原料酿制而成。酒体呈琥珀色，清澈透明，香气浓郁，味道醇厚。',
				content: '绍兴黄酒是中国最负盛名的黄酒，已有2500多年的历史，产于浙江省绍兴市。相传是春秋末期越王勾践用来犒劳士兵的美酒，又称"越酒"。绍兴黄酒以糯米为主要原料，经传统工艺精制而成，是一种古老的发酵酒，素有"百味之王"的美誉。\n\n绍兴黄酒酒液呈琥珀色、黄褐色，清澈透明，香气纯正，口味协调，醇厚甘冽，回味怡畅，既可佐餐，又可独饮，还可入药，有"液体蛋糕"的美称。',
				honors: ['中国国家地理标志产品', '国家级非物质文化遗产'],
				tags: ['传统工艺', '地理标志'],
				related: ['4', '6', '8']
			},
			{
				id: '6',
				name: '东阳木雕',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTIxNzY5NjczNw==679217696737'
				],
				province: '浙江省',
				city: '金华市',
				location: {
					address: '浙江省金华市东阳市',
					longitude: 120.2418,
					latitude: 29.2847
				},
				longitude: 120.2418,
				latitude: 29.2847,
				viewCount: 536,
				category: '工艺品',
				categoryName: '工艺品',
				description: '东阳木雕是中国著名的传统木雕工艺，以造型优美、雕刻精细、立体感强而著称，是中国四大木雕之一，具有浓郁的中国传统文化特色。',
				content: '东阳木雕，中国传统工艺美术珍品，是浙江东阳的地方传统工艺，已有千余年历史。东阳木雕与福建惠安石雕、浙江青田石雕、江苏苏州玉雕并称为"中国四大名雕"。\n\n东阳木雕继承了宋元明清以来的传统技艺，以深浮雕、浮雕、镂雕、圆雕等多种手法相结合，讲究三分雕、七分刻，线条流畅，层次丰富，人物形象生动，刀工精细，注重写实与写意相结合，题材广泛，包括人物、山水、花鸟、走兽、龙凤等。',
				honors: ['国家级非物质文化遗产', '中国工艺美术珍品'],
				tags: ['传统工艺', '文化遗产'],
				related: ['3', '7', '8']
			},
			{
				id: '7',
				name: '西湖龙井茶村手工龙井',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTIxNzY5NjczNw==679217696737'
				],
				province: '浙江省',
				city: '杭州市',
				location: {
					address: '浙江省杭州市西湖区龙井村',
					longitude: 120.1524,
					latitude: 30.2271
				},
				longitude: 120.1524,
				latitude: 30.2271,
				viewCount: 1089,
				category: '茶叶',
				categoryName: '茶叶',
				description: '西湖龙井茶村手工龙井是产自西湖龙井核心产区的顶级龙井茶，全程手工炒制，保留了传统龙井茶的精髓，品质上乘，香气高雅。',
				content: '西湖龙井茶村手工龙井产自杭州西湖龙井核心产区，属于顶级明前龙井。采用传统手工炒制工艺，由经验丰富的炒茶师傅精心炮制而成。\n\n手工龙井强调"色绿、香郁、味甘、形美"的品质特点，外形扁平光滑，叶张嫩绿匀整，香气高雅持久，滋味鲜爽甘醇，汤色清澈明亮。喝上一口，舌尖回甘生津，唇齿间留香，是茶中珍品。',
				honors: ['中国国家地理标志产品', '国家级非物质文化遗产'],
				tags: ['传统工艺', '明前茶', '手工炒制'],
				related: ['1', '2', '3']
			},
			{
				id: '8',
				name: '临安山核桃',
				images: [
					'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
					'https://img.cdn.sugarat.top/mdImg/MTY3OTIxNzY5NjczNw==679217696737'
				],
				province: '浙江省',
				city: '杭州市',
				location: {
					address: '浙江省杭州市临安区',
					longitude: 119.7248,
					latitude: 30.2336
				},
				longitude: 119.7248,
				latitude: 30.2336,
				viewCount: 723,
				category: '副食',
				categoryName: '副食',
				description: '临安山核桃是浙江省杭州市临安区特产，果实饱满，壳薄肉厚，油脂丰富，营养价值高，有"干果之王"的美誉。',
				content: '临安山核桃，中国国家地理标志产品，山核桃原产于中国，临安是山核桃栽培最早，面积最大，产量最高，品质最优的地区。临安山核桃以其皮薄、仁满、味香、品优而闻名，在国内外享有盛誉。\n\n临安山核桃含有丰富的不饱和脂肪酸、蛋白质、维生素和矿物质，是一种高档营养保健食品。具有健脑、降血脂、抗衰老等功效。临安山核桃以其"三高一低"著称：即高蛋白、高不饱和脂肪酸、高维生素E、低饱和脂肪酸。',
				honors: ['中国国家地理标志产品'],
				tags: ['健康食品', '地理标志'],
				related: ['2', '4', '5']
			}
		];
		
		// 根据ID查找特产
		const specialty = specialties.find(item => item.id === id);
		
		if (!specialty) {
			return {
				code: -1,
				msg: '未找到特产信息'
			};
		}
		
		// 模拟增加浏览量
		specialty.viewCount = specialty.viewCount + 1;
		
		return {
			code: 0,
			msg: '获取成功',
			data: specialty
		};
	} catch (e) {
		console.error('getSpecialtyDetail Error：', e);
		return {
			code: -1,
			msg: '获取特产详情失败'
		};
	}
}

/**
 * 获取相关特产
 * @param {Array} ids 特产ID数组
 */
async function getRelatedSpecialties(ids) {
	try {
		// 实际项目中应该查询数据库
		// 这里使用模拟数据
		
		// 模拟数据库查询延迟
		await new Promise(resolve => setTimeout(resolve, 300));
		
		// 模拟特产数据
		const specialties = [
			{
				id: '1',
				name: '龙井茶',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '浙江',
				city: '杭州',
				category: '茶叶'
			},
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
			},
			{
				id: '5',
				name: '绍兴黄酒',
				image: 'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
				province: '浙江',
				city: '绍兴',
				category: '烟酒'
			},
			{
				id: '6',
				name: '东阳木雕',
				image: 'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
				province: '浙江',
				city: '金华',
				category: '工艺品'
			},
			{
				id: '7',
				name: '西湖龙井茶村手工龙井',
				image: 'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
				province: '浙江',
				city: '杭州',
				category: '茶叶'
			},
			{
				id: '8',
				name: '临安山核桃',
				image: 'https://img.cdn.sugarat.top/mdImg/MTY3OTEzOTU5NTQyMw==679139595423',
				province: '浙江',
				city: '杭州',
				category: '副食'
			}
		];
		
		// 获取满足条件的特产
		const result = ids ? specialties.filter(item => ids.includes(item.id)) : [];
		
		return {
			code: 0,
			msg: '获取成功',
			data: result
		};
	} catch (e) {
		console.error('getRelatedSpecialties Error：', e);
		return {
			code: -1,
			msg: '获取相关特产失败'
		};
	}
}

/**
 * 记录足迹
 * @param {String} userOpenId 用户OpenID
 * @param {String} specialtyId 特产ID
 * @param {Object} specialtyInfo 特产信息
 */
async function recordFootprint(userOpenId, specialtyId, specialtyInfo) {
	try {
		// 实际项目中应该操作数据库
		// 这里先模拟成功
		console.log('记录足迹：', userOpenId, specialtyId, specialtyInfo);
		
		return {
			code: 0,
			msg: '记录成功'
		};
	} catch (e) {
		console.error('recordFootprint Error：', e);
		return {
			code: -1,
			msg: '记录足迹失败'
		};
	}
}

/**
 * 检查收藏状态
 * @param {String} userOpenId 用户OpenID
 * @param {String} specialtyId 特产ID
 */
async function checkCollectionStatus(userOpenId, specialtyId) {
	try {
		// 实际项目中应该查询数据库
		// 这里使用模拟数据
		// 模拟数据库查询延迟
		await new Promise(resolve => setTimeout(resolve, 200));
		
		// 模拟已收藏的特产ID
		const collectedIds = ['1', '3', '5', '7'];
		
		return {
			code: 0,
			msg: '获取成功',
			data: {
				isCollected: collectedIds.includes(specialtyId)
			}
		};
	} catch (e) {
		console.error('checkCollectionStatus Error：', e);
		return {
			code: -1,
			msg: '检查收藏状态失败'
		};
	}
}

/**
 * 添加收藏
 * @param {String} userOpenId 用户OpenID
 * @param {String} specialtyId 特产ID
 * @param {Object} specialtyInfo 特产信息
 */
async function addCollection(userOpenId, specialtyId, specialtyInfo) {
	try {
		// 实际项目中应该操作数据库
		// 这里先模拟成功
		console.log('添加收藏：', userOpenId, specialtyId, specialtyInfo);
		
		return {
			code: 0,
			msg: '收藏成功'
		};
	} catch (e) {
		console.error('addCollection Error：', e);
		return {
			code: -1,
			msg: '收藏失败'
		};
	}
}

/**
 * 取消收藏
 * @param {String} userOpenId 用户OpenID
 * @param {String} specialtyId 特产ID
 */
async function cancelCollection(userOpenId, specialtyId) {
	try {
		// 实际项目中应该操作数据库
		// 这里先模拟成功
		console.log('取消收藏：', userOpenId, specialtyId);
		
		return {
			code: 0,
			msg: '取消收藏成功'
		};
	} catch (e) {
		console.error('cancelCollection Error：', e);
		return {
			code: -1,
			msg: '取消收藏失败'
		};
	}
} 