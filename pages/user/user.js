// pages/user/user.js
var QR = require("../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    userid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userid: options.userid
    })
    this.getQRCode();
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  //生成二维码
  formSubmit: function (e) {
    this.getQRCode();
  },

  //从后台获取二维码
  getQRCode: function () {
    var that = this;
    var UserID = this.data.userid;
    wx.request({
      url: 'https://dinner.geafon.com/Purchase/APIGetQRCodeSource',
      method: 'POST',
      data: {
        UserID: UserID,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if( res.data[0].code == "true")
        {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })  
          console.log("qrcode1:" + res.data[0].qrcode);
          var qrcode = res.data[0].qrcode;

          //绘制二维码
          var size = that.setCanvasSize();
          that.createQrCode(qrcode, "mycanvas", size.w, size.h);
        }
        else
        {
          var message = res.data[0].message;
          wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          })  
        }
      },
      fail: function ({
        errMsg
      }) {
        wx.showToast({
          title: errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },  

  //注销
  btnLogoutClick: function () {
    //清除登录信息
    wx.clearStorageSync();
    wx.redirectTo({ url: '../login/login' })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getQRCode();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})