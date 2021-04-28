---
title: "CentOS上安装nvm"
date: 2021-04-20T22:14:43+08:00
draft: false
tags:
 - nvm
 - linux
---
## CentOS上安装nvm
1. 先安装curl,标准CentOS库中提供了Curl软件包
```shell
sudo dnf install curl
```
2. 安装[nvm](https://github.com/nvm-sh/nvm)
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
3. 配置`~/.bashrc`或`~/.bash_profile`
```shell
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
4. 使配置生效
- bash: `source ~/.bashrc`
- zsh: `source ~/.zshrc`
  
## nvm常用命令
- `nvm --version` 查看nvm版本
- `nvm ls` 查看已安装的node版本
- `nvm current` 查看当前使用的node版本
- `nvm use 12`切换node版本到12
- `nvm ls-remote --lts`查看远端node lts版本
- `nvm install 10.16.3` 安装该版本node
- `nvm install stable` 安装最新稳定版本


## npm
- `npm config list`查看  list-简写ls
- `npm config set registry  https://registry.npmjs.org` 切换为原始源
- npm config set registry https://registry.npmjs.org
- npm config set registry https://registry.npm.taobao.org 淘宝源
- `sass-binary-site=https://npm.taobao.org/mirrors/node-sass`

## yarn
- `curl -o- -L https://yarnpkg.com/install.sh | bash` CentOS上安装yarn
- `yarn config get registry` --> https://registry.yarnpkg.com
- `vi` `touch`会自动创建,可编辑  `cat`不会自动创建,只能查看

cp -r node_modules/ ../appdata_web_dev/

```
- whereis node
[qimai@dev workspace]$ sudo -s
[root@dev workspace]# whereis node
node: /usr/bin/node /usr/local/bin/node /root/.nvm/versions/node/v12.22.1/bin/node /usr/share/man/man1/node.1.gz
[root@dev workspace]# cp -rf /root/.nvm/versions/node/v12.22.1/bin/node /usr/bin/node
cp：是否覆盖"/usr/bin/node"？ y
[root@dev workspace]# cp -rf /root/.nvm/versions/node/v12.22.1/bin/node /usr/local/bin/node
cp：是否覆盖"/usr/local/bin/node"？ y
[root@dev workspace]# chmod a+x /usr/bin/node /usr/local/bin/node
[root@dev workspace]# su qimai
node -v
```