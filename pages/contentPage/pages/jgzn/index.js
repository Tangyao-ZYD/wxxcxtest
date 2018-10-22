Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedId: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    //获取请求地址
    var urlStr = getApp().globalData.urlStr;
    //获取查询条件  -- 功能代码
		var gndm = options.gndm;
    //将请求地址、功能代码 设置在本页data 中  方便其他方法中调用
    that.setData({ gndm: gndm, urlStr: urlStr });
    //查询法律法规列表
		console.log("gndm : " + gndm);
    wx.request({
      url: urlStr+"xxfz/queryXxByGndm?gndm=" + gndm,
      success: function (r) {
				console.log(r)
        //判断返回数据是否为空
        if (r.data.data !=null) {
          var arr = r.data.data;
          //设置页面选中样式的值 以及返回数据绑定
          var checkedId = r.data.data[0].xxid;
          that.setData({
            arr: arr,
            checkedId: checkedId,
          });
        } else {
          that.setData({
            arr: null
          });
        }
      }
    });
  },
  /**
   * 标题点击事件
   */
  checkFun: function (e) {
    //切换选中样式
    var checkedId = e.currentTarget.dataset.id;
    this.setData({
      checkedId: checkedId,
    });
    //跳转到查看详情页面
    wx.navigateTo({
      url: '../../pages/jgznInfo/jgznInfo?id=' + checkedId,
    });
  },
  /**
   * 条件查询
   */
  queryByBt:function(e){
    var that = this;
    
    var gndm = this.data.gndm;
    var formData = e.detail.value;
    
    var urlStr = getApp().globalData.urlStr;
    //判断查询条件是否为空
    if(formData.bt .length != 0){
      //如果不为空  则查询 出相对应的数据
      wx.request({
        url: urlStr+'flfg/queryWx_xx',
        data: { "bt": formData.bt, "gndm": gndm },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (r) {
          //判断请求返回的数据是否为空  
          if (r.data.data != null) {
            //设置选中的样式的值  以及 返回数据的绑定
            var arr = r.data.data;
            var checkedId = r.data.data[0].xxid;
            that.setData({
              arr: arr,
              checkedId: checkedId,
            });
          } else {
            that.setData({
              arr: null
            });
          }
        }
      })
    }else{
      //查询法律法规列表(查询条件为空时  查询所有)
      wx.request({
        url: urlStr+"xxfz/queryXxByGndm?gndm=" + gndm,
        success: function (r) {
					console.log(r)
          //判断请求返回数据是否为空
          if (r.data.data != null) {
            var arr = r.data.data;
            var checkedId = r.data.data[0].xxid;
            that.setData({
              arr: arr,
              checkedId: checkedId,
            });
          } else {
            that.setData({
              arr: null,
            });
          }
        }
      });
    }
    
  }
})