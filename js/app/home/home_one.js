
/**
 * Created by sunchengbin on 15/11/2.
 */
require(['token','dialog','zepto','loading','searchplug','homenav','lazyload','config','weixin','gotop','base'],function(token,dialog,zepto,loading,searchplug,homenav,lazyload,config,weixin,gotop,base){
    var domloading = loading.domLoading();
    var ACT_HOME = {
        init : function(){
            var _this = this;
            _this.actioning = true;
            _this.page = 1;
            token.init({
                callback : function(){
                    searchplug.init('.j_home_common','','home');
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
                //wxcallback : function(){},
                noToken : true,
                type : 'home'
            });
        },
        getActs : function(){
            var _this = this;
            _this.getActFn(1,function(error){
                if(error){
                    _this.getActs();
                }
            },function(opts){
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
                },'gooddetail');
            });
        },
        getActFn : function(page,callback,wxcallback){
            var _this = this,
                _code = base.others.getUrlPrem('code'),
                _parentid = base.others.getUrlPrem('sparentid'),
                _user_info = localStorage.getItem('USERINFO'),
                _childid = _user_info?JSON.parse(_user_info).token.userId:null,
                _data = {
                    page:page,
                    pageSize:30
                },
                _action_url = config.HOST+config.ACTIONS.actLists+'?code='+_code+'&parentId='+_parentid+'&childId='+_childid;
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
                    request.setRequestHeader("X-Access-Token",localStorage.getItem('TOKEN'));
                },
                data:JSON.stringify(_data),
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
                            $('.j_home_common').append(_this.createTopHtm());
                            $('.j_wraper').html(_this.createHomeHtm(res.detail.acts));
                            homenav.init('home');
                            lazyload.init();
                            domloading.remove();
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
                            wxcallback && wxcallback({
                                link : _link
                            });
                        }
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
                    if(page > 1){
                        callback && callback('error');
                    }else{
                        dialog.alert({
                            body_txt: '网络出问题了请点击确定,重新加载.',
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
                    }
                }
            });
        },
        createTopHtm : function(){
            var _htm = '';
            _htm+='<a href="'+config.URLHOST+'act_detail.html?actid=10001" class="block">'
                +'<img src="http://s.hdour.com/images/act/home_1.jpg">'
                +'</a>'
                +'<img src="http://s.hdour.com/images/act/slogn.jpg">'
                +'<a href="'+config.URLHOST+'act_detail.html?actid=10015" class="block">'
                +'<img src="http://s.hdour.com/images/act/home_2.jpg">'
                +'</a>'
                +'<div class="hot-good-wraper">'
                +'<a class="block good-one" href="'+config.URLHOST+'good_detail.html?goodid=55268">'
                +'<p class="good-title">雪花秀滋阴水乳两件套</p>'
                +'<p class="good-price"><em>￥</em>619<em class="bk">惊爆价</em></p>'
                +'</a>'
                +'<div class="good-next">'
                +'<a class="block good-two" href="'+config.URLHOST+'good_detail.html?goodid=61423">'
                +'<p class="good-title">后拱振享套装</p>'
                +'<p class="good-price"><em>￥</em>749<em class="bk">惊爆价</em></p>'
                +'</a>'
                +'<div class="good-next-n">'
                +'<a class="block good-three" href="'+config.URLHOST+'good_detail.html?goodid=13947">'
                +'<p class="good-title">芭妮兰卸妆膏</p>'
                +'<p class="good-price"><em>￥</em>87</p>'
                +'<p class="good-title"><em class="bk">惊爆价</em></p>'
                +'</a>'
                +'<a class="block good-four" href="'+config.URLHOST+'good_detail.html?goodid=63422">'
                +'<p class="good-title">春雨蜂蜜面膜</p>'
                +'<p class="good-price"><em>￥</em>106</p>'
                +'<p class="good-title"><em class="bk">惊爆价</em></p>'
                +'</a>'
                +'</div>'
                +'</div>'
                +'</div>';
            return _htm;
        },
        createHomeHtm : function(acts){
            var _htm='',
                _this = this;
            _htm += '<div class="act-wraper">'
                +_this.createActsHtm(acts)
                +'</div>';
            return _htm;
        },
        createActsHtm : function(acts){
            var _htm = '';
            $.each(acts,function(i,item){
                _htm+='<div class="one-act" data-act-id="'+item.actId+'">'
                    +'<a href="'+config.URLHOST+'act_detail.html?actid='+item.actId+'" class="block">'
                    +'<img class="" data-img="'+(item.actPics?item.actPics[0]:'../images/huodong-banner.jpg')+'"/>'
                    +'</a>'
                    +'</div>';
            });
            return _htm;
        }
    };
    ACT_HOME.init();
})