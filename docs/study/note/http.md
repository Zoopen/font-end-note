## HTTP协议入门
HTTP是应用层协议
![An image](../../.vuepress/public/images/http.jpg)


### 访问网页
#### 1.本机参数
假设用户设置好了自己的网络参数：
``` md
- 本机的IP地址： 192.168.1.13
- 子网掩码： 255.255.255.0
- 网关的IP地址： 192.168.1.1
- DNS的IP地址： 8.8.8.8
```

打开浏览器，在地址栏中输入网址，www.baidu.com。
这意味着，浏览器要向baidu发送一个网页请求的数据包。

#### 2.DNS协议
我们知道，发送一个数据包，必须知道对方的IP地址，但是现在我们只知道它的网址www.baidu.com，不知道它的IP地址。
DNS协议可以帮助我们，将这个网址转成IP地址。已知DNS服务器为8.8.8.8，于是我们向这个地址发送一个DNS数据包（53端口）。
然后，DNS服务器做出响应，解析出www.baidu.com的IP地址104.193.88.123，于是，我们知道了对方的IP地址。

#### 3.子网掩码
接下来我们要判断此IP地址是不是在同一个子网络，这就需要用到子网掩码。已知子网掩码为：255.255.255.0，本机IP为：192.168.1.13，
两者做二进制的AND运算，计算结果为：192.168.1.0。然后将子网掩码和目标IP地址104.193.88.123也做二进制的AND运算，计算得：104.193.88.0。两个计算结果不相等，因此它们不在同一个子网。因此，我们要向baidu发送数据包，必须通过网关192.168.1.1转发，也就是说，接收方的MAC地址将是网关的MAC地址。

#### 4.应用层协议
浏览器使用的是http协议，HTTP部分的内容，类似于下面这样：
``` md  
Host: www.baidu.com
Connection: keep-alive
Pragma: no-cache
Referer: https://www.baidu.com/
sec-ch-ua: "Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
Sec-Fetch-Dest: image
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36
```

我们假定这个部分的长度为4960字节，它会被嵌在TCP数据包之中。