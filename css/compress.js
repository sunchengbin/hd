var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var fileName = process.argv[2];
var platform = process.platform;

function setBuild(){
    fs.readFile('build.js','utf-8',function(err,data){
        var obj = JSON.parse(data);
        var f_obj = '('+JSON.stringify(obj)+')';
        fs.writeFile('optimize.js',f_obj,function(){
            console.log('开始压缩------>')
            var sh_order = platform.indexOf('win32') != -1 || platform.indexOf('win64') != -1 ? 'csscompress.sh '+fileName : 'sh csscompress.sh '+fileName;
            child_process.exec(sh_order,function(err,stdout,stderr){
                if(err){
                    console.log('err:'+err);
                }
                else {
                    console.log(arguments[1])
                }
            })
        })
    })
}
setBuild();