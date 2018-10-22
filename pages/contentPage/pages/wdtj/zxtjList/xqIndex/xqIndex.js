var interval = null //倒计时函数
var app = getApp();
var baseUrl = getApp().baseUrl;
var ctx;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkedId: 1,
    isonLoad: 1,//加载标识。。
    idNum: 2,
    wsImgName: [],
    items: [],
    time: '获取验证码', //倒计时 
    currentTime: 61,
    showView: true,
    sfcg: 1, //是否办结成功
    text: "",
    tjid: '',
    //案件类型
    caseTypeArray: [{
      name: "请选择",
      value: "0"
    }],
    caseTypeIndex: 0,
    caseType: "",
    //案由
    ayArray: [{
      name: "请选择",
      value: "0"
    }],
    ayIndex: 0,
    ay: "",
    //部门（组织）
    depArray: [{
        name: "请选择",
        value: "0"
      },
      {
        name: "民事",
        value: "ms"
      },
      {
        name: "刑事",
        value: "xs"
      }
    ],
    depIndex: 0,
    dep: "",
    //人员类型（申请人类型）
    rylxArray: [{
        name: "请选择",
        value: "0"
      },
      {
        name: "自然人",
        value: "1"
      },
      {
        name: "法人",
        value: "2"
      }
    ],
    rylxIndex: 0,
    rylx: "",
    rylxType: [],
    //追加内容(被申请人)
    itemsBsqr: [],
    //追加内容(第三人)
    itemsDsr: [],
		clList: [],
    lxdh: '',
    details: '',
    rylxTypeIndex: 0,
    tjfs: 0, //调解方式
    tjjg: "",
    jg: 0,
    img_arrBj: [],
    resultName: '',
    //人员类型（0：当事人、务工、企业、人大代表。1：调解员、律师、政府人员）
    lx: 0,
    // menuName:"调解确认",
    // menuNameLx:"调解报结",
    sfqrbj: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    showView: (options.showView == "true" ? true : false)
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    var rylx = getApp().globalData.wxUserInfo.rylx;
    var jcid = getApp().globalData.wxUserInfo.jcid;
    var tjid = options.id;

    //获取人员类型
    var r = rylx;
    var arr = [];
    if(rylx != null){
      arr = r.split(",");
    }
    
    //设置 人员类型

    that.setData({
      lxdh: getApp().globalData.wxUserInfo.lxdh,
      rylx: rylx,
      rylxType: arr,
      tjid: tjid,
      jcid: jcid
    })
    //设置人员类型（0：用户端人员，1：服务端人员）
    if (rylx != "ls" && rylx != "tjy" && rylx != "zfry") {
      that.setData({
        lx: 0
      });
    } else {
      that.setData({
        lx: 1
      });
    }

    //根据ID查询调解详情接口
    wx.request({
      url: urlStr+'mediate/findTj',
      data: {
        id: tjid
      },
      success: function(res) {
        console.log(res);
        if (res.data.data != null) {
          if (res.data.data.clrMap != null){
            if (res.data.data.clrMap.mediator != null){
              that.setData({
                clrInfo: res.data.data.clrMap.mediator,
                clrInfo_basicInfo: res.data.data.clrMap.basic
              });
            }else{
              that.setData({
                clrInfo: null
              });
            }
          }else{
            that.setData({
              clrInfo: null
            });
          }
          //调解详情
          that.setData({
            details: res.data.data,
            itemsBsqr: res.data.data.cyrList,
            img_arr: res.data.data.clList,
            tjfs: res.data.data.tjfs,
            tjjg: res.data.data.tjjg,
            tjbh: res.data.data.tjbh
          });
          if (res.data.data.sqr == jcid) {
            // console.log("我是申请人");
            that.setData({
              usertype: "sqr"
            });
          } else {
            that.setData({
              usertype: "qt"
            });
          }

          // console.log("--------")
          // console.log(that.data.details)
          //设置案件类型填写项的值caseTypeArray
          for (var i = 0; i < that.data.caseTypeArray.length; i++) {
            if (res.data.data.tjlx == that.data.caseTypeArray[i].value) {
              that.setData({
                caseTypeIndex: i
              });
              break;
            }
          }

          //设置案由填写项的值
          for (var i = 0; i < that.data.caseTypeArray.length; i++) {
            if (res.data.data.tjlx == that.data.caseTypeArray[i].value) {
              that.setData({
                ayIndex: i
              });
              break;
            }
          }
          var sfqrbj = res.data.data.cyrList.sfqrbj
          for (var i = 0; i < res.data.data.cyrList.length; i++) {
            if (that.data.jcid == res.data.data.cyrList.sscyrid) {
              if (sfqrbj != 0) {
                that.setData({
                  sfqrbj: sfqrbj,
                })
              } else {
                break;
              }
            }
          }  
        } else {
          that.setData({
            details: null
          });
        }

      }
    })
    drawPic(that);
  },
  onShow: function() {

  },

	/**上传图片*/
	upimg: function () {
		var that = this;
		var urlStr = getApp().globalData.urlStr;
		var clList = this.data.clList;
		var obj = {};
		if (that.data.clList.length < 5) {

			wx.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机
				success: function (res) {
					// that.setData({
					//   img_arr: that.data.img_arr.concat(res.tempFilePaths),

					// })

					var tempFilePaths = res.tempFilePaths
					var tPath = res.tempFilePaths;

					//循环上传图片
					for (var i = 0; i < tPath.length; i++) {
						wx.getImageInfo({
							src: tPath[i],
							success: function (res) {
								// console.log(res);
							}
						})


						wx.uploadFile({
							url: urlStr + 'upload/uploadFile', //仅为示例，非真实的接口地址
							filePath: tPath[i],
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: function (r) {
								console.log(r)
								var data = r.data.data
								//对上传图片 返回值 进行数据转换
								r.data = JSON.parse(r.data);
								console.log("------")
								console.log(r.data.data)
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
							fail: function (r) {
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
	deleteImg: function (e) {
		var clList = this.data.clList;
		var index = e.currentTarget.dataset.index;
		clList.splice(index, 1);
		this.setData({
			clList: clList,

		});
	},
  /**
   * 标题点击事件
   */
  checkFun: function(e) {
    //切换选中样式
    var checkedId = e.currentTarget.dataset.index;
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var tjfs = that.data.tjfs;
    var lx = that.data.lx;
    var tjjg = that.data.tjjg;
    var sfqrbj = that.data.sfqrbj; //是否参与人办结
    var tjid = that.data.tjid;
    // console.log(tjid+"--------======------");
    var clr = e.currentTarget.dataset.clr;
    var tjzt = e.currentTarget.dataset.tjzt;
    var tjbh = this.data.tjbh;
    // console.log("tjbh" + tjbh)
    var tjzt = e.currentTarget.dataset.tjzt;
    //详情
    if (checkedId == 1) {
      that.setData({
        checkedId: checkedId
      });
    }
    //调解方式
    if (checkedId == 2) {
      if (tjfs == null) {
        //判断用户类型
        if (lx == 0) {
          // console.log("调解暂未开始");
          wx.showModal({
            title: '提示',
            content: '调解暂未开始',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  checkedId: 1
                });
              }
            }
          })
        } else {
          that.setData({
            checkedId: 2
          });
        }
      } else if (tjfs == 1) {
        // console.log(that.data.jcid);
        //查询该调解的群组信息
        wx.request({
          url: urlStr+'im/queryGroup',
          data: {
            tjbh: tjbh
          },
          success: function(res) {
            //如果群组为空 则提示调解员是否新建 提示用户请等待
            if (res.data.data != null) {

              var qzid = res.data.data.qzid;
              //查询用户所在的所有群组信息
              wx.request({
                url: urlStr+"im/queryGroupListIM",
                data: {
                  "jcid": that.data.jcid
                },
                success: function(r) {
                  var array = r.data.data.GroupIdList;

                  if (array  == undefined ) {

                    array = null;
                    wx.showModal({
                      title: '提示',
                      content: '暂无群组',
                      showCancel: false
                    });
                  } else {
                    var isExist = 0; //是否存在聊天群组中 0：不存在  1：存在
                    //比对
                    for (var i = 0; i < array.length; i++) {
                      //比对是否存在群组
                      if (array[i].GroupId == qzid) {
                        isExist = 1;
                        var nowMsgSeq = array[i].NextMsgSeq - 1;
                        wx.navigateTo({
                          url: '../../../../../groupChatPage/pages/groupInfo/index?groupId=' + array[i].GroupId + '&nowMsgSeq=' + nowMsgSeq + '&unreadMsgNum=' + array[i].SelfInfo.UnreadMsgNum + "&tjzt=" + tjzt + "&tjid=" + tjid
                        });
                        break;
                      }
                    }
                    //判断该用户是存在该调解的群组中
                    if(isExist == 0){
                      wx.showModal({
                        title: '提示',
                        content: '暂无群组',
                        showCancel: false
                      });
                    }
                  }
                  that.setData({
                    groupArr: array
                  });
                }
              });
            } else {
              //暂无群组 是否创建新的群组信息
              if (lx == 0) {
                //客户端 提示客户 暂未群组
                wx.showModal({
                  title: '提示',
                  content: '暂无群组',
                  showCancel: false
                });
              } else {
                if (tjzt == 5) {
                  //判断调解员是否新建群组信息
                  wx.showModal({
                    title: '提示',
                    content: '调解已结束,且无群组信息',
                    showCancel: false
                  })
                } else {
                  //判断调解员是否新建群组信息
                  wx.showModal({
                    title: '提示',
                    content: '是否新建群组',
                    showCancel: true,
                    success: function(res) {
                      if (res.confirm) {
                        //新建群组
                        wx.navigateTo({
                          url: "../../../../../groupChatPage/pages/addGroup/index?tjbh=" + tjbh+"&tjid="+tjid
                        })
                      } else {
                        // console.log("取消新建");
                      }
                    }
                  })
                }

              }
            }
          }
        })
      } else if (tjfs == 3) {
        that.setData({
          checkedId: checkedId
        });
        // console.log("线下调节");
      } else {
        wx.showModal({
          title: '提示',
          content: '视频调解功能敬请期待',
          showCancel: false
        });
        // console.log("在线视频调解");
      }
    }

    //报结
    if (checkedId == 3) {
      if (lx == 1) {
        if(tjjg == 0 || tjjg == 1){
          // console.log("服务端已报结，请评价");
          //内部评价   或者 外部评价
          wx.navigateTo({
            url: '../pj/pj?tjid=' + tjid + '&clr=' + clr
          })
        }else{
          // console.log("服务端未报结")
          that.setData({
            checkedId: 3,
          })
        }

      } else {
        console.log(tjjg);
        if (tjjg != null && tjjg != "" || tjjg == 0) {
          // console.log(sfqrbj);
          console.log("用户端已确认办结！");
          wx.navigateTo({
            url: '../pj/pj?tjid=' + tjid + '&clr=' + clr
          });
        } else {
          // console.log("调解暂未结束")
          wx.showModal({
            title: '提示',
            content: '调解暂未结束',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  checkedId: 1
                });
              }
            }
          })
        }

      }

      if (tjjg == 0) {
        // console.log("调解失败")
        that.setData({
          resultName: '调解失败 !'
        })
      } else if (tjjg == 1) {
        that.setData({
          resultName: '调解成功 !'
        })
      }
    }


  },

/**
 * 确认报结
 */
  formSubmit: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var formData = e.detail.value;

    var verificationState = 0; //定义一个 验证标识
    var clmc = "";
    var sscyrid = that.data.jcid;
    var yzm = ""

    var lx = that.data.lx;
    var tjid = that.data.tjid;
    // drawPic(that);//随机验证码
    //用户确认提交
    if (that.data.lx == 0) {
      yzm = formData.yzm;
      if (yzm == "" || null == yzm) {
        wx.showModal({
          title: '提示',
          content: "验证码不能为空",
          showCancel: false
        });
        verificationState = -1;
        return;
      }
      if (yzm == that.data.text) {
        //用户端办结确认填写内容 完成
        verificationState = 1;
      } else {
        wx.showModal({
          title: '提示',
          content: "验证码输入不正确",
          showCancel: false
        });
        verificationState = -1;
        return;
      }

    } else if (that.data.lx == 1) {
      clmc = that.data.clList;
			if (null == that.data.sfcg || that.data.sfcg == "") {
        wx.showModal({
          title: '提示',
          content: "调解结果不能为空",
          showCancel: false
        });
        verificationState = -2;
        return;
      }
      verificationState = 2;
    }

    if (verificationState == 1) {
      var parame = {
        id: tjid
      };
      // console.log(parame)
      //提交
      wx.request({
        url: urlStr+'mediate/confirmTj',
        data: parame,
        success: function(res) {
          wx.showModal({
            title: '提示',
            content: '办结确认填写内容完成',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  checkedId: 1,
                  sfqrbj: 1
                })
              }
            }
          })

        }
      })

    } else if (verificationState == 2) {
			console.log(parseInt(that.data.sfcg))
      // var parame = {
			// 	"tjjg": parseInt(that.data.sfcg),
      //   "clList": that.data.clList,
      //   "sfzctj": 0,
      //   "id": tjid,
      //   "tjzt": 5
      // };
      var parame = {
        tjjg: parseInt(that.data.sfcg),
        clList: that.data.clList,
        sfzctj: 0,
        id: tjid,
        tjzt: 5
      };
      //提交
      wx.request({
        url: urlStr+'mediate/completeTj',
        method: 'POST',
        data: parame,
        success: function(res) {
					console.log("----是否报结完成-----");
          console.log(res);
          wx.showModal({
            title: '提示',
            content: '办结填写内容完成',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // console.log("报结成功")
                that.setData({
                  checkedId: 1,
									tjjg: that.data.sfcg
                })
              }
            }
          })

        }
      })

    }



  },

  /**
   * 切换 处理中和已完结方式  触发相对应的 函数
   */
  onChangeShowState: function(e) {
    var that = this;
    var sfcg = e.currentTarget.dataset.id;
    that.setData({
      sfcg: sfcg,
    });
  },


  /**
   * 在线调解
   * */
  checkFunZxtj: function(e) {
    var tjid = this.data.tjid;
    var tjfs = e.currentTarget.dataset.id;
    var tjbh = this.data.tjbh;
    var urlStr = this.data.urlStr;

    var num = 1;
    //展示方式（tjfs:1在线文字调解  tjfs:2 在线视频调解）
    wx.request({
      url: urlStr+'mediate/updateTjfs',
      method: 'POST',
      data: {
        id: tjid,
        tjfs: tjfs
      },
      success: function(res) {
        console.log(res);
        if (res.data.state == 0) {
          //判断调解员是否新建群组信息
          wx.showModal({
            title: '提示',
            content: '是否新建群组',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                //新建群组
                wx.navigateTo({
                  url: "../../../../../groupChatPage/pages/addGroup/index?tjbh=" + tjbh+"&tjid="+tjid
                })
              } else {
                console.log("取消新建");
              }
            }
          })
        }
      }
    })
  },
  /**
   * 线下调解
   */
  checkFunxxtj: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    var tjid = that.data.tjid;
    var tjbh = e.currentTarget.dataset.tjbh;
    that.setData({
      showView: (!that.data.showView)
    })
    //展示方式
    wx.request({
      url: urlStr+'mediate/updateTjfs',
      method: 'POST',
      data: {
        id: tjid,
        tjfs: 3
      },
      success: function(res) {
        console.log(res);
      }
    })
  },


  change: function() {
    var that = this;
    drawPic(that);

  },
  mobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  /**
   * 再次申请调解
   */
  arginFun:function(e){
    
    wx.navigateTo({
      url: '../../tjsq/index',
    })
  },
  /**
		 * 展示图片
		 */
  showImg: function (e) {
    //获取data-src
    var src = e.currentTarget.dataset.src;
    var imgList = [src];
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    });
  },
  /**
   * 渲染
   */
  onReady: function () {
    this.setData({isonLoad:0});
  },
  /**
   * 查看调解员信息
   */
  bindFunGrxx:function(e){
      //获取处理人信息
    var clrInfo = this.data.clrInfo;
    var basic = this.data.clrInfo_basicInfo;
    wx.navigateTo({
      url: '../../../wdzx/zxGrxx/zxGrxx?xm=' + basic.xm + '&lxdh=' + basic.lxdh + '&jl=' + clrInfo.jl + '&tx=' + clrInfo.tx,
    })

  }

})


function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/**生成一个随机色**/
function randomColor(min, max) {
  var r = randomNum(min, max);
  var g = randomNum(min, max);
  var b = randomNum(min, max);
  return "rgb(" + r + "," + g + "," + b + ")";
}
/**绘制验证码图片**/
function drawPic(that) {
  ctx = wx.createCanvasContext('canvas');
  console.log("ctx : " + ctx)
  /**绘制背景色**/
  ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
  ctx.fillRect(0, 0, 90, 28)
  /**绘制文字**/
  var arr;
  var text = '';
  var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
  for (var i = 0; i < 4; i++) {
    var txt = str[randomNum(0, str.length)];
    ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
    ctx.font = randomNum(20, 26) + 'px SimHei'; //随机生成字体大小
    var x = 5 + i * 20;
    var y = randomNum(20, 25);
    var deg = randomNum(-20, 20);
    //修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(txt, 5, 0);
    text = text + txt;
    //恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  /**绘制干扰线**/
  for (var i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, 90), randomNum(0, 28));
    ctx.lineTo(randomNum(0, 90), randomNum(0, 28));
    ctx.stroke();
  }
  /**绘制干扰点**/
  for (var i = 0; i < 20; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, 90), randomNum(0, 28), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.draw(false, function() {
    that.setData({
      text: text
    })

  });
}