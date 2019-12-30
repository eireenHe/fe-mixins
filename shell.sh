#!/bin/sh
##### 更新项目名称 #####
#
#
# 项目根目录，进行fe-quick-cms-spa替换
# 执行脚本输入更新名称即可
#
##### 更新项目名称  #####
read -p "请输入新项目名称:" name oldname
if [[ ! -n $oldname ]]; then
  oldname="fe-gps-data-analysis"
fi
echo "新项目名称："$name
echo "已替换名称："$oldname
if [[ $name =~ [a-zA-Z0-9_-]{3,} ]]; then
  cat settings.json > settings-bak.json
  echo "更新后项目名称为${name}"
  sed 's/'$oldname'/'$name'/g' settings.json > settings-final.json
  cp settings-final.json settings.json
  rm settings-final.json
else
  echo "请输入合法名称"
fi