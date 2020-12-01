Page({

  /**
   * 页面的初始数据
   */
  data: {
		urlStr:""
	},
  /**
     * 点击跳转用户所在群组列表
     */
  groupList: function () {
    wx.navigateTo({
      url: "../../groupChatPage/pages/groupList/index"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var urlStr = getApp().globalData.urlStr;
		this.setData({ urlStr: urlStr });
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
   * 我要调解
   */
  clickTjFun:function(e){
    wx.navigateTo({
      url: "../../contentPage/pages/wdtj/index/index"
    })
  },
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
  },
	//小程序跳小程序
	appletCheck: function (e) {
		var parame = {
			tjzt: "1",
			sf: "1",
			tjbh: "20181101160024",
			jcid: "dd7cab00-99dd-4e4e-9fe2-6bb1a5189f80",
			userName: "yangx"
		}
		// getApp().globalData.sptj = parame
		wx.navigateToMiniProgram({
			appId: 'wxc50b09fb1c085e41',
			path: 'pages/index/index?parame=' + parame,
			// extraData: {
			
			// },
			envVersion: 'develop',
			success(res) {
				// 打开成功
				console.log("小程序与小程序之间跳转")
			}
		})
	}
})