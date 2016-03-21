/**
 * Created by sunchengbin on 15/11/6.
 */
require(['token','dialog','zepto','loading','lazyload','homenav','base','config','searchplug','gotop','weixin'],function(token,dialog,zepto,loading,lazyload,homenav,base,config,searchplug,gotop,weixin){
    var domloading = loading.domLoading();
    var SEARCHRESULT = {
        init : function(){
            var _this = this;
            _this.page = 1;
            token.init({
                callback : function(){
                    _this.getHotList(1,function(error){
                        if(error){
                            _this.getHotList(1);
                        }
                    },function(opts){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: "小白免税",
                                desc: '我在小白免税搜了'+decodeURIComponent(base.others.getUrlPrem('keyword'))+',结果,惊呆了!',
                                link: opts.link,
                                imgUrl: "http://s.hdour.com/images/logo.jpg",
                                success: function() {
                                    //alert('分享成功');
                                },
                                cancel: function() {}
                            });
                        },'search_result');
                    });
                    gotop.init(function(){
                        if(_this.page == 0) {
                            $('.j_loading').remove();
                            return false;
                        }else{
                            _this.page++;
                            _this.getHotList(_this.page,function(){
                                $('.j_loading').remove();
                            });
                        }
                    });
                },
                type : 'search_result',
                noToken : true
            });
        },
        handelFn : function(){
            $('.j_keyword').on('change',function(){

            });
        },
        getHotList : function(page,callback,wxcallback) {
            var _this = this,
                _type = base.others.getUrlPrem('keytype'),
                _data = _type=='hottype'?{
                    page:page,
                    pageSize:20,
                    searchType:'category',
                    name:decodeURIComponent(base.others.getUrlPrem('keyword'))
                }:{
                    page:page,
                    pageSize:20,
                    name:decodeURIComponent(base.others.getUrlPrem('keyword'))
                },
                //_action_url = config.ACTIONS.search,
                _code = base.others.getUrlPrem('code'),
                _parentid = base.others.getUrlPrem('sparentid'),
                _user_info = localStorage.getItem('USERINFO'),
                _childid = _user_info?JSON.parse(_user_info).token.userId:null,
                _action_url = config.HOST+config.ACTIONS.search+'?code='+_code+'&parentId='+_parentid+'&childId='+_childid;
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
                    url : _action_url,
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
                            if(page > 1){
                                if(res.detail.total > 0){
                                    $('.j_goods_ul').append(_this.createGoodsHtm(res.detail.goodsList));

                                    gotop.enableLoad();
                                }
                                if(res.detail.total == 0){
                                    _this.page = 0;
                                }
                            }else {
                                $('.j_wraper').html(_this.createDetailHtm(res.detail));
                                searchplug.init('.j_wraper', decodeURIComponent(base.others.getUrlPrem('keyword')));
                                homenav.init();
                                setTimeout(function () {
                                    lazyload.init();
                                    domloading.remove();
                                }, 1);
                                var user_info = localStorage.getItem('USERINFO'),
                                    pid = user_info?JSON.parse(user_info).token.userId:null,
                                    _link = location.href;
                                if(pid){
                                    _link += '&sparentid='+pid;
                                }
                                wxcallback && wxcallback({
                                    link : _link
                                });
                            }
                            var _h = $('.j_goods_ul .img').height();
                            $('.li-sold-out').css({
                                'height':_h,
                                'paddingTop':_h/2-15
                            });
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
        createDetailHtm : function(detail){
            var _htm = '',
                _this = this;
            if(detail.goodsList && detail.goodsList.length){
                _htm+='</div>'
                    +'<p class="title">'
                    +'共有<em>'+detail.total+'</em>件商品'
                    +'</p>'
                    +'<div class="goods-list-wraper">'
                    +'<ul class="good-list j_goods_ul clearfix">'
                    +_this.createGoodsHtm(detail.goodsList)
                    +'</ul>'
                    +'</div>';
            }else{
                _htm += '<div class="no-good">'
                    +'<i class=""></i>'
                    +'<p>很遗憾,没有找到您要的！</p>'
                    +'<p>换个关键词再搜索一下吧！</p>'
                    //+'<a href="act_home.html" class="">开始购物</a>'
                    +'</div>'
            }
            return _htm;
        },
        createGoodsHtm : function(goods){
            var _htm = '',
                _this = this;
            $.each(goods,function(i,item){
                item = _this.transGoodPrice(item);
                var _pric = item.priceList,
                    //_currmb = (_pric.vip?_pric.vip:(_pric.curRmb?_pric.curRmb:0)),
                    _currmb = _pric.curRmb?_pric.curRmb:0,
                    _domestic = _pric.domestic?_pric.domestic:{symbol:'￥',price:_currmb.price},
                    _gain = Number(_domestic.price - _currmb.price);
                _htm+='<li data-id="'+item.id+'">'
                    +'<a class="block" href="good_detail.html?goodid='+item.id+'">';
                    if(item.isSoldOut == 'Y'){
                        _htm+='<div class="li-sold-out">已售罄</div>';
                    }
                _htm+='<div class="img" data-img="'+item.logoUrl+'"></div>'
                    +'<div class="good-info">'
                    //+'<p class="good-name">'+item.name+'</p>'
                    //+'<p class="good-price">'+(_currmb.symbol?_currmb.symbol:"￥")+_currmb.price+'<i>省'+_gain+'</i></p>'
                    //+'<p class="good-price"><span>'+_domestic.symbol+_domestic.price+'</span><em>(国内价)</em></p>'
                    +'<p class="good-name">'+item.name+'</p>'
                    +'<p class="good-price">'+(_currmb.symbol?_currmb.symbol:'￥')+_currmb.price+'<i class="price">'+_domestic.symbol+_domestic.price+'</i></p>'//<i>(国内均价)</i>
                    +'<p class="good-pain"><span class="bk">省¥'+_gain+'</span></p>'
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
    SEARCHRESULT.init();
})