'use strict';

const anhui_data = require('./anhui_map_specialties_detail.json');

exports.main = async (event, context) => {
    console.log('开始导入特产数据...');
    
    // 获取云数据库引用
    const db = uniCloud.database();
    const collection = db.collection('specialties'); // 此处使用您创建的表名
    
    // 数据转换（可选，根据需要调整字段）
    const processedData = anhui_data.map(item => {
        // 这里可以进行数据格式转换，例如添加创建时间等
        return {
            ...item,
            create_date: new Date(),
            update_date: new Date()
        };
    });
    
    try {
        // 检查数据量
        console.log(`准备导入 ${processedData.length} 条特产数据`);
        
        // 分批导入数据，避免单次写入过多
        const batchSize = 50;
        let successCount = 0;
        
        for (let i = 0; i < processedData.length; i += batchSize) {
            const batch = processedData.slice(i, i + batchSize);
            const result = await collection.add(batch);
            
            // 更新成功计数
            if (result.inserted) {
                successCount += result.inserted;
            } else if (result.ids && result.ids.length) {
                successCount += result.ids.length;
            }
            
            console.log(`已导入批次 ${Math.floor(i / batchSize) + 1}，当前进度: ${successCount}/${processedData.length}`);
        }
        
        return {
            code: 0,
            msg: '数据导入成功',
            data: {
                total: processedData.length,
                success: successCount
            }
        };
    } catch (err) {
        console.error('导入数据错误：', err);
        return {
            code: -1,
            msg: '导入数据失败',
            error: err.message
        };
    }
};