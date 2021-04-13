---
title: "Vim常用基本操作"
date: 2021-04-12T11:24:53+08:00
draft: true
---
## Linux常用命令
- `mkdir` make directory 创建目录
- `rm` remove 删除
- `mv` move 移动
- `cp` copy 复制  
- `ls` list 罗列
- `pwd` progress working directory 查看当前完整路径
- `rm -r` 文件夹名  //删除目录(递归操作)
- `rm -rf` 文件夹名  //强制删除目录

## Vim模式

### 普通模式 Normal mode
1. 用户启动vim时,默认进入普通模式, 可以使用`ESC`从其他模式切到普通模式
2. 普通模式可以进行各种命令操作和移动.
3. 大多数情况我们是在浏览而不是操作,所以`Vim`默认进入的是`Normal Mode`

常用命令
- `i` 切换到输入模式，以输入字符,在当前光标之前插入文本
- `a` 命令可以在当前光标之后插入文本。
- `o` 在当前行的下面另起一行，并使当前模式转为Insert模式。
- `x` 删除当前光标所在处的字符。 
- `u` 还原操作
- `:` 切换到底线命令模式，以在最底一行输入命令。
- `gg` 光标移到第一行
- `nG` 移动到第几行 (大写G)
- `G` 移动到最后一行
- `dd` 删除整行
--- 
- `v` 从光标当前位置,光标经过的地方都会被选中,再按`v`结束
- `V` 从光标当前行开始，光标经过的`行`都会被选中，再按一下`Ｖ`结束


### 插入(编辑)模式 Insert mode
在普通模式下按下`i,a,o` 就进入了插入模式
1. `i` insert
2. `a` append
3. `o` open a line below

- 字符按键以及Shift组合，输入字符
- `ENTER`，回车键，换行
- `BACK SPACE`，退格键，删除光标前一个字符
- `DEL` 删除键，删除光标后一个字符
- `hjkl(左下上右)`或`方向键`，在文本中移动光标
- `HOME/END`，移动光标到行首/行尾
- `Page Up/Page Down`，上/下翻页
- `Insert`，切换光标为输入/替换模式，光标将变成竖线/下划线
- `ESC`，退出输入模式，切换到命令模式

### 命令模式 Command mode
在命令模式下按下:（英文冒号）就进入了命令模式。

命令模式可以输入单个或多个字符的命令，可用的命令非常多。

常用命令:
- `:w` 保存
- `:q` 退出, 不保存 `:q!`加上感叹号,表示强制退出
- `:wq` 保存退出
- `:set nu` 显示行号; `:set nonu` 取消行号

按ESC键可随时退出命令模式。

### 可视化模式 Visual mode

## References
- [VimScript](https://learnvimscriptthehardway.stevelosh.com/chapters/01.html)
- [精通 VIM ，此文就够了](https://zhuanlan.zhihu.com/p/68111471)
- [Vim资源](https://github.com/vim-china/hello-vim)
- [Vim入门教程](https://github.com/vim-china/hello-vim/blob/master/quick-start-guide.md)
- [为什么说 zsh 是 shell 中的极品？](https://www.zhihu.com/question/21418449)

