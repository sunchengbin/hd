/**
 * Created by sunchengbin on 16/1/15.
 */
//个人用户
require(['zepto','token','dialog','config','base','fastclick','weixin','actconfig','loading'],function(zepto,token,dialog,config,base,fastclick,weixin,actconfig,loading) {
    fastclick.attach(document.body);
    var domloading = loading.domLoading();
    var ATU = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    _this.getUserInfo(function(){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: '小白免税为你的气质买单',
                                desc: '小伙伴们快去找好友加气质,赢取韩国化妆品',
                                link: location.href,
                                imgUrl: 'http://s.hdour.com/images/logo.jpg',
                                success: function() {
                                    //alert('分享成功');
                                },
                                cancel: function() {}
                            });
                        },'acttemuserlist');
                    });
                },
                type:'acttemuserlist'
            });
        },
        getUserInfo:function(callback){
            var _this = this;
            $.ajax({
                url : config.HOST + config.ACTIONS.actTemperHistory,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data:JSON.stringify({
                    page:1,
                    pageSize:20
                }),
                success: function (res) {
                    if (res.errcode == 0) {
                        $('.j_wraper').html(_this.getHtml(res.detail),'true');
                        domloading.remove();
                        callback && callback();
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
                    window.location.reload();
                }
            });
        },
        getHtml : function(res,isself){
            var _htm = '',
                _this = this;

            _htm+='<img src="../../images/act/ranking_list_title.jpg"/>';
            _htm+='<p class="btn-wraper clearfix">'
                +'<a href="act_temperament_user.html" class="right-btn"></a>'
                +'</p>';
            //_htm+='<p class="ranking-title">'
            //    +'<a href="act_temperament_user.html" class="">我也要参加</a>'
            //    +'</p>';
            if(res.rankList.length){
                _htm+='<img src="../../images/act/ranking_title.png"/>'
                    +'<div class="txt-cont">'
                    +'<span class="angle-s"></span>'
                    +'<p class="clearfix"><em class="fr">排名</em></p>'
                    +'<ul class="list-rank">'
                    +_this.getUsersList(res.rankList)
                    +'</ul>'
                        //+'<a href="javascript:;" class="get-more block">查看更多</a>'
                    +'</div>';
            }
            _htm+='<img src="../../images/act/act_list.png"/>'
                +'<div class="txt-cont act-wraper">'
                +'<span class="angle-s"></span>'
                +'<div class="clearfix txt-d">'
                +'<em class="">1</em>'
                +'<p>2月4日20:00 ~ 2月14日22:00活动期间,气质排行榜前20的朋友都会获得奖品哦</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">2</em>'
                +'<p>第一名:雪花秀滋阴套盒一份</p>'
                +'<p>第二名:赫拉气垫C21一份</p>'
                +'<p>第三名:雪花秀玉荣撕拉面膜一份</p>'
                +'<p>第四名:兰芝睡眠面膜一份</p>'
                +'<p>第五名:九朵云奇迹马油一份</p>'
                +'<p>第六名:水光针面膜一份</p>'
                +'<p>第七名:芭妮兰卸妆膏一份</p>'
                +'<p>第八名:雨润面膜一份</p>'
                +'<p>第九名:无硅润膏一份</p>'
                +'<p>第十 ~ 二十名:神秘礼品一份</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">3</em>'
                +'<p>活动结束后:客服小白会联系获奖者领取奖品,获奖者也可主动联系客服小白哦</p>'
                +'</div>'
                +'<p>长按识别二维码联系客服小白</p>'
                +'<div class="wx-er">'
                +'<img src="../../images/service/find_ser_er.jpg"/>'
                +'</div>'
                +'</div>';
            _htm+='<img src="../../images/act/about_top.png"/>'
                +'<a class="block" href="http://s.hdour.com">'
                +'<img src="../../images/act/go_shop.png">'
                +'</a>'
                +'<p class="footer-p">活动最终解释权归北京海兜科技有限公司所有</p>';
            return _htm;
        },
        getUsersList : function(child){
            var _htm = '';
            if(!child.length){
                _htm+='<li class="clearfix">'
                    +'<p class="no-user">还没有人给你加气质哦</p>'
                    +'<p class="no-user">快分享给好友让他们帮你加气质哦</p>'
                    +'</li>';
            }else{
                $.each(child,function(i,item){
                    if(!item.name){
                        item.name = '神秘游客';
                        item.rank = item.rank?item.rank:'无';
                    }
                    _htm+='<li class="clearfix"><a href="act_temperament_user.html?pid='+item.userId+'" class="">'
                        +'<img src="'+(item.portraitUrl?item.portraitUrl:'../../images/service/ser1.jpg')+'"/>'
                        +'<div>'
                        +'<p>'+item.name+'<em>(气质点'+item.childCount+')</em><em class="fr">'+item.rank+'</em></p>'
                        +'</div></a>'
                        +'</li>';
                });
            }
            return _htm;
        }
    };
    ATU.init();
})
