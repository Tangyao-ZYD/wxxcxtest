Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:[
     
    ],
    limit:20,
    offset:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr});
    var parame = { limit:that.data.limit, offset:that.data.offset}
    wx.request({
      url: urlStr+'mediator/queryAll',
      data:parame,
      success:function(r){
       
        if(r.data.data != null){
          that.setData({
            arr:r.data.data,
          });
        }else{
          that.setData({
            arr: null,
          });
        }
      }
    })    

  },
  /**
   * 点击加载更多
   */
  loadMoreFun:function(e){
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var arr = that.data.arr;
    var limit = that.data.limit;
    var offset = that.data.offset + 20;

    var parame = { limit: limit, offset: offset }

    wx.request({
      url: urlStr+'mediator/queryAll',
      data: parame,
      success: function (r) {

        if (r.data.data != null) {

          for (var i = 0; i < r.data.data.length; i++) {
            arr.push(r.data.data[i]);
          }

          that.setData({
            arr: arr,
            offset: offset
          });

        } else {
          wx.showToast({
            title: '暂无更多信息',
            icon: 'none',
            duration: 2000,
            mask: true,
          });
        }
      }
    }); 
  },
  /**
   * 人员详情查看
   */
  detailsFun:function(e){
    var tjyid = e.currentTarget.dataset.id;
    console.log(tjyid);
    wx.navigateTo({
      url: '../info/info?tjyid=' + tjyid,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
})