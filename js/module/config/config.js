/**
 * Created by sunchengbin on 15/11/4.
 */
define([],function(){
    var CONFIG = {
        //线上配置
        HOST : 'http://api.hdour.com', //action的请求域名
        IMGHOST :'http://s.hdour.com/',//图片url前缀
        URLHOST : 'http://s.hdour.com/html/',//链接地址url前缀

        //本地测试
        //HOST : 'http://api.hdour.com', //action的请求域名
        //HOST : 'http://api.xbdfs.com', //action的请求域名
        //IMGHOST:'http://127.0.0.1/hd-git/',
        //URLHOST : 'http://127.0.0.1/hd-git/html/',

        //119.28.20.220测试服务器配置
        //HOST : 'http://api.xbdfs.com', //action的请求域名
        //IMGHOST:'http://t.xbdfs.com/',
        //URLHOST : 'http://t.xbdfs.com/html/',

        NOWEIXINURL : function(){
            //海兜测试公众账号的appid wxb6680909daddbd84
            //小白客服公众账号的appid wxc02bb9e14cad725c
            return  'https://open.weixin.qq.com/connect/oauth2/authorize?'+
                    'appid=wxc02bb9e14cad725c'+
                    '&redirect_uri='+encodeURIComponent(window.location.href)+
                    '&response_type=code'+
                    '&scope=snsapi_userinfo'+
                    '&state=STATE'+
                    '&connect_redirect=1'+
                    '#wechat_redirect';
        },
        ACTIONS : {
            getToken : '/hdour/api/v1/xiaobai/wx/info',//获取微信用户token
            getWxSign : '/hdour/api/v1/xiaobai/sign',//获取微信调用config权限信息
            actLists : '/hdour/emall/act/listView',//首页活动列表
            actDetail : '/hdour/emall/act/detailView',//活动详情列表
            goodDetail : '/hdour/emall/goods/detail',//单品详情页
            hotType :'/hdour/emall/dict/category',//搜索页热门类别
            hotBrand :'/hdour/emall/dict/brand',//热门品牌
            search :'/hdour/emall/goods/search',//关键字搜索
            searchHome:'/hdour/emall/dict/search',//搜索首页类别品牌搜索
            countFunction:'/hdour/emall/my/discount',//购物车中的计算满减优惠算法
            previewOrder:'/hdour/emall/order/preview',//提交购物车预览订单preview
            addressList:'/hdour/emall/my/addressList',//收货地址列表
            orderList:'/hdour/emall/order/list',//订单列表
            newAddress:'/hdour/emall/my/newAddress',//新建收货地址
            newOrder:'/hdour/emall/order/create',//创建订单
            orderDetail:'/hdour/emall/order/detail',//订单详情
            payOrder:'/hdour/emall/order/payment',//支付
            delAddress:'/hdour/emall/my/delAddress',//删除地址
            delOrder:'/hdour/emall/order/del',//删除订单
            vipInfo:'/hdour/emall/my/customer/curList',//vip信息
            vipHistory:'/hdour/emall/my/customer/historyList',//vip历史记录
            actTemperUser:'/hdour/emall/share/info',//气质活动用户信息
            actTemperHistory:'/hdour/emall/share/rank',//气质排行榜
            isConcern : '/hdour/emall/my/userInfoComplete',//是否关注有完整用户信息
            officQrcode : '/hdour/emall/my/qrcode',//获取官方二维码接口
            shareCallBack : '/hdour/emall/asset/share',//分享活动,得五元
            shareAct : '/hdour/emall/asset/act',//分享加5元活动页面接口
            assetAction:'hdour/emall/asset/my'//收益页面
        },
        CITY : '首尔'//初始地点

    };
    return CONFIG;
})
