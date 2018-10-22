Page({

  data: {
    showView: true,
    items: [],
    Handle: [],
    startX: 0, //开始坐标
    startY: 0,
    isonLoad:1,//加载标识。。
    

  },

  onLoad: function(e) {
    showView: (e.showView == "true" ? true : false)
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    var rylx = getApp().globalData.wxUserInfo.rylx;
    var jcid = getApp().globalData.wxUserInfo.jcid;
    var lxdh = getApp().globalData.wxUserInfo.lxdh;
    this.setData({
      rylx: rylx,
      jcid: jcid,
      lxdh: lxdh
    });
    var parame = {};
    if (rylx != "ls" && rylx != "tjy" && rylx != "zfry") {
      this.setData({
        lx: 0
      });
      parame = {
        lxdh: lxdh,
        tjzt: 1
      }
      wx.request({
        url: urlStr+'mediate/queryTjByLxdh',
        data: parame,
        // method:"POST",
        success: function(res) {
          if (res.data.data != null) {
            that.setData({
              items: res.data.data
            });
          } else {
            that.setData({
              items: null
            });
          }
        }
      })

    } else {
      this.setData({
        lx: 1
      });
      parame = {
        clr: jcid,
        tjzt: 1
      }
      //获取当事人调解列表
      wx.request({
        url: urlStr+"mediate/queryTj",
        method: "POST",
        data: parame,
        success: function(res) {
          if (res.data.data != null) {
            that.setData({
              items: res.data.data
            });
          } else {
            that.setData({
              items: null
            });
          }
        }
      });
    }
  },
  /**
   * 切换 处理中和已完结方式  触发相对应的 函数
   */
  onChangeShowState: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var tjzt = parseInt(e.currentTarget.dataset.id);
    var lx = that.data.lx;
    var jcid = that.data.jcid;
    var lxdh = that.data.lxdh;
    that.setData({
      showView: (!that.data.showView)
    });
    var parame = {};
    if (lx == 0) {
      parame = {
        lxdh: lxdh,
        tjzt: tjzt
      }
      wx.request({
        url: urlStr+'mediate/queryTjByLxdh',
        data: parame,
        success: function(res) {
          // console.log(res);
          if (res.data.data != null) {
            that.setData({
              items: res.data.data
            });
          } else {
            that.setData({
              items: null
            });
          }
        }
      })
    } else {
      parame = {
        clr: jcid,
        tjzt: tjzt
      }
      //获取列表
      wx.request({
        url: urlStr+'mediate/queryTj',
        data: parame,
        method: "POST",
        success: function(res) {
          // console.log(res);
          if (res.data.data != null) {
            that.setData({
              items: res.data.data
            });
          } else {
            that.setData({
              items: null
            });
          }

        }
      })
    }
    // console.log(parame);

  },
  /**
   * 点击列表 查询详情
   */
  clickFunContent: function(e) {
    var id = e.currentTarget.dataset.id;
    // console.log(id);
    wx.navigateTo({
      url: '../xqIndex/xqIndex?id=' + id,
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
  //评价
  pjClickFun: function(e) {
    var zxid = e.currentTarget.dataset.id;
    var clr = e.currentTarget.dataset.index;
    // console.log("pj");
    // wx.navigateTo({
    //   url: '../pj/pj?zxid=' + zxid + '&clr=' + clr,
    // });
  },
  /**
   * 点击查看详情
   */
  xqClickFun: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../xqIndex/xqIndex?id="+id,
    });
  },
  /**
   * 服务端转办调解
   */
  zbClickFun: function(e) {
    var urlStr = getApp().globalData.urlStr;
    var tjid = e.currentTarget.dataset.id;
    var tjbh = e.currentTarget.dataset.tjbh;
    var jcid = this.data.jcid;
    var parame = {
      tjid: tjid,
      tjbh: tjbh,
      yclr: jcid,
      cjr: jcid,
			shjg:2
    };
    //判断是否在转办中
    wx.request({
      url: urlStr+'mediate/queryZbqk',
      data: {
        id: tjid
      },
      success: function(res) {
        console.log(res);
        if (res.data.state == 0) {
          //确定用户是否确认申请转办
          wx.showModal({
            title: '提示',
            content: "是否申请调解转办？",
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                // console.log("用户点击确定");//转办操作
                wx.request({
                  url: urlStr+'mediate/applyBg',
                  method: "POST",
                  data: parame,
                  success: function(res) {
                    console.log(res);
                    //判断是否转办完成
                    if (res.data.state == 0) {
                      wx.showModal({
                        title: '提示',
                        content: "申请完成，请等待审核",
                        showCancel: false,
                      });
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: "申请失败",
                        showCancel: false,
                      });
                    }
                  }
                })
              }
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: "正在转办中。。。",
            showCancel: false,
          });
        }
      }
    })

  },
  /**
   * 删除退回调解信息
   */
  delClickFun: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var tjid = e.currentTarget.dataset.id;
    var tjzt = e.currentTarget.dataset.index;
    var jcid = this.data.jcid;
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: urlStr + "mediate/delTj",
            data: {
              id: tjid
            },
            success: function (res) {
              // console.log(res);
              if (res.data.state == 0) {
                // console.log("删除成功");
                //获取调解列表
                wx.request({
                  url: urlStr + 'mediate/queryTj',
                  data: {
                    sqr: jcid,
                    tjzt: tjzt
                  },
                  method: "POST",
                  success: function (res) {
                    console.log(res);
                    if (res.data.data != null) {
                      that.setData({
                        items: res.data.data
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
        }
      }
    })
  },
  /**
   * 渲染
   */
  onReady: function () {
    this.setData({ isonLoad: 0 });
  }


})