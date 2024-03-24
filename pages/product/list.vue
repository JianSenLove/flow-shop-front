<template>
	<view class="content">
		<view class="search-section">
			<uni-section>
				<uni-search-bar placeholder="搜索商品" @confirm="search" :focus="true" v-model="searchValue" @blur="blur"
					@focus="focus" @input="input" @cancel="cancel" @clear="clear">
				</uni-search-bar>

			</uni-section>
			<button class="confirm-btn" @click="identify" :disabled="logining">花卉识别功能</button>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.ioc" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<view class="price-box">
					<text class="price">{{item.price || 0}}</text>
					<text>已售 {{item.aid}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>



	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import api from '../../common/api.js'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				searchValue: '123123',
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateId: 0, //分类id
				goodsList: [{
						id: 1,
						ioc: 'https://example.com/image1.jpg',
						title: '商品标题1',
						price: '99.00',
						aid: '150'
					},
					{
						id: 2,
						ioc: 'https://example.com/image2.jpg',
						title: '商品标题2',
						price: '199.00',
						aid: '80'
					},
					{
						id: 3,
						ioc: 'https://example.com/image2.jpg',
						title: '商品标题3',
						price: '199.00',
						aid: '80'
					},
					{
						id: 2,
						ioc: 'https://example.com/image2.jpg',
						title: '商品标题4',
						price: '199.00',
						aid: '80'
					},
					// 可以根据需要添加更多测试商品数据
				],
				page: 1,
			};
		},

		onLoad(options) {
			this.cateId = options.sid;
			this.filterIndex = options.tid;
			this.loadData();
			this.loadingType = 'noMore';
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.page = this.page + 1;
			this.loadData();
		},
		methods: {
			search(res) {
				uni.showToast({
					title: '搜索：' + res.value,
					icon: 'none'
				})
			},
			input(res) {},
			clear(res) {
				uni.showToast({
					title: 'clear事件，清除值为：' + res.value,
					icon: 'none'
				})
			},
			cancel(res) {
				uni.showToast({
					title: '点击取消，输入值为：' + res.value,
					icon: 'none'
				})
			},

			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}


				let data = {
					"page": this.page,
					"limit": 2,
					"lx": this.filterIndex,
					"labelsid": this.cateId
				}

			},

			goodlist() {

			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 5upx;
	}
	
	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 20upx;
		background: $uni-color-success;
		color: #fff;
		font-size: $font-lg;
	
		&:after {
			border-radius: 100px;
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.goods-item {
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

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
</style>