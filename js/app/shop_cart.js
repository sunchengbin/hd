/**
 * Created by sunchengbin on 15/11/7.
 */
require(['cart','zepto','loading','token','homenav','lazyload','fastclick','dialog','config','weixin'],function(cart,zepto,loading,token,homenav,lazyload,fastclick,dialog,config,weixin){
    var domloading = loading.domLoading();
    fastclick.attach(document.body);
    if(!weixin.isWeixin) {
        window.location.href = config.URLHOST+'offic_qrcode.html';
    }
    var SHOP_CART = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    _this.initCountFunction();
                }
            });
        },
        initCountFunction: function(){
            var _this = this;
            $.ajax({
                url : config.HOST+config.ACTIONS.countFunction,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                success : function(res){
                    if(res.errcode == 0){
                        _this.config = res.detail;
                        $('.j_wraper').html(_this.getShopCartHtm());
                        if(cart.getGoodNum()){
                            $('body').append(_this.getSumHtm());
                        }
                        homenav.init('shop');
                        _this.handleFn();
                        _this.setShopInfo();
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
                error : function(){
                    window.location.reload();
                }
            });
        },
        handleFn : function(){
            var _that = this;
            $('.j_radio').add('.j_all_checkbox').on('click',function(){
                var _this = $(this);
                if(_this.is('.radioed-i')){
                    _this.removeClass('radioed-i');
                    if(_this.is('.j_all_checkbox')){
                        $('.radioed-i').removeClass('radioed-i');
                    }else{
                        $('.j_all_checkbox').removeClass('radioed-i');
                    }
                    if(!$('.radioed-i').length){
                        $('.j_will_full_off').remove();
                    }
                }else{
                    _this.addClass('radioed-i');
                    if(_this.is('.j_all_checkbox')){
                        $('.j_radio').addClass('radioed-i');
                    }else{
                        if($('.j_good_li .radioed-i').length == $('.j_good_li .radio-i').length){
                            $('.j_all_checkbox').addClass('radioed-i');
                        }
                    }
                }
                _that.setShopInfo();
            });
            $('.j_wraper').on('click','.j_good_move',function(){
                var _this = $(this),
                    _goodid = _this.attr('data-id'),
                    _num = Number(_this.parent().find('.j_good_num').attr('data-val'));
                if(_num > 1){
                    _num--;
                    cart.updateCart({
                        id:_goodid,
                        num:_num
                    },function(){
                        _this.parent().find('.j_good_num').attr('data-val',_num).html(_num);
                        _that.setShopInfo();
                    });
                }
            });
            $('.j_wraper').on('click','.j_good_add',function(){
                var _this = $(this),
                    _goodid = _this.attr('data-id'),
                    _num = Number(_this.parent().find('.j_good_num').attr('data-val')),
                    _limit_all = _this.attr('data-limit-all'),
                    _limit_one = _this.attr('data-limit-one');

                    //if(_num == _limit_all){
                    //        //库存
                    //}else{
                        if(_num == _limit_one){
                            //单人限购
                            dialog.alert({
                                body_txt: '每人每天限购'+_limit_one+'件',
                                is_cover: true
                            });
                        }else{
                            _num++;
                        }

                    //}
                    cart.updateCart({
                        id:_goodid,
                        num:_num
                    },function(){
                        _this.parent().find('.j_good_num').attr('data-val',_num).html(_num);
                        _that.setShopInfo();
                    });

            });
            $('.j_wraper').on('click','.j_del_btn',function(){
                var _this = $(this),
                    _goodid = _this.attr('data-id');
                dialog.confirm({
                    body_txt : '<p class="dialog-body-p">确定要删除该商品?</p>',
                    cf_fn : function(dialog){
                        $('#'+_goodid).remove();
                        cart.delGood(_goodid);
                        if(cart.jsonLocalItem('SHOPGOODS')){
                            _that.setShopInfo();
                            dialog.remove();
                        }else{
                            location.reload();
                        }
                    }
                });
            });
            $('body').on('click','.j_submit_btn',function(){
                if(_that.verifySubmit()){
                    _that.commitCart();
                }
            });
        },
        setShopInfo : function(){
            var _this = this,
                _config = _this.config,
                _sum = _this.countMoney(),
                _num = _this.getSelectNum(),
                _ticket = _this.countTicket();

            if(_num!=0){
                $('.j_show_num').html(_num).show();
                $('.j_sum_num').html('('+_num+')');
            }else{
                $('.j_show_num').html('').hide();
                $('.j_sum_num').html('');
                $('.j_sum').html('¥0');
            }
            if(!$('.j_good_li .radioed-i').length)
                return;
            //if(_ticket.willFullOff > _sum){
            //    $('.j_will_full_off').remove();
            //    var _htm = '<div class="act-msg-wraper j_will_full_off">'
            //        +'<a class="block" href="act_home.html">'
            //        +'<em class="bk">满'+_config.fullFreePost+'包送</em>'
            //        +'再凑<i>¥'+(_ticket.willFullOff - _sum)+'</i>享受满<i>¥'+_ticket.willFullOff+'</i>减'+_this.config.fullOff[_ticket.willFullOff]
            //        +'<i class="icon iconfont fr">&#xe63e;</i>'
            //        +'<span class="fr">去凑单</span>'
            //        +'</a>'
            //        +'</div>';
            //    $('.j_wraper').prepend(_htm);
            //}else{
            //    $('.j_will_full_off').remove();
            //}
            //if(_sum > _config.fullFreePost){
            //    $('.j_sum').html('¥'+_sum);
            //    $('.j_post_price').remove();
            //}else{
            //    $('.j_sum').html('¥'+(_sum+_config.postPrice));
            //    $('.j_post_price').remove();
            //    var htm = '<p class="title shop-title clearfix j_post_price">'
            //        +'运费'
            //        +'<i class="">首尔当地购物满'+_config.fullFreePost+'元包邮,<a href="act_home.html" class="">去凑单<i class="icon iconfont">&#xe63e;</i></a></i>'
            //        +'<i class="fr">运费:'+_config.postPrice+'</i>'
            //        +'</p>';
            //    $('.j_sum_info').append(htm);
            //}
            $('.j_sum').html('¥'+_sum);
            $('.j_ticket').html('¥'+_ticket);
        },
        getSelectNum : function(){
            var _num = 0;
            $('.j_good_li .radioed-i').each(function(i,item){
                _num += Number($(item).parent().find('.j_good_num').attr('data-val'));
            });
            return _num;
        },
        countMoney : function(){
            var _sum = 0;
            $('.j_good_li .radioed-i').each(function(i,item){
                _sum += Number($(item).parent().find('.j_good_num').attr('data-val')) * Number($(item).attr('data-price'));
            });
            return _sum;
        },
        countTicket : function(){
            var _this = this,
                _config = _this.config,
                _fll_off =_this.config.fullOff,
                _full_off_obj = _this.countFullOff(),
                _sum =_this.countMoney(),
                _full_off = _full_off_obj.price?_full_off_obj.price:0,
                _will_off = _full_off_obj.willPrice?_full_off_obj.willPrice: 0,
                _ticket = {
                    postPrice : _sum > _config.fullFreePost?0:_config.postPrice,//运费
                    fullOff : _full_off,//满减(如果为0就是没有满减)
                    willFullOff : _will_off//凑单满减(如果为0就是没有下一级别的满减)
                };
            return _ticket;
        },
        countFullOff : function(){
            var _this = this,
                _full_off = _this.config.fullOff,
                _full_price = [],
                _sum =_this.countMoney();
            if(!_full_off){
                return {
                    index : 0,
                    price : 0,
                    willPrice : 0
                };
            }
            for(var price in _full_off){
                _full_price.push(Number(price));
            }
            _full_price = _full_price.sort(_this.sortFull);
            _len = _full_price.length;
            for(var i = 0;i < _full_price.length;i++){
                var item = _full_price[i];
                if(i == 0){
                    if(item > _sum){
                        return {
                            price : 0,
                            index : 0,
                            willPrice : _len>1?_full_price[1]:0
                        };
                    }else{
                        return {
                            price : 0,
                            index : 0,
                            willPrice : _full_price[0]
                        };
                    }
                }else{
                    if(item > _sum){
                        return{
                            price : _full_price[i-1],
                            index : i-1,
                            willPrice : item
                        };
                    }else{
                        if(i == _len-1){
                            return{
                                price : item,
                                index : i,
                                willPrice : 0
                            };
                        }
                    }
                }
            }
            return _full_obj;
        },
        sortFull : function(a,b){
            return a - b;
        },
        getSumHtm : function(){
            var _htm = '',
                _num = cart.getGoodNum();
            _htm+='<nav class="cart-nav clearfix">'
                +'<span class="cart-nav-block radioed-i j_all_checkbox">'
                +'<i class="icon iconfont radio-i">&#xe601;</i>全选'
                +'</span>'
                +'<span class="cart-nav-block">总计:<i class="j_sum">¥0</i></span>'
                //+'<span class="cart-nav-block">共省:<i class="j_ticket">¥0</i></span>'
                +'<a href="javascript:;" class="cart-nav-block j_submit_btn">结算<em class="j_sum_num"></em></a>'
                +'</nav>';
            return _htm;
        },
        getShopCartHtm : function(){
            var _shop_goods =  cart.jsonLocalItem('SHOPGOODS'),
                _htm = '',
                _this = this,
                _config = _this.config;
            if(_shop_goods){
                _htm+='<div class="shop-cart-wraper j_s_c_w">'
                    +'<p class="title shop-title">'
                    +'<i>首尔当地全场购物满'+_config.fullFreePost+'元,免运费。</i>'
                    +'</p>'
                    +'<div class="order-good-list-wraper j_sum_info">'
                    +'<ul class="order-good-list">';
                for(var goodid in _shop_goods){
                    _htm+=_this.createGoodsHtm(_shop_goods[goodid]);
                }
                _htm+='</ul>';
                    //+'<p class="title shop-title clearfix">配送费'
                    //+'<i class="fr j_freight"></i>'
                    //+'</p>'
                _htm+='</div>'
                    +'</div>';
            }else{
                _htm += '<div class="no-good">'
                    +'<i class=""></i>'
                    +'<p>购物车还是空的</p>'
                    +'<p>去挑几件中意的商品吧!</p>'
                    +'<a href="act_home.html" class="">开始购物</a>'
                    +'</div>';
            }
            return _htm;
        },
        createGoodsHtm : function(goodinfo){
            var _htm = '',
                _pric = goodinfo.info.priceList,
                _curRmb = _pric.vip?_pric.vip:_pric.curRmb,
                _domestic = _pric.domestic?_pric.domestic:{symbol:'￥',price:0};
                _htm+='<li class="clearfix j_good_li" id="'+goodinfo.info.id+'">'
                    +'<div class="radio-wraper radioed-i j_radio fl" data-price="'+_curRmb.price+'" data-id="'+goodinfo.info.id+'">'
                    +'<i class="icon iconfont radio-i">&#xe601;</i>'
                    +'</div>'
                    +'<a href="good_detail.html?goodid='+goodinfo.info.id+'" class="block">'
                    +'<div class="img fl" data-img="'+(goodinfo.info.pics?goodinfo.info.pics[0]:goodinfo.info.logoUrl)+'"></div></a>'
                    +'<div class="good-info-wraper">'
                    +'<p>'+goodinfo.info.name+'</p>'
                    +'<p class="price">'
                    +'<em>'+_curRmb.symbol+_curRmb.price+'</em>'
                    +'<i>'+_domestic.symbol+_domestic.price+'</i>'
                    +'</p>'
                    +'<div class="operate-wraper clearfix">'
                    +'<div class="good-wrap fl">'
                    +'<div class="good-num">'
                    +'<span class="good-move j_good_move" data-id="'+goodinfo.info.id+'">'
                    +'<i class="icon iconfont">&#xe6e0;</i>'
                    +'</span>'
                    +'<p class="j_good_num" data-val="'+goodinfo.num+'">'+goodinfo.num+'</p>'
                    //+'<input type="text" class="j_good_num" readonly="true" value="'+goodinfo.num+'">'
                    +'<span class="good-add j_good_add" data-id="'+goodinfo.info.id+'" data-limit-one="'+goodinfo.info.limitOne+'" data-limit-all="'+goodinfo.info.limitAll+'">'
                    +'<i class="icon iconfont">&#xe6df;</i>'
                    +'</span>'
                    +'</div>'
                    +'</div>'
                    +'<a href="javascript:;" class="bb fr j_del_btn" data-id="'+goodinfo.info.id+'">删除</a>'
                    +'</div>'
                    +'</div>'
                    +'</li>';
            return _htm;
        },
        verifySubmit : function(){
            if(!this.getSelectNum()){
                return false;
            }
            return true;
        },
        getGoodsList : function () {
            var _goods = cart.jsonLocalItem('SHOPGOODS'),
                _goods_list = [];
            for(var _id in _goods){
                if($('.radioed-i[data-id="'+_id+'"]').length){
                    _goods_list.push({
                        id:_id,
                        amount:_goods[_id].num,
                        info : _goods[_id].info
                    });
                }

            }
            return _goods_list;
        },
        commitCart : function(){//提交订单
            var _this = this;
            $.ajax({
                url : config.HOST+config.ACTIONS.previewOrder,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data : JSON.stringify({
                    //token:localStorage.getItem('TOKEN'),
                    //userId : localStorage.getItem('TOKEN'),
                    goodsList : _this.getGoodsList()
                }),
                success : function(res){
                    if(res.errcode == 0){
                        _this.savePreviewData(res.detail);
                        //location.href = config.URLHOST+'order_confirm.html';
                        location.href = 'order_confirm.html';
                    }else{
                        if(res.errcode == 20){
                            //var _limitAll = res.detail.limitAll,
                            var _limitOne = res.detail.limitOne,
                                _soldOutList = res.detail.soldOutList;
                            //if(_limitAll){
                            //
                            //}
                            if(_limitOne){
                                var _msg = '';
                                for(var _goodid in _limitOne){
                                    _msg += cart.getOneGoodInfo(_goodid).name+'购买量,超出单日单人限购数,还能购买'
                                            +(cart.getOneGoodInfo(_goodid).limitOne-_limitOne[_goodid])+'件。';
                                }
                                dialog.alert({
                                    body_txt: _msg,
                                    is_cover : true
                                });
                            }else{
                                dialog.alert({
                                    body_txt: res.errmsg,
                                    is_cover: true
                                });
                            }
                            if(_soldOutList){
                                var _names = [];
                                $.each(_soldOutList,function(i,item){
                                    _names.push(cart.getOneGoodInfo(item).name);
                                });
                                dialog.alert({
                                    body_txt: _names.join(',')+',已售罄。',
                                    is_cover : true
                                });
                            }else {
                                dialog.alert({
                                    body_txt: res.errmsg,
                                    is_cover: true
                                });
                            }
                        }else{
                            dialog.alert({
                                body_txt: res.errmsg,
                                is_cover : true
                            });
                        }

                    }
                },
                error : function(){
                    _this.commitCart();
                }
            });
        },
        savePreviewData : function(money_info){//保存订单预览数据
            var _this = this,
                _config = _this.config,
                _data = {};
            localStorage.setItem('ORDER',null);
            _data.goodsList = _this.getGoodsList();
            _data.moneyInfo = money_info;
            _data.postPrice = _config.postPrice;
            _data.fullFreePost = _config.fullFreePost;
            //"discount": {
            //    "isFreePost": 1,
            //    "off": 50,
            //    "full": 500
            //},
            //"total": 122045
            localStorage.setItem('ORDER',JSON.stringify(_data));
        }
    };
    SHOP_CART.init();
})