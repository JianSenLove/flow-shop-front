<template>
	<view class="content">
		<view class="search-section">
			<uni-section>
				<uni-search-bar placeholder="搜索商品" @confirm="search" :focus="true" v-model="searchValue" @blur="blur"
					@focus="focus" @input="input" @cancel="cancel" @clear="clear">
				</uni-search-bar>

			</uni-section>
			<button class="confirm-btn" @click="identify">花卉识别</button>
			<button class="confirm-btn" @click="recommendation">智能推荐</button>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.image" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{ item.name }}</text>
				<view class="price-box">
					<text class="price">{{ item.price || 0 }}</text>
					<text>库存 {{ item.stock }}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>



	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { getGoodsList } from '@/common/restApi';
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
			goodsList: [
							{
								id: 1,
								image: 'https://example.com/image1.jpg',
								name: '植物1',
								price: '99.00',
								stock: '150'
							},
							{
								id: 2,
								image: 'https://example.com/image2.jpg',
								name: '植物2',
								price: '199.00',
								stock: '80'
							},
							{
								id: 3,
								image: 'https://example.com/image3.jpg',
								name: '花卉3',
								price: '299.00',
								stock: '60'
							},
							{
								id: 4,
								image: 'https://example.com/image4.jpg',
								name: '绿植4',
								price: '399.00',
								stock: '40'
							},
							{
								id: 5,
								image: 'https://example.com/image5.jpg',
								name: '多肉植物5',
								price: '49.00',
								stock: '200'
							}
			],
			page: 1,
		};
	},

	onLoad(options) {
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
		input(res) { },
		clear(res) {
		},
		cancel(res) {
		},

		//加载商品 ，带下拉刷新和上滑加载
		async loadData(type = 'add') {
			// 如果当前已经是'nomore'状态，并且是'add'操作，直接返回
			if (type === 'add' && this.loadingType === 'nomore') {
				return;
			}

			// 显示加载状态
			if (type === 'refresh') {
				this.goodsList = []; // 刷新操作需要清空现有列表
				this.loadingType = 'loading';
			} else if (type === 'add') {
				this.loadingType = 'loading';
			}

			try {
				// 模拟的API调用，替换成你的实际API方法
				let response = await getGoodsList({ page: this.page, rows: 10 });
				if (response && response.data && response.data.length > 0) {
					if (type === 'refresh') {
						// 刷新操作，直接替换数据
						this.goodsList = response.data;
					} else {
						// 加载更多，追加到现有数据之后
						this.goodsList = this.goodsList.concat(response.data);
					}

					// 判断是否还有更多数据，以决定loadingType的状态
					this.loadingType = response.data.length < 10 ? 'nomore' : 'more';
				} else {
					// 没有更多数据
					this.loadingType = 'nomore';
				}
			} catch (error) {
				// 处理加载过程中的错误
				console.error("Failed to load goods data:", error);
				this.loadingType = 'nomore'; // 设置状态为没有更多
			}

			// 结束下拉刷新动作
			if (type === 'refresh') {
				uni.stopPullDownRefresh();
			}
		},
		// 花卉识别
		identify() {
			uni.navigateTo({
				url: '/pages/product/flowerIdentify'
			})
		},
		// 智能推荐,调取接口获取新列表
		async recommendation() {
			// TODO 调整为推荐列表
			let response = await getGoodsList({ page: this.page, rows: 99 });
		},
		//详情
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			let id = item.id;
			uni.navigateTo({
				url: `/pages/product/product?id=${id}`
			})
		},
		stopPrevent() { }
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
	margin-top: 10upx;
	margin-bottom: 20upx;
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