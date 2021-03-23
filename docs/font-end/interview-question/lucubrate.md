## 浏览器怎么和服务端确定自己用啥协议版本沟通
0.9、1.0、1.1、2.0


## cookie属性值里samesite是用来做啥子用的,怎么用
Chrome51开始，浏览器的Cookie新增加了一个SameSite属性，用来防止CSRF攻击和用户追踪。

### 一、CSRF攻击是什么？
Cookie往往用来存储用户的身份信息，恶意网站可以设法伪造带有正确Cookie的HTTP请求，这就是CSRF（Cross site request forgery，跨站请求伪造）攻击。
举例来说，用户登陆了银行网站<code>your-bank.com</code>，银行服务器发来了一个Cookie:
```
Set-Cookie: id=a3fWa;
```
用户后来又访问了恶意网站<code>malicious.com</code>，上面有一个表单。
``` html
<form action="your-bank.com/transfer" method="POST">
    ...
</form>
```
用户一但被诱骗发送这个表单，银行网站就会收到带有正确Cookie的请求。为了防止这种攻击，表单一般都带有一个随机token，告诉服务器这是真实请求。
``` html
<form action="your-bank.com/transfer" method="POST">
    <input type="hidden" name="token" value="dad3weg34">
    ...
</form>
```
这种第三方网站引导发出的Cookie，就称为第三方Cookie。它除了用于CSRF攻击，还可以用于用户追踪。
比如，Facebook在第三方网站插入一张看不见的图片。
``` js
<img src="facebook.com" style="visibility:hidden;">
```
浏览器加载上面代码时，就会像向Facebook发出带有Cookie的请求，从而Facebook就会知道你是谁，访问了什么网站。

### 二、SameSite属性
Cookie的<code>SameSite</code>属性用来限制第三方Cookie，从而减少安全风险。
它可以设置三个值。
``` md
- Strict
- Lax
- None
```

#### 2.1 Strict
<code>Strict</code>最为严格，完全禁止第三方Cookie，跨站点时，任何情况下都不会发送Cookie。换言之，只有当网页的URL与请求目标一致，才会带上Cookie。
```
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```
这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个GitHub链接，用户点击跳转就不会带有GitHub的Cookie，跳转过去总是未登录状态。

#### 2.2 Lax
<code>Lax</code>规则稍微放宽，大多数情况也是不发送第三方Cookie，但是导航到目标网址的Get请求除外。
```
Set-Cookie: CookieName=CookieValue; SameSite=Lax;
```
导航到目标网址的GET请求，只包括三种情况：链接，预加载请求，GET表单，详见下表：
| 请求类型 | 示例 | 正常情况 | Lax |
| ------ | ------ | ------ | ------ |
| 链接 | ```<a href="..."></a>``` | 发送Cookie | 发送Cookie | 
| 预加载 | ```<link rel="prerender" href="..." />``` | 发送Cookie | 发送Cookie | 
| GET表单 | ```<form method="GET" action="..."></form>``` | 发送Cookie | 发送Cookie | 
| POST表单 | ```<form method="POST" action="..."></form>``` | 发送Cookie | 不发送 | 
| iframe | ```<iframe src="..."></iframe>``` | 发送Cookie | 不发送 | 
| AJAX | ```$.get("...")``` | 发送Cookie | 不发送 | 
| Image | ```<img src="...">``` | 发送Cookie | 不发送 | 
设置了<code>Strict</code>或<code>Lax</code>以后，基本就杜绝了CSRF攻击。当然，前提是用户浏览器支持SameSite属性。

#### 2.3 None
Chorme计划将<code>Lax</code>变为默认设置。这是，网站可以选择显式关闭SameSite属性，将其设为None。不过，前提是必须同时设置Secure属性（Cookie只能通过HTTPS协议发送），否则无效。
下面的设置无效。
```
Set-Cookie: widget_session=abc123; SameSite=None;
```
下面的设置有效。
```
Set-Cookie: widget_session=abc123; SameSite=None; Secure;
```

### 三、参考链接
<http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html>

### 四、实践测试
待完成


## js执行会先干啥


## PWA

## Service worker
