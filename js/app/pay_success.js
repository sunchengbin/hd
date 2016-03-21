/**
 * Created by sunchengbin on 15/11/21.
 */
/**
 * Created by sunchengbin on 15/11/12.
 */
require(['zepto','loading','token','dialog','config','lazyload','base','homenav'],function(zepto,loading,token,dialog,config,lazyload,base,homenav) {
    var domloading = loading.domLoading();
    var OI = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    _this.getOrder();
                }
            });
        },
        getOrder : function(){
            var _this = this,
                _orderid = base.others.getUrlPrem('orderid');
            $.ajax({
                url : config.HOST+config.ACTIONS.orderDetail,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data : JSON.stringify({
                    id : _orderid
                }),
                success : function(res){
                    if(res.errcode == 0){
                        $('.j_wraper').html(_this.createSuccessOrder(res.detail));
                        homenav.init();
                        lazyload.init();
                        domloading.remove();
                    }else{
                        dialog.alert({
                            body_txt : res.errmsg,
                            is_cover : true
                        });
                    }
                },
                error : function(res){
                    dialog.alert({
                        body_txt : res.res,
                        is_cover : true
                    });
                }
            });
        },
        createSuccessOrder:function(detail){
            var _this =this,
                order = detail.order,
                my = detail.my,
                _status_img = _this.getOrderStatusImg(order.status),
                _address = my.dispatchType!=30?(my.address?my.address:''):my.domesticAddr;
            var _htm = '<p class="order-title">订单编号:'+order.id+'</p>';
            //+'<p class="title">预计送达时间:2015-11-30 14:30</p>'
                if(_status_img){
                    _htm+='<p class="order-state-img">'
                        +'<img src="'+_status_img+'"/>'
                        +'</p>';
                }
            _htm+='<div class="buyer-address">'
                +'<p class="line"></p>'
                +'<div class="address-wraper">'
                +'<p class="user-info clearfix"><span>收货人:'+my.name+'</span><span class="fr">'+my.phone+'</span></p>'
                +'<p class="address-info clearfix"><i class="address-icon fl"></i><span>地址信息:'+_address+'</span></p>'
                if(my.addressPics && my.addressPics.length){
                    _htm += '<div class="address-img clearfix">';
                    $.each(my.addressPics,function(i,item){
                        _htm += '<div class="img" data-img="'+item+'"></div>';
                    });
                    _htm += '</div>';
                }
            _htm+='</div><p class="line"></p>'
                +'</div>';
            //if(order.status == 30 || order.status == 25){
            //    _htm+='<div class="carry-time">'
            //        +'<p>期望送达时间:</p>'
            //        +'<p class="clearfix">2015年10月20日(周一)10:00<a href="javascript:;" class="bb fr">修改</a></p>'
            //        +'</div>';
            //}
            _htm += _this.createGoodsHtm(detail);
            _htm += '<div class="service-wraper">'
                +'<h2>如有问题，请联系客服小白</h2>'
                +'<p>1、在“小白免税”公众服务号首页，点击左下角图标<i></i>，输入文字，我们会在第一时间回复给您。</p>'
                +'<p>2、添加客服小白微信号：<a href="javascript:;">herexiaobai</a>，或直接扫描下面二维码，我们将立即为您服务。</p>'
                +'<p>3、拨打客服小白24小时客服热线：185-1189-2989，欢迎随时骚扰。</p>'
                +'<div class="img-box">'
                +'<img src="../images/service_logo.jpg"/>'
                +'</div>'
                +'</div>'
                +'<a href="act_home.html" class="shoping">继续购物</a>';
            return _htm;

        },
        createGoodsHtm : function(order_info){
            var goods = order_info.goods.goodsList,
                _this = this;
            var _htm = '<div class="shop-cart-wraper">'
                +'<div class="order-good-list-wraper">'
                +'<p class="order-title bw">共'+goods.length+'件商品</p>'
                +'<ul class="order-good-list">';
            $.each(goods,function(i,item){
                //var _pric = item.info.priceList;
                _htm += ' <li class="clearfix">'
                    +'<div class="img fl" data-img="'+item.logoUrl+'"></div>'
                    +'<div class="good-info-wraper">'
                    +'<p>'+item.name+'</p>'
                    +'<p>'
                    +'<em>'+item.price+'</em>'
                    +'<span>x'+item.amount+'</span>'
                    +'</p>'
                    +'</div>'
                    +'</li>';
            });
            _htm += '</ul>'
                +_this.createOrderInfoHtm(order_info.order,order_info.my)
                +'</div>'
                +'</div>';
            return _htm;
        },
        createOrderInfoHtm : function(order_info,my){
            var moneyInfo = order_info.discount,
                _htm = '';
            _htm +='<p class="title clearfix">'
                +'卖家留言:'
                +(order_info.comment?order_info.comment:'无')
                +'</p>'
                +'<p class="title clearfix">'
                +'配送费'
                //+'<i class="fr">'+(moneyInfo.isFreePost?'包送':'+'+moneyInfo.postPrice)+'</i>'
                +'<i class="fr">'+this.getPostPriceStr(my,order_info)+'</i>'
                +'</p>'
                +'<p class="title clearfix">'
                +'优惠合计'
                +'<span class="bk">满减</span>'
                +'<i class="fr">－￥'+(moneyInfo.off?moneyInfo.off:0)+'</i>'
                +'</p>'
                +'<p class="title clearfix">'
                +'商品合计'
                +'<i class="fr">￥'+order_info.totalPrice+'</i>'
                +'</p>';
            return _htm;
        },
        getPostPriceStr:function(address,order_info){
            if(address){
                if(address.dispatchType==10){
                    return '机场自提免运费';
                }
                if(address.dispatchType==20){
                    return order_info.discount.isFreePost?'首尔当地免运费':'＋￥'+order_info.discount.postPrice;
                }
                if(address.dispatchType==30){
                    return (order_info.freight?'＋￥'+order_info.freight:'＋￥0');
                }
            }else{
                return '＋￥0';
            }
        },
        getOrderStatusImg : function(status){
            switch (status){
                case 10:
                    return null;
                case 20:
                    return null;
                case 25:
                    return '../images/icon/ordered.png';
                case 30:
                    return '../images/icon/ordered.png';
                case 35:
                    return '../images/icon/orderbuyend.png';
                case 40:
                    return '../images/icon/ordercarryed.png';
                case 50:
                    return null;
                case 90:
                    return null;
                case 100:
                    return null;
                default :
                    return null;
            }
        },
        getOrderStatus : function(status){
            switch (status){
                case 10:
                    return '新建';
                case 20:
                    return '未支付';
                case 25:
                    return '已支付';
                case 30:
                    return '货到付款';
                case 35:
                    return '备货中';
                case 40:
                    return '配送中';
                case 50:
                    return '已送达';
                case 90:
                    return '已取消';
                case 100:
                    return '已完成';
                default :
                    return '订单异常';
            }
        }
    };
    OI.init();
})