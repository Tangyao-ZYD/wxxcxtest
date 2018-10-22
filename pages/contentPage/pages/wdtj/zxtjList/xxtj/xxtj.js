Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		checkedId: 2,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
	},

	/**
		* 标题点击事件
		*/
	checkFun: function (e) {
		//切换选中样式
		var checkedId = e.currentTarget.dataset.index;
		this.setData({
			checkedId: checkedId,
		});
		if (checkedId == 1) {
			wx.navigateTo({
				url: "../xqIndex/xqIndex"
			})
		} else if (checkedId == 3) {
			wx.navigateTo({
				url: "../bj/bj"
			})
		}
	},
	
})