Page({

  data: {
    showView: true,
    items: [],
    Handle: [],
    startX: 0, //开始坐标
    startY: 0

  },

  onLoad: function(e) {
      showView: (e.showView == "true" ? true : false)
      var that = this;
      var urlStr = getApp().globalData.urlStr;
    
      that.setData({
        urlStr: urlStr
      });
    console.log(this.data.urlStr);
      var rylx = getApp().globalData.wxUserInfo.rylx;
      var jcid = getApp().globalData.wxUserInfo.jcid;
      this.setData({
        rylx: rylx,
        jcid: jcid
      });
      //获取当事人咨询列表
      wx.request({
        url: urlStr+'consultation/queryAllConsul',
        data: {
          fqr: jcid,
          zt: 2
        },
        success: function(res) {
          if (res.data.data != null) {
            that.setData({
              items: res.data.data.zxList
            });
          } else {
            that.setData({
              items: null
            });
          }

        }
      })

    }

    ,

  /**
   * 切换 处理中和已完结方式  触发相对应的 函数
   */
  onChangeShowState: function(e) {

    var zt = e.currentTarget.dataset.id;
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({
      showView: (!that.data.showView)
    });
    //获取当事人咨询列表
    wx.request({
      url: urlStr+'consultation/queryAllConsul',
      data: {
        fqr: that.data.jcid,
        zt: zt
      },
      success: function(res) {
        console.log(res);
        if (res.data.data != null) {
          that.setData({
            items: res.data.data.zxList
          });
        } else {
          that.setData({
            items: null
          });
        }

      }
    })

  },
  //手指触摸动作开始 记录起点X坐标

  touchstart: function(e) {

    //开始触摸时 重置所有删除

    this.data.items.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items

    })

  },

  //滑动事件处理

  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标

      //获取滑动角度

      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });

    that.data.items.forEach(function(v, i) {

      v.isTouchMove = false

      //滑动超过30度角 return

      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true

      }

    })

    //更新数据
    that.setData({
      items: that.data.items
    })

  },

  /**
  
  * 计算滑动角度
  
  * @param {Object} start 起点坐标
  
  * @param {Object} end 终点坐标
  
  */

  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y

    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件

  del: function(e) {
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })

  },
  //评价
  clickFunPj: function(e) {
    var zxid = e.currentTarget.dataset.id;
    var clr = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../pj/pj?zxid=' + zxid + '&clr=' + clr,
    });


  },
  //咨询信息已完结列表点击事件
  clickFunContent: function(e) {
    var shjg = e.currentTarget.dataset.index;
    var zxid = e.currentTarget.dataset.id;
    console.log(shjg);
    if (shjg == null) {
      wx.showToast({
        title: '审核中，请等待',
        icon: 'none',
        duration: 3000
      });
    } else if (shjg == 0) {
      wx.navigateTo({
        url: '../thbj/thbj?lx=th&zxid=' + zxid,
      })
    } else {
      wx.navigateTo({
        url: '../zxxx/zxxx?zxid=' + zxid,
      });
    }

  },

  //咨询信息处理中列表点击事件
  clickFunEdit: function(e) {
    var zxid = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../zxxx/zxxx?zxid=' + zxid,
    });
  },
  /**
   * 点击查看详情
   */
  clickFunInfo: function(e) {
    var zxid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "../thbj/thbj?zxid=" + zxid + "&lx=xq",
    });
  },
  /**
   * 删除退回咨询信息
   */
  clickFunDel: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var zxid = e.currentTarget.dataset.id;
    var zt = e.currentTarget.dataset.index;
    wx.request({
      url: urlStr+"consultation/delZxInfo",
      data: {
        id: zxid
      },
      success: function(res) {
        console.log(res);
        if (res.data.state == 0) {
          console.log("删除成功");
          //查询新的列表
          //获取当事人咨询列表
          wx.request({
            url: urlStr+'consultation/queryAllConsul',
            data: {
              fqr: that.data.jcid,
              zt: zt
            },
            success: function(res) {
              console.log(res);
              if (res.data.data != null) {
                that.setData({
                  items: res.data.data.zxList
                });
              } else {
                that.setData({
                  items: null
                });
              }

            }
          })
        }
      }
    })
  },
})