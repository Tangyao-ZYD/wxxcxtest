Page({

  /**
   * 页面的初始数据
   */
  data: {
    tjnr: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var tjbh = options.tjbh;
    var tjid = options.tjid;
    that.setData({ tjbh: tjbh, urlStr: urlStr,tjid:tjid});
  },
  /**
   * 添加群组
   */
  addGroupFun: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var formData = e.detail.value;
    var tjnr = formData.tjnr;
    var ztjj = formData.ztjj;
    
    var jcid = getApp().globalData.wxUserInfo.jcid;
    var tjbh = this.data.tjbh;
    var tjid = this.data.tjid;

    var parame = { tjnr: tjnr, ztjj: ztjj, jcid: jcid ,tjbh:tjbh};
    // console.log(parame)
    //执行新建
    wx.request({
      url: urlStr+'im/addQzjl',
      data:parame,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success:function(res){
        console.log(res)
        //判断是否新建成功
        if(res.data.state == 0){
          wx.showToast({
            title: '新建成功',
            icon: 'success',
            duration: 3000,
            mask: true
          });
          //跳转群组列表页面
          wx.navigateTo({
            url: '../../../contentPage/pages/wdtj/zxtjList/xqIndex/xqIndex?id=' + tjid,
          })

        }else{
          wx.showToast({
            title: '新建失败',
            icon: 'none',
            duration: 1500,
            mask: true
          });
        }
      }
    })
  }

})