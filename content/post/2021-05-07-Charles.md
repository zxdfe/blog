---
title: "Charles抓包配置"
date: 2021-05-07T18:28:10+08:00
draft: false
tags:
 - Charles
---

## Charles报错处理
Charles报错`Failed to install helper CFErrorDomainLaunchd error 9`
- 打开终端输入`launchctl print-disabled system`,回车查看`com.xk72.charles.ProxyHelper`是否为`true`
- 如果是的话,输入`sudo launchctl enable system/com.xk72.charles.ProxyHelper`回车,输入系统密码
- 重启Charles

![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210507183227.png#w80)

## Mac 本地Https抓包配置
1. 安装根证书 `Help   -> SSL Proxying  ->    Install Charles Root Certificate`
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210507234518.png#w80)

2. 钥匙串中点击该证书,始终信任
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210507234818.png#w60)

3. 设置HTTPS端口 `Proxy  ->  SSL Proxying Settings` 点击`Enable SSL Proxying`,点击`Add`
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210507235038.png#w30)

    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210507235109.png#w80)
4. 设置抓包地址和IP
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210508000040.png#w60)

## 手机上Https抓包配置
1. 首先要保证和Mac在同一wifi下,查看Mac本地wifi的IP  `ifconfig | grep "inet"` 或者wifi那里查看
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210508000510.png#w80)
2. 手机上`无线局域网`点击该wifi,底部配置代理,选择手动配置
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210508000811.png#w50)
    服务器填PC端的IP, 端口默认`8888`
3. PC上`Proxy  ->  Proxy Settings`,同样设置`8888`
    ![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20210508001316.png#w60)
4. 手机浏览器访问`chls.pro/ssl`, 此时电脑上提示,选择`Allow`允许
5. 下载证书,并信任证书
6. 同样设置需要抓包的HTTPS地址,或者`*`全局

## PS. Markdown中插入图片自定义大小
- [markdown中插入图片怎么定义图片的大小或比例？](https://www.zhihu.com/question/23378396)