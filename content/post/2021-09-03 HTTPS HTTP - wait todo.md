---
title: "https http"
date: 2021-05-02T21:10:10+08:00
draft: true
tags:
 - 
---
## 1. https与http区别?
1. https协议是在http基础上加入SSL; http运行在TCP(传输层)基础上;
2. http是超文本传输协议,信息是明文传输,安全性低;https使用了SSL传输
3. HTTPS可以有效的防止运营商劫持
4. http端口80; https 默认端口443;
5. 链接时非对称加密;链接后对称加密

## 2. http1.0  http1.1  http2.0区别?
server push

HTTP2.0 和HTTP 1.1相比
- 新的二进制格式（Binary Format）
- 多路复用（MultiPlexing）
- header压缩
- 服务端推送（server push）

## 3. TCP 和 UDP 区别?
- TCP（Transmission Control Protocol，传输控制协议）是一种`面向连接的`、`可靠的`、`基于字节流`的传输层通信协议。
- UDP（User Datagram Protocol，用户数据报协议）

`IP 通过 IP 地址信息把数据包发送给指定的电脑，而 UDP 通过端口号把数据包分发给正确的程序。`

- 对于数据包丢失的情况，TCP 提供重传机制；
- TCP 引入了数据包排序机制，用来保证把乱序的数据包组合成一个完整的文件。

## 4. URI 和 URL 区别?   URN?
- URI = Uniform Resource Identifier 统一资源`标识符`
- URL = Uniform Resource Locator 统一资源`定位符`
- URN = Uniform Resource Name 统一资源`名称`

1. URI是一种抽象的定义,包含URL, URN;
2. URL是用定位的方式实现的URI, 是URI的一种实现,子集; 

## 5. 从输入URL到页面展示, 这中间发生了什么?

## DNS预解析
## 缓存
## 三次握手 四次挥手

## Reference
1. [HTTP1.0、HTTP1.1 和 HTTP2.0 的区别](https://www.cnblogs.com/heluan/p/8620312.html)
2. [从输入URL到页面展示](https://blog.csdn.net/asd0356/article/details/107895274)
