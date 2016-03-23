/**
 * Created by sunchengbin on 15/12/28.
 */
define(['zepto','config'],function(zepto,config){
    var V_I = {
        getUserList : function(users){
            if(!users || !users.length){
                return  '<div class="no-good">'
                    +'<i class=""></i>'
                    +'<p>没有人关注哦</p>'
                    +'</div>';
            }
            var _htm ='<ul class="user-list">'
                +this.createListHtm(users)
                +'</ul>';
            return _htm;
        },
        createListHtm : function(users){
            var _htm = '';
            if(!users.length){
                return '';
            }
            $.each(users,function(i,user){
                _htm += '<li class="clearfix" id="'+user.childId+'">'
                    +'<img src="'+(user.portraitUrl?user.portraitUrl:config.IMGHOST+'images/icon/default_user.png')+'" class="fl"/>'
                    +'<div class="user-list-info" style="height: 40px;line-height: 40px;">'
                        //+'<p>'
                        //+(user.userName?user.userName:'游客')
                        //+'</p>'
                    +'<p class="clearfix">'
                    +(user.nickName?user.nickName:'游客')
                        //+(user.orderCount?'订单数:'+user.orderCount:'')
                    +'<em class="fr price">消费金额:'+user.total+'</em>'
                    +'</p>'
                    +'</div>'
                    +'</li>';
            });
            return _htm;
        }
    };
    return V_I;
})
