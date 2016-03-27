/**
 * Created by sunchengbin on 15/11/5.
 */
require(['buyplug','token','dialog','zepto','loading','slide','homenav','lazyload','base','config','gotop','cart','weixin','searchplug'],function(buyplug,token,dialog,zepto,loading,slide,homenav,lazyload,base,config,gotop,cart,weixin,searchplug){
    //buyplug.init();
    var domloading = loading.domLoading();
    var ACTDETAIL = {
        init : function(){
            var _this = this;
            _this.page = 1;
            token.init({
                callback : function(){
                    searchplug.init('.j_home_common','','home');
                    _this.getActInfo(1,function(error){
                        if(error){
                            _this.getActInfo(1);
                        }
                    },function(opts){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: "小白免税",
                                desc: "服务于全球华人的海外电商，现已开通韩国站，众多韩国化妆品等你来选购",
                                link: "http://s.hdour.com/",
                                imgUrl: "http://s.hdour.com/images/logo.jpg",
                                success: function() {
                                    //alert('分享成功');
                                },
                                cancel: function() {}
                            });
                        },'gooddetail');

                    });
                    _this.handleFn();
                    gotop.init();
                },
                noToken : true,
                type:'actdetail'
                //wxcallback : function(){}
            });
        },
        handleFn : function(){
            var _this = this;
            $('.j_wraper').on('click','.j_add_cart_btn',function () {
                var _id = $(this).attr('data-id');
                _this.good = _this.transGood(_this.goods)[_id];
                buyplug.init(_this.transGood(_this.goods)[_id]);
            });
            $('.j_wraper').on('click','.j_tag',function () {
                var _that = $(this),
                    _w = _that.attr('data-wraper');
                if(!_that.is('.act')){
                    $('.act[data-wraper]').removeClass('act');
                    _that.addClass('act');
                    $('.j_ul').hide();
                    $('.'+_w).show();
                }

            });
            buyplug.handelFn(function(num){
                var good = _this.good,
                    _id = _this.good.id,
                    _nums = cart.getOneGoodNum(_id),
                    _num_o = Number(num) + (_nums?_nums:0),
                    _num = (good.limitOne!=0&&_num_o>good.limitOne)?good.limitOne:_num_o,
                    _good = {
                        id : _id,
                        num : _num,
                        info : good
                    };
                cart.addCart(_good,function(){
                    var _cart_num = cart.getGoodNum();
                    if(_cart_num){
                        $('.j_show_num').html(_cart_num).removeClass('hide');
                    }else{
                        $('.j_show_num').html(0).addClass('hide');
                    }
                });
            });
        },
        transGood : function(goods){
            var _this = this,
                _good = {};
            $.each(goods,function(i,item){
                _good[item.id] = item;
            });
            return _good;
        },
        transActs : function(acts){
            if(!acts)return null;
            var _acts = {};
            $.each(acts,function(i,item){
                _acts[item['actId']] = item;
            });
            return _acts;
        },
        getActInfo : function(page,callback,wxcallback){
            var _this = this,
                _actlist = localStorage.getItem('ACTHOME')?JSON.parse(localStorage.getItem('ACTHOME')):null,
                _time = (new Date()).getTime(),
                _acts = _actlist?_this.transActs(_actlist.detail.acts):null,
                _actid = 10020,//base.others.getUrlPrem('actid'),
                _act = _acts?_acts[_actid]:null,
                _timestamp = _actlist?_actlist.timestamp+7200000:_time+100,
                _code = base.others.getUrlPrem('code'),
                _parentid = base.others.getUrlPrem('sparentid'),
                _user_info = localStorage.getItem('USERINFO'),
                _childid = _user_info?JSON.parse(_user_info).token.userId:null,
                _data = {
                    actId: _actid,
                    page: page,
                    pageSize: 20
                },
                _action_url = config.HOST+config.ACTIONS.actDetail+'?code='+_code+'&parentId='+_parentid+'&childId='+_childid;
            //if(_code){
            //    _data.code = _code;
            //}
            //if(_parentid){
            //    _data.parentId = _parentid;
            //}
            //if(_childid){
            //    _data.childId = _childid;
            //}
            $.ajax({
                url: _action_url,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data: JSON.stringify(_data),
                success: function (res) {
                    callback && callback();
                    if (res.errcode == 0) {
                        $('.j_wraper').html(_this.createDetailHtm(res.detail));
                        var _h = $('.j_g_l .img').height();
                        $('.li-sold-out').css({
                            'height':_h,
                            'paddingTop':_h/2-15
                        });
                        _this.goods = res.detail.goodsList;
                        homenav.init('home');
                        lazyload.init();
                        domloading.remove();
                        var _name = res.detail.act.name,
                            //_url = res.detail.actPics?res.detail.actPics[0]:res.detail.act.pics[0],
                            _id = res.detail.act.id,
                            _user_info = localStorage.getItem('USERINFO'),
                            _nick_name = _user_info?JSON.parse(_user_info).user.nickName:null,
                            _title = _id == 10019?'猴年现货专场':'小白免税',
                            _l_title = _nick_name?_nick_name+'推荐~'+_title:_title,
                            user_info = localStorage.getItem('USERINFO'),
                            pid = user_info?JSON.parse(user_info).token.userId:null,
                            _link = location.href;
                        if(pid){
                            _link += '&sparentid='+pid;
                        }
                        wxcallback && wxcallback({
                            title : _l_title,
                            //url : _url,
                            name : _name,
                            link : _link
                        });
                    } else {
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
        createDetailHtm : function(actinfo){
            var _htm = '',
                _this = this;
            //_htm += '<div class="act-detail">'
            //    +'<img data-img="'+(actinfo.actPics?actinfo.actPics[0]:actinfo.act.pics[0])+'"/>'
            //    +'</div>';
            //if(actinfo.act.description && actinfo.act.id == 10019){
            //    _htm += '<div class="detail-des">'
            //        +actinfo.act.description
            //        +'</div>';
            //    _htm += '<div class="detail-tag clearfix">'
            //        +'<a href="javascript:;" class="block act j_tag" data-wraper="j_d_l">'
            //        +'<p class="">'
            //        +'<i class="list-img"></i>列表'
            //        +' </p>'
            //        +'</a>'
            //        +'<a href="javascript:;" class="block j_tag" data-wraper="j_g_l">'
            //        +'<p class="">'
            //        +'<i class="img-icon"></i>图片'
            //        +'</p>'
            //        +'</a>'
            //        +'</div>';
            //}else{
            //    _htm += '<div class="detail-tag clearfix">'
            //        +'<a href="javascript:;" class="block j_tag" data-wraper="j_d_l">'
            //        +'<p class="">'
            //        +'<i class="list-img"></i>列表'
            //        +' </p>'
            //        +'</a>'
            //        +'<a href="javascript:;" class="block act j_tag" data-wraper="j_g_l">'
            //        +'<p class="">'
            //        +'<i class="img-icon"></i>图片'
            //        +'</p>'
            //        +'</a>'
            //        +'</div>';
            //}
            _htm+='<img src="http://s.hdour.com/images/act/home_1.jpg">'
                +'<img src="http://s.hdour.com/images/act/slogn.jpg">';
            _htm += '<ul class="good-detail-lists j_ul '+(actinfo.act.description && actinfo.act.id == 10019?'':'hide')+' j_d_l">'
                +_this.createDetailGood(actinfo.goodsList)
                +'</ul>'
                    //+'<p class="title">'
                    //+'共有<em>'+actinfo.goodsList.length+'</em>件商品'
                    ////+'<i class="icon iconfont fr act">&#xe62d;</i>'
                    ////+'<i class="icon iconfont fr">&#xe6ad;</i>'
                    //+'</p>'
                +'<ul class="good-list j_g_l j_ul '+(actinfo.act.description && actinfo.act.id == 10019?'hide':'')+' clearfix">'
                + _this.createGoodsList(actinfo.goodsList)
                +'</ul>';
            return _htm;
        },
        createDetailGood : function(goods){
            var _htm = '',
                _this = this;
            $.each(goods,function(i,item) {
                item = _this.transGoodPrice(item);
                var _pric = item.priceList,
                //_curRmb = (_pric.vip?_pric.vip:(_pric.curRmb?_pric.curRmb:{symbol:'￥',price:0})),
                    _curRmb = _pric.curRmb?_pric.curRmb:{symbol:'￥',price:0},
                    _domestic = (_pric.domestic && _pric.domestic.price)?_pric.domestic:{symbol:'￥',price:_curRmb.price},
                    _curLocal = _pric.curLocal,
                    _gain = Number(_domestic.price - _curRmb.price);
                _htm += '<li class="">'
                    + '<div class="detail-wraper">'
                    + '<p class="good-title">'+item.name+'</p>'
                    + '<div class="good-description">'
                    + (item.description?item.description:'')
                    + '</div>'
                    + '<a class="block" href="'+config.URLHOST+'good_detail.html?goodid='+item.id+'">'
                    + '<div class="img" data-img="'+item.logoUrl+'"></div>'
                    + '</a>'
                    + ' <p class="good-price clearfix">'
                    + '<em><i>'+(_curRmb.symbol?_curRmb.symbol:'￥')+'</i>'+_curRmb.price+'</em>'
                    + '<span>韩币:'+_curLocal.symbol+_curLocal.price+'</span>';
                if(item.isSoldOut == 'Y'){
                    _htm+='<a data-id="'+item.id+'" class="sold-out" href="javascript:;">已售罄</a>';
                }else{
                    _htm+='<a data-id="'+item.id+'" class="j_add_cart_btn" href="javascript:;"><i></i>加入购物车</a>';
                }
                //'<a data-id="'+item.id+'" class="j_add_cart_btn" href="javascript:;"><i></i>加入购物车</a>'
                _htm += '</p>'
                    + '</div>'
                    + '<p class="add-cart-btns">'
                    + '国内价:<span>¥'+_domestic.price+'</span><i class="bb">省¥'+_gain+'</i>'
                    + '</p>'

                    + '</li>';
            });
            return _htm;
        },
        createGoodsList : function(goods){
            var _htm = '',
                _this = this;
            $.each(goods,function(i,item){
                item = _this.transGoodPrice(item);
                var _pric = item.priceList,
                //_curRmb = (_pric.vip?_pric.vip:(_pric.curRmb?_pric.curRmb:{symbol:'￥',price:0})),
                    _curRmb = _pric.curRmb?_pric.curRmb:{symbol:'￥',price:0},
                    _domestic = (_pric.domestic && _pric.domestic.price)?_pric.domestic:{symbol:'￥',price:_curRmb.price},
                    _gain = Number(_domestic.price - _curRmb.price);
                _htm+='<li data-id="'+item.id+'">'
                    +'<a class="block" href="good_detail.html?goodid='+item.id+'">';
                if(item.isSoldOut == 'Y'){
                    _htm+='<div class="li-sold-out">已售罄</div>';
                }
                _htm+='<div class="img" data-img="'+item.logoUrl+'"></div>'
                    +'<div class="good-info">'
                    +'<p class="good-name">'+item.name+'</p>'
                    +'<p class="good-price">'+(_curRmb.symbol?_curRmb.symbol:'￥')+_curRmb.price+'<i class="price">'+_domestic.symbol+_domestic.price+'</i></p>'//<i>(国内均价)</i>
                    +'<p class="good-pain"><span class="bk">省¥'+_gain+'</span></p>'
                        //+'<p class="good-name">'+item.name+'</p>'
                        //+'<p class="good-price">'+(_curRmb.symbol?_curRmb.symbol:'￥')+_curRmb.price+'<i>省'+_gain+'</i></p>'
                        //+'<p class="good-price"><span>'+_domestic.symbol+_domestic.price+'</span><em>(国内价)</em></p>'
                    +'</div>'
                    +'</a>'
                    +'</li>';
            });
            return _htm;
        },
        transGoodPrice : function(good){
            good = $.extend({
                "name": "",
                "id": '',
                "logoUrl": "",
                "goodsDoc": "",
                "priceList": {
                    "domestic": {
                        "symbol": "￥",
                        "price": 0,
                        "name": "人民币",
                        "enName": "RMB"
                    },
                    "curRmb": {
                        "symbol": "￥",
                        "price": 0,
                        "name": "人民币",
                        "enName": "RMB"
                    },
                    "curLocal": {
                        "symbol": "￥",
                        "price": 0,
                        "name": "人民币",
                        "enName": "RMB"
                    }
                }
            },good);
            return good;
        }
    };
    ACTDETAIL.init();
})
