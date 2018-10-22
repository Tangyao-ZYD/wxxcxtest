Page({

  /**
   * 页面的初始数据
   */
  data: {
		tjydataIndex:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
    var urlStr = getApp().globalData.urlStr;
		var tjydataIndex = options.tjydataIndex
		console.log(tjydataIndex)
		that.setData({
			tjydataIndex: tjydataIndex,
      urlStr: urlStr
		})
		if (tjydataIndex == 'hfph') {//调解咨询好评排行榜
			wx.request({
				url: urlStr+'mediator/queryMediatorLimitTenByZxhps',
				success: function (r) {
					if (r.data.data != null) {
						that.setData({
							arr: r.data.data,
						});
					} else {
						that.setData({
							arr: null,
						});
					}
				}
			});
		} else if (tjydataIndex == 'hpph') {
			wx.request({
				url: urlStr+'mediator/queryMediatorLimitTenByZxhps',
				success: function (r) {
					console.log(r);
					if (r.data.data != null) {
						that.setData({
							hpArr: r.data.data,
						});
					} else {
						that.setData({
							hpArr: null,
						});
					}
				}
			});
		} else if (tjydataIndex == 'tjph') {//调解调解数量排行榜
			wx.request({
				url: urlStr+'mediator/queryMediatorLimitTenByTjs',
				success: function (r) {
					console.log(r);
					if (r.data.data != null) {
						that.setData({
							tjArr: r.data.data,
						});
					} else {
						that.setData({
							tjArr: null,
						});
					}
				}
			});
		} else if (tjydataIndex == 'tjhpph') {
			wx.request({
				url: urlStr+'mediator/queryMediatorLimitTenByTjhps',
				success: function (r) {
					console.log(r);
					if (r.data.data != null) {
						that.setData({
							tjhpArr: r.data.data,
						});
					} else {
						that.setData({
							tjhpArr: null,
						});
					}
				}
			});
		}	
  },
})