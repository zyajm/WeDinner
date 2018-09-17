// pages/eat/eat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supports: '技术支持：上海福耀客车信息部',
    userid: "",
    btnScanText: '扫一扫',
    QRCode: "",
    loading: false,
    buttonDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userid: options.userid
    })
  },

  //扫一扫
  ScanQRCode: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log("result:" + res.result)
        console.log("scanType:" + res.scanType)
        console.log("charSet:" + res.charSet)
        console.log("path:" + res.path)
        console.log("rawData:" + res.rawData)
        that.setData({
          QRCode: res.result
        })
        this.Purchase();
      }
    })
  },

  //交易
  Purchase: function () {
    var that = this;
    var actionType = "Payment";
    var QRCode = this.data.QRCode;
    var UserID = this.data.userid;
    console.log("QRCode：" + QRCode);
    console.log("UserID：" + UserID);
    that.setData({
      loading: true,
      buttonDisabled: true
    })
    wx.request({
      url: 'https://dinner.geafon.com/Purchase/APIPurchaseDetailSource',
      method: 'POST',
      data: {
        actionType: actionType,
        QRCode: QRCode,
        UserID: UserID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data[0].code == "true") {
          var message = "成功";
          wx.showToast({
            title: message,
            icon: 'success',
            duration: 600000
          })
          const innerAudioContext = wx.createInnerAudioContext(); //新建一个createInnerAudioContext();
          innerAudioContext.autoplay = true; //音频自动播放设置
          innerAudioContext.src = '/audio/success.mp3'; //链接到音频的地址
          innerAudioContext.onPlay(() => { }); //播放音效
          innerAudioContext.onError((res) => { //打印错误
            console.log(res.errMsg); //错误信息
            console.log(res.errCode); //错误码
          })
        }
        else {
          var message = res.data[0].message;
          wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          loading: false,
          buttonDisabled: false
        })
      },
      fail: function ({
        errMsg
      }) {
        wx.showToast({
          title: errMsg,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          loading: false,
          buttonDisabled: false
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