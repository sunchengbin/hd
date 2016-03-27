/**
 * Created by sunchengbin on 15/11/12.
 */
require(['zepto','loading','token','dialog','config','lazyload','homenav','fastclick','cart','weixin'],function(zepto,loading,token,dialog,config,lazyload,homenav,fastclick,cart,weixin) {
    var domloading = loading.domLoading();
    fastclick.attach(document.body);
    if(!weixin.isWeixin) {
        window.location.href = config.URLHOST+'offic_qrcode.html';
    }
    var MC = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    _this.getOrderList();
                    _this.handleFn();
                }
            });
        },
        handleFn:function(){
            var _this = this;
            $('body').on('click','.j_del_order',function(){
                var _id = $(this).attr('data-id');
                dialog.confirm({
                    body_txt: '确定要删除订单?',
                    is_cover : true,
                    cf_fn : function(){
                        _this.delOrder(_id);
                    }
                });
            });
            $('body').on('click','.j_show_all_good',function(){
                var _id = $(this).attr('data-id');
                $('[li-id="'+_id+'"]').show();
                $(this).hide();
            });
        },
        delOrder:function(id){
            $.ajax({
                url : config.HOST+config.ACTIONS.delOrder,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data:JSON.stringify({
                    'id' : id
                }),
                success : function(res){
                    if(res.errcode == 0){
                        $('[order-id="'+id+'"]').remove();
                    }else{
                        if(res.errcode == 201){
                            localStorage.removeItem('TOKEN');
                            location.reload();
                        }else{
                            dialog.alert({
                                body_txt: res.errmsg,
                                is_cover : true
                            });
                        }
                    }
                }
            });
        },
        getTopHtm : function(detail,level){
            var _user_info = localStorage.getItem('USERINFO')?JSON.parse(localStorage.getItem('USERINFO')):null;
            var _htm = '<section class="user-info-wraper">'
                    +'<div class="user-info clearfix">'
                    //+(level>0?'<a href="vip_info.html" class="block clearfix">':'')
                    +'<div class="img" data-img="'+(_user_info  && _user_info.user && _user_info.user.logoUrl?_user_info.user.logoUrl:'../images/service/ser1.jpg')+'"></div>'
                    +'<div class="clearfix user-info-top">'
                    +(_user_info  && _user_info.user && _user_info.user.nickName?_user_info.user.nickName:'游客')
                    +'<div class="fr">'
                    +'<p>我的余额:'+detail.asset+'</p>'
                    +'<p><a href="vip_info.html" class="">查看累计收益<i class="icon iconfont">&#xe63e;</i></a></p>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    //+(level>0?'</a>':'')
                    +'</section>'
                    +'<nav class="my-centre-nav">'
                    +'<a class="block ticket-url" href="my_ticket.html">'
                    //+'<i class=""></i>'
                    +'<p><i class=""></i>优惠券</p>'
                    +'</a>'
                    +'<a class="block address-url" href="address_list.html">'
                    //+'<i class=""></i>'
                    +'<p><i class=""></i>送货信息</p>'
                    +'</a>'
                    +'<a class="block service-url" href="service.html">'
                    //+'<i class=""></i>'
                    +'<p><i class=""></i>联系客服</p>'
                    +'</a>'
                    +'</nav>';
            return _htm;
        },
        getOrderList : function(){
            var _this = this;
            $.ajax({
                url : config.HOST+config.ACTIONS.orderList,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data:JSON.stringify({
                    completeType : 'ALL',
                    page:1,
                    pageSize:40
                }),
                success : function(res){
                    if(res.errcode == 0){
                        //alert(res.detail.userSceneId)
                            $(_this.getTopHtm(res.detail,res.detail.userSceneId)).insertBefore('.j_wraper');
                            $('.j_wraper').html(_this.createSuccessOrder(res.detail));
                            _this.saveLocalOrders(res.detail.orderList);
                            homenav.init('my');
                            lazyload.init();
                            domloading.remove();
                    }else{
                        token.reloadToken(res,function(){
                            dialog.alert({
                                body_txt: res.errmsg,
                                is_cover: true,
                                c_fn : function(){
                                    setTimeout(function(){
                                        window.location.reload();
                                    },0);
                                },//close按钮点击关闭的回调函数
                                cf_fn : function(){
                                    setTimeout(function(){
                                        window.location.reload();
                                    },0);
                                }//点击确定的回调函数
                            });
                        });
                    }
                },
                error:function(){
                    location.reload();
                }
            });
        },
        saveLocalOrders : function(orders){
            var _orders = {};
            if(orders && orders.length){
                $.each(orders,function(i,item){
                    _orders[item.id] = item;
                });
            }
            localStorage.setItem('ORDERS',JSON.stringify(_orders));
        },
        createSuccessOrder:function(detail){
            var _this =this,
                _htm = '',
                orders = detail.orderList;
            //orders = null;
            if(!orders){
                _htm += '<div class="no-good">'
                    +'<i class=""></i>'
                    +'<p>订单还是空的</p>'
                    +'<p class="gray">快去下单吧!</p>'
                    +'<a href="act_home.html" class="">开始购物</a>'
                    +'</div>';
            }else{
                $.each(orders,function(i,order){
                    var _status_img = _this.getOrderStatusImg(order.status),
                        _staus_txt = _this.getOrderStatus(order.status);
                    if(order.status == 30){
                        var _is_payment = order.isPayment?'(已支付)':'';
                    }
                    _htm += '<div class="mt10" order-id="'+order.id+'">'
                        +'<p class="order-title bw">共'+order.goodsList.length+'件商品</p>'
                        +'<p class="order-title">订单号:'+order.id+'<i class="fr">'+_staus_txt+(_is_payment?_is_payment:'')+'</i></p>'
                        //+'<p class="order-title">预计送达时间:2015-11-30 14:30<i class="fr">'+_staus_txt+'</i></p>'
                        +'<div class="order-list-wraper">';
                    if(_status_img){
                        _htm+='<p class="order-state-img">'
                            +'<img src="'+_status_img+'"/>'
                            +'</p>';
                        //_htm+='<div class="order-msg-wraper"><p class="order-msg-title clearfix"><i class="fl"></i>快递员小白已经出发</p></div>';
                    }
                    _htm+='</div>';
                    _htm += _this.createGoodsHtm(order);
                    _htm+='</div>';
                });
            }
            return _htm;

        },
        createGoodsHtm : function(order_info){
            var goods = order_info.goodsList,
                _this = this,
                _sum = order_info.totalPrice,
                _o_sum = cart.getOrderMoney()+_sum;
            var _htm = '<div class="shop-cart-wraper">'
                +'<div class="order-good-list-wraper">';
                if(order_info.status == 20 || order_info.status == 30){
                    if(!order_info.isPayment && _o_sum < 3000){
                        _htm+='<a class="block" href="order_pay.html?orderid='+order_info.id+'">';
                    }else{
                        _htm+='<a class="block" href="order_info.html?orderid='+order_info.id+'">';
                    }
                }else{
                    _htm+='<a class="block" href="order_info.html?orderid='+order_info.id+'">';
                }
            _htm+='<ul class="order-good-list">';
            $.each(goods,function(i,item){
                _htm += ' <li class="clearfix '+(i>0?'hide':'')+'" li-id="'+order_info.id+'">'
                    +'<div class="img fl" data-img="'+item.logoUrl+'"></div>'
                    +'<div class="good-info-wraper">'
                    +'<p>'+item.name+'</p>'
                    +'<p class="clearfix">'
                    +'<em>￥'+item.price+'</em>'
                    +'<span class="fr">x'+item.amount+'</span>'
                    +'</p>'
                    +'</div>'
                    +'</li>';
            });
            _htm += '</ul></a>'
                +(goods.length>1?'<p class="show-all j_show_all_good" data-id="'+order_info.id+'">还有'+(goods.length-1)+'件<i class="icon iconfont">&#xe615;</i></p>':'')
                +_this.createOrderInfoHtm(order_info)
                +'</div>'
                +'</div>';
            return _htm;
        },
        createOrderInfoHtm : function(order_info){
            var _htm = '',
                _sum = order_info.totalPrice,
                _o_sum = cart.getOrderMoney()+_sum;
            _htm +='<p class="title clearfix">'
                +'实付:'+'<em class="ce">¥'+order_info.totalPrice+'</em>';
                if(order_info.status == 30){
                    if(!order_info.isPayment && _o_sum < 3000){
                        _htm+='<a href="order_pay.html?orderid='+order_info.id+'" class="fr bk">立即付款</a>';
                    }
                }
                if(order_info.status == 20){
                    _htm+='<a href="order_pay.html?orderid='+order_info.id+'" class="fr bk">立即付款</a>';
                }
                if(order_info.status == 100 || order_info.status == 90){
                    _htm+='<a href="javascript:;" data-id="'+order_info.id+'" class="fr bb j_del_order">删除</a>';
                }
            _htm +='</p>';
            return _htm;
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
    MC.init();
})