/**
 * Created by sunchengbin on 15/11/4.
 */
define(['zepto','config','weixin','base','dialog','gotop'],function(zepto,config,weixin,base,dialog,gotop){
    var TOKEN = {
        init : function(opts){
            var _this = this,
                _code = base.others.getUrlPrem('code');
            if (!localStorage.getItem('CITY')) {
                localStorage.setItem('CITY', config.CITY);
            }
            //localStorage.clear();
            //localStorage.setItem('TOKEN','32-a506-a36f103cd89d');
            //alert(localStorage.getItem('USERINFO'))
            if(!weixin.isWeixin) {
                location.href = config.NOWEIXINURL();
                return false;
            }else{
                if(opts.noToken){
                    if(!localStorage.getItem('TOKEN')){
                        if(_code){
                            opts.code = _code;
                        }else{
                            location.href = config.NOWEIXINURL();
                            return false;
                        }
                    }
                    _this.wxInit(opts);
                }else{
                    if(!localStorage.getItem('TOKEN')) {//用于验证是否登录
                        if(_code){
                            $.ajax({
                                url: config.HOST + config.ACTIONS.getToken,
                                type: 'GET',
                                data: {
                                    code: _code
                                },
                                dataType: 'json',
                                success: function (res) {
                                    if (res.errcode == 0){
                                        var TOKEN_ERROR = localStorage.getItem('TOKEN_ERROR');
                                        if(TOKEN_ERROR){
                                            localStorage.removeItem('TOKEN_ERROR');
                                        }
                                        _this.saveToken(res.detail.token.token);
                                        localStorage.setItem('USERINFO', JSON.stringify(res.detail));
                                        setTimeout(function(){
                                            _this.wxInit(opts);
                                        },0);
                                    } else {
                                        _this.errorFn();
                                    }
                                },
                                error:function(){
                                    _this.errorFn();
                                }
                            });
                        }else{
                            location.href = config.NOWEIXINURL();
                            return false;
                        }
                    }else{
                        _this.wxInit(opts);
                    }
                }
            }
        },
        saveToken : function(token){
            window.localStorage.setItem('TOKEN',token);
        },
        wxInit : function(opts){
            var _this = this;
            weixin.init(function() {
                opts.callback && opts.callback(opts);
            },function(){
                //opts.wxcallback && weixin.wxinit(opts.wxcallback,opts.type);
                !opts.type && weixin.wxinit(opts.wxcallback,opts.type);
            });
            setTimeout(function(){
                _this.isConcern();
            },200);
        },
        isConcern : function(){
            var _this = this,
                _user_info = localStorage.getItem('USERINFO'),
                _self_id = _user_info?JSON.parse(_user_info).token.userId:10021,
                _data = {
                    id : _self_id
                };
            if(!_self_id){
                return false;
            }
            $.ajax({
                url: config.HOST + config.ACTIONS.isConcern,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                data: JSON.stringify(_data),
                success: function (res) {
                    var _htm = '<a href="'+config.URLHOST+'offic_qrcode.html" class="block is-concern-a"><div class="is-concern">关注小白免税,随时获得优惠信息<span>关注</span></div></a>';
                    if (res.errcode == 0){
                        if(res.detail.complete == 'false'){
                            $('body').prepend(_htm);
                        }

                    } else {
                        _this.errorFn();
                    }
                },
                error:function(){
                    _this.errorFn();
                }
            });
        },
        errorFn : function(){
            var TOKEN_ERROR = localStorage.getItem('TOKEN_ERROR');
            if(TOKEN_ERROR){
                TOKEN_ERROR++;
                localStorage.setItem('TOKEN_ERROR',TOKEN_ERROR);
                if(TOKEN_ERROR > 3){
                    dialog.alert({
                        body_txt: '微信网络忙,关闭窗口,重新进入',
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
                }else{
                    window.location.reload();
                }

            }else{
                localStorage.setItem('TOKEN_ERROR',1);
                window.location.reload();
            }
        },
        reloadToken : function(res,callback){
            if(res.errcode = 201){
                localStorage.removeItem('TOKEN');
                this.errorFn();
            }else{
                callback && callback();
            }
        }
    };
    return TOKEN;
})