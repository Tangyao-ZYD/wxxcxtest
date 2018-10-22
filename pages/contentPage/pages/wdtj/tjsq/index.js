var num;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isonLoad: 1,//加载标识。。
    //案件类型
    caseTypeArray: [{
      name: "请选择",
      value: "0"
    }],
    caseTypeIndex: 0,
    caseType: 0,
    //案由
    ayArray: [{
      name: "请选择",
      value: "0"
    }],
    ayIndex: 0,
    ay: "",
    //人员类型（申请人类型）
    rylxArray: [{
        name: "自然人",
        value: 1
      },
      {
        name: "法人",
        value: 2
      }
    ],
    rylxIndex: 0,
    rylx: 1,
    //追加内容(被申请人)
    itemsBsqr: [{
      "title": "名    称",
      "frxm": "法人姓名",
      "sfzh": "身份证号",
      "lxdh": "联系电话",
      "dz": "地    址"
    }],
    //追加内容(第三人)
    itemsDsr: [],
    img_arr: [],
    displaySqr: 0,
    clList: [],
    clmcName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    //获取申请人信息
    var userInfo = getApp().globalData.wxUserAllInfo.basicinfo;
    var enterprise = getApp().globalData.wxUserAllInfo.enterprise;
    that.setData({
      sqrInfo: userInfo,
      enterprise: enterprise
    });

    // console.log(userInfo);
    // console.log(getApp().globalData.wxUserAllInfo.enterprise);
    var caseTypeArray = that.data.caseTypeArray;
    //查询出以及下拉框
    wx.request({
      url: urlStr+'mediate/queryZz',
      data: {
        fjdm: 0
      },
      success: function(res) {
        // console.log(res);
        if (res.data.data != null) {
          that.setData({
            caseTypeArray: null,
          });
          var obj = {};
          for (var i = 0; i < res.data.data.length; i++) {
            obj = {
              "name": res.data.data[i].mc,
              "value": res.data.data[i].dm
            };
            caseTypeArray.push(obj);
          }
          that.setData({
            caseTypeArray: caseTypeArray,
          });
        }

      }
    });

  },
  /**
   * 案件类型选择器
   */
  bindCaseTypeChange: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    this.setData({
      caseTypeIndex: e.detail.value,
      caseType: that.data.caseTypeArray[e.detail.value].value
    });
    // console.log(that.data.caseType);
    that.setData({
      ayArray: [],
    });
    var ayArray = that.data.ayArray;
    //查询案由下拉框信息、
    wx.request({
      url: urlStr+'mediate/queryZz',
      data: {
        fjdm: that.data.caseType
      },
      success: function(res) {
        var obj = {};
        if (res.data.data != null) {
          obj = {
            "name": "请选择",
            "value": "0"
          };
          ayArray.push(obj);
          for (var i = 0; i < res.data.data.length; i++) {

            obj = {
              "name": res.data.data[i].mc,
              "value": res.data.data[i].dm
            };
            ayArray.push(obj);
          }
          that.setData({
            ayArray: ayArray,
          });
        }
      }
    });
  },
  /**
   * 案由选择器
   */
  bindAyChange: function(e) {
    var that = this;
    this.setData({
      ayIndex: e.detail.value,
      ay: that.data.ayArray[e.detail.value].value
    });
  },
  /**
   * 部门选择器
   */
  bindDepChange: function(e) {
    var that = this;
    this.setData({
      depIndex: e.detail.value,
      dep: that.data.depArray[e.detail.value].value
    });
  },
  /**
   * 申请人类型（自然人/法人）
   */
  bindRylxChange: function(e) {
    // console.log(e.detail.value);
    var that = this;
    this.setData({
      rylxIndex: e.detail.value,
      rylx: that.data.rylxArray[e.detail.value].value
    });
    if (e.detail.value == 1) {
      this.setData({
        displaySqr: 1
      });
    } else {
      this.setData({
        displaySqr: 0
      });
    }

  },
  /**
   * 添加人员（被申请人/第三人）
   */
  clickAddPeople: function(e) {
    var rylx = e.currentTarget.dataset.rylx;
    // console.log("rylx:" + rylx);
    var itemsBsqr = this.data.itemsBsqr; //被申请人数组
    var itemsDsr = this.data.itemsDsr; //第三人数组
    var obj = {
      "title": "名    称",
      "frxm": "法人姓名",
      "sfzh": "身份证号",
      "lxdh": "联系电话",
      "dz": "地    址"
    };
    //判断用户新增的是被申请人或者第三人
    if (rylx == 1) {
      if (itemsBsqr.length < 5) {
        itemsBsqr.push(obj);
        this.setData({
          itemsBsqr: itemsBsqr
        });
      } else {
        wx.showModal({
          title: '提示',
          content: "最多新增5个被申请人",
          showCancel: false
        });
        // console.log("最多新增5个被申请人");
      }

    } else {
      if (itemsDsr.length < 5) {
        itemsDsr.push(obj);
        this.setData({
          itemsDsr: itemsDsr
        });
        // console.log(this.data.itemsDsr);
      } else {
        wx.showModal({
          title: '提示',
          content: "最多新增5个第三人",
          showCancel: false
        });
        // console.log("最多新增5个第三人");
      }
    }
  },
  /**
   * 删除人员（被申请人/第三人）
   */
  clickDelPeople: function(e) {
    var rylx = e.currentTarget.dataset.rylx;
    var index = e.currentTarget.dataset.index;
    // console.log("index:" + index);
    var itemsBsqr = this.data.itemsBsqr; //被申请人数组
    var itemsDsr = this.data.itemsDsr; //第三人数组
    //判断用户新增的是被申请人或者第三人
    if (rylx == 1) {
      if (itemsBsqr.length <= 1) {
        wx.showModal({
          title: '提示',
          content: "必须填写一个被申请人信息",
          showCancel: false
        });
      } else {
        itemsBsqr.splice(index, 1);
        this.setData({
          itemsBsqr: itemsBsqr
        });
      }
    } else {
      itemsDsr.splice(index, 1);
      this.setData({
        itemsDsr: itemsDsr
      });
    }
  },
  /**上传图片*/
  upimg: function() {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var clList = this.data.clList;
    var obj = {};
    if (that.data.clList.length < 5) {

      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机
        success: function(res) {
          // that.setData({
          //   img_arr: that.data.img_arr.concat(res.tempFilePaths),

          // })

          var tempFilePaths = res.tempFilePaths
          var tPath = res.tempFilePaths;

          //循环上传图片
          for (var i = 0; i < tPath.length; i++) {
            wx.getImageInfo({
              src: tPath[i],
              success: function(res) {
                // console.log(res);
              }
            })


            wx.uploadFile({
              url: urlStr+'upload/uploadFile', //仅为示例，非真实的接口地址
              filePath: tPath[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function(r) {
                // console.log(r)
                var data = r.data.data
                //对上传图片 返回值 进行数据转换
                r.data = JSON.parse(r.data);
                obj = {
                  "cllb": "3",
                  "clmc": r.data.data
                };
                clList.push(obj);
                that.setData({
                  clList: clList
                });
                wx.showToast({
                  title: '上传成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                });
              },
              fail: function(r) {
                wx.showToast({
                  title: '上传失败',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                })
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '最多上传5张图片',
        icon: 'none',
        duration: 2000
      });

    }
  },

     // 删除图片
    deleteImg: function(e) {    
    var clList = this.data.clList;    
    var index = e.currentTarget.dataset.index;    
    clList.splice(index, 1);    
    this.setData({      
      clList: clList,
          
    });  
  },
  /**
   * 申请调解
   */
  formSubmit: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var formData = e.detail.value;
    var ry = [];
    var mc = "";
    var obj = {};
    var lx = 0;
    var bsqrItems = this.data.itemsBsqr;
    var dsrItems = this.data.itemsDsr;
    var sqrInfo = this.data.sqrInfo;
    var tj = {};
    var tjlx = this.data.caseType;
    var zzbh = this.data.ay;
    var bd = formData.bd;
    var sqsx = formData.sqsx;
    var jfms = formData.jfms;
    var jcid = sqrInfo.jcid;
    var bz = formData.bz;
    //调解信息
    if (tjlx == 0) {
      wx.showModal({
        title: '提示',
        content: "请选择调解案件类型",
        showCancel: false
      });
      return;
    }
    if (zzbh == 0) {
      wx.showModal({
        title: '提示',
        content: "请选择案由",
        showCancel: false
      });
      return;
    }
    if (null == sqsx || sqsx == "") {
      wx.showModal({
        title: '提示',
        content: "申请事项不能为空",
        showCancel: false
      });
      return;
    }
    if (null == jfms || jfms == "") {
      wx.showModal({
        title: '提示',
        content: "纠纷描述不能为空",
        showCancel: false
      });
      return;
    }


    //材料信息（证据材料）
    var clList = this.data.clList;

    //申请人
    //身份证号码格式验证
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!(reg.test(formData.sfzhm))) {
      wx.showModal({
        title: '提示',
        content: "身份证号码格式错误",
        showCancel: false
      });
      return;
    }
    //联系电话格式验证
    if (!(/^1[34578]\d{9}$/.test(formData.lxdh))) {
      wx.showModal({
        title: '提示',
        content: '联系电话格式错误，请重新输入',
        showCancel: false
      });
      return;
    }
    var sqr = {};
    // console.log(this.data.rylx);
    if (this.data.rylx == 1) {

      sqr = {
        ssdw: 1,
        lx: this.data.rylx,
        mc: formData.mc,
        fddbr: null,
        // xb: formData.xb,
        xb: 1,
        sfzhm: formData.sfzhm,
        dz: formData.dz,
        lxdh: formData.lxdh
      }
    } else {
      if (null != formData.mc && formData.mc != "") {
        sqr = {
          ssdw: 1,
          lx: formData.lx,
          mc: formData.mc,
          fddbr: formData.fddbr,
          // xb: formData.xb,
          xb: 1,
          sfzhm: formData.sfzhm,
          dz: formData.dz,
          lxdh: formData.lxdh
        }
      } else {
        wx.showModal({
          title: '提示',
          content: "公司名称不能为空",
          showCancel: false
        });
        return;
      }

    }
    ry.push(sqr);

    //被申请人
    for (var i = 0; i < bsqrItems.length; i++) {
      if (null != formData["dsrfddbr" + i] && formData["dsrfddbr" + i] != "") {
        lx = 2;
      } else {
        lx = 1;
      }
      if (null == formData["bsqrmc" + i] || formData["bsqrmc" + i] == "") {
        wx.showModal({
          title: '提示',
          content: "被申请人名称不能为空",
          showCancel: false
        });
        return;
      } else if (null == formData["bsqrlxdh" + i] || formData["bsqrlxdh" + i] == "") {
        wx.showModal({
          title: '提示',
          content: "被申请人联系电话不能为空",
          showCancel: false
        });
        return;
      } else if (!(/^1[34578]\d{9}$/.test(formData["bsqrlxdh" + i]))) {
        wx.showModal({
          title: '提示',
          content: "被申请人联系电话格式错误，请重新输入",
          showCancel: false
        });
        return;
      } else if (null == formData["bsqrdz" + i] || formData["bsqrdz" + i] == "") {
        wx.showModal({
          title: '提示',
          content: "被申请人地址不能为空",
          showCancel: false
        });
        return;
      } else {
        obj = {
          ssdw: 2,
          lx: lx,
          mc: formData["bsqrmc" + i],
          fddbr: formData["bsqrfddbr" + i],
          // xb: formData["bsqrxb" + i],
          xb: null,
          sfzhm: formData["bsqrsfzh" + i],
          dz: formData["bsqrdz" + i],
          lxdh: formData["bsqrlxdh" + i]
        };
        ry.push(obj);
      }
    }

    //第三人 数据
    for (var i = 0; i < dsrItems.length; i++) {
      mc = formData["dsrmc" + i];
      if (null != formData["dsrfddbr" + i] && formData["dsrfddbr" + i] != "") {
        lx = 2;
      } else {
        lx = 1;
      }
      if (null == formData["dsrmc" + i] || formData["dsrmc" + i] == "") {
        wx.showModal({
          title: '提示',
          content: "第三人名称不能为空",
          showCancel: false
        });
        return;
      } else if (null == formData["dsrlxdh" + i] || formData["dsrlxdh" + i] == "") {
        wx.showModal({
          title: '提示',
          content: "第三人联系电话不能为空",
          showCancel: false
        });
        return;
      }
      if (!(/^1[34578]\d{9}$/.test(formData["dsrlxdh" + i]))) {

        wx.showModal({
          title: '提示',
          content: "第三人联系电话格式错误，请重新输入",
          showCancel: false
        });
        return;
      }
      obj = {
        ssdw: 3,
        lx: lx,
        mc: mc,
        fddbr: formData["dsrfddbr" + i],
        xb: null,
        sfzhm: formData["dsrsfzh" + i],
        dz: formData["dsrdz" + i],
        lxdh: formData["dsrlxdh" + i]
      };
      ry.push(obj);
    }

    tj = {
      "tjlx": tjlx,
      "zzbh": zzbh,
      "bd": bd,
      "sqsx": sqsx,
      "jfms": jfms,
      "sqr": jcid,
      "bz": bz,
      "clList": clList,
      "cyrList": ry
    };
    // console.log(tj)
    wx.request({
      url: urlStr+'mediate/applyTj',
      data: tj,
      method: 'POST',
      success: function(res) {
        // console.log(res);
        if (res.data.state == 0) {
          // 提示用户 申请完成，请等待审核
          wx.showModal({
            title: '提示',
            content: '申请完成，请等待审核',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //申请完成  跳转到我的调解列表页面
                wx.navigateTo({
                  url: '../zxtjList/wdtj/index',
                })
              }
            }
          });
        }
      }
    });
  },
  /**
    * 渲染
    */
  onReady: function () {
    this.setData({ isonLoad: 0 });
  }
})