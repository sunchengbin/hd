/**
 * Created by sunchengbin on 15/11/4.
 */
define([],function(){
    var TCONFIG = {
        woman : {
            one : ['美艳赶超杀阡陌','傲视群芳赞压摞','您老兰芝手中藏','羽化成仙六界忙'],
            two : ['气场盖过芈太后','身材还是高显瘦','妆不够，赫拉凑','分钟秒掉小鲜肉'],
            three : ['魔眼神，红嘴唇','娇羞面容没皱纹','美颜不靠吹','超越太子妃','男神女神排成堆'],
            four : ['没有小蛮腰','全是五花膘','不想韩国挨把刀','小白免税有高招'],
            five : ['貌美似如花','当妈肥掉渣','赚钱要为自己花','整套面膜抱回家']
        },
        man : {
            one : ['气场堪比义渠王','爱嘶吼，头发长','用过红吕','duang~duang~duang'],
            two : ['你就是我的梅郎','咳声长，脸焦黄','伊思面膜','秒靖王'],
            three : ['飘逸胜过白子画','没有胸，怀天下','悦诗风吟','了牵挂'],
            four : ['三餐猪肉加啤酒','女神见你绕道走','雪花秀要不行','得上嵩山去修行'],
            five : ['撞脸不可怕','就怕撞脸有文化','像沈阳，声还娘','不去韩国心要凉']
        },
        getRemark : function(sex){
            var _this = this,
                ranking = Math.ceil(Math.random()*10);
            if(sex == '女'){
                if(ranking >= 0){
                    if(ranking < 2){
                        return  _this.woman.five;
                    }else{
                        if(ranking < 4 ){
                            return  _this.woman.four;
                        } else{
                            if(ranking < 6 ){
                                return  _this.woman.three;
                            } else{
                                if(ranking < 8 ){
                                    return  _this.woman.two;
                                } else{
                                    return  _this.woman.one;
                                }
                            }
                        }
                    }
                }
            }else{
                if(ranking >= 0){
                    if(ranking < 2){
                        return  _this.man.five;
                    }else{
                        if(ranking < 4 ){
                            return  _this.man.four;
                        } else{
                            if(ranking < 6 ){
                                return  _this.man.three;
                            } else{
                                if(ranking < 8 ){
                                    return  _this.man.two;
                                } else{
                                    return  _this.man.one;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    return TCONFIG;
})
