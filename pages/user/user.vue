<template>  
    <view class="container">  
		
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.image || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text class="username" >{{userInfo.name}}</text>
					<button class="topright"  open-type="getUserProfile" lang="zh_CN" @tap="wxGetUserInfo" v-if="!userInfo">立即登录</button>
				</view>
			</view>
			<view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				
				<text class="e-m">flower-shop</text>
				<text class="e-b">欢迎你进入商城</text>
			</view>
		</view>
		
		<view 
			class="cover-container"
			:style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>
			
			
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="Jump('/pages/order/order?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="Jump('/pages/order/order?state=1')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="Jump('/pages/order/order?state=3')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待发货</text>
				</view>
				<view class="order-item" @click="Jump('/pages/order/order?state=2')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="Jump('/pages/order/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>退款/售后</text>
				</view>
			</view>
			<view class="history-section icon">
				
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理"  @eventClick="Jump('/pages/address/address')"></list-cell>
				<!-- <list-cell icon="icon-share" iconColor="#9789f7" title="分享"  ></list-cell> -->
				<!-- <list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell> -->
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="当前版本 1.0.0" ></list-cell>
				<list-cell v-if="userInfo" icon="icon-shezhi1" iconColor="#e07472" title="退出登录" border="" @eventClick="toLogout"></list-cell>
			</view>
		</view>
			
		
    </view>  
</template>  
<script>
import listCell from '@/components/mix-list-cell';

let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				userInfo:{},
				xcxcode: '',//获取登录用户的code
			}
		},
		onLoad(){
      this.userInfo=JSON.parse(uni.getStorageSync('userInfo'));
		},
		onShow() {
		},
		
        
        methods: {
			//获取用户信息
			wxGetUserInfo() {
				uni.navigateTo({ url: '/pages/public/login' });
				this.userInfo = uni.getStorageSync('userInfo');
			},
			Jump(e){
				if(this.userInfo){
					uni.navigateTo({
						url:e
					})
				}else{
					uni.showToast({
						title: '用户信息未登录！',
						icon: 'none'
					});
					uni.navigateTo({ url: '/pages/public/login' });
				}
				
			},
			//退出登录
			toLogout(){
				uni.showModal({
					content: '确定要退出登录么',
					success: (e)=>{
						if(e.confirm){
							uni.clearStorageSync();	
							this.userInfo=null;
						}
					}
				});
			}
        }  
    }  
</script>  
<style lang='scss'>
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}
	.container{
		height: 100vh;
		background: #f5f5f5;
	}
	.user-section{
		height: 520upx;
		padding: 100upx 30upx 0;
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}
	.topright{
		/* width: 170rpx; */
			height: 67rpx;
			/* color:#fff !important; */
			color:#383636 !important;
			font-size: 12px;
			/* border: 1px solid #fff; */
			border: 1px solid #383636;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50px;
			background-color:rgba($color: #000000, $alpha: 0) !important; 
			margin-top: 10rpx;
		}
	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0,0,0,.7), rgba(0,0,0,.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;
		.card-bg{
			position:absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}
		.b-btn{
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;
			.yticon{
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}
	.cover-container{
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		.yticon{
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}
		.icon-shouhoutuikuan{
			font-size:44upx;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
</style>