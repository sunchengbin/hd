/**
 * Created by sunchengbin on 15/11/5.
 */
require(['token','dialog','zepto','loading','lazyload','slide','config','base','cart','buyplug','weixin'],function(token,dialog,zepto,loading,lazyload,slide,config,base,cart,buyplug,weixin){
    var domloading = loading.domLoading();
    var GOODDETAIL = {
        init : function(){
            var _this = this,
                _user_info = localStorage.getItem('USERINFO'),
                _nick_name = _user_info?JSON.parse(_user_info).user.nickName:null,
                _l_title = _nick_name?_nick_name+'推荐~小白免税':'小白免税';
            token.init({
                callback : function(){
                    _this.getGoodInfo(function(opts){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: _l_title,
                                desc: opts.name,
                                link: opts.link,
                                imgUrl: opts.url,
                                success: function() {
                                    //alert('分享成功');
                                },
                                cancel: function() {}
                            });
                        },'gooddetail');
                    });
                },
                type:'gooddetail',
                //wxcallback : function(){},
                noToken : true
            });
        },
        handleFn : function(good){
            var load = null,
                _this = this,
                _config = _this.good;
            $('.good-nav-bar').on('click','.j_add_btn',function () {
                buyplug.init(good);
            });
            buyplug.handelFn(function(num){
                var _nums = cart.getOneGoodNum(_config.id),
                    _num_o = Number(num) + (_nums?_nums:0),
                    _num = (_config.limitOne!=0&&_num_o>_config.limitOne)?_config.limitOne:_num_o,
                    _good = {
                        id : _config.id,
                        num : _num,
                        info : _config
                    };
                cart.addCart(_good,function(){
                    var _cart_num = cart.getGoodNum();
                    if(_cart_num){
                        $('.j_good_num').html(_cart_num).removeClass('hide');
                    }else{
                        $('.j_good_num').html(0).addClass('hide');
                    }
                });
            });
        },
        getGoodInfo : function(callback){
            var _this = this,
                _code = base.others.getUrlPrem('code'),
                _parentid = base.others.getUrlPrem('sparentid'),
                _user_info = localStorage.getItem('USERINFO'),
                _childid = _user_info?JSON.parse(_user_info).token.userId:null,
                _data = {
                    id : base.others.getUrlPrem('goodid')
                },
                _action_url = config.HOST+config.ACTIONS.goodDetail+'?code='+_code+'&parentId='+_parentid+'&childId='+_childid;
            $.ajax({
                url : _action_url,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data : JSON.stringify(_data),
                success : function(res){
                    if(res.errcode == 0){
                        $('.j_wraper').html(_this.createDetailHtm(res.detail));
                        _this.good = res.detail;
                        $('body').append(_this.createNavHtm(res.detail));
                        if(res.detail.pics.length>1){
                            slide.createNew({
                                dom : document.querySelector('.good-imgs')
                            });
                        }
                        _this.handleFn(res.detail);
                        lazyload.init();
                        domloading.remove();
                        var _curRmb = res.detail.priceList.curRmb?res.detail.priceList.curRmb.price:'',
                            _add = _curRmb?'(零售价:￥'+_curRmb+')':'',
                            _name = res.detail.name+_add,
                            _url = res.detail.pics[0],
                            user_info = localStorage.getItem('USERINFO'),
                            pid = user_info?JSON.parse(user_info).token.userId:null,
                            _link = location.href;
                        if(pid){
                            _link += '&sparentid='+pid;
                        }
                        callback && callback({
                            name : _name,
                            url : _url,
                            link : _link
                        })
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
                    //window.location.reload();
                    _this.getGoodInfo(callback);
                }
            });
        },
        createNavHtm : function(good){
            var _htm = '',
                _num = cart.getGoodNum();
                //_htm += '<nav class="good-nav-bar clearfix">'
                //    +'<a class="cart-icon fl" href="shop_cart.html">'
                //    +'<i class="icon iconfont">&#xe649;</i>'
                //    +'<em class="shop-icon j_good_num '+(_num?'':'hide')+'">'+(_num?_num:'')+'</em>'
                //    +'</a>'
                //    +'<a href="javascript:;" class="add-btn j_add_btn">'
                //    +'<em>加入购物车</em>'
                //    +'</a>'
                //    +'<a href="act_home.html" class="act-home fr">'
                //    +'<i class="icon iconfont">&#xe64b;</i>'
                //    +'</a>'
                //    +'</nav>';
                _htm +='<nav class="good-nav-bar clearfix">'
                    +'<div class="good-bars fl">'
                    +'<a class="act-home" href="act_home.html">'
                    +'<p class="icon-p"><i class=""></i></p>'
                    +'<p>首页</p>'
                    +'</a>'
                    +'<a class="service-icon" href="service.html">'
                    +'<p class="icon-p"><i class=""></i></p>'
                    +'<p>客服</p>'
                    +'</a>'
                    +'<a class="cart-icon" href="shop_cart.html">'
                    +'<p class="icon-p"><i class=""></i></p>'
                    +'<p>购物车</p>'
                    +'<em class="shop-icon j_good_num '+(_num?'':'hide')+'">'+(_num?_num:'')+'</em>'
                    +' </a>'
                    +' </div>';
                    if(good.isSoldOut == 'Y'){
                        _htm+='<a href="javascript:;" class="add-btn fl sold-out">已售罄</a>';
                    }else{
                        _htm+='<a href="javascript:;" class="add-btn fl j_add_btn">加入购物车</a>';
                    }
                    _htm+='</nav>';
            return _htm;
        },
        createDetailHtm : function(actinfo){
            var _htm = '',
                _user = localStorage.getItem('USERINFO')?JSON.parse(localStorage.getItem('USERINFO')):null,
                _pric = actinfo.priceList,
                _vip = _pric.vip,
                _currmb = _pric.curRmb?_pric.curRmb:0,
                _local = _pric && _pric.local?_pric.local:{symbol:'￥',price:_currmb.price},
                _curlocal = _pric && _pric.curLocal?_pric.curLocal:{symbol:'￥',price:0},
                _domestic = _pric.domestic?_pric.domestic:{symbol:'￥',price:_currmb.price};
            _htm += '<div class="goods-wraper">'
                +'<p class="sel-info"><span>已售<em>'+actinfo.salesVol+'</em>件</span></p>'
                +'<div class="good-imgs clearfix">';
                $.each(actinfo.pics?actinfo.pics:[],function(i,item){
                    _htm +='<img class="good-img" src="'+item+'"/>';
                });

            _htm +='</div></div>';
                //+'<p class="good-price">'
                //+'<em>'+(_currmb.symbol?_currmb.symbol:"￥")+_currmb.price+'</em>'
                //+'<span>(约合:'+(_curlocal.symbol+_curlocal.price)+')</span>'//_pric.curLocal.price+_pric.curLocal.name
                //+'</p>'
                //+'<p class="good-contrast-price">'
                //+'<em>'+_local.symbol+_local.price+'</em>'
                //+'<span>(韩国免税店价)</span>'
                //+'<span>(立省'+Number(_local.price - _currmb.price)+'元)</span>'
                //+'</p>'
                //+'<p class="good-contrast-price">'
                //+'<em>'+_domestic.symbol+_domestic.price+'</em>'
                //+'<span>(国内网购均价)</span>'
                //+'<span>(立省'+Number(_domestic.price - _currmb.price)+'元)</span>'
                //+'</p>'
                //<div class="discount-msg">
                //<span>满500减100</span>
                //<span>满500减100</span>
                //<span>满500减100</span>
                //</div>
                //+'<p class="good-title">'+actinfo.name+'</p>';
            _htm +='<div class="good-wraper">'
                +'<p class="good-title">'+actinfo.name+'</p>'
                +'<p class="good-price clearfix">';
                //if(_vip) {
                //    _htm +='<em><i>' + (_vip.symbol ? _vip.symbol : "￥") + '</i>' + _vip.price + '</em>'
                //}else{
                _htm +='<em><i>' + (_currmb.symbol ? _currmb.symbol : "￥") + '</i>' + _currmb.price + '</em>';
                //}
            _htm +='<span class="ml10">韩币:'+(_curlocal.symbol+_curlocal.price)+'</span>';
                    if(actinfo.brand){
                        _htm +='<a class="fr" href="brand_detail.html?brandid='+actinfo.brand.id+'&brandname='+encodeURIComponent(actinfo.brand.name)+'">品牌商城</a>';
                    }
            _htm +='</p>';
                if(_vip){
                    _htm +='<p class="good-contrast-price">'
                        +'<span>VIP价:'+_vip.symbol+_vip.price+'</span>'
                        +'<i class="ml10 pain-icon">省'+Number(_currmb.price - _vip.price)+'元</i>'
                        +'</p>';
                }
            var _buy_price = _vip?_vip.price:_currmb.price,
                _now_price = _buy_price + Number((actinfo.weight*40).toFixed(1));
            //_htm +='<p class="good-contrast-price">'
            //    +'<span>国内到手价:'+_domestic.symbol+_now_price+'</span>'
            //    +'<span class="ml10 ">（约'+actinfo.weight+'kg）</span>'
            //    //+'<i class="ml10 pain-icon">'+actinfo.weight+'kg/件,满首重1kg,每件国际物流费'+Number((actinfo.weight*40).toFixed(1))+'</i>'
            //    +'</p>';
            //_htm +='<p class="good-contrast-price">'
            //    +'<i class="pain-icon">'+actinfo.weight+'kg/件,满首重1kg,每件国际物流费'+Number((actinfo.weight*40).toFixed(1))+'元</i>'
            //    +'</p>';
            //_htm +='<p class="good-contrast-price">'
            //    +'<span>国内价:'+_domestic.symbol+_domestic.price+'</span>'
            //    +'<i class="ml10 pain-icon">省'+Number(_domestic.price - _currmb.price)+'元</i>'
            //    +'</p>';
            _htm +='</div>';
            _htm +='<div class="discount-msg">'
                //+'<p><span>满减</span>跨品牌满'+actinfo.fullFreePost+'减'+actinfo.postPrice+'，上不封顶</p>'
                +'<p><span>国内</span>国际直邮299包邮,299以内20运费</p>'
                +'<p><span>免邮</span>全场购物满'+actinfo.discount.fullFreePost+'元,首尔当地免运费</p>'
                +'</div>'
                +'<ul class="good-declare clearfix">'
                +'<li><p><i></i></p><p>正品保障</p></li>'
                +'<li><p><i></i></p><p>极速物流</p></li>'
                +'<li><p><i></i></p><p>更低折扣</p></li>'
                +'<li><p><i></i></p><p>无忧退货</p></li>'
                +'</ul>'
                +'<div class="good-des-wraper">'
                +'<p><span>小白推荐</span></p>'
                //+'<div class="good-description clearfix">'
                //+'<div class="fl">'
                //+'<img data-img="'+_user+'" class=""/>'
                //+'<p>_user.nikeName</p>'
                //+'</div>'
                +'<div class="txt">'
                +(actinfo.description?actinfo.description:'')
                +'</div>'
                +'</div>'
                +'</div>';
                //+'<div class="detail-tag clearfix">'
                //+'<a href="javascript:;" class="block act">'
                //+'<div class="">'
                //+'图文详情'
                //+' </div>'
                //+'</a>'
                //+'<a href="javascript:;" class="block">'
                //+'<div class="">'
                //+'FAQ'
                //+'</div>'
                //+'</a>'
                //+'</div>';
            _htm += '<div class="good-imgs-wraper">';
            $.each((actinfo.drumbeatingPics?actinfo.drumbeatingPics:[]),function(i,item){
                _htm +='<img class="good-img" data-img="'+item+'"/>';
            });
            _htm += '</div>';
            return _htm;
        }
    };
    GOODDETAIL.init();
})