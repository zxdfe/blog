let url = "?wd=window.onload&rsv_spt=1&rsv_iqid=0xd1242b8400000885&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8"

const getQueryStringArgs = () => {
    // 取得查询字符串,并去掉开头问号
    let qs = location.search.length>0?location.search.substring(1):""
    // 保存数据的对象
    let args = {}
    // 把每个参数添加到args对象
    for(let item of qs.split("&").map(kv=>kv.split("="))){
       let name = decodeURIComponent(item[0])
       let value = decodeURIComponent(item[1])
       if(name.length){
          args[name] = value
       }
    }
    return args
 }
//  function getQueryString(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
//     var url = "?wd=window.onload&rsv_spt=1&rsv_iqid=0xd1242b8400000885&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8"
//     var r = url.substr(1).match(reg);
//     // var r = window.location.search.substr(1).match(reg);
//     if (r != null) {
//         return unescape(r[2]);
//         // unescape() 解码
//         // r[2] 分组捕获中的第二组
//     }
//     return null;
// }

// var queryString = getQueryString('rsv_iqid')
// console.log(queryString)

//  console.log(getQueryStringArgs(url))