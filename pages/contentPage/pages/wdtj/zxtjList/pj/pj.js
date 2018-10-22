var app = getApp()
Page({
  data: {
    star: 0,
    starMap: [1, 2, 3, 4, 5],
    stars: [0, 1, 2, 3, 4],
    normalSrc: 'https://www.nbxwx.cn/SpringBootJT/show/images?fileName=normal.png',
    selectedSrc: 'https://www.nbxwx.cn/SpringBootJT/show/images?fileName=selected.png',
    halfSrc: 'https://www.nbxwx.cn/SpringBootJT/show/images?fileName=half.png',
    key: 0, //评分
    pjfs: 0,
    parameter: [{
      id: 1,
      name: '简单'
    }, {
      id: 2,
      name: '一般'
    }, {
      id: 3,
      name: '困难'
    }], //评价难度选择按钮
    kncd: 1,
    isClick: true
  },

  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr});
    var rylx = getApp().globalData.wxUserInfo.rylx;
    var lx = 0;
    if ((rylx != 'ls' && rylx != 'tjy' && rylx != 'zfry')|| rylx == '') {
      lx = 0;
    } else {
      lx = 1;
    }
    that.setData({
      bpjr: options.clr,
      parameter: that.data.parameter, //默认parameter数组的第一个对象是选中的
      pjr: getApp().globalData.wxUserInfo.jcid,
      rylx: rylx,
      lx:lx,
      xxid: options.tjid
    });
    if (lx == 0) {
      wx.request({
        url: urlStr+'mediate/findTj',
        data: {
          id: options.tjid
        },
        success:function(res){
          console.log(res);
          if(res.data.data != null){
            if (res.data.data.clrMap != null) {
              if (res.data.data.clrMap.mediator != null) {
                that.setData({
                  clrInfo: res.data.data.clrMap.mediator,
                  userInfo: res.data.data.clrMap.basic
                });
              } else {
                that.setData({
                  clrInfo: null
                });
              }
            } else {
              that.setData({
                clrInfo: null
              });
            }
            //查询 评价信息
            wx.request({
              url: urlStr+'evaluate/queryPjxxByXxid',
              data: {
                xxid: options.tjid
              },
              success: function (res) {
                if (res.data.data != null) {
                  that.setData({
                    pjxxInfo: res.data.data,
                    pjfs: that.starCount(res.data.data.pjfs)
                  });
                }
              }
            })
          }
        }
      })
      
    } else {
      //查询调解员心得
      wx.request({
        url: urlStr+'mediate/findTj',
        data: {
          id: options.tjid
        },
        success: function(res) {
          console.log(res);
          if(res.data.data!= null){
            if (res.data.data.clrMap != null) {
              if (res.data.data.clrMap.mediator != null) {
                that.setData({
                  clrInfo: res.data.data.clrMap.mediator
                });
              } else {
                that.setData({
                  clrInfo: null
                });
              }
            } else {
              that.setData({
                clrInfo: null
              });
            }
            //调解详情
            that.setData({
              details: res.data.data,
            });
            var parameter = that.data.parameter;
            if (res.data.data.tjyxd != null) {
              for (var i = 0; i < parameter.length; i++) {
                if (parameter[i].id == res.data.data.kncd) {
                  parameter[i].checked = true;
                  that.setData({
                    isClick: false,
                    parameter: parameter
                  });
                } else {
                  parameter[i].checked = false;
                  that.setData({
                    parameter: parameter
                  });
                }
              }
            }
          }
        }
      })
    }

  },


  //点击右边,半颗星
  selectLeft: function(e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function(e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },
  /**
   * 新增评价信息
   */
  formSubmit: function(e) {
    // xxid（信息id）、pjlx（评价类型）、pjnr（评价内容）、
    // pjr（评价人）、bpjr（被评价人）、pjfs（评价分数），调解过程评价
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var lx = that.data.lx;
    var formData = e.detail.value;
    var xxid = this.data.xxid;
    if (lx == 0) {
      var bpjr = this.data.bpjr;
      var pjr = this.data.pjr;
      var pjnr = formData.pjnr;
      var tjgcpj = 1;
      var pjfs = this.data.key;
      var parame = {
        "xxid": xxid,
        "pjlx": 1,
        "pjnr": pjnr,
        "pjr": pjr,
        "bpjr": bpjr,
        "tjgcpj": tjgcpj,
        "pjfs": pjfs
      };
      wx.request({
        url: urlStr+'evaluate/addEvaluateInfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: parame,
        success: function(res) {
          if (res.data.state == 0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showModal({
              title: '提示',
              content: "评价失败",
              showCancel: false
            });
          }
        }
      });
    } else {

      var parame = {
        "id": xxid,
        "kncd": that.data.kncd,
        "tjyxd": formData.tjyxd
      };
      wx: wx.request({
        url: urlStr+'mediate/updateTjxd',
        data: parame,
        method: "POST",
        success: function(res) {
          if (res.data.state == 0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showModal({
              title: '提示',
              content: "评价失败",
              showCancel: false
            });
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }


  },
  //计算行星显示规则
  starCount: function(originStars) {
     var that = this;
    var urlStr = getApp().globalData.urlStr;
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars * 10 / 10,
      stars = [],
      i = 0;
    do {
      if (starNum >= 1) {
        stars[i] = urlStr+'show/images?fileName=selected.png';
      } else if (starNum >= 0.5) {
        stars[i] = urlStr+'show/images?fileName=half.png';
      } else {
        stars[i] = urlStr+'show/images?fileName=normal.png';
      }
      starNum--;
      i++;
    } while (i < 5)
    return stars;
  },

  // 难度选择参数点击响应事件
  parameterTap: function(e) { //e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList = this.data.parameter //获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].id == this_checked) {
        parameterList[i].checked = true; //当前点击的位置为true即选中
      } else {
        parameterList[i].checked = false; //其他的位置为false
      }
    }
    that.setData({
      parameter: parameterList,
      kncd: this_checked
    })
  }

});