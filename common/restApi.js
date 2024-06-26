import api from '../common/api';

// 所有接口都不需要userId,因为使用了jwt

// 获取商品分页列表
export const getGoodsList = (params) => {
	return api.get('/mirageLedger/v1/product', params);
};

// 获取商品详情(路径参数)
export const getGoodsDetail = (id) => {
	return api.get('/mirageLedger/v1/product/' + id);
};

// 获取分类列表
export const getCategoryList = (params) => {
	return api.get('/mirageLedger/v1/category',params);
};

// 根据用户ID获取购物车
export const getCartList = (params) => {
	return api.get('/mirageLedger/v1/cart',params);
};

// 添加商品到购物车
export const addCart = (cart) => {
	return api.post('/mirageLedger/v1/cart', cart);
};

// 删除购物车商品
export const deleteCart = (cartId) => {
	return api.delete('/mirageLedger/v1/cart/' + cartId);
};

// 清空购物车商品
export const clearCart = () => {
	return api.delete('/mirageLedger/v1/cart/all');
};

// 创建用户订单接口
export const createOrder = (order) => {
	return api.post('/mirageLedger/v1/order', order);
};

// 获取用户订单接口
export const getOrderById = (id) => {
	return api.get('/mirageLedger/v1/order/' + id);
};

// 修改用户订单接口
export const updateOrder = (id,order) => {
	return api.put('/mirageLedger/v1/order/' + id, order);
};

// 删除用户订单接口
export const deleteOrder = (id) => {
	return api.delete('/mirageLedger/v1/order/' + id);
};

// 分页查询用户订单接口
export const getOrderList = (params) => {
	return api.get('/mirageLedger/v1/order', params);
};

// 查询用户收货地址接口
export const getAddressList = () => {
	return api.get('/mirageLedger/v1/userAddress/list/');
};

// 添加收货地址接口
export const createAddress = (data) => {
	return api.post('/mirageLedger/v1/userAddress', data);
};

// 查询默认收货地址接口
export const getDefaultAddress = () => {
	return api.get('/mirageLedger/v1/userAddress/default');
};

export const getAddressById = (id) => {
	return api.get('/mirageLedger/v1/userAddress/' + id);
};

// 修改收货地址接口
export const updateAddress = (id, data) => {
	return api.put('/mirageLedger/v1/userAddress/' + id, data);
};

// 删除收货地址接口
export const deleteAddress = (id) => {
	return api.delete('/mirageLedger/v1/userAddress/' + id);
};

// 图片识别接口
export const recognize = (imageFile) => {
	return api.imgPost('/mirageLedger/v1/product/classify', imageFile);
};

export const createViewHistory = (params) => {
	return api.post('/mirageLedger/v1/viewHistory',params);
};