import api from '../common/api';

// 所有接口都不需要userId,因为使用了jwt
export default {
    // 获取商品分页列表
    getGoodsList(page, rows) {
        return api.get('/goods/list', {
            page,
            rows
        });
    },
    // 获取商品详情(路径参数)
    getGoodsDetail(id) {
        return api.get('/goods/' + id);
    },
    // 获取分类列表
    getCategoryList() {
        return api.get('/category/list');
    },
    // 根据用户ID获取购物车
    getCartList() {
        return api.get('/cart/list');
    },
    // 添加商品到购物车
    addCart(goodsId) {
        return api.post('/cart/add', {
            goodsId
        });
    },
    // 删除购物车商品
    deleteCart(goodsId) {
        return api.delete('/cart/delete', {
            goodsId
        });
    },
    // 查询用户订单接口
    getOrderList() {
        return api.get('/order/list');
    },
    // 查询用户收货地址接口
    getAddressList() {
        return api.get('/address/list');
    },
    // 添加收货地址接口
    addAddress(name, phone, address) {
        return api.post('/address/add', {
            name,
            phone,
            address
        });
    },
    // 修改收货地址接口
    updateAddress(id, name, phone, address) {
        return api.put('/address/update/' + id, {
            name,
            phone,
            address
        });
    },
    // 删除收货地址接口
    deleteAddress(id) {
        return api.delete('/address/' + id);
    },
}