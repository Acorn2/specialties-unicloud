# uniCloud 云开发指南

## 云开发架构
uniCloud 是 DCloud 联合阿里云、腾讯云推出的基于 serverless 模式和 js 编程的云开发平台。本项目使用的是腾讯云版本（tcb）。

## 云函数开发流程

### 1. 创建云函数
- 在 `uniCloud-tcb` 目录下创建 `cloudfunctions` 文件夹
- 每个云函数是一个独立的目录，包含 `index.js` 入口文件
- 云函数目录结构示例：
```
uniCloud-tcb/
├── cloudfunctions/         # 云函数目录
│   ├── user/               # 用户相关云函数
│   │   ├── index.js        # 入口文件
│   │   └── package.json    # 依赖配置
│   └── product/            # 产品相关云函数
│       ├── index.js        # 入口文件
│       └── package.json    # 依赖配置
└── database/               # 数据库相关
```

### 2. 编写云函数
云函数的基本结构：
```javascript
'use strict';
exports.main = async (event, context) => {
  // event 为客户端上传的参数
  // context 包含了调用信息和运行状态
  // 业务逻辑代码
  
  // 返回数据给客户端
  return {
    code: 0,
    msg: '成功',
    data: {}
  }
};
```

### 3. 上传部署云函数
- 在 HBuilderX 中右键云函数目录，选择"上传部署"
- 或使用命令行工具进行部署

### 4. 前端调用云函数
```javascript
// 方式一：Promise
uniCloud.callFunction({
  name: 'user',
  data: { action: 'login', username: 'admin', password: '123456' }
}).then(res => {
  console.log(res.result);
}).catch(err => {
  console.error(err);
});

// 方式二：async/await
async function callCloudFunction() {
  try {
    const res = await uniCloud.callFunction({
      name: 'user',
      data: { action: 'login', username: 'admin', password: '123456' }
    });
    console.log(res.result);
  } catch (err) {
    console.error(err);
  }
}
```

## 数据库开发流程

### 1. 创建集合（表）
- 在 `uniCloud-tcb/database` 目录下创建集合（表）的 schema 文件
- schema 文件用于定义表结构、字段验证和权限控制

### 2. 定义数据模型
使用 JSON Schema 格式定义数据模型，示例 schema 文件（products.schema.json）：
```json
{
  "bsonType": "object",
  "required": ["name", "price"],
  "permission": {
    "read": true,
    "create": "auth.uid != null",
    "update": "auth.uid != null",
    "delete": "auth.uid != null && doc.creator == auth.uid"
  },
  "properties": {
    "_id": {"description": "ID，系统自动生成"},
    "name": {"bsonType": "string", "description": "商品名称"},
    "price": {"bsonType": "number", "description": "商品价格"},
    "description": {"bsonType": "string", "description": "商品描述"},
    "create_time": {"bsonType": "timestamp", "description": "创建时间"},
    "creator": {"bsonType": "string", "description": "创建者ID"}
  }
}
```

### 3. 前端操作数据库
使用 clientDB 在前端直接操作数据库：

```javascript
// 查询数据
const db = uniCloud.database();
const products = await db.collection('products').get();

// 添加数据
await db.collection('products').add({
  name: '商品名称',
  price: 99.9,
  description: '商品描述',
  create_time: Date.now()
});

// 更新数据
await db.collection('products').doc('文档ID').update({
  price: 88.8
});

// 删除数据
await db.collection('products').doc('文档ID').remove();
```

## 云函数与数据库结合使用

### 1. 在云函数中操作数据库
```javascript
'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database();
  const collection = db.collection('products');
  
  // 获取商品列表
  const { data: products } = await collection
    .where({price: db.command.lt(100)})
    .orderBy('create_time', 'desc')
    .limit(10)
    .get();
  
  return {
    code: 0,
    msg: '获取成功',
    data: products
  }
};
```

### 2. 使用事务处理
```javascript
const transaction = await db.startTransaction();
try {
  // 扣减库存
  await transaction.collection('products').doc(productId).update({
    stock: db.command.inc(-1)
  });
  
  // 创建订单
  await transaction.collection('orders').add({
    product_id: productId,
    user_id: userId,
    create_time: Date.now()
  });
  
  // 提交事务
  await transaction.commit();
  return { code: 0, msg: '下单成功' };
} catch (e) {
  // 回滚事务
  await transaction.rollback();
  return { code: -1, msg: '下单失败' };
}
```

## 云开发最佳实践

### 1. 合理设计数据模型
- 根据业务需求设计合适的数据结构
- 考虑查询效率，设置合适的索引

### 2. 权限控制
- 使用 schema 的 permission 字段控制数据访问权限
- 敏感操作通过云函数进行，避免在前端直接操作

### 3. 云函数粒度
- 合理划分云函数粒度，避免过大或过小
- 相关功能可以放在同一个云函数中，通过不同的 action 区分

### 4. 错误处理
- 做好异常捕获和错误处理
- 返回统一格式的结果，方便前端处理

### 5. 数据验证
- 在 schema 中定义字段验证规则
- 在云函数中进行二次验证

## 实战案例：商品管理系统

### 1. 数据模型设计

**商品集合（products）**
```json
{
  "bsonType": "object",
  "required": ["name", "price", "category_id"],
  "permission": {
    "read": true,
    "create": "auth.role == 'admin'",
    "update": "auth.role == 'admin'",
    "delete": "auth.role == 'admin'"
  },
  "properties": {
    "_id": {"description": "ID，系统自动生成"},
    "name": {"bsonType": "string", "description": "商品名称"},
    "price": {"bsonType": "number", "description": "商品价格"},
    "original_price": {"bsonType": "number", "description": "原价"},
    "category_id": {"bsonType": "string", "description": "分类ID"},
    "description": {"bsonType": "string", "description": "商品描述"},
    "images": {"bsonType": "array", "description": "商品图片"},
    "stock": {"bsonType": "int", "description": "库存数量"},
    "sales": {"bsonType": "int", "description": "销量"},
    "is_on_sale": {"bsonType": "bool", "description": "是否上架"},
    "create_time": {"bsonType": "timestamp", "description": "创建时间"},
    "update_time": {"bsonType": "timestamp", "description": "更新时间"}
  }
}
```

**分类集合（categories）**
```json
{
  "bsonType": "object",
  "required": ["name"],
  "permission": {
    "read": true,
    "create": "auth.role == 'admin'",
    "update": "auth.role == 'admin'",
    "delete": "auth.role == 'admin'"
  },
  "properties": {
    "_id": {"description": "ID，系统自动生成"},
    "name": {"bsonType": "string", "description": "分类名称"},
    "sort": {"bsonType": "int", "description": "排序权重"},
    "create_time": {"bsonType": "timestamp", "description": "创建时间"}
  }
}
```

### 2. 云函数开发

**商品管理云函数（product.js）**
```javascript
'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database();
  const productsCollection = db.collection('products');
  const action = event.action || '';
  
  // 根据action参数执行不同操作
  switch (action) {
    case 'list': // 获取商品列表
      return await getProductList(db, event);
    case 'detail': // 获取商品详情
      return await getProductDetail(db, event);
    case 'add': // 添加商品
      return await addProduct(db, event);
    case 'update': // 更新商品
      return await updateProduct(db, event);
    case 'delete': // 删除商品
      return await deleteProduct(db, event);
    default:
      return { code: -1, msg: '未知操作' };
  }
};

// 获取商品列表
async function getProductList(db, event) {
  const { page = 1, size = 10, category_id, keyword } = event;
  const skip = (page - 1) * size;
  let query = {};
  
  // 构建查询条件
  if (category_id) {
    query.category_id = category_id;
  }
  if (keyword) {
    query.name = new RegExp(keyword, 'i');
  }
  
  try {
    // 聚合查询，关联分类信息
    const { data } = await db.collection('products')
      .aggregate()
      .match(query)
      .lookup({
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category'
      })
      .project({
        name: 1,
        price: 1,
        original_price: 1,
        images: 1,
        stock: 1,
        sales: 1,
        is_on_sale: 1,
        category: { $arrayElemAt: ['$category', 0] }
      })
      .skip(skip)
      .limit(size)
      .end();
    
    // 获取总数
    const { total } = await db.collection('products')
      .where(query)
      .count();
    
    return {
      code: 0,
      msg: '获取成功',
      data: {
        list: data,
        pagination: {
          page,
          size,
          total
        }
      }
    };
  } catch (err) {
    return { code: -1, msg: '获取失败', error: err.message };
  }
}

// 其他函数实现...
```

### 3. 前端页面开发

**商品列表页面（pages/products/list.vue）**
```vue
<template>
  <view class="container">
    <view class="search-box">
      <uni-search-bar v-model="keyword" @confirm="search" placeholder="搜索商品" />
      <uni-data-select v-model="selectedCategory" :localdata="categories" @change="search" />
    </view>
    
    <uni-list>
      <uni-list-item v-for="item in products" :key="item._id" :title="item.name" :note="item.category.name"
        :thumb="item.images[0]" :rightText="`¥${item.price}`" @click="goDetail(item._id)" />
    </uni-list>
    
    <uni-pagination :total="pagination.total" :pageSize="pagination.size" :current="pagination.page"
      @change="changePage" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '',
      keyword: '',
      pagination: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  onLoad() {
    this.loadCategories();
    this.loadProducts();
  },
  methods: {
    async loadCategories() {
      try {
        const db = uniCloud.database();
        const { data } = await db.collection('categories').get();
        this.categories = data.map(item => ({
          value: item._id,
          text: item.name
        }));
      } catch (err) {
        uni.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
      }
    },
    async loadProducts() {
      try {
        uni.showLoading({ title: '加载中' });
        const res = await uniCloud.callFunction({
          name: 'product',
          data: {
            action: 'list',
            page: this.pagination.page,
            size: this.pagination.size,
            category_id: this.selectedCategory,
            keyword: this.keyword
          }
        });
        
        if (res.result.code === 0) {
          this.products = res.result.data.list;
          this.pagination = res.result.data.pagination;
        } else {
          uni.showToast({
            title: res.result.msg,
            icon: 'none'
          });
        }
      } catch (err) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    search() {
      this.pagination.page = 1;
      this.loadProducts();
    },
    changePage(e) {
      this.pagination.page = e.current;
      this.loadProducts();
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/products/detail?id=${id}`
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}
.search-box {
  display: flex;
  margin-bottom: 20rpx;
}
</style>
```

## 进阶技巧

### 1. 使用云函数URL化
云函数URL化可以将云函数通过HTTP请求访问，便于第三方系统集成：

```javascript
// 在云函数中
exports.main = async (event, context) => {
  // 判断是否为HTTP请求
  if (event.httpMethod) {
    // 处理HTTP请求
    const { data } = event.body ? JSON.parse(event.body) : {};
    // 业务逻辑
    return {
      mpserverlessComposedResponse: true, // 启用自定义返回头部
      statusCode: 200,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        code: 0,
        msg: '成功',
        data: {}
      })
    };
  } else {
    // 处理普通云函数调用
    // 业务逻辑
    return {
      code: 0,
      msg: '成功',
      data: {}
    };
  }
};
```

### 2. 使用云对象
云对象是比云函数更接近面向对象的开发模式：

```javascript
// 云对象定义
module.exports = {
  _before: async function() {
    // 前置处理，如权限校验
    if (!this.getUniIdToken()) {
      throw new Error('未登录');
    }
  },
  
  // 获取商品列表
  getProductList: async function(params) {
    const { page = 1, size = 10 } = params;
    const db = uniCloud.database();
    const { data } = await db.collection('products')
      .skip((page - 1) * size)
      .limit(size)
      .get();
    return {
      code: 0,
      msg: '获取成功',
      data
    };
  },
  
  // 其他方法
  _after: async function(error, result) {
    // 后置处理
    if (error) {
      return {
        code: -1,
        msg: error.message
      };
    }
    return result;
  }
}
```

### 3. 使用uni-id统一用户系统
uni-id提供了完整的用户管理系统，包括登录、注册、密码管理等功能：

```javascript
// 用户登录
const uniID = require('uni-id');
exports.main = async function(event) {
  const { username, password } = event;
  const res = await uniID.login({
    username,
    password
  });
  return res;
}
```

## 小程序云开发注意事项

1. **小程序权限**
   - 确保在 `manifest.json` 中配置了正确的微信小程序 AppID
   - 在微信开发者平台开通云开发功能

2. **数据安全**
   - 敏感操作必须通过云函数进行，避免在前端直接操作
   - 使用 schema 的 permission 字段进行权限控制

3. **性能优化**
   - 减少不必要的云函数调用
   - 合理使用索引提高查询效率
   - 使用缓存减少重复请求

4. **开发调试**
   - 使用 HBuilderX 的云函数调试功能
   - 使用云控制台查看云函数日志和数据库内容

5. **部署上线**
   - 测试环境和生产环境分离
   - 上线前全面测试云函数和数据库操作 