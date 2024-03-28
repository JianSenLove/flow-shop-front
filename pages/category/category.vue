<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="(item,index) in flist" :key="item.id" class="f-item b-b"
				:class="{active: item.id === currentId}" @click="tabtap(item,index)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll"
			:scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view @click="navToList(titem.id)" v-if="titem.categoryId === item.id" class="t-item"
						v-for="titem in tlist" :key="titem.id">
						<image :src="titem.image"></image>
						<text>{{titem.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getCategoryList
	} from '@/common/restApi.js'
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1, // 假设默认当前选中的分类ID
				// 一级分类
				flist: [],
				// 二级分类
				slist: [],
				// 三级分类，与二级分类ID相关联
				tlist: [],
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			async loadData() {
				let params = {
					page: 1,
					rows: 99
				};
				let response = await getCategoryList(params);
				this.flist = response.records; // 假设一级分类和二级分类数据结构相同，仅作展示用

				// 重构二级分类（slist）的加载逻辑，使其包含对应的产品信息
				this.slist = response.records.map(item => {
					return {
						...item, // 展开原始二级分类信息
						products: item.products || [], // 确保每个二级分类都有products数组
					};
				});

				// 计算每个二级分类的top值，便于滚动定位
				let temp = 0;
				this.slist.forEach(item => {
					item.top = temp;
					// 假设每个二级分类区块的高度是由其产品数量决定的，这里简化为每个产品占据100的高度
					temp += item.products.length * 100; // 根据产品数量动态调整高度
				});
			},
			//一级分类点击
			tabtap(item, index) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}

				this.currentId = item.id;
				// console.log(item.id)
				// let index = this.slist.findIndex(sitem=>sitem.categoryId === item.id);

				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				// console.log(scrollTop)
				let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
				// console.log(tabs,this.slist,tabs.length)
				if (tabs.length > 0) {
					this.currentId = tabs[0].categoryId;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid) {
				uni.navigateTo({
					url: `/pages/product/list?sid=${sid}&tid=0`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}
</style>