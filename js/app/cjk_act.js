/**
 * Created by sunchengbin on 16/3/27.
 */
require(['weixin','zepto'],function(weixin,zepto){
    $('.j_log_div').css({
        top : ($('body').height()-$('.j_log_div').height())
    });
    $(window).scroll(function(){
        $('.j_log_div').hide();
    });
    weixin.wxinit(function(){
        weixin.updateShare({
            title: '小白免税携"太阳的后裔"归来',
            desc: "服务于全球华人的海外电商，现已开通韩国站，众多韩国化妆品等你来选购",
            link: "http://s.hdour.com/",
            imgUrl: "http://s.hdour.com/images/logo.jpg",
            success: function() {
                //alert('分享成功');
            },
            cancel: function() {}
        });
    },'cjk');

})
