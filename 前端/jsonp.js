/**
 * 同源策略：协议域名端口
 *目的，是为了保证用户信息的安全，防止恶意的网站窃取数据
 （1） Cookie、LocalStorage 和 IndexDB 无法读取。
（2） DOM 无法获得。
（3） AJAX 请求不能发送。
规避限制方法
（1）浏览器允许通过设置document.domain共享 Cookie。
举例来说，A网页是http://w1.example.com/a.html，B网页是http://w2.example.com/b.html，那么只要设置相同的document.domain，两个网页就可以共享Cookie。
document.domain = 'example.com';
（2）HTML5全新的API：跨文档通信 APIwindow.postMessage
（3）CORS跨源资源分享
（4）jsonp
由于<script>元素请求的脚本，直接作为代码运行。
这时，只要浏览器定义了foo函数，该函数就会立即调用。
作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用JSON.parse的步骤。
 */

// http://www.practice-zhao.com/student.php?id=1&callback=jsonhandle

function jsonp(url, data, callback) {
    let dataString = url.indexOf("?") === -1 ? '?' : '&'
    for (let key in data) {
        dataString += key + '=' + data[key] + '&'
    }
    let fnName = '_fn' + Math.random().toString.replace('.', '')
    dataString += 'callback=' + fnName

    let scriptEle = document.createElement('script')
    scriptEle.src = url + dataString

    window[fnName] = function (data) {
        callback(data)
        window.removeChild(scriptEle)
    }

    window.appendChild(scriptEle)
}