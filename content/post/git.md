---
title: "Git"
date: 2021-06-01T14:57:43+08:00
draft: true
tags:
 - 
---
## Git

### 1. git push origin
将当前分支推送到origin主机的对应分支

```bash
# 查看git日志
git log
# 本地仓库回退到某一版本
git reset -hard xxxx

# 撤销到前一次的提交, 会删除所有修改
git reset --hard HEAD^

# 保留当前工作区修改, 撤销commit 
git reset --soft <版本号>
```
- HEAD^的意思是上一个版本, 也可以写成HEAD~1
- 如果你进行了2次commit，想都撤回，可以使用HEAD~2

---
- `--soft`  不删除工作空间改动代码，撤销commit，不撤销`git add .` 
- `--hard` 删除工作空间改动代码，撤销commit，撤销`git add .`,注意完成这个操作后，就恢复到了上一次的commit状态
- 如果commit注释写错了，只是想改一下注释，只需要：
git commit --amend

---
## git撤销远端push操作
```bash
# 1、克隆项目
git clone <项目地址>

# 2、创建本地分支并连接到远程分支

# 本地会创建一个分支名为 branch_name
# 本地 branch_name 分支会自动跟踪远程的同名分支 branch_name
git checkout --track origin/branch_name

# 3、查看所有分支(确保分支在想要进行撤销操作的分支)
git branch -a

# 4、查看历史(查找到想要回溯到的版本号)
git log

# 5、重置至指定版本的提交，达到撤销提交的目的
git reset –-soft <版本号>

# 6、强制提交当前版本
git push origin branch_name –-force
git push -f <remote-name> <branch-name> 
```