/**
 * Created by sunchengbin on 15/11/3.
 */
define(['dialog','zepto'],function(dialog,zepto){
    var LOAD_DIALOG = {
        domLoading : function(){
            var _dh = $(document).height(),
                _wh = $(window).height(),
                _ch = _dh > _wh?_dh:_wh;
            var _loading = dialog.loading({
                body_txt: '<div id="loading"><div class="circles-loader"></div></div>',
                wraper_css : {
                    top : 0,
                    left : 0,
                    width : '100%',
                    height: _ch
                },
                is_cover : false
            });
            return _loading;
        },
        ajaxWaiting : function(){
            var _dh = $(document).height(),
                _wh = $(window).height(),
                _ch = _dh > _wh?_dh:_wh;
            var _waiting = dialog.loading({
                body_txt: '<div class="waiting"><div class="circles-loader"></div></div>',
                wraper_css : {
                    top : 0,
                    left : 0,
                    width : '100%',
                    height: _ch,
                    backgroundColor:'transparent'
                },
                is_cover : true,
                cover_css : {
                    backgroundColor : 'rgba(255,255,255,0.2)'
                }
            });
            return _waiting;
        }
    };
    return LOAD_DIALOG;
})
