/**
 * Created by sunchengbin on 15/11/11.
 */
require(['cart','zepto','loading','token','homenav','lazyload','fastclick','dialog','config','weixin','onoff'],function(cart,zepto,loading,token,homenav,lazyload,fastclick,dialog,config,weixin,onoff){
    var domloading = loading.domLoading();
    fastclick.attach(document.body);
    var ORDERCONFIRM = {
        init : function(){
            var _this = this;
            token.init({
                wxcallback : function(){
                    //var money = {day:(new Date()).getDate(),money:1000};
                    //cart.setOrderMoney(JSON.stringify(money));
                    if(localStorage.getItem('ORDER')){
                        _this.getAddressList();
                    }else{
                        location.href='act_home.html';
                    }
                }
            });
        },
        handleFn : function(order,moneyInfo){
            var _that = this;
            var _address = {};
            if(localStorage.getItem('SELADDRESS')){
                _address = JSON.parse(localStorage.getItem('SELADDRESS'));
            }else{
                _address = localStorage.getItem('ADDRESS')?JSON.parse(localStorage.getItem('ADDRESS'))[0]:null;
            }
            $('.j_wraper').on('click','.j_radio',function(){
                var _this = $(this),
                    _sum = _that.getTotal(),
                    _o_sum = cart.getOrderMoney()+_sum;
                if(_o_sum > 3000){
                    if(_this.is('[data-val="10"]')){
                        dialog.alert({
                            body_txt: '由于微信支付的限制，单日单笔最高支付3000元，请您选择“货到付款”。',
                            is_cover : true
                        });
                    }
                }else{
                    //if(_address && _address.dispatchType == 30 && _this.is('[data-val="10"]')){
                    //    dialog.alert({
                    //        body_txt: '国际直邮，请您选择“货到付款”。',
                    //        is_cover : true
                    //    });
                    //}else{
                        if(!_this.is('.radioed-i')){
                            $('.radioed-i').removeClass('radioed-i');
                            _this.addClass('radioed-i');
                        }
                    //}
                }

            });
            if(order.moneyInfo.asset){
                var address = JSON.parse(localStorage.getItem('SELADDRESS'));
                _that.onoff = onoff({
                    val : {//开关对应的值
                        on : 1,
                        off : 0
                    },
                    callBack : function(){
                        var _this = this;
                        if(_this.config.isOn){
                            $('.j_banktxt_p').show();
                            $('.j_sum').html('¥'+_that.getActualSum(address,moneyInfo));
                        }else{
                            $('.j_banktxt_p').hide();
                            $('.j_sum').html('¥'+_that.getSum(address,moneyInfo));
                        }
                    }
                });
                console.log(_that.onoff.getValue());
            }
            $('body').on('click','.j_submit_btn',function(){
                var _this = $(this);
                if(_that.verfiySub() && _this.attr('data-beal') != 0){
                    _this.attr('data-beal',0);
                    var _loading = loading.ajaxWaiting();
                    _that.submitBtn(_this,function(){
                        _loading.remove();
                    });
                }
            });
            if(_address){
                if(_address.addressPics && _address.addressPics.length){
                    $('.j_wraper').on('click','.j_address_img',function(){
                        if(_address.picUrl){
                            weixin.previewImage($(this).attr('data-view'),_address.picUrl);
                        }else{
                            weixin.previewImage($(this).attr('data-view'),_address.addressPics);
                        }

                    });
                }
                localStorage.setItem('SELADDRESS',JSON.stringify(_address));
            }

        },
        getTotal : function(){
            var _order = JSON.parse(localStorage.getItem('ORDER'));
            return _order.moneyInfo.total;
        },
        getPostPrice:function(address_list){
            var _address = null;
            if(address_list && address_list.length){
                if(localStorage.getItem('SELADDRESS')){
                    _address = JSON.parse(localStorage.getItem('SELADDRESS'));
                }else{
                    _address = JSON.parse(address_list)[0];
                    localStorage.setItem('SELADDRESS',JSON.stringify(_address));
                }
                return _address;
            }else{
                return _address;
            }
        },
        getAddressList : function(){
            var _this = this;
            $.ajax({
                url : config.HOST+config.ACTIONS.addressList,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data : JSON.stringify({
                    page:1
                }),
                success : function(res){
                    if(res.errcode == 0){
                        var _addressList = res.detail.total == 0?null:res.detail.addressList;
                        localStorage.removeItem('ADDRESS');
                        var _straddress = _addressList?JSON.stringify(_addressList):null;
                        if(_straddress){
                            localStorage.setItem('ADDRESS',_straddress);
                        }
                        _this.getOrderInfo(_straddress);
                    }else{
                        dialog.alert({
                            body_txt: res.errmsg,
                            is_cover : true
                        });
                    }
                },
                error:function(){
                    location.reload();
                }
            });
        },
        getOrderInfo : function(addressList){
            var _this = this,
               _order = JSON.parse(localStorage.getItem('ORDER'));
            $('.j_wraper').html(_this.createOrderHtm(_order,addressList));
            $('body').append(_this.getSumHtm(_order,addressList));
            _this.handleFn(_order,_order.moneyInfo);
            //homenav.init();
            lazyload.init();
            domloading.remove();
        },
        getSumHtm : function(order,addresslist){
            var _htm = '',
                _this = this,
                _address = _this.getPostPrice(addresslist),
                _sum = _this.getSum(_address,order.moneyInfo,order),
                _actual_sum = _this.getActualSum(_address,order.moneyInfo,order);
                //_sum = _address&&_address.dispatchType==10?(order.moneyInfo.total-order.postPrice):order.moneyInfo.total;
            _htm+='<nav class="cart-nav">'
                //+'<span class="cart-nav-block">'
                //+'<i class="icon iconfont j_all_checkbox checkbox-i">&#xe601;</i>全选'
                //+'</span>'
                +'<span class="cart-nav-block">实付款:<i class="j_sum">¥'+_actual_sum+'</i></span>'
                +'<a href="javascript:;" data-beal="1" data-val="'+order.moneyInfo.asset+'" class="cart-nav-block j_submit_btn">提交</a>'
                +'</nav>';
            return _htm;
        },
        createOrderHtm : function(order_info,address_list){
            var _htm = '',
                _this = this;
            //_htm += _this.createPostPriceHtm(order_info);
            _htm += _this.createAddressHtm(address_list);
            _htm += _this.createGoodsHtm(order_info,address_list);
            _htm += _this.createSubInfo();
            return _htm;
        },
        createPostPriceHtm : function(order_info){
            var _htm = '';
                _htm+='<p class="title">'
                    +'<i class="icon iconfont">&#xe65d;</i>'
                    +'全场购物满'+order_info.fullFreePost+'元,首尔当地免运费'
                    +'</p>';
            return _htm;
        },
        createAddressHtm : function(address_list){
            var _this = this,
                _htm = '<div class="buyer-address"><p class="line"></p>';
            if(!address_list || !address_list.length){
                _htm += '<a href="edit_address.html?type=new" class="no-address-wraper block clearfix">'
                    +'<i class="fl"></i>'
                    +'<i class="">添加收货地址和收货信息</i>'
                    +'<i class="icon iconfont fr">&#xe63e;</i>'
                    +'</a>';
            }else{
                var _address = {};
                if(localStorage.getItem('SELADDRESS')){
                    _address = JSON.parse(localStorage.getItem('SELADDRESS'));
                }else{
                    _address = JSON.parse(address_list)[0];
                    localStorage.setItem('SELADDRESS',JSON.stringify(_address));
                }
                var _abode = _this.transAddress(_address);
                _htm += '<div class="address-wraper clearfix">'
                    //+'<i class="icon iconfont fl">&#xe609;</i>'
                    +'<ul class="address-info">'
                    +'<li>收货人:'+_address.name+'</li>'
                    +'<li>电  话:'+_address.phone+'</li>'
                    +'<li>收货地址:'+(_abode?_abode:'')+'</li>';
                    if(_address.addressPics && _address.addressPics.length){
                        _htm += '<li class="address-img clearfix">';
                        if(_address.picUrl){
                            _address.addressPics = _address.picUrl;
                        }
                        $.each(_address.addressPics,function(i,item){
                            _htm += '<div class="img j_address_img" data-view="'+item+'" data-img="'+item+'"></div>';
                        });
                        _htm += '</li>';
                    }
                    +'</ul>';
                _htm += '<a class="bb" href="address_list.html?addressid='+_address.id+'">编辑</a></div>';
            }
            _htm += '<p class="line"></p></div>';
            return _htm;
        },
        transAddress : function(address){
            var _abode = '';
            if(address.dispatchType==10){
                if(address.airport==10){
                    _abode = '仁川机场自提';
                }else{
                    _abode = '金浦机场自提';
                }
            }
            if(address.dispatchType==20){
                _abode = address.abode;
            }
            if(address.dispatchType==30){
                _abode = address.domesticAddr;
            }
            return _abode;
        },
        createGoodsHtm : function(order_info,addresslist){
            var goods = order_info.goodsList,
                _this = this;
            var _htm = '<div class="shop-cart-wraper">'
                +'<div class="order-good-list-wraper">'
                +'<p class="order-title">共'+goods.length+'件商品</p>'
                +'<ul class="order-good-list">';
            $.each(goods,function(i,item){
                var _pric = item.info.priceList,
                    _curRmb = _pric.vip?_pric.vip:_pric.curRmb,
                    //_weight = item.info.weight?item.info.weight*item.amount: 0,
                    _weight = item.info.weight?item.info.weight: 0,
                    _weight_tofixed = _weight?_weight.toFixed(1):0;
                _htm += ' <li class="clearfix">'
                    +'<div class="img fl" data-img="'+(item.info.pics?item.info.pics[0]:item.info.logoUrl)+'"></div>'
                    +'<div class="good-info-wraper">'
                    +'<p>'+item.info.name+'</p>'
                    +'<p>'
                    +'<em>'+_curRmb.symbol+_curRmb.price+'</em>'
                    +'<i class="no-through">'+_weight_tofixed+'kg/件</i>'
                    +'<span>x'+item.amount+'</span>'
                    +'</p>'
                    +'</div>'
                    +'</li>';
            });
            _htm += '</ul>'
                +_this.createOrderInfoHtm(order_info,addresslist)
                +'</div>'
                +'</div>';
            return _htm;
        },
        getSum : function(address,moneyInfo,order_info){//商品合计
            var _weight = cart.getOrderPostPrice();
            if(address){
                if(address.dispatchType==10) {
                    return moneyInfo.sum;
                }
                if(address.dispatchType==20) {
                    return moneyInfo.total;
                }
                if(address.dispatchType==30) {
                    var _sum = moneyInfo.sum+_weight,
                        _asset = moneyInfo.asset;
                   return _sum;
                }
            }
            return moneyInfo.sum;
        },
        getActualSum : function(address,moneyInfo,order_info){//实付价格
            var _weight = cart.getOrderPostPrice();
            if(address){
                if(address.dispatchType==10) {
                    return moneyInfo.sum;
                }
                if(address.dispatchType==20) {
                    return moneyInfo.total;
                }
                if(address.dispatchType==30) {
                    var _sum = moneyInfo.sum+_weight,
                        _asset = moneyInfo.asset;
                    if(this.onoff && !this.onoff.config.isOn){
                        return _sum;
                    }else{
                        if(_sum > _asset){
                            return (_sum - _asset);
                        }else{
                            return 0;
                        }
                    }
                }
            }
            return moneyInfo.sum;
        },
        createOrderInfoHtm : function(order_info,addresslist){
            var moneyInfo = order_info.moneyInfo,
                _htm = '',
                _address = this.getPostPrice(addresslist),
                _sum = this.getSum(_address,moneyInfo,order_info),
                _post_price = this.getPostPriceStr(_address,order_info,moneyInfo);
            this.SUM = _sum;
            _htm +='<p class="title clearfix">'
                +'卖家留言:'
                +'<input class="msg j_content" placeholder="选填，填写您的要求或补充" type="text"/>'
                +'</p>'
                +'<p class="title clearfix">'
                +'配送费'
                +(_address&&_address.dispatchType==30?'<i class="ml10">(国际直邮299包邮,299以内20运费)</i>':'')
                +'<i class="fr">'+_post_price+'</i>'
                +'</p>';

            _htm += '<p class="title clearfix">'
                +'优惠合计'
                //+'<span class="bk">满减</span>'
                +'<i class="fr"><em>－</em>￥<em>'+(moneyInfo.discount.off?moneyInfo.discount.off:0)+'</em></i>'
                +'</p>';
            if(moneyInfo.asset && moneyInfo.asset != 0){
                _htm += '<p class="title clearfix">'
                    +'余额'
                    +'<span class="j_on_off on-off fr">'
                    +'<i></i>'
                    +'</span>'
                    +'</p>';
                _htm += '<p class="title bank-p j_banktxt_p">使用余额<i>'+moneyInfo.asset+'</i>元,抵<i>￥'+moneyInfo.asset+'</i></p>';
            }
            _htm+='<p class="title clearfix">'
                +'商品合计'
                +'<i class="fr">￥<em>'+_sum+'</em></i>'
                +'</p>';
            return _htm;
        },
        getPostPriceStr:function(address,order_info,moneyInfo){
            if(address){
                if(address.dispatchType==10){
                    return '机场自提免运费';
                }
                if(address.dispatchType==20){
                    return moneyInfo.discount.isFreePost?'首尔当地免运费':'￥'+order_info.postPrice;
                }
                if(address.dispatchType==30){
                    var _post_price = cart.getOrderPostPrice();
                    //return (_post_price?'￥'+_post_price:'￥40');
                    return '￥'+_post_price;
                }
            }else{
                return '￥0';
            }
        },
        createSubInfo : function(){
            var _sum = this.getTotal(),
                _o_sum = cart.getOrderMoney()+_sum,
                 _address = {};
            if(localStorage.getItem('SELADDRESS')){
                _address = JSON.parse(localStorage.getItem('SELADDRESS'));
            }else{
                _address = localStorage.getItem('ADDRESS')?JSON.parse(localStorage.getItem('ADDRESS'))[0]:null;
            }
            var _htm = '<div class="buyer-message clearfix">'
                    //+'<div class="buyer-message-title">买家留言:</div>'
                    //+'<div class="buyer-message-content">'
                    //+'<textarea class="j_content" placeholder="填写您的要求或补充"></textarea>'
                    //+'</div>'
                    //+'</div>'
                    +'<div class="pay-wraper">'
                    +'<p class="order-title">支付方式</p>'
                    if(_address){
                        _htm+='<p class="j_radio '+(_o_sum < 3000?'radioed-i':'')+'" data-val="10">'
                    }else{
                        _htm+='<p class="j_radio '+(_o_sum < 3000?'':'radioed-i')+'" data-val="10">'
                    }

            _htm+='<span class="img"></span>'
                    +'微信支付'
                    +'<i class="icon iconfont radio-i fr">&#xe601;</i>'
                    +'</p>';
                    if(_address){
                        _htm+='<p class="j_radio '+(_o_sum < 3000?'':'radioed-i')+'" data-val="20">'
                    }else{
                        _htm+='<p class="j_radio '+(_o_sum < 3000?'radioed-i':'')+'" data-val="20">'
                    }

            _htm+='<i class="pay-i fl">¥</i>'
                    +'货到付款'
                    +'<i class="icon iconfont radio-i fr">&#xe601;</i>'
                    +'</p>'
                    +'</div>';
            return _htm;
        },
        verfiySub : function(){
            var _address = localStorage.getItem('SELADDRESS');
            if(!_address){
                dialog.alert({
                    body_txt: '请填写收货地址',
                    is_cover : true
                });
                return false;
            }
            return true;
        },
        submitBtn : function(btn,callback){
            var _this = this,
                _address = JSON.parse(localStorage.getItem('SELADDRESS')),
                _pay_type = $('.radioed-i').attr('data-val'),
                _pay_detail = {},
                _asset = btn.attr('data-val')?btn.attr('data-val'):0,
                _data = {
                    name:_address.name,
                    comment : $.trim($('.j_content').val()),
                    payType : $('.radioed-i').attr('data-val'),
                    passport : _address.passport,
                    dispatchType : _address.dispatchType,
                    airport:_address.airport,
                    abode : _address.abode?_address.abode:'',
                    phone : _address.phone,
                    domesticAddr:_address.domesticAddr,
                    addressPics : _address.addressPicsRelative || [],
                    goodsList : JSON.parse(localStorage.getItem('ORDER')).goodsList
                };
            if(_pay_type==10){
                if(_this.onoff && _this.onoff.config.isOn){
                    _pay_detail.balance = 1;	// 余额
                    if(_asset < _this.SUM ){
                        _pay_detail.weChat = 1;	// 微信
                    }
                }else{
                    _pay_detail.weChat = 1;	// 微信
                }
                _data.payDetail = _pay_detail;
            }
            //console.log(JSON.stringify(_data));
            $.ajax({
                url : config.HOST+config.ACTIONS.newOrder,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data : JSON.stringify(_data),
                success : function(res){
                    callback && callback();
                    if(res.errcode == 0){
                        //删除购物车中提交的物品
                        $.each(JSON.parse(localStorage.getItem('ORDER')).goodsList,function(i,item){
                            cart.delGood(item.id);
                        });

                        //成功要调用支付
                        //alert(JSON.stringify(res.detail.wxDetail));
                        //alert(res.detail.wxDetail)
                        var _pay_type = $('.radioed-i').attr('data-val'),
                            _surl = 'pay_success.html?orderid='+res.detail.orderDetail.orderId;
                        if(_pay_type == 20){
                            location.href = _surl;
                        }else{
                            if($('.j_asset').length && $('.j_asset').val() > _this.SUM){
                                location.href = _surl;
                            }else{
                                weixin.payOrder(res.detail.wxDetail,function(res){
                                    var money = {day:(new Date()).getDate(),money:_this.SUM};
                                    cart.setOrderMoney(JSON.stringify(money));
                                    location.href = _surl;
                                },function(res){
                                    location.href = 'my_centre.html';
                                },function(res){
                                    location.href = 'my_centre.html';
                                });
                            }
                        }
                        localStorage.removeItem('ORDER');
                        localStorage.removeItem('ADDRESS');
                        localStorage.removeItem('SELADDRESS');
                    }else{
                        btn.attr('data-beal',1);
                        dialog.alert({
                            body_txt : res.errmsg,
                            is_cover : true
                        });
                    }

                },
                error : function(res){
                    btn.attr('data-beal',1);
                    callback && callback();
                }
            });
        }
    };
    ORDERCONFIRM.init();
})
