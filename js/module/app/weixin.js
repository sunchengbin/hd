define(['loading', 'config','zepto'], function(loading, config,zepto) {
    var WeiXin = {
        isWeixin: "micromessenger" == window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i),
        shareConf: {
            title: "小白免税",
            desc: "帮你送货到酒店和机场",
            link: "http://s.hdour.com/",
            imgUrl: "http://s.hdour.com/images/logo.jpg",
            success: function() {
                //alert('分享成功');
            },
            cancel: function() {}
        },
        location: null,
        locationStr: '',
        init: function(callback,wxcallback) {
            callback && callback();
            wxcallback && wxcallback();
        },
        wxinit : function(callback,type){
            var _this = this;
            $.ajax({
                //url: 'http://api.hdour.com/hdour/api/v1/sign',
                url : config.HOST + '/hdour/api/v1/sign',
                //url : config.HOST + '/api/v1/xiaobai/sign',
                type: 'get',
                dataType: 'json',
                data: {
                    url : location.href.replace(/#.*$/, "")
                },
                success: function (res) {
                    //callback && callback();
                    try {
                        wx.config({
                            debug: false,
                            appId: res.appId,
                            timestamp: parseInt(res.timestamp),
                            nonceStr: res.nonceStr,
                            signature: res.signature,
                            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','chooseImage','uploadImage']
                        });
                        wx.ready(function () {
                            if(!type){
                                _this.updateShare(_this.shareConf);
                            }
                            callback && callback();
                        });
                    } catch (g) {
                        callback && callback();
                    }
                },
                error:function(){
                    _this.wxinit(callback,type);
                }
            });
        },
        updateShare: function(conf) {
            var settings = "onMenuShareTimeline onMenuShareAppMessage";
            settings.split(" ").forEach(function(e) {
                wx[e](conf);
            });
        },
        previewImage: function(current, urls) {
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            });
        },
        chooseImage: function(num, callback) {
            wx.chooseImage({
                count: num, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    var localIds = res.localIds;  //返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    callback && callback(res);
                }
            });
        },
        uploadImage: function(id, callback) {
            wx.uploadImage({
                localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                    callback && callback(res);
                }
            });
        },
        uploadOneImg:function(callback){
            var self = this;
            // 选图
            this.chooseImage(1, function(chooseRes) {
                if (chooseRes.errMsg == 'chooseImage:ok') {
                    // 上传微信服务器
                    self.uploadImage(
                        chooseRes.localIds[0],
                        function(uploadRes) {
                            if (uploadRes.errMsg == 'uploadImage:ok') {
                                // 下载本地服务器
                                self.imgServerDownload(uploadRes.serverId, function(downloadRes) {
                                    callback && callback(downloadRes);
                                });
                            }
                        }
                    );
                }
            });
        },
        timer: null,
        imgServerDownload: function(id, callback) {
            var self = this,
                ids = [];
                ids.push(id);
            var formObj = {
                picIdList: ids
            };
            $.ajax({
                url: config.HOST + '/hdour/emall/my/addressPic/wx',
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data: JSON.stringify(formObj),
                success: function(res) {
                    callback && callback(res);
                },
                error: function(e) {
                    alert('上传失败');
                }
            });
        },
        uploadActOneImg:function(callback){
            var self = this;
            // 选图
            this.chooseImage(1, function(chooseRes) {
                if (chooseRes.errMsg == 'chooseImage:ok') {
                    // 上传微信服务器
                    self.uploadImage(
                        chooseRes.localIds[0],
                        function(uploadRes) {
                            if (uploadRes.errMsg == 'uploadImage:ok') {
                                // 下载本地服务器
                                self.actImgServerDownload(uploadRes.serverId, function(downloadRes) {
                                    callback && callback(downloadRes);
                                });
                            }
                        }
                    );
                }
            });
        },
        actImgServerDownload : function(id, callback) {
            var self = this,
                ids = [];
            ids.push(id);
            var formObj = {
                picIdList: ids
            };
            $.ajax({
                url: config.HOST + '/hdour/emall/share/portraitPic',
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data: JSON.stringify(formObj),
                success: function(res) {
                    callback && callback(res);
                },
                error: function(e) {
                    alert('上传失败');
                }
            });
        },
        payOrder : function(payinfo,sfn,cfn,ffn){
            wx.chooseWXPay({
                timestamp: payinfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: payinfo.nonceStr, // 支付签名随机串，不长于 32 位
                package: payinfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: payinfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: payinfo.paySign, // 支付签名
                success: function (res) {
                    sfn && sfn(res);
                    // 支付成功后的回调函数
                },
                fail : function(res){
                    alert('微信出错了');
                    ffn && ffn(res)
                },
                cancel : function(res){
                    cfn && cfn(res);
                },
                error: function(res) {
                    alert('支付失败');
                }

            });
        },
        shareSuccess : function(callback){
            $.ajax({
                url: config.HOST + config.ACTIONS.shareCallBack,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                success: function(res) {
                    if (res.errcode == 0){
                        if(res.detail.total == 0){
                            alert('快让好友扫码关注,50元红包拿个够');
                        }else{
                            callback && callback();
                        }

                    } else {
                        //_this.errorFn();
                    }
                },
                error: function(e) {
                    alert('上传失败');
                }
            });
        }
    };
    return WeiXin;
});