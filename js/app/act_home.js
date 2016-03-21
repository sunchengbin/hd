/**
 * Created by sunchengbin on 15/11/2.
 */
require(['token','dialog','zepto','loading','slide','homenav','lazyload','config','weixin','gotop'],function(token,dialog,zepto,loading,slide,homenav,lazyload,config,weixin,gotop){
    var domloading = loading.domLoading();
    var ACT_HOME = {
        init : function(){
            var _this = this;
            _this.actioning = true;
            _this.page = 1;
            token.init({
                callback : function(){
                    _this.getActs();
                    gotop.init(function(){
                        if(_this.page == 0) {
                            $('.j_loading').remove();
                            return false;
                        }else{
                            _this.page++;
                            _this.getActFn(_this.page,function(){
                                $('.j_loading').remove();
                            });
                        }
                    });
                },
                wxcallback : function(){}
            });
        },
        handleFn : function(){
            $('body').on('focus','.j_keyword',function(){
                location.href = config.URLHOST+'search_home.html';
            });
        },
        getActs : function(){
            var _this = this,
                _actlist = localStorage.getItem('ACTHOME'),
                _time = (new Date()).getTime(),
                _timestamp = _actlist?JSON.parse(_actlist).timestamp+7200000:_time+100;
            //if(_actlist && _time < _timestamp){
            //    $('.j_wraper').html(_this.createHomeHtm(JSON.parse(_actlist).detail.acts));
            //    slide.createNew({
            //        dom : document.querySelector('.img-act')
            //    });
            //    homenav.init('home');
            //    lazyload.init();
            //    domloading.remove();
            //    _this.handleFn();fu
            //}else{
                _this.getActFn(1,function(error){
                    if(error){
                        _this.getActs();
                    }

                });
            //}
        },
        getActFn : function(page,callback){
            var _this = this;
            //if(_this.actioning){
            //    _this.actioning = false;
                $.ajax({
                    url : config.HOST+config.ACTIONS.actLists,
                    type : 'post',
                    contentType: 'application/json;charset=UTF-8',
                    dataType:'json',
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Access-Token",localStorage.getItem('TOKEN'));
                    },
                    data:JSON.stringify({
                        page:page,
                        pageSize:30
                    }),
                    success : function(res){
                        callback && callback();
                        if(res.errcode == 0){
                            if(page > 1){
                                if(res.detail.total > 0){
                                    $('.j_acts_ul').append(_this.createHomeHtm(res.detail.acts));
                                    gotop.enableLoad();
                                }
                                if(res.detail.total == 0){
                                    _this.page = 0;
                                }
                            }else{
                                var _acts = res;
                                _acts['timestamp'] = (new Date()).getTime();
                                localStorage.setItem('ACTHOME',JSON.stringify(_acts));
                                $('.j_wraper').html(_this.createHomeHtm(res.detail.acts));
                                slide.createNew({
                                    dom : document.querySelector('.img-act')
                                });
                                homenav.init('home');
                                lazyload.init();
                                domloading.remove();
                            }
                        }else{
                            dialog.alert({
                                body_txt: res.errmsg,
                                is_cover : true
                            });
                        }
                        _this.handleFn();
                    },
                    error : function(){
                        callback && callback('error');
                    }
                });
            //}
        },
        createHomeHtm : function(acts){
            var _htm='',
                _this = this;
            _htm+='<div class="search-form-wraper home-search clearfix">'
                +'<div class="change-country fl">'
                +'<img class="fl" src="http://s.hdour.com/images/icon/hanguo.png"/>'
                +'<div class="">'
                +'首尔'
                //+'<i class="icon iconfont">&#xe615;</i>'
                +'</div>'
                +'</div>'
                +'<div class="search-form clearfix">'
                +'<i class="search-btn fl"></i><div>'
                +'<input type="text" class="j_keyword" placeholder="搜索商品名"/>'
                +'</div></div>'
                +'</div>';
            _htm+='<div class="banner-wraper">'
                +'<div class="img-act clearfix">'
                //+'<a class="block" href="'+config.URLHOST+'act_detail.html?actid=10014"><img data-img="../images/act/banner2.jpg"/></a>'
                +'<a class="block" href="'+config.URLHOST+'act_detail.html?actid=10015"><img data-img="http://img.hdour.com/act/2015/12/3/1/ceeb0c41c69d9bbf4662c3f0d8.jpg"/></a>'
                //+'<a class="block fl" href="'+config.URLHOST+'act_detail.html?actid=10014">'
                //+'<div class="img" style="background-image:url(../images/act/banner2.png)"></div>'
                //+'</a>'
                //+'<a class="block fl" href="javascript:;">'
                //+'<div class="img" style="background-image:url(../images/act/banner1.png)"></div>'
                //+'</a>'
                +'</div>'
                +'</div>';
            _htm+='<div class="next-tag clearfix">'
                +'<div class="type-tag"><a class="block " href="'+config.URLHOST+'search_home.html?key=type"><i></i><div>'
                +'<p>分类</p>'
                +'<p>最清晰找所需</p>'
                +'</div>'
                +'</a>'
                +'</div>'
                +' <div class="brand-tag"><a class="block " href="'+config.URLHOST+'search_home.html?key=brand"><i></i><div>'
                +' <p>品牌</p>'
                +'<p>爱找韩国大牌</p>'
                +'</div>'
                +'</a>'
                +'</div>'
                +'</div>';
            _htm += '<div class="act-wraper">'
                +_this.createActsHtm(acts)
                +' </div>'
                +' </section>';
            return _htm;
        },
        createActsHtm : function(acts){
            var _htm = '',
                _this = this;
            $.each(acts,function(i,item){
                _htm+='<div class="one-act" data-act-id="'+item.actId+'">'
                    +'<a href="'+config.URLHOST+'act_detail.html?actid='+item.actId+'" class="block">'
                    +'<img class="" data-img="'+(item.actPics?item.actPics[0]:'../images/huodong-banner.jpg')+'"/>'
                    //+'<div class="act-title">'
                    //+'<p class=""><i class="icon iconfont">&#xe6cf;</i>暖意专场<i class="icon iconfont">&#xe6cf;</i></p>'
                    //+'<p class="">秋日暖心又暖胃</p>'
                    //+'<p><span>查看全部</span></p>'
                    //+'</div>'
                    +'<span class="angle"></span>'
                    +'</a>'
                    +'<div class="act-lists-wraper">'
                    +'<ul class="act-lists j_acts_ul clearfix">'
                    +_this.createGoodsHtm(item.goodsList,item.actId)
                    +'</ul>'
                    +'</div>'
                    +'</div>'
            });
            return _htm;
        },
        createGoodsHtm : function(goods,actid){
            var _htm = '',
                _this = this;
            $.each(goods,function(i,item){
                item = _this.transGoodPrice(item);
                var _pric = item.priceList,
                    _logo = item.logoUrl?item.logoUrl:'',
                    _currmb = _pric.curRmb?_pric.curRmb:0,
                    _domestic = _pric.domestic&&_pric.domestic.price?_pric.domestic:{symbol:'￥',price:_currmb.price},
                    _gain = Number(_domestic.price - (_currmb?_currmb.price:0));
                if(i > 4)
                    return;
                _htm+='<li>'
                    +'<a class="block" data-goodsid="'+item.id+'" href="'+config.URLHOST+'good_detail.html?goodid='+item.id+'">'
                    +'<div class="img" data-img="'+_logo+'"></div>'
                    +'<div class="good-info">'
                    +'<p class="good-name">'+item.name+'</p>'
                    +'<p class="good-price"><span>'+(_currmb?(_pric.curRmb.symbol?_pric.curRmb.symbol:'￥')+'</span>'+_pric.curRmb.price:0)+'<i>'+_domestic.symbol+_domestic.price+'</i></p>'
                    +'<p class="good-pain"><em>立省'+_gain+'</em></p>'
                    +'</div>'
                    +'</a>'
                    +'</li>';
            });
            _htm += '<li class="see-all">'
                +'<a class="block" href="'+config.URLHOST+'act_detail.html?actid='+actid+'">'
                +'<div class="img">'
                +'<p>'
                +'<span>查看全部</span>'
                +'</p>'
                +'<p>see-all</p>'
                +'</div>'
                +'</a>'
                +'</li>';
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
    ACT_HOME.init();


})