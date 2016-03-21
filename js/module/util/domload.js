/**
 * Created by sunchengbin on 15/11/1.
 */
define([],function(){
    var DOMLOAD = {
        loadNum : 0,
        loading : function(n){
            if (!isNaN(n) && n < 0 && --this.loadingNumber <= 0) {
                this.loadingNumber = 0;
                $('#loading').remove();
            } else {
                if (isNaN(n) || n > 0) {
                    this.loadingNumber++;
                }
                if ($('#loading').length == 0) {
                    $('body').append('<div id="loading"></div>');
                }
            }
        }
    };
    return DOMLOAD;
})
