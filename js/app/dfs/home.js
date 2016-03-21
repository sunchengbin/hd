/**
 * Created by sunchengbin on 15/11/5.
 */
require(['buyplug','token','dialog','zepto','loading','slide','homenav','lazyload','base','config','gotop','cart','weixin'],function(buyplug,token,dialog,zepto,loading,slide,homenav,lazyload,base,config,gotop,cart,weixin){
    var ACTDETAIL = {
        init : function(){
            var _this = this;
            _this.page = 1;
            _this.getActInfo(1,function(error){
                if(error){
                    _this.getActInfo(1);
                }
            });
            _this.handleFn();
        },
        handleFn : function(){
            var _this = this;
            $('.j_wraper').on('click','.j_look',function () {
                dialog.alert({
                    body_txt: '<div><img class="contact-wx" src="../../images/dnf/contact-wx.jpg"/></div>',
                    is_cover: true,
                    width:300
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
        getActInfo : function(){
            var _this = this;
            var res = {"detail":{"total":22,"goodsList":[{"id":55268,"description":"*TOP1:*雪花秀最！最！最！明星的产品，一年卖出几十万套，补水、滋养、嫩滑肌肤顶级棒，没有之一。","name":"雪花秀/Sulwhasoo 滋阴肌本平衡水乳套装","priceList":{"curLocal":{"symbol":"₩","price":90699,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":510,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":560,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":840,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/eb17874ac9af9d0641b75b86a6.jpg","isSoldOut":"N"},{"id":43074,"description":"*TOP2：*面膜界永居琅琊榜首，免税店平均一分钟卖出6百片，一年四季补水全靠它。睡前贴一片，第二天超级水嘟嘟。","name":"可莱丝/MEDIHEAL NMF针剂补水保湿面膜10片","priceList":{"curLocal":{"symbol":"₩","price":12983,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":73,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":120,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":189,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/15/1/af7e6f4f14a8aa579b06bc46ba.jpg","isSoldOut":"N"},{"id":61423,"description":"*TOP3：*后品牌的热卖王。代购在免税店的必败品。只需一星期，就能为皮肤带来充足的营养和保湿效果。其秘丹成分能够渗透至肌肤深处，为你打造出娇嫩无比的美丽肌肤。","name":"后/The history of whoo 拱辰享阴阳套装","priceList":{"curLocal":{"symbol":"₩","price":116486,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":655,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":824,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":1220,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/f1dfe44c91b57f22c409fdc9e6.jpg","isSoldOut":"N"},{"id":32207,"description":"*TOP4：*:这款霜称得上韩国的传奇，不断被回购，永不被超越。蜗牛精华能够淡化痘印，修复痘肌。同时还含有大量的胶原蛋白和高效的抗皱精华，深层滋养和保湿的同时能让皮肤柔软细腻充满弹力。修复痘印的同时还有神奇的美白功效。","name":"伊思/IT'S SKIN 晶钻蜗牛霜60ml","priceList":{"curLocal":{"symbol":"₩","price":38236,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":215,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":300,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":419,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/3/1/7206b848e4ad9cf8bc0c67e377.jpg","isSoldOut":"N"},{"id":13947,"description":"*TOP5：*真是不用不知道，一用吓一跳，绝对完胜市面上各种卸妆产品。涂上之后1分钟轻松卸干净全脸，就连最难卸眼妆也都不是事儿。而且，清水一洗，脸上就超级干净，不像植村秀的某某，总像糊了一层油洗不掉的感觉。","name":"芭妮兰/banila co. 致柔卸妆膏霜100ml","priceList":{"curLocal":{"symbol":"₩","price":13339,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":75,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":85,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":164,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/5c541a4fbe9931b3bb891c78fc.jpg","isSoldOut":"N"},{"id":55264,"description":"TOP6：*别看包装这么低调，简直是精华界的劳斯莱斯。免税店要是下午去基本都会断货。坚持使用两个星期，皮肤会明显变得润泽光亮。他的保湿滋润成分能够渗入干燥的肌肤深层，让肌肤水分饱满充盈。","name":"雪花秀/Sulwhasoo 润致优活肌底精华露90ml","priceList":{"curLocal":{"symbol":"₩","price":91055,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":512,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":569,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":840,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/25/2/8e648582942011e5a78a525400199935.jpg","isSoldOut":"N"},{"id":63459,"description":"*TOP7：*韩国斩获多项大奖的气垫BB，每30秒就卖出一个的明星单品，自然色C21，遮瑕、轻薄、防晒、 美白、 保湿 ，五合一。这个色号绝对堪称免税店的彩妆售卖王。","name":"赫拉/HERA 保湿气垫BB霜 C21","priceList":{"curLocal":{"symbol":"₩","price":32012,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":180,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":498,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/9f2fd94f2297fd1769ae726ab8.jpg","isSoldOut":"N"},{"id":23372,"description":"*TOP8：*11月份的小黑马，火爆全网的素颜霜！当日常面霜，抹上立即换脸，非常自然由内而外的透亮、嫩白。遮瑕膏、粉底液统统扔掉，不用再化妆了，关键不！用！卸！妆！","name":"蒂佳婷/Dr.Jart+ V7保湿美白淡斑润肤霜50ml","priceList":{"curLocal":{"symbol":"₩","price":33079,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":186,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":243,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":319,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/d2b609473ba7550830f98b6e7d.jpg","isSoldOut":"N"},{"id":63315,"description":"*TOP9：*免税店经常断货，性价比超级高。最大的卖点在于洗护二合一，比洗发水清洁力更强，比护发素更滋养。据说富含100多种中草药，但味道却像CHANEL COCO，洗完非常顺滑，而且深层滋养头皮，加强毛囊健康。","name":"LG润膏/ReEn 无硅洗护合一洗发水","priceList":{"curLocal":{"symbol":"₩","price":8003,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":45,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":69,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":89,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/3/1/3d1fca46919724fdea5bb7a129.jpg","isSoldOut":"N"},{"id":55274,"description":"*TOP10：*别看名字这么不起眼，但韩国几乎明星必备。熬夜、憔悴没关系，只要睡前敷上一层，第二天起来，你真的会吓到，内里透出自然光泽。 其各种草药滋养成分能于肌肤表面形成保湿膜，入睡休息时源源渗透进皮肤，快速补充营养和水分的同时，白皙度光亮度大大提升。","name":"雪花秀/Sulwhasoo 雨润睡眠修复面膜120ml","priceList":{"curLocal":{"symbol":"₩","price":39303,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":221,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":246,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":380,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/25/2/8e68c35e942011e5a78a525400199935.jpg","isSoldOut":"N"},{"id":61420,"description":"*TOP11：*强化保湿、收缩毛孔、胶原再生，三合一。金喜善强力推荐。它从皮肤深层开始保湿，增强细胞活性，重塑肌肤，让肌肤自己解决干燥、松弛、暗沉。坚持使用一个月，另肌肤恢复婴儿般新生状态。","name":"后/The history of whoo 密贴自生精华套装","priceList":{"curLocal":{"symbol":"₩","price":144052,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":810,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":887,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":1450,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/15/1/0bc0b64c87b7784a02a0e32a28.jpg","isSoldOut":"N"},{"id":10726,"description":"“TOP12：”《来自星星的你》多次出现，斩获各项杂志大奖。富含澳洲坚果精华、蜂胶和玫瑰花油，修复受损发质，维持头发的适当的湿度，经常使用能令你的秀发丰盈飘逸、易于梳理、柔顺爽滑闪亮动人光泽。","name":" 爱茉莉/mise en scene 美仙玫瑰橄榄蜂蜜护发精油免洗70ml","priceList":{"curLocal":{"symbol":"₩","price":8003,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":45,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":70,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":79,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/25/2/8e677576942011e5a78a525400199935.jpg","isSoldOut":"N"},{"id":36773,"description":"“TOP13：”韩国人手一款的睡眠面膜，在夜间新陈代谢活跃、吸收力好的时间为肌肤导入源源不断的水分。一觉醒来，肌肤光滑水嫩，润泽有弹性，一种宛若新生的感觉！","name":"兰芝/LANEIGE 夜间修护睡眠面膜70ml","priceList":{"curLocal":{"symbol":"₩","price":22764,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":128,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":134,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":208,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/abd836474c958162184adad67d.jpg","isSoldOut":"N"},{"id":29541,"description":"“TOP14：”这款霜简直是奇迹中的奇迹，能保持72小时补水，从2013年火到2015年。淡斑 细腻肌肤 保湿 滋养 抗皱 美白 提亮 ，一瓶解决肌肤七大问题。对于淡化疤痕也有很好的效果。","name":"Guerisson 奇迹马油70g","priceList":{"curLocal":{"symbol":"₩","price":12627,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":71,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":178,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":189,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/25/2/8e6b8e2c942011e5a78a525400199935.jpg","isSoldOut":"N"},{"id":55260,"description":"”TOP15：“闺蜜们口口相传的护肤法宝，比任何洁面乳都好用百倍。韩方药妆，40天手工熬制，选取珍贵原材料，洁肤效果超级赞，顽固污垢黑头统统不见，用完后皮肤水水嫩嫩。净化排毒，重现无暇肌肤。","name":"雪花秀/Sulwhasoo 宫中秘皂 100g*2套盒","priceList":{"curLocal":{"symbol":"₩","price":32012,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":180,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":200,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":332,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/15/1/b4ef1e40d28a1acef2721b1095.jpg","isSoldOut":"N"},{"id":63354,"description":"”TOP16：“李小璐、郭富城、范冰冰太多推荐，仿人皮面膜材质，羊胎盘素植入皮肤基底，连用三天等于打了水光针的效果。让你轻松拥有婴儿般水嫩、白皙、光滑。如果害怕打针，那就来试试这个吧。","name":"JAYJUN 水光针补水玻尿酸面膜10片","priceList":{"curLocal":{"symbol":"₩","price":16895,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":95,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":129,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":199,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/14/1/726de34f5ca15bc2401b5b38c9.jpg","isSoldOut":"N"},{"id":61426,"description":"TOP16：“后的最高端护理产品，以其独有专利配以36种中草药研制而成。富含细胞生长因子，深入肌底，改善暗沉肤色，提亮肌肤，从根本上解决肌肤水油平衡问题，促进肌肤细胞的迅速代谢和再生，年轻10岁，还你少女般白嫩肌肤。好用到只能用逆天来形容了。","name":"后/The history of whoo 天气丹 华泫/花献套装","priceList":{"curLocal":{"symbol":"₩","price":241509,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":1358,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":1483,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":2699,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/15/1/b06d724795b4c27091bad69305.jpg","isSoldOut":"N"},{"id":63314,"description":"”TOP17：“韩国姑娘化妆包的必备，口碑好到无人能敌，简直就是暗黄肤色的大救星！一瓶三用，做妆前乳解决上妆干燥问题；做高光液，能够让大平脸变得立体；混合粉底使用，肌肤就像是从肌层自然透出的光泽，通透亮白！韩星上妆都会使用它哦~","name":"薇蒂艾儿/VDL 贝壳提亮液/妆前乳30ml","priceList":{"curLocal":{"symbol":"₩","price":15828,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":89,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":168,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":188,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/26/1/7d5e4c411db376d15fe5091755.jpg","isSoldOut":"N"},{"id":54216,"description":"”TOP18：“SNP是韩国第一药妆，这个面膜也是韩国”膜“界神话。富含70%金丝燕窝萃取精华，超强的保湿锁水力和肌肤修护力。在帝都的冬天，快要干成狗的你，只要敷上一片，奇迹发生了，就像肌肤大口大口喝饱了水，而且其超强锁水能力能保持24H不缺水。","name":"SNP燕窝海洋水库面膜10片","priceList":{"curLocal":{"symbol":"₩","price":12983,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":73,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":122,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":159,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/25/2/8e699824942011e5a78a525400199935.jpg","isSoldOut":"N"},{"id":36783,"description":"”TOP19：“这个月新上榜。气味超好闻，唇部干燥、起皮、无水分的克星，晚上睡前敷上一层第二天起来唇纹不见啦，水水润润滴，嫩红嫩红，让人看了就想咬一口。还有去死皮功效哦！","name":"兰芝/LANEIGE 草莓果冻睡眠唇膜20g","priceList":{"curLocal":{"symbol":"₩","price":14050,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":79,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":84,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":139,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/11/25/2/8e6e10d4942011e5a78a525400199935.jpg","isSoldOut":"N"},{"id":63422,"description":"”TOP20：“韩国面膜界最大的一匹黑马，太火太火太火了。87%的蜂蜜原液，深层补水美白，去除老化污垢，促进细胞再生，集中补给营养，特别轻薄的面膜纸敷上，肌肤就像涂了蜜汁一般，摘下时会让你忍不住惊叫，皮肤如此细嫩之极，简直是太神奇了！","name":"papa recipe 春雨蜂蜜保湿补水面膜10片","priceList":{"curLocal":{"symbol":"₩","price":11916,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":67,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":99,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":149,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/23/1/abc61341cc8c4c8818ed55eb03.jpg","isSoldOut":"N"},{"id":63480,"description":"头发干枯毛躁，该吃燕窝补补啦！升级版ReEn燕窝润膏，添加滋补圣品—燕窝，遵循“蒸”9次+“干”9次古方制法，从发芯开始养护，拒绝断发毛躁，一支就能见效！安娜苏许愿精灵香味，一闻就忘不了。","name":"LG润膏/ReEn 燕窝无硅洗护合一洗发水","priceList":{"curLocal":{"symbol":"₩","price":8715,"name":"韩元","enName":"KRW"},"curRmb":{"symbol":"￥","price":49,"name":"人民币","enName":"RMB"},"local":{"symbol":"￥","price":59,"name":"人民币","enName":"RMB"},"domestic":{"symbol":"￥","price":89,"name":"人民币","enName":"RMB"}},"logoUrl":"http://img.hdour.com/goods/2015/12/25/1/19fbf04f6485d718c662b680ae.jpg","isSoldOut":"N"}],"page":1,"act":{"id":10015,"pics":["http://img.hdour.com/act/2015/12/23/1/9229b94dcea0e1ce438726a38d.jpg"],"description":"韩国乐天免税店热卖排行榜出来了，*全部成本价，骗你剁手*，手快有，手慢无，再不抢就没有啦！","name":"15年销量排行榜"}},"errmsg":"ok","errcode":0};
            console.log(res);
            $('.j_wraper').html(_this.createDetailHtm(res.detail));
            lazyload.init();
        },
        createDetailHtm : function(actinfo){
            var _htm = '',
                _this = this;
            _htm += '<ul class="good-list j_g_l j_ul '+(actinfo.act.description && actinfo.act.id == 10015?'hide':'')+' clearfix">'
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
                    + '<a class="block" href="good_detail.html?goodid='+item.id+'">'
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
                    _curRmb = _pric.curRmb?_pric.curRmb:{symbol:'￥',price:0},
                    _domestic = (_pric.domestic && _pric.domestic.price)?_pric.domestic:{symbol:'￥',price:_curRmb.price},
                    _gain = Number(_domestic.price - _curRmb.price);
                _htm+='<li data-id="'+item.id+'">'
                    +'<a class="block j_look" href="javascript:;">';
                if(item.isSoldOut == 'Y'){
                    _htm+='<div class="li-sold-out">已售罄</div>';
                }
                _htm+='<div class="img" data-img="'+item.logoUrl+'"></div>'
                    +'<div class="good-info">'
                    +'<p class="good-name">'+item.name+'</p>'
                    +'<p class="good-price"><em>'+(_curRmb.symbol?_curRmb.symbol:'￥')+_curRmb.price+'</em><i class="price">'+_domestic.symbol+_domestic.price+'</i><span class="bk j_look">去看看</span></p>'
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
