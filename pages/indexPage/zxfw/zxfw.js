Page({

  /**
   * 页面的初始数据
   */
  data: {
		urlStr:""
	},
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this;
		var urlStr = getApp().globalData.urlStr;
		that.setData({ urlStr: urlStr });
    var that = this;
    //判断是否注册 审核通过
    var isRegister = getApp().globalData.isRegister;
    if (isRegister != 1) {
      //审核未通过
      // wx.showModal({
      //   title: '提示',
      //   content: "未登录，请登录",
      //   showCancel: false,
      //   success: function (res) {
      //     if (res.confirm) {
      //       wx.switchTab({
      //         url: '../index/index',
      //       });
      //     }
      //   }
      // });
    }
  },
  /**
   * 我要咨询
   */
  clickTjFun:function(e){
			wx.navigateTo({
				url: "../../contentPage/pages/wdzx/index/index"
			})
		}
  ,
  /**
   * 监听页面显示
   */
  onShow: function (e) {
    var that = this;
    //判断是否注册 审核通过
    var isRegister = getApp().globalData.isRegister;
    if (isRegister != 1) {
      //审核未通过
      wx.showModal({
        title: '提示',
        content: "未登录，请登录",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index',
            });
          }
        }
      });
    }
  }
})