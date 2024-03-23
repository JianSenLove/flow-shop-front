<template>
	<view style="background-color: rgb(248, 248, 248); height: 100vh;">
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
		</view>
		<!-- 退款原因 -->
		<view style="background-color: #FFFFFF; margin-top: 20rpx;">
			<!-- <cmd-cell-item title="退货原因:" :addon="returnReason"  @click="togglePopup('center', 'reasons')" arrow/> -->
			<picker @change="bindPickerChange" :range="array" class="picker">	
				<label>退货原因：</label>
				<label class="picker_title">{{returnReason}}</label>	
			</picker>
		</view>
		<!-- 退款金额 -->
		
		<view style="background-color: #FFFFFF; margin-top: 10rpx; height: 100rpx; padding-left: 25rpx;">
			<text  class="pay-name" style="line-height: 100rpx; font-size: 28rpx; float: left;">退款金额：</text>
			<text class="pay-value"  style="line-height: 100rpx;font-size: 28rpx; color:#ED1C24;font-weight: bold;">￥{{orderInfo.order.money}}</text>
			
		</view>
		<!-- 退款说明 -->
		<view style="background-color: #FFFFFF; margin-top: 10rpx;height: 200rpx; padding-left: 25rpx;">
			<text style="line-height: 100rpx; font-size: 28rpx; float: left;">
				退款说明：
			</text>
			<textarea style="float: left; width: 70%; height: 150rpx; margin-top: 30rpx; font-size: 28rpx;"  placeholder="选填" v-model="refund_instructions" data-key="refund_instructions"  />
		</view>
		<!-- 注意提醒 -->
		<view class="note-div" style="padding-top: 20rpx;">
			<text class="note" style="font-size: 20rpx; ">
				注意:
				  1、所有售后申请请先与客服沟通
				  2、按照沟通结果填写售后申请单
				  3、填写完申请单后请联系客服处理后续事宜
			</text>
		</view>
		<button class="btn" style="width: 70%;" @click="applyReturnApply()">提交</button>
		<view style="text-align: center;">
			<!-- <text style="font-size: 20rpx; color: #909399; ">联系客服</text> -->
			<button open-type='contact' session-from='' class="kerg">客服-联系我们</button>
		</view>
		
		
	</view>
</template>

<script>
	import api from '../../common/api.js' 
	export default {
		components: {
		},
		data() {
			return {
				show: false,
				type: '',
				returnAmount:0,
				description:"",
				tempReason:"",
				returnReason:"请选择退货原因",
				refund_instructions:"",
				array:["商品信息描述不符","商品错发、漏发 ","收到商品破损","商品质量问题","不想还要了/拍错","其他"],
				lx:0,
				orderSn:"",
				id:"",
				orderInfo:null,
				reasonList:[
					
				]
			};
		},
		onLoad(option) {
			this.id=option.id;
			this.loadOrderInfo();
			// this.getReturnReasonList();
		},
		onShow() {
			this.loadUserInfo()
		},
		computed: {
		},
		methods:{
			//下拉框
			bindPickerChange: function(e) {	
				// this.index = e.target.value		
				let index = e.target.value			
				this.returnReason=this.array[index]
						console.log(e.target.value)
			},
			loadOrderInfo(){
				api.post('Order/xcxlistData', {"id":this.id}).then(res => {
					console.log(res.data)
					if(res.code==200){
						this.orderInfo=res.data
					}
					
				})
			},
			applyReturnApply(){
				let data={
					"id":this.id,
					"refund_reason":this.returnReason,
					"refund_instructions":this.refund_instructions
				}
				api.post('Order/tuiadd', data).then(res => {
					if(res.code==200){
						uni.showToast({
							title:"申请成功" 
						})
						setTimeout(function() {
							uni.navigateTo({
								url:"/pages/order/order?state=4"
							})
						}, 800);
					}else{
						uni.showToast({
							title:"申请失败" 
						})
					}
					
				})
			}
			
		}
	}
</script>

<style lang="scss">
	@import "@/common/details.scss";
	.uni-page-head{
		background-color: rgb(248, 248, 248);
	}
	.note-div{
		position: relative;
		left: 40upx;
		height: 300upx;
	}
	.note{
		color: #909399;
		font-size: 28upx;
		
	}
	.title{
		-webkit-box-flex: 1;
		-webkit-flex: 1 1 0%;
		-ms-flex: 1 1 0%;
		flex: 1 1 0%;
		color: #111A34;
		font-size: 32upx;
		line-height: 1.2;
		left: 22upx;
		position: relative;
	}
	.amount-input{
		position: relative;
		top: -44upx;
		left: 200upx;
		color: #ec9222;
	}
	.desc-input{
		position: relative;
		top: -44upx;
		left: 200upx;
		
	}
	.fuhao{
		margin-top: 0px;
		margin-left: 13px;
		font-size: 14px;
		color: #ec9222;
	}
	.btn{
		height: 66upx;
		line-height: 66upx;
		border-radius: 100upx;
		background: $uni-color-primary;
		font-size: $font-base + 2upx;
		color: #fff;
		margin: 30upx auto 20upx;
		bottom: 10upx;
		background-image: linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%);
	}
.picker{
	padding: 20upx 30upx;
}
.picker_title{
	margin-left: 20upx;
	color: #636363;
}
.kerg{
	margin: 0 60upx;
	
	font-size: 20rpx; 
	color: #909399;
	background-color:rgba(255, 255, 255, 0.1);
}
button::after { border: none }
</style>
