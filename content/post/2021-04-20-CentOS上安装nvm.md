---
title: "CentOS上安装nvm"
date: 2021-04-20T22:14:43+08:00
draft: false
tags:
 - nvm
 - linux
---
## CentOS上安装nvm
1. 先按照curl,标准CentOS库中提供了Curl软件包
```shell
sudo dnf install curl
```
2. 安装[nvm](https://github.com/nvm-sh/nvm)
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
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