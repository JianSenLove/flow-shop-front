<template>
	<view class="content">
		<view class="search-section">
			<uni-section>
				<uni-search-bar placeholder="搜索商品" v-model="searchValue" @confirm="search" @cancel="cancel" @clear="cancel">
				</uni-search-bar>

			</uni-section>
      <view class="history-section icon">

         <list-cell icon="icon-share" iconColor="#9789f7" title="花卉识别" @eventClick="identify" ></list-cell>
         <list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="智能推荐" @eventClick="recommendation"></list-cell>
      </view>
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
	import {
		getGoodsList
	} from '@/common/restApi.js';
  import listCell from "@/components/mix-list-cell.vue";
	export default {
		components: {
      listCell,
			uniLoadMore
		},
		data() {
			return {
				searchValue: '',
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				goodsList: [

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
			this.loadData('refresh',this.searchValue);
		},
		//加载更多
		onReachBottom() {
			this.page = this.page + 1;
			this.loadData('add',this.searchValue);
		},
		methods: {
			cancel(res) {
				this.loadData('refresh');
			},
			search(res) {
				this.loadData('refresh',this.searchValue);
			},

			async loadData(type = 'add', searchName = '') {
				if (type === 'add' && this.loadingType === 'nomore') {
					return;
				}

				this.loadingType = 'loading';

				const params = {
					page: this.page,
					rows: 10
				};
				if (searchName) {
					params.name = searchName; // 添加搜索参数
				}

				let response = await getGoodsList(params);
				if (response && response && response.records && response.records.length > 0) {
					this.goodsList = type === 'refresh' ? response.records : this.goodsList.concat(response.records);
					this.loadingType = response.records.length < 10 ? 'nomore' : 'more';
				} else {
					this.loadingType = 'nomore';
          if (type === 'refresh') {
            this.goodsList = [];
            uni.showToast({
              title: '没有更多了',
              icon: 'none'
            })
          }
				}

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
				let response = await getGoodsList({
					page: this.page,
					rows: 99
				});
			},
			//详情
			navToDetailPage(item) {
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