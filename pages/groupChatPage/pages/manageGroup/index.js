Page({

  /**
   * 页面的初始数据
   */
  data: {
    disp: 1,
    checkd: 0,
    sfcx: 1,
    isDel: 1,
    dsrList: [],
    qzjj: "",
    qzid: "",
    newUser: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var qzid = getApp().globalData.qzid;
    that.setData({
      qzid: qzid,
      disp: 1,
      checkd: 0,
      sfcx: 1,
      isDel: 1,
      urlStr: urlStr 
    });
    wx.request({
      url: urlStr+'im/queryQzcyListAndQzjlByQzid',
      data: {
        qzid: that.data.qzid
      },
      success: function(res) {
        console.log(res);
        if (res.data.data != null) {
          if (res.data.data.qzcy.length != 0) {
            that.setData({
              dsrList: res.data.data.qzcy
            });
          } else {
            that.setData({
              dsrList: null
            });
          }
          that.setData({
            qzjj: res.data.data.qzjl.qzjj
          });
        } else {
          that.setData({
            qzjj: null,
            dsrList: null
          });
        }
      }
    });
  },
  /**
   * 失去光标 获取input 中的值
   */
  blurFun: function(e) {
    var sfzh = e.detail.value;
    console.log(sfzh);
    this.setData({
      sfzh: sfzh
    });

  },
  /**
   * 查询案件相关信息（包括当事人信息）
   */
  queryFun: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    this.setData({
      sfcx: 0
    });
    console.log(123); //qzid:'@TGS#26VDE7LF4'
    //查询信息
    wx.request({
      url: urlStr+'basicinfo/findUserBySfzh',
      data: {
        sfzh: that.data.sfzh
      },
      success: function(res) {
        console.log(res);
        if (res.data.data != null) {
          that.setData({
            newUser: res.data.data,
          });
        } else {
          that.setData({
            newUser: null,
          });
        }
      }
    })

  },
  clickFun: function(e) {
    console.log(123);
    var that = this;
    that.setData({
      disp: 0,
      checkd: 1,
      isDel: 0,
    });
  },
  /**
   * 添加用户
   */
  addUserFun: function(e) {
    var that = this;
    var sfzh = e.currentTarget.dataset.index;
    var xm = e.currentTarget.dataset.id;
    var jcid = e.currentTarget.id;

    var dsrList = this.data.dsrList;

    var obj = {
      "qcymc": that.data.newUser.xm,
      "sfzhm": that.data.newUser.sfzh,
      "jcid": that.data.newUser.jcid
    };

    dsrList.unshift(obj);

    this.setData({
      dsrList: dsrList,
      sfcx: 1,
    });
  },
  /**
   * 删除用户
   */
  deleteUserFun: function(e) {
    var index = e.currentTarget.id;
    var dsrList = this.data.dsrList;
    dsrList.splice(index, 1);
    this.setData({
      dsrList: dsrList
    });

  },
  /**
   * 提交修改的群成员信息
   */
  submitFun: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var str = "";
    var dsrList = this.data.dsrList;


    for (var i = 0; i < dsrList.length; i++) {
      if (i != dsrList.length - 1) {
        str += dsrList[i].jcid + ","
      } else {
        str += dsrList[i].jcid
      }
    }



    var parame = {
      qzid: this.data.qzid,
      jcids: str
    }
    console.log(parame);
    wx.request({
      url: urlStr+'im/operateQzcy',
      data: parame,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(r) {
        console.log(r);
        if (r.data.state == 0) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1500,
            mask: true
          });
          that.onLoad();
          // that.refreshFun();
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1500,
            mask: true
          });
        }
      }
    })
  },
  /**
   * 刷新
   */
  refreshFun: function(e) {

  }


})