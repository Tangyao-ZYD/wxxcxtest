Page({

  /**
   * 页面的初始数据
   */
  data: {
		dataIndex:'',
		hpindex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
		var dataIndex = options.dataIndex;
    var url = getApp().globalData.urlStr;
		that.setData({
			dataIndex: dataIndex,
			url: url
		})
		if (dataIndex == 'hfph'){//律师咨询好评排行榜
			wx.request({
				url: url +'lawyer/queryLawyerLimitTenByZxhps',
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
		} else if (dataIndex == 'hpph'){
			wx.request({
				url: url + 'lawyer/queryLawyerLimitTenByZxhps',
				success: function (r) {
					console.log(r);
					if (r.data.data != null) {
						that.setData({
							hparr: r.data.data,
						});
					} else {
						that.setData({
							hparr: null,
						});
					}
				}
			});
		} else if (dataIndex == 'tjph') {//律师调解数量排行榜
			wx.request({
				url: url+'lawyer/queryLawyerLimitTenByTjs',
				success: function (r) {
					console.log(r);
					if (r.data.data != null) {
						that.setData({
							tjslArr: r.data.data,
						});
						console.log(that.data.arr)
					} else {
						that.setData({
							tjslArr: null,
						});
					}
				}
			});
		} else if (dataIndex == 'tjhpph') {
			wx.request({
        url: url +'lawyer/queryLawyerLimitTenByTjhps',
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