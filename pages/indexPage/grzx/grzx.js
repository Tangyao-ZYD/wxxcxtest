Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //是否注册
    var isRegister = getApp().globalData.isRegister;
    if (isRegister == 0) {
      //未注册 请注册
      wx.showModal({
        title: '提示',
        content: "暂未注册，请到首页注册",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../../pages/indexPage/index/index',
            });
          }
        }
      })

    } else {
      //检测是否审核通过
      var isReviewed = getApp().globalData.isReviewed;
      if (isReviewed == 0) {
        //审核未通过  提示用户
        wx.showModal({
          title: '提示',
          content: "正在审核，请等待...",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../../../pages/indexPage/index/index',
              });
            }
          }
        })
      } else {
        //审核通过可以点击

      }
    }
    
  },

  onShow:function(){
    this.onLoad();
  },
  /**
   * 网上立案
   */
  clickWslaFun:function(e){
      wx.navigateTo({
        url: '../../../../../../../pages/caseInfoPage/pages/wsla/one',
      })
  },
  /**
   * 沟通交流
   */
  gtjlFun: function (e) {
    console.log(123);
    wx.navigateTo({
      url: "../../../../../../../pages/caseInfoPage/pages/gtjl/gtjl",
    })
  }
  , 
  /**
   * 个人案件
   */
  grajFun:function(e){
    wx.navigateTo({
      url: "../../../../../../../pages/indexPage/grzx/ajList/index",
    })
  }
})