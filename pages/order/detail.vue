<template>
	<view class="body">
		<view class="header">
			<view  class="order-status">
				<text>{{orderInfo.status}}</text>
			</view>
			
		</view>
		<navigator  class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{orderInfo.order.receivingName}}</text>
						<text class="mobile">{{orderInfo.order.receivingPhone}}</text>
					</view>
					<text class="address">{{orderInfo.order.receivingAddress}} </text>
				</view>
			</view>
		</navigator>
		
		<view class="goods-section">
			
			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in orderInfo.goodsList" :key="index">
				<image :src="item.ioc"></image>
				<view class="right">
					<text class="title clamp">{{item.title}}</text>
					<text class="spec">{{item.specsname}} / {{item.fitname}}</text>
					<view class="price-box">
						<text class="price">￥{{item.price}}</text>
						<text class="number">x {{item.mun}}</text>
					</view>
				</view>
			</view>
			<!--付款-->
			<view class="pay-info" >
				<text  class="pay-name">支付金额&emsp;</text>
				<text class="pay-value">￥{{orderInfo.order.money}}</text>
			</view>
			
			<view class="operation" v-if="orderInfo.order.pStatus>-1">
				<view class="action-box b-t">
					<button class="action-btn"  v-if="orderInfo.order.pStatus === 0" @click="cancelOrder(orderInfo.order.id)">取消订单</button>
					<button class="action-btn recom" v-if="orderInfo.order.pStatus === 0" @click="toPay(orderInfo.omsOrder.orderSn)">立即支付</button>
					<button class="action-btn recom" v-if="orderInfo.order.pStatus === 2" @click="confirmReceipt(orderInfo.order.id)">确认收货</button>
					<button class="action-btn recom" v-if="orderInfo.order.pStatus === 1 || orderInfo.order.pStatus === 2 || orderInfo.order.pStatus === 3" @click="shouhou(orderInfo.order.id)">申请售后</button>
				</view>
			</view>
		</view>

		<view class="example-title">订单信息</view>
		<view class="xianqg">
			<view class="ordn">订单编号 : {{orderInfo.order.number}}</view>
			<view class="ordn">创建时间 : {{orderInfo.order.ctime}}</view>
			<view class="ordn" v-if="orderInfo.order.ptime">付款时间 : {{orderInfo.order.ptime}}</view>
			<view class="ordn" v-if="orderInfo.order.expressName">物流公司 : {{orderInfo.order.expressName}}</view>
			<view class="ordn" v-if="orderInfo.order.expressNumber">物流单号 : {{orderInfo.order.expressNumber}}</view>
			<view class="ordn" v-if="orderInfo.order.ftime">发货时间 : {{orderInfo.order.ftime}}</view>
		</view>
		
	</view>
</template>

<script>
	import listCell from '@/components/mix-list-cell';
	import api from '../../common/api.js' 
	export default { 
		omponents: {
			listCell
		},
		data() {
			return {
				id:"",
				orderInfo:null
			};
		},
		onLoad(option) {
			this.id=option.id;
			this.loadOrderInfo();
		},
		onShow() {
			this.loadOrderInfo();
		},
		filters: {
			
			isEmpty:function isEmpty(value){
				if(value){
					return value;
				}else{
					return "";
				}
			}
		},
		methods:{
			loadOrderInfo(){
				api.post('Order/xcxlistData', {"id":this.id}).then(res => {
					console.log(res.data)
					if(res.code==200){
						this.orderInfo=res.data
					}
					
				})
				
			},
			
			//取消订单
			cancelOrder(id){
				var _self=this;
				uni.showLoading({
					title: '请稍后'
				})
				api.post('Order/qu', {"id":id}).then(res => {
					console.log(res)
					uni.hideLoading();
					this.loadOrderInfo();
				})
			},
			toPay(orderSn){
				uni.redirectTo({
					url: '/pages/money/pay?orderSn='+orderSn
				})
			},
			confirmReceipt(id){
				var _self=this;
				uni.showLoading({
					title: '请稍后'
				})
				api.post('Order/shouhuo', {"id":id}).then(res => {
					console.log(res)
					uni.hideLoading();
					this.loadOrderInfo();
				})
			},
			shouhou(id){
				let _this = this
				api.post('Pay/getSign', {"id":id}).then(res => {
					console.log(res)
					uni.requestPayment({
						provider: 'wxpay',
						nonceStr: res.nonceStr,
						package: res.package,
						paySign:res.paySign,
						signType: res.signType,
						timeStamp: res.timeStamp,
						success: function(res) {
							console.log('success:' + JSON.stringify(res));
							_this.$api.msg('支付成功')
							setTimeout(() => {
								uni.navigateTo({
									url:"/pages/order/order?state=2"
								})
							}, 800)
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
							
						}
					});
					
				})
			},
		}
	}
</script>

<style lang="scss"> 
@import "@/common/details.scss";
	
	.body{
		background: #f4f4f4;
	}
	.header{
		height: 200upx;
		background:url('../../static/detail_header.jpg') no-repeat 0px 0px;
		.order-status{
			text{
				position: absolute;
				top: 80upx;
				left: 60upx;
				font-size: 32upx;
				color: rgba(255,255,255,1);
			}
			image{
				position: absolute;
				top: 10upx;
				right: 60upx;
				width: 300upx;
				height: 200upx;
			}
			
		}
	}
	.order-info{
		margin-top: 20upx;
		background: #fff;
		.info-title{
			position: relative;
			left: 30upx;
			font-size: 28upx;
		}
		.p-row{
			position: relative;
			left: 40upx;
			min-height: 50upx;
			.p-name{
				display: block;
				color: #908181;
				font-size: 20upx;
				min-width: 150upx;
				float: left;
				margin-top: 15upx;
			}
			.p-value{
				display: block;
				color: black;
				float: left;
				font-size: 20upx;
				margin-top: 15upx;
			}
		}
		
	}
	.operation{
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx 30upx 30upx 50upx;
		margin-top: 20upx;
		position: relative;
		background-color: #fdfdfd;
		border-bottom: 1px #f5f5f5 solid
	}
	
	.example-title__after {
		position: relative;
		color: #031e3c
	}
	
	.example-title:after {
		content: '';
		position: absolute;
		left: 30upx;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 6upx;
		height: 32upx;
		background-color: #ccc
	}
	.xianqg{
		margin-top: 1upx;
		background-color: #fff;
		padding: 0 30upx;
	}
	.ordn{
		border-bottom: 1px #f5f5f5 solid;
		font-size: 28upx;
		padding: 20upx 20upx;
		color: #464e52;
	}
	
</style>