#! /bin/bash
if [ $1 ]
    then
        echo $1
        echo "------开始压缩-----"
        node r.js -o optimize.js
        echo ${node}
        echo "------处理指定目录------"
        echo "-----打包已压缩文件-----"
        cd compress/
        tar -cvf ../compress.tar $1
        echo "-----处理已压缩文件-----"
        cd ../dist
        tar -xvf ../compress.tar
        cd ../
        echo "-----清除临时文件-----"
        /bin/rm -rf compress.tar
        /bin/rm -rf compress
        /bin/rm optimize.js
        echo "-----压缩完毕-----"
else
    echo "error:请输入要压缩的js目录名"
fi