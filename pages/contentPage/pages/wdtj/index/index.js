
var app = getApp();
var baseUrl = getApp().baseUrl;
var ctx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    //获取接口访问地址前半部分
    var urlStr = getApp().globalData.urlStr;
    //获取当前登录人的人员类型
    var rylx = getApp().globalData.wxUserInfo.rylx;
    //获取当前登录人基础id
    var jcid = getApp().globalData.wxUserInfo.jcid;
    //将其值 保存在本页面的data 里边 方便后面使用
    this.setData({
      rylx: rylx,
      jcid: jcid,
      urlStr: urlStr
    });
  },
  /**
   * 新增调解信息
   */
  clickFunPropose:function(e){
    wx.navigateTo({
      url: '../tjsq/index?lx=sq',
    })
  },
  /**
   * 我的调解列表
   */
  tjListFun:function(e){
    wx.navigateTo({
      url: '../zxtjList/wdtj/index?rylx=' + this.data.rylx,
    })
  },
  // /**
  //  * 速裁保障
  //  */
  // scbzFun:function(e){
  //   wx.navigateTo({
  //     url: '../../scbz/index/index',
  //   })
  // }
})
