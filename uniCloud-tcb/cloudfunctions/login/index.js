'use strict';

const crypto = require('crypto');

// 微信小程序配置
const appId = 'your-appid'; // 请替换为实际的微信小程序appId
const appSecret = 'your-app-secret'; // 请替换为实际的微信小程序appSecret

exports.main = async (event, context) => {
  // 获取微信小程序传递的code
  const { code } = event;
  
  if (!code) {
    return {
      code: -1,
      message: '缺少登录code'
    };
  }
  
  try {
    // 请求微信服务器获取openid和session_key
    const wxRes = await getWXOpenId(code);
    
    if (!wxRes.openid) {
      return {
        code: -1,
        message: '微信登录失败'
      };
    }
    
    // 获取数据库引用
    const db = uniCloud.database();
    const userCollection = db.collection('users');
    
    // 查询用户是否已存在
    const userRes = await userCollection.where({
      openid: wxRes.openid
    }).get();
    
    let userId;
    let isNewUser = false;
    
    // 生成token
    const token = generateToken(wxRes.openid);
    
    if (userRes.data && userRes.data.length > 0) {
      // 用户已存在，更新登录时间
      userId = userRes.data[0]._id;
      await userCollection.doc(userId).update({
        last_login_time: new Date()
      });
    } else {
      // 用户不存在，创建新用户
      isNewUser = true;
      const newUserRes = await userCollection.add({
        openid: wxRes.openid,
        create_time: new Date(),
        last_login_time: new Date(),
        // 默认用户信息
        nickname: '风物用户' + Math.floor(Math.random() * 10000),
        avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        // 用户初始数据
        collections: [],
        footprints: [],
        // 其他用户相关字段
      });
      
      userId = newUserRes.id;
    }
    
    // 查询用户信息
    const userInfo = await userCollection.doc(userId).field({
      openid: false // 不返回openid字段
    }).get();
    
    return {
      code: 0,
      message: '登录成功',
      token,
      userInfo: userInfo.data[0],
      isNewUser
    };
    
  } catch (error) {
    console.error('登录失败:', error);
    return {
      code: -1,
      message: '登录失败，请稍后重试'
    };
  }
};

// 获取微信openid
async function getWXOpenId(code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
  
  // 使用uniCloud.httpclient发起请求
  const res = await uniCloud.httpclient.request(url, {
    method: 'GET',
    dataType: 'json'
  });
  
  if (res.status === 200 && res.data && res.data.openid) {
    return {
      openid: res.data.openid,
      session_key: res.data.session_key
    };
  } else {
    throw new Error('获取微信openid失败');
  }
}

// 生成token
function generateToken(openid) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2);
  const content = `${openid}_${timestamp}_${randomStr}`;
  
  // 使用SHA256生成token
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
} 