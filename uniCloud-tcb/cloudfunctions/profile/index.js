'use strict';

exports.main = async (event, context) => {
	const { action } = event;
	
	// 获取用户OpenID，实际项目中应该从context中获取
	const userOpenId = context.OPENID || 'test_user_openid';
	
	try {
		switch (action) {
			case 'getUserInfo':
				return await getUserInfo(userOpenId);
			case 'getRecentFootprints':
				return await getRecentFootprints(userOpenId);
			case 'getCollections':
				return await getCollections(userOpenId, event.page, event.pageSize, event.category);
			case 'getAllFootprints':
				return await getAllFootprints(userOpenId, event.page, event.pageSize, event.category);
			case 'cancelCollection':
				return await cancelCollection(userOpenId, event.id);
			default:
				return {
					code: 1,
					msg: '无效的操作'
				};
		}
	} catch (e) {
		console.error(e);
		return {
			code: 1,
			msg: '服务器错误'
		};
	}
};

// 获取用户信息
async function getUserInfo(userOpenId) {
	try {
		// 实际项目中应该从数据库查询
		/* 
		const db = uniCloud.database();
		const userInfo = await db.collection('users').where({ openId: userOpenId }).get();
		if (userInfo.data && userInfo.data.length > 0) {
			return {
				code: 0,
				data: userInfo.data[0]
			};
		}
		*/
		
		// 模拟数据
		const userInfo = {
			userId: '20240501',
			nickname: '寻味探索者',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8cG9ydHJhaXR8fHx8fHwxNjQ5NTQyODUz&ixlib=rb-1.2.1&q=80',
			location: '北京',
			collectCount: 26,
			footprintCount: 48
		};
		
		return {
			code: 0,
			data: userInfo
		};
	} catch (e) {
		console.error('获取用户信息失败:', e);
		return {
			code: 1,
			msg: '获取用户信息失败'
		};
	}
}

// 获取最近足迹
async function getRecentFootprints(userOpenId) {
	try {
		// 实际项目中应该从数据库查询
		/*
		const db = uniCloud.database();
		const footprints = await db.collection('footprints')
		  .where({ userOpenId })
		  .orderBy('visitTime', 'desc')
		  .limit(3)
		  .get();
		
		return {
			code: 0,
			data: footprints.data
		};
		*/
		
		// 模拟数据 - 与HTML原型保持一致
		const footprints = [
			{
				id: 'fp001',
				name: '郫县豆瓣酱',
				image: 'https://images.unsplash.com/photo-1605197181726-e3bd08490ba1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsZm9vZHx8fHx8fDE2NDk1Mzk2NjE&ixlib=rb-1.2.1&q=80',
				visitTime: '今天 10:30'
			},
			{
				id: 'fp002',
				name: '苏州刺绣',
				image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsY3JhZnR8fHx8fHwxNjQ5NTQwMTYy&ixlib=rb-1.2.1&q=80',
				visitTime: '昨天 16:45'
			},
			{
				id: 'fp003',
				name: '西湖龙井',
				image: 'https://images.unsplash.com/photo-1613614210474-4960ab6b3eb5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpbmEsdGVhfHx8fHx8MTY0OTU0MDQxMQ&ixlib=rb-1.2.1&q=80',
				visitTime: '3天前'
			}
		];
		
		return {
			code: 0,
			data: footprints
		};
	} catch (e) {
		console.error('获取最近足迹失败:', e);
		return {
			code: 1,
			msg: '获取最近足迹失败'
		};
	}
}

// 获取收藏列表
async function getCollections(userOpenId, page = 1, pageSize = 10, category) {
	try {
		// 实际项目中应该从数据库查询
		// const db = uniCloud.database();
		// let query = db.collection('collections').where({ userOpenId });
		// 
		// if (category) {
		//   query = query.where({ category });
		// }
		// 
		// const collections = await query
		//   .orderBy('collectTime', 'desc')
		//   .skip((page - 1) * pageSize)
		//   .limit(pageSize)
		//   .get();
		
		// 模拟数据
		const allCollections = [
			{
				id: 'c001',
				name: '北京烤鸭',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '北京市',
				city: '北京市',
				collectTime: '2023-05-15',
				category: 'food',
				categoryName: '主食',
				description: '北京著名传统美食，色泽红艳，肉质细嫩，肥而不腻。',
				viewCount: '3.2万'
			},
			{
				id: 'c002',
				name: '兰州牛肉面',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '甘肃省',
				city: '兰州市',
				collectTime: '2023-05-14',
				category: 'food',
				categoryName: '主食',
				description: '清汤牛肉面，以汤清、肉香、面劲道著称。',
				viewCount: '2.8万'
			},
			{
				id: 'c003',
				name: '西湖龙井',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '浙江省',
				city: '杭州市',
				collectTime: '2023-05-13',
				category: 'tea',
				categoryName: '茶叶',
				description: '中国十大名茶之一，以色翠、香郁、味甘、形美四绝著称。',
				viewCount: '4.1万'
			},
			{
				id: 'c004',
				name: '阳澄湖大闸蟹',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '江苏省',
				city: '苏州市',
				collectTime: '2023-05-12',
				category: 'seafood',
				categoryName: '水产海鲜',
				description: '中国著名水产品，肉质鲜美，营养丰富。',
				viewCount: '5.6万'
			},
			{
				id: 'c005',
				name: '重庆火锅',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '重庆市',
				city: '重庆市',
				collectTime: '2023-05-11',
				category: 'food',
				categoryName: '主食',
				description: '麻辣鲜香，让人欲罢不能的美食体验。',
				viewCount: '6.7万'
			},
			{
				id: 'c006',
				name: '武汉热干面',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '湖北省',
				city: '武汉市',
				collectTime: '2023-05-10',
				category: 'food',
				categoryName: '主食',
				description: '武汉名小吃，香、咸、辣、甜，回味悠长。',
				viewCount: '2.3万'
			},
			{
				id: 'c007',
				name: '四川麻婆豆腐',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '四川省',
				city: '成都市',
				collectTime: '2023-05-09',
				category: 'food',
				categoryName: '副食',
				description: '麻、辣、烫、香、酥、嫩、鲜、活的川菜代表。',
				viewCount: '1.9万'
			},
			{
				id: 'c008',
				name: '广东早茶',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '广东省',
				city: '广州市',
				collectTime: '2023-05-08',
				category: 'snack',
				categoryName: '小吃',
				description: '粤式饮食文化的代表，品种丰富多样。',
				viewCount: '3.5万'
			},
			{
				id: 'c009',
				name: '南京盐水鸭',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '江苏省',
				city: '南京市',
				collectTime: '2023-05-07',
				category: 'food',
				categoryName: '副食',
				description: '肉质鲜嫩，滋味可口，香气浓郁。',
				viewCount: '1.7万'
			},
			{
				id: 'c010',
				name: '青岛啤酒',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '山东省',
				city: '青岛市',
				collectTime: '2023-05-06',
				category: 'drink',
				categoryName: '饮料',
				description: '中国历史最悠久的啤酒品牌之一，口感醇厚。',
				viewCount: '4.8万'
			},
			{
				id: 'c011',
				name: '云南过桥米线',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '云南省',
				city: '昆明市',
				collectTime: '2023-05-05',
				category: 'food',
				categoryName: '主食',
				description: '云南特色美食，汤鲜味美，配料丰富。',
				viewCount: '2.6万'
			},
			{
				id: 'c012',
				name: '陕西肉夹馍',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '陕西省',
				city: '西安市',
				collectTime: '2023-05-04',
				category: 'snack',
				categoryName: '小吃',
				description: '陕西特色小吃，外酥里嫩，肉香四溢。',
				viewCount: '3.9万'
			},
			{
				id: 'c013',
				name: '苏州刺绣',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '江苏省',
				city: '苏州市',
				collectTime: '2023-05-03',
				category: 'craft',
				categoryName: '工艺品',
				description: '中国四大名绣之一，以绣工精细、针法严谨、色彩典雅著称。',
				viewCount: '1.5万'
			},
			{
				id: 'c014',
				name: '景德镇陶瓷',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '江西省',
				city: '景德镇市',
				collectTime: '2023-05-02',
				category: 'craft',
				categoryName: '工艺品',
				description: '中国传统工艺美术，以"白如玉、明如镜、薄如纸、声如磬"著称。',
				viewCount: '2.2万'
			},
			{
				id: 'c015',
				name: '烟台苹果',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '山东省',
				city: '烟台市',
				collectTime: '2023-05-01',
				category: 'fruit',
				categoryName: '水果',
				description: '色泽鲜艳，甜脆多汁，富含营养。',
				viewCount: '1.8万'
			}
		];
		
		// 根据分类筛选
		let filteredCollections = allCollections;
		if (category) {
			filteredCollections = allCollections.filter(item => item.category === category);
		}
		
		// 分页逻辑
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		const collections = filteredCollections.slice(start, end);
		const hasMore = end < filteredCollections.length;
		
		return {
			code: 0,
			data: {
				list: collections,
				hasMore
			}
		};
	} catch (e) {
		console.error('获取收藏列表失败:', e);
		return {
			code: 1,
			msg: '获取收藏列表失败'
		};
	}
}

// 获取所有足迹
async function getAllFootprints(userOpenId, page = 1, pageSize = 10, category) {
	try {
		// 实际项目中应该从数据库查询
		// const db = uniCloud.database();
		// let query = db.collection('footprints').where({ userOpenId });
		// 
		// if (category && category !== 'all') {
		//   query = query.where({ category });
		// }
		// 
		// const footprints = await query
		//   .orderBy('visitTime', 'desc')
		//   .skip((page - 1) * pageSize)
		//   .limit(pageSize)
		//   .get();
		
		// 模拟数据
		const allFootprints = [
			{
				id: 'fp001',
				name: '北京烤鸭',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '北京市',
				city: '北京市',
				visitTime: '今天 10:30',
				category: 'food',
				categoryName: '主食',
				description: '北京著名传统美食，色泽红艳，肉质细嫩，肥而不腻。'
			},
			{
				id: 'fp002',
				name: '兰州牛肉面',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '甘肃省',
				city: '兰州市',
				visitTime: '昨天 16:45',
				category: 'food',
				categoryName: '主食',
				description: '清汤牛肉面，以汤清、肉香、面劲道著称。'
			},
			{
				id: 'fp003',
				name: '西湖龙井',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '浙江省',
				city: '杭州市',
				visitTime: '3天前',
				category: 'tea',
				categoryName: '茶叶',
				description: '中国十大名茶之一，以色翠、香郁、味甘、形美四绝著称。'
			},
			{
				id: 'fp004',
				name: '阳澄湖大闸蟹',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '江苏省',
				city: '苏州市',
				visitTime: '4天前',
				category: 'seafood',
				categoryName: '水产海鲜',
				description: '中国著名水产品，肉质鲜美，营养丰富。'
			},
			{
				id: 'fp005',
				name: '重庆火锅',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '重庆市',
				city: '重庆市',
				visitTime: '5天前',
				category: 'food',
				categoryName: '主食',
				description: '麻辣鲜香，让人欲罢不能的美食体验。'
			},
			{
				id: 'fp006',
				name: '武汉热干面',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '湖北省',
				city: '武汉市',
				visitTime: '一周前',
				category: 'food',
				categoryName: '主食',
				description: '武汉名小吃，香、咸、辣、甜，回味悠长。'
			},
			{
				id: 'fp007',
				name: '四川麻婆豆腐',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '四川省',
				city: '成都市',
				visitTime: '一周前',
				category: 'material',
				categoryName: '副食',
				description: '麻、辣、烫、香、酥、嫩、鲜、活的川菜代表。'
			},
			{
				id: 'fp008',
				name: '广东早茶',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '广东省',
				city: '广州市',
				visitTime: '两周前',
				category: 'snack',
				categoryName: '小吃',
				description: '粤式饮食文化的代表，品种丰富多样。'
			},
			{
				id: 'fp009',
				name: '南京盐水鸭',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '江苏省',
				city: '南京市',
				visitTime: '两周前',
				category: 'material',
				categoryName: '副食',
				description: '肉质鲜嫩，滋味可口，香气浓郁。'
			},
			{
				id: 'fp010',
				name: '青岛啤酒',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '山东省',
				city: '青岛市',
				visitTime: '三周前',
				category: 'alcohol',
				categoryName: '烟酒',
				description: '中国历史最悠久的啤酒品牌之一，口感醇厚。'
			},
			{
				id: 'fp011',
				name: '云南过桥米线',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '云南省',
				city: '昆明市',
				visitTime: '三周前',
				category: 'food',
				categoryName: '主食',
				description: '云南特色美食，汤鲜味美，配料丰富。'
			},
			{
				id: 'fp012',
				name: '陕西肉夹馍',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '陕西省',
				city: '西安市',
				visitTime: '一个月前',
				category: 'snack',
				categoryName: '小吃',
				description: '陕西特色小吃，外酥里嫩，肉香四溢。'
			},
			{
				id: 'fp013',
				name: '天津狗不理包子',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '天津市',
				city: '天津市',
				visitTime: '一个月前',
				category: 'snack',
				categoryName: '小吃',
				description: '始于清朝的百年老字号，皮薄馅大，汤汁丰富。'
			},
			{
				id: 'fp014',
				name: '内蒙古手把肉',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '内蒙古自治区',
				city: '呼和浩特市',
				visitTime: '一个月前',
				category: 'food',
				categoryName: '主食',
				description: '蒙古族传统美食，肉质鲜嫩，风味独特。'
			},
			{
				id: 'fp015',
				name: '安徽臭鳜鱼',
				image: 'https://img.yzcdn.cn/vant/cat.jpeg',
				province: '安徽省',
				city: '合肥市',
				visitTime: '两个月前',
				category: 'seafood',
				categoryName: '水产海鲜',
				description: '徽菜代表作，外臭里香，口感鲜美。'
			}
		];
		
		// 根据分类筛选
		let filteredFootprints = allFootprints;
		if (category && category !== 'all') {
			filteredFootprints = allFootprints.filter(item => item.category === category);
		}
		
		// 分页逻辑
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		const footprints = filteredFootprints.slice(start, end);
		const hasMore = end < filteredFootprints.length;
		
		return {
			code: 0,
			data: {
				list: footprints,
				hasMore
			}
		};
	} catch (e) {
		console.error('获取所有足迹失败:', e);
		return {
			code: 1,
			msg: '获取所有足迹失败'
		};
	}
}

// 取消收藏
async function cancelCollection(userOpenId, id) {
	try {
		// 实际项目中应该从数据库删除
		// const db = uniCloud.database();
		// await db.collection('collections')
		//   .where({ userOpenId, id })
		//   .remove();
		
		// 模拟成功操作
		console.log(`用户 ${userOpenId} 取消收藏: ${id}`);
		
		return {
			code: 0,
			data: {
				success: true
			}
		};
	} catch (e) {
		console.error('取消收藏失败:', e);
		return {
			code: 1,
			msg: '取消收藏失败'
		};
	}
} 