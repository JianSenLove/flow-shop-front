<template>
	<view class="container">

		<!-- 搜索栏 -->
		<view class="search-section">
			<input class="search-input" type="text" placeholder="请输入搜索内容" />
			<button class="search-btn" @click="search">搜索</button>
		</view>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in homeList.lb" :key="index" class="carousel-item">
					<image :src="item.url" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" v-for="(itme,index) in LabelsList" :key="index" @click="navToList(itme.id,0)">
				<image :src="itme.ioc"></image>
				<text>{{itme.name}}</text>
			</view>
		</view>


		<view class="ad-1" v-if="homeList.zx.url!=''">
			<image :src="homeList.zx.url" mode="scaleToFill" @click="xiangq()"></image>
		</view>

		<view class="hot-floor">
			<view class="f-header m-t">
				<image src="/static/temp/h1.png"></image>
				<view class="tit-box">
					<text class="tit">新品上市</text>
					<text class="tit2">New arrival</text>
				</view>
				<!-- <text class="yticon icon-you" @click="navToList(0,1)"></text> -->
			</view>
			<scroll-view class="floor-list" scroll-x>

				<view class="scoll-wrapper">
					<view v-for="(item, index) in xList" :key="index" class="floor-item"
						@click="navToDetailPage(item.id)">
						<image :src="item.ioc" mode="aspectFill"></image>
						<text class="title clamp">{{item.title}}</text>
						<text class="price">￥{{item.price}}</text>
					</view>
					<view class="more" @click="navToList(0,1)">
						<text>查看全部</text>
						<text>More+</text>
					</view>
				</view>
			</scroll-view>
		</view>


		<view class="f-header m-t">
			<image src="/static/hot.png"></image>
			<view class="tit-box">
				<text class="tit">热销推荐</text>
				<text class="tit2">Best Selling Recommendation</text>
			</view>
			<text class="yticon icon-you" @click="navToList(0,2)"></text>
		</view>

		<view class="guess-section">
			<view v-for="(item, index) in sList" :key="index" class="guess-item" @click="navToDetailPage(item.id)">
				<view class="image-wrapper">
					<image :src="item.ioc" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price">￥{{item.price || 0}}</text>
			</view>
		</view>


	</view>
</template>

<script>
	import api from '../../common/api.js'
	export default {
		data() {
			return {
				titleNViewBackground: 'rgb(203, 87, 60)',
				swiperCurrent: 0,
				swiperLength: 3, // 假设轮播图有3张
				carouselList: [{
						id: 1,
						url: '../staic/temp/c1.png'
					},
					{
						id: 2,
						url: '../staic/temp/c2.png'
					},
					{
						id: 3,
						url: '../staic/temp/c3.png'
					}
				],
				LabelsList: [{
						id: 1,
						ioc: '../staic/temp/c1.png',
						name: '分类一'
					},
					{
						id: 2,
						ioc: '../staic/temp/c2.png',
						name: '分类二'
					},
					{
						id: 3,
						ioc: '../staic/temp/c3.png',
						name: '分类三'
					},
					{
						id: 4,
						ioc: '../staic/temp/c4.png',
						name: '分类四'
					}
				],
				homeList: {
					lb: [{
							url: '../staic/temp/banner1.jpg'
						},
						{
							url: '../staic/temp/banner2.jpg'
						},
						{
							url: '../staic/temp/banner3.jpg'
						}
					],
					zx: {
						url: '../staic/temp/ad1.jpg'
					}
				},
				xList: [{
						id: 1,
						ioc: 'path/to/new1.png',
						title: '新品一',
						price: '99'
					},
					{
						id: 2,
						ioc: 'path/to/new2.png',
						title: '新品二',
						price: '199'
					},
					{
						id: 3,
						ioc: 'path/to/new3.png',
						title: '新品三',
						price: '299'
					}
				],
				sList: [{
						id: 1,
						ioc: 'path/to/hot1.png',
						title: '热销一',
						price: '89'
					},
					{
						id: 2,
						ioc: 'path/to/hot2.png',
						title: '热销二',
						price: '159'
					},
					{
						id: 3,
						ioc: 'path/to/hot3.png',
						title: '热销三',
						price: '259'
					}
				]
			};
		},


		onLoad() {
			this.loadData();
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {


				let goodsList = await this.$api.json('goodsList');
				this.goodsList = goodsList || [];
				// api.post('Operate/xcxList', {}).then(res => {
				// 	this.homeList=res.data
				// 	this.swiperLength = res.data.lb.length;
				// 	// this.carouselList = carouselList;
				// 	// console.log("homeList",res)
				// })



				// api.post('Labels/homeList', {}).then(res => {
				// 	this.LabelsList=res.data
				// 	// console.log(res)
				// })
				let data = {
					"page": 1,
					"limit": 10,
					"lx": 2,
					"labelsid": 0
				}
				// api.post('Goods/xcxlist', data).then(res => {
				// 	this.sList=res.data
				// 	// console.log(res)
				// })
				let datas = {
					"page": 1,
					"limit": 10,
					"lx": 1,
					"labelsid": 0
				}
				// api.post('Goods/xcxlist', datas).then(res => {
				// 	this.xList=res.data
				// 	// console.log(res)
				// })
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//详情页
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			navToList(sid, tid) {
				uni.navigateTo({
					url: `/pages/product/list?sid=${sid}&tid=${tid}`
				})
			},
			xiangq() {
				console.log(11)
				uni.navigateTo({
					url: `/pages/notice/notice`
				})
			}
		},

	}
</script>

<style lang="scss">
	.search-section {
	    display: flex;
	    justify-content: space-between;
	    padding: 10px;
		border-radius: 20px; /* 设置圆角大小，此处为20px */
	}
	
	.search-input {
	    flex: 1;
	    margin-right: 10px;
		border-radius: 20px; /* 设置圆角大小，此处为20px */
	}
	
	.btn {
	    margin: 5px;
		border-radius: 20px; /* 设置圆角大小，此处为20px */
	}
	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	page {
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	/* #endif */


	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			padding: 13rpx;
			width: 120upx;
			height: 120upx;
			margin-bottom: 14upx;
			border-radius: 10%;
			opacity: .6;
			box-shadow: 4upx 4upx 20upx rgba(168, 168, 168, 0.4);
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		margin-top: 18rpx;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}

	.hot-floor {
		width: 100%;
		overflow: hidden;
		// margin-top: 40rpx;
		margin-bottom: 20upx;


		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			// margin-top:-10upx;
			// margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>