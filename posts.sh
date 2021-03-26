#!/usr/bin/env sh
echo "输入文件名？(Name.md)"   
# read  REPLY 
#     echo ""
#     echo ""

    # 创建文件
    fileDate=$(date +%Y-%m-%d)
    echo "正在创建$fileDate-$1.md..."
    
    # 进入制定目录
    cd content/posts/
    touch $fileDate-$1.md