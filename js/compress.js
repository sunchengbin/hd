var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var fileName = process.argv[2];
var platform = process.platform;
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var count = list.length;
        if (!count) return done(null, results);
        list.forEach(function(file) {
            //file = path.resolve(dir, file);
            file = dir +'/'+file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--count) done(null, results);
                    });
                } else {
                    var rs = path.normalize(file);
                    results.push(rs);
                    if (!--count) done(null, results);
                }
            });
        });
    });
};

if(fileName.indexOf('.js') != -1){
    var modules = [];
    modules.push({name : fileName.replace(/.js/g,'')})
    setBuild(modules);
}else{
    walk(fileName,function(err,list){
        var modules = [];
        list.forEach(function(item){
            if(item.indexOf('.js') != -1) {
                var m_path = item.replace(/\\\\/g, '\/');
                m_path = m_path.replace(/\\/g, '\/');
                m_path = m_path.replace(/.js/g, '');
                modules.push({name: m_path});
            }
        })
        setBuild(modules);
    })
}
function setBuild(modules){
    fs.readFile('build.js','utf-8',function(err,data){
        var obj = JSON.parse(data);
        obj.modules = modules;
        var f_obj = '('+JSON.stringify(obj)+')';
        fs.writeFile('optimize.js',f_obj,function(){
            console.log('开始压缩------>')
            var sh_order = platform.indexOf('win32') != -1 || platform.indexOf('win64') != -1 ? 'jscompress.sh '+fileName : 'sh jscompress.sh '+fileName;
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