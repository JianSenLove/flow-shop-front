<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="userInfo && cartList.length==0" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<!-- {{cartList}} -->
			<view v-if="cartList.length==0" class="empty-tips">
				空空如也
				<navigator class="navigator" url="../product/list" open-type="switchTab">随便逛逛></navigator>
			</view>
		</view>
		<view v-if="!userInfo" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>

			<view class="empty-tips" v-if="!userInfo">
				你还未登录
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.image" ></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}"
								@click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.productName}}</text>
							<text class="price">¥{{item.price}}<text class="num">× {{item.num}}</text></text>

						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked?'/static/selected.png':'/static/select.png'" mode="aspectFit"
						@click="check('all')"></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>

				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {getCartList,deleteCart,clearCart} from '@/common/restApi.js'
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				userInfo: {
				},
				total: 0, // 总价格，静态数据中可以先设为0，后面根据实际商品计算
				allChecked: false, // 全选状态 false表示未全选
				empty: false, // 是否显示空白页，有商品时不显示，无商品时显示
				cartList: [
				],
			};
		},
		onLoad() {
		},
		onShow() {
			let userInfo = uni.getStorageSync('userInfo');
			this.userInfo = userInfo;
			if (userInfo) {
				this.loadData();
			}
      this.allChecked= false;
			this.calcTotal();
      this.total = 0;
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {},
		methods: {
			//请求数据
			async loadData() {
				let params = {
					page: 1,
					rows: 99
				}
				let response = await getCartList(params);
				this.cartList = response.records
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				this.cartList[data.index].number = data.number;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				// 调用接口删除id
        deleteCart(id);
        this.total = 0;
				this.cartList.splice(index, 1);
        if (list.length === 0) {
          this.empty = true;
          // this.total = 0;
        }
				this.calcTotal();
				uni.hideLoading();
        uni.showToast({
					title: '删除成功',
					icon: 'success'
				});
			},
			//清空
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: (e) => {
						if (e.confirm) {
							let id = "";
							for (let i = 0; i < this.cartList.length; i++) {
								if (i == 0) {
									id = this.cartList[i].id
								} else {
									id = id + "," + this.cartList[i].id
								}

							}
							// 调用接口清除购物车
              clearCart();
							this.cartList = [];
							this.total = 0;
							this.calcTotal();
              uni.showToast({
								title: '清空成功',
								icon: 'success'
							});
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let t = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						t += item.price * item.num;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = parseFloat(t.toFixed(2));
			},
			//创建订单
			createOrder() {
        let list = [];
        this.cartList.forEach(item => {
          if (item.checked === true) {
            list.push(item);
          }
        })
        if(list.length===0){
          uni.showToast({
            title: '请选择商品',
            icon: 'none'
          })
          return;
        }
        uni.setStorageSync('orderData',JSON.stringify(list));
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
				// this.$api.msg('跳转下一页 sendData');
			}
		}
	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

      image {
        width: 100%;
        height: 100%;
        opacity: 1;
        border-radius: 8upx;
      }
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}

	.num {
		float: right;
	}
</style>