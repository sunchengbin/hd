/**
 * Created by sunchengbin on 16/2/22.
 */
/**
 * Created by sunchengbin on 15/11/5.
 */
require(['dialog','zepto','loading','config','weixin'],function(dialog,zepto,loading,config,weixin){
    //buyplug.init();
    var domloading = loading.domLoading();
    var ACTDETAIL = {
        init : function(){
            this.getOfficQrcode();
        },
        getOfficQrcode : function(){
            var _this = this,
                _user_info = localStorage.getItem('USERINFO'),
                _self_id = _user_info?JSON.parse(_user_info).token.userId:10021,
                _data = {
                    id  : _self_id
                };
            $.ajax({
                url: config.HOST+config.ACTIONS.officQrcode,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                data: JSON.stringify(_data),
                success: function (res) {
                    if (res.errcode == 0) {
                        $('.j_wraper').html(_this.getHtml(res));
                        domloading.remove();
                    } else {
                        //window.location.reload();
                    }
                },
                error:function(){
                    location.reload();
                }
            });
        },
        getHtml : function(res){
            var _htm = '',
                _this = this;
            _htm+='<div class="txt-cont act-wraper">';
                //+'<span class="angle-s"></span>'
                 if(weixin.isWeixin){
                     +'<p>长按识别二维码关注小白免税</p>'
                 } else{
                     +'<p>微信扫一扫，立即购买</p>'
                 }
            _htm+='<div class="wx-er">'
                +'<img src="'+res.detail.qrcodeUrl+'"/>'
                +'</div>'
                +'</div>';

            _htm+='<img src="../images/act/about_top.png"/>'
                +'<a class="block" href="http://s.hdour.com">'
                +'<img src="../images/act/go_shop.png">'
                +'</a>'
                +'<p class="footer-p">活动最终解释权归北京海兜科技有限公司所有</p>';
            return _htm;
        }
    };
    ACTDETAIL.init();
})
