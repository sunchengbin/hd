/**
 * Created by sunchengbin on 15/11/6.
 */
require(['token','dialog','zepto','loading','lazyload','homenav','searchplug','config','base','weixin'],function(token,dialog,zepto,loading,lazyload,homenav,searchplug,config,base,weixin){
    var domloading = loading.domLoading();
    var GOODDETAIL = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    _this.getHotList(function(opts){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: "小白免税",
                                desc: "帮你送货到酒店和机场",
                                link: opts.link,
                                imgUrl: "http://s.hdour.com/images/logo.jpg",
                                success: function() {
                                    //alert('分享成功');
                                },
                                cancel: function() {}
                            });
                        },'search_home');
                    });
                    _this.handelFn();
                },
                type:'search_home',
                noToken : true
            });
        },
        handelFn : function(){
            $('body').on('click','.j_change_tag',function(){
                var _this = $(this),
                    _tab = _this.attr('data-tab');
                if(!_this.is('.act')){
                    $('.act[data-tab]').removeClass('act');
                    _this.addClass('act');
                    $('[data-tag]').hide();
                    $('[data-tag="'+_tab+'"]').show();
                    lazyload.init();
                }

            });
        },
        getHotList : function(callback) {
            var _this = this,
                _searchhome = localStorage.getItem('SEARCHHOME'),
                _time = (new Date()).getTime(),
                _timestamp = _searchhome?JSON.parse(_searchhome).timestamp+7200000:_time+100;
            if(_searchhome && _time < _timestamp){
                searchplug.init('.j_wraper');
                $('.j_wraper').append(_this.createDetailHtm(JSON.parse(_searchhome).type,JSON.parse(_searchhome).brand));
                homenav.init(base.others.getUrlPrem('key'));
                setTimeout(function(){
                    lazyload.init();
                    domloading.remove();
                },1);
                var user_info = localStorage.getItem('USERINFO'),
                    pid = user_info?JSON.parse(user_info).token.userId:null,
                    _link = location.href;
                if(pid){
                    if(!location.search.length){
                        _link += '?sparentid='+pid;
                    }else{
                        _link += '&sparentid='+pid;
                    }
                }
                callback && callback({
                    link : _link
                });
            }else{
                var _code = base.others.getUrlPrem('code'),
                    _parentid = base.others.getUrlPrem('sparentid'),
                    _user_info = localStorage.getItem('USERINFO'),
                    _childid = _user_info?JSON.parse(_user_info).token.userId:null,
                    _action_url = config.HOST+config.ACTIONS.searchHome+'?code='+_code+'&parentId='+_parentid+'&childId='+_childid;
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
                    success : function(type){
                        //alert(JSON.stringify(type))
                        if(type.errcode == 0){
                            var _search_home = {};
                            _search_home['timestamp'] = (new Date()).getTime();
                            _search_home['type'] = type.detail.category;
                            _search_home['brand'] = type.detail.brand;
                            localStorage.setItem('SEARCHHOME',JSON.stringify(_search_home));
                            searchplug.init('.j_wraper');
                            $('.j_wraper').append(_this.createDetailHtm(type.detail.category,type.detail.brand));
                            homenav.init(base.others.getUrlPrem('key'));
                            setTimeout(function(){
                                lazyload.init();
                                domloading.remove();
                            },1);
                            var user_info = localStorage.getItem('USERINFO'),
                                pid = user_info?JSON.parse(user_info).token.userId:null,
                                _link = location.href;
                            if(pid){
                                if(!location.search.length){
                                    _link += '?sparentid='+pid;
                                }else{
                                    _link += '&sparentid='+pid;
                                }
                            }
                            callback && callback({
                                link : _link
                            });
                        }else{
                            token.reloadToken(type,function(){
                                dialog.alert({
                                    body_txt: type.errmsg,
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
                            //dialog.alert({
                            //    body_txt: type.errmsg,
                            //    is_cover : true
                            //});
                        }
                    }
                });
            }
        },
        createDetailHtm : function(hottype,hotbrand){
            var _htm = '',
                _this = this,
                _key = base.others.getUrlPrem('key');
            _htm+='<div class="detail-tag clearfix">'
                +'<a href="search_home.html?key=type" class="block '+(!_key||_key=='type'?'act':'')+' j_change_tag" data-tab="j_hot_type">'
                +'<p>'
                +'分类'
                +' </p>'
                +'</a>'
                +'<a href="search_home.html?key=brand" class="block '+(_key&&_key=='brand'?'act':'')+' j_change_tag" data-tab="j_brand">'
                +'<p>'
                +'品牌'
                +'</p>'
                +'</a>'
                +'</div>';
                _htm+= '<div class="search-list">'
                    //+'<p class="search-list-title">热门分类</p>'
                    +'<ul class="hot-type-list clearfix '+(!_key||_key=='type'?'':'hide')+'" data-tag="j_hot_type">'
                    +_this.createTypeHtm(hottype)
                    +'</ul>'
                    +'<div class="hot-brand-list '+(_key&&_key=='brand'?'':'hide')+'" data-tag="j_brand">'
                    +'<ul class="clearfix">'
                    +_this.createBrandHtm(hotbrand)
                    +'</ul>'
                    +'</div>'
                    +'</div>';
            return _htm;
        },
        createTypeHtm : function(type){
            var _htm = '';
            $.each(type,function(i,item){
                _htm+='<li>'
                    +'<a href="search_result.html?keytype=hottype&typeid='+item.id+'&keyword='+encodeURIComponent(item.name)+'" class="block">'
                    +'<div class="img" data-img="'+item.logoUrl+'" style=""></div>'
                    +'<p>'+item.name+'</p>'
                    +'</a>'
                    +'</li>';
            });
            return _htm;
        },
        createBrandHtm : function(brand){
            var _htm = '';
            $.each(brand,function(i,item){
                _htm+='<li>'
                    +'<a href="brand_detail.html?brandid='+item.id+'&brandname='+encodeURIComponent(item.name)+'" class="block">'
                    +'<p>'+item.name+'</p>'
                    +'<img class="" data-img="'+item.logoUrl+'">'
                    //+'<div class="img" data-img="'+item.logoUrl+'" style=""></div>'
                    +'</a>'
                    +'</li>';
            });
            return _htm;
        }
    };
    GOODDETAIL.init();
})