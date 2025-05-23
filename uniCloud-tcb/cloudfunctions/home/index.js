'use strict';
exports.main = async (event, context) => {
	// event 包含客户端的调用参数
	const db = uniCloud.database();
	const $ = db.command.aggregate; // 用于聚合操作

	// 示例：获取热门目的地 (您可以从数据库中查询)
	const hotDestinations = [
		{ name: '湖北', image: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75ef6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=200', province: 'hubei' },
		{ name: '四川', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=200', province: 'sichuan' },
		{ name: '广东', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=200', province: 'guangdong' },
		{ name: '浙江', image: 'https://images.unsplash.com/photo-1529883406927-7de37457a0cf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=200', province: 'zhejiang' },
	];

	// 示例：获取特产分类 (您可以从数据库中查询)
	const specialtyCategories = [
		{ id: 'staple', name: '主食', icon: 'medal', iconColor: '#F7C873', iconBgColor: '#FFF8E1'},
		{ id: 'non-staple', name: '副食', icon: 'pyramid', iconColor: '#9B59B6', iconBgColor: '#F3E5F5'},
		{ id: 'snack', name: '小吃', icon: 'gift', iconColor: '#58D68D', iconBgColor: '#E8F5E9'},
		{ id: 'tea', name: '茶叶', icon: 'flag', iconColor: '#1ABC9C', iconBgColor: '#E0F2F1'},
		{ id: 'fruit', name: '水果', icon: 'hand-up', iconColor: '#2ECC71', iconBgColor: '#E8F5E9'},
	];
	
	// 示例：获取推荐特产 (您可以从数据库中查询，例如按点赞数、浏览量排序)
	const recommendedSpecialties = [
		{ id: 'hb002', name: '热干面', tag: '主食', tagBgColor: '#F7C873', tagColor: '#8B5000', description: '武汉名小吃，香、咸、辣、甜，回味悠长...', location: '湖北省·武汉', image: 'https://images.unsplash.com/photo-1551326844-dc5bbc0dadd6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&w=120' },
		{ id: 'hb004', name: '宜昌柑橘', tag: '生鲜', tagBgColor: '#58D68D', tagColor: '#1D6640', description: '色泽金黄，汁多味甜，果肉细嫩...', location: '湖北省·宜昌', image: 'https://images.unsplash.com/photo-1591183137550-fd9c8ff4a485?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&w=120' },
		{ id: 'gd001', name: '沙糖桔', tag: '生鲜', tagBgColor: '#58D68D', tagColor: '#1D6640', description: '皮薄汁多、甜酸适口，富含维生素C...', location: '广东省·江门', image: 'https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=120&w=120' },
	];

	// 返回结果
	return {
		code: 0,
		msg: '数据获取成功',
		data: {
			hotDestinations,
			specialtyCategories,
			recommendedSpecialties
		}
	}
}; 