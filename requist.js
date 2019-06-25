
const request = require('request')
const http = require('http')
const iconv = require('iconv-lite');
const query = require('./api/mysqlpool')
const cheerio = require('cheerio')

var GB2312UnicodeConverter={
    ToUnicode:function(str){
        return escape(str).toLocaleLowerCase().replace(/%u/gi,'\\u');
    },
    ToGB2312:function(str){
        return unescape(str.replace(/\\u/gi,'%u'));
    }
};
let pageList = [];
let pageIndex = 0;
function getPageList(type){
    let typeList = {
        new: '350309',
        exam: '350320',
        notice: '350312'
    }
    pageList = [];
    pageIndex = 0;
    return new Promise(resolve => {
        request.post({
            url: 'http://glbm1.nepu.edu.cn/jwc/dwr/call/plaincall/portalAjax.getNewsXml.dwr',
            //    http://glbm1.nepu.edu.cn/jwc/dwr/call/plaincall/portalAjax.getNewsXml.dwr
            body: 'callCount=1&httpSessionId=8FE90BA7D105DBC009F1182450ACCC5C&scriptSessionId=80C974DBC6E3BBBAF23BE1EAB50935F9770&c0-scriptName=portalAjax&c0-methodName=getNewsXml&c0-id=0&c0-param0=string:3503&c0-param1=string:'+typeList[type]+'&c0-param2=string:news_&c0-param3=number:20&c0-param4=number:1&c0-param5=null:null&c0-param6=null:null&batchId=0',
            headers: {
                'Host': 'glbm1.nepu.edu.cn',
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Origin': 'http://glbm1.nepu.edu.cn',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                'Content-Type': 'text/plain',
                'Accept': '*/*',
                'Referer': 'http://glbm1.nepu.edu.cn'+typeList[type],
                'Accept-Language': 'zh-CN,zh;q=0.9',
            }
        }, (err, res, body) => {
            let temp = GB2312UnicodeConverter.ToGB2312(body);
            let temps = temp.split('<item>');
            temps.forEach((val, index) => {
                try {
                    let title = temps[index].split('title')[1].split('title')[0].split('A[')[1].split(']]')[0]
                    let href = temps[index].split('link')[1].split('link')[0].split('A[')[1].split(']]')[0]
                    let pubDate = temps[index].split('pubDate>')[1].split('<')[0]
                    pageList.push({
                        title,
                        href,
                        pubDate,
                        type
                    })
                    let pageListNew = pageList.map((val, index) => {
                        return pageList[pageList.length - index - 1]
                    })
                    pageList = pageListNew
                }catch (e) {

                }
                resolve(pageList)
            })
        })
    })

}

function getPageContent() {
    return new Promise(resolve => {

        if (pageIndex >= pageList.length) {

            pageIndex = 0;
            resolve(pageList)
            return
        }
        let url = pageList[pageIndex].href

        http.get(url, function (res) {
            res.pipe(iconv.decodeStream('GBK')).collect(function (err, body) {
                try{
                    if (err) {
                        console.log(err)
                    } else {
                        //获取content
                        let contentJSON = getContentJSON(body)
                        let contentStr = JSON.stringify(contentJSON);

                        //获取图片
                        let imgs = body.split('img')
                        let imageList = []
                        imgs.forEach((val, index) => {
                            let imgHref = val.split('src')[1].split('"')[1].split('"')[0]
                            if(imgHref.indexOf('jpg') != -1)
                                imageList.push(imgHref)
                        })
                        if(!pageList[pageIndex] || pageList[pageIndex] != undefined ){
                            pageList[pageIndex].imgList = imageList;
                            pageList[pageIndex].content = contentStr;
                            pageIndex += 1;
                        }

                    }
                }catch (e) {
                    pageIndex += 1;
                    console.log(e)
                }

                getPageContent().then(res => {
                    resolve(res)
                })
            })
        })
    })
}

let type='new'
getPageList(type).then(res => {
    getPageContent().then(res => {
        query("SELECT * FROM `page` ORDER BY id", (err, res) => {

            pageList.map((val, index) => {
                var n = 0;
                var flag = true;
                if(res.length < 1){
                    query("INSERT INTO `page` (`type`, `title`, `href`, `pubDate`, `imgList`, `content`) VALUES ('"+val.type+"', '"+val.title+"', '"+val.href+"', '"+val.pubDate+"', '"+val.imgList+"', '"+val.content+"')" , (err, data) => {
                        console.log(err)
                    })
                    return
                }
                res.map((val2, index) => {
                    if(flag){
                        if(val.href == val2.href){
                            flag = false
                        }else{

                        }
                        n+=1;
                        if(n == res.length && flag){
                            query("INSERT INTO `page` (`type`, `title`, `href`, `pubDate`, `imgList`, `content`) VALUES ('"+val.type+"', '"+val.title+"', '"+val.href+"', '"+val.pubDate+"', '"+val.imgList+"', '"+val.content+"')" , (err, data) => {
                                console.log(err)
                            })
                        }
                    }

                })
            })
        })


    })
})
/*
let url="http://news.nepu.edu.cn/news/155608357779010888.html"
http.get(url, function (res) {
    res.pipe(iconv.decodeStream('GBK')).collect(function (err, body) {

    })
})

*/
function getContentJSON(body){
    try {
        //获取content
        let contentJSON = {};
        let pList = [];
        const $ = cheerio.load(body)
        let title = $('.title h3').text()
        let info = $('.title h4').text()
        $('#contentdisplay p').each((i, ele) => {
            $(ele).find('img').map((i, eleImg) => {
                pList.push({
                    type: 'img',
                    data: $(eleImg).attr('src')
                })
            })
            if($(ele).text().length > 1){
                pList.push({
                    type: 'txt',
                    data: $(ele).text()
                })
            }

        })
        contentJSON = {
            title,
            info,
            pList
        }
        return contentJSON
    }catch (e) {
        console.log(e)
        return ({
            err: 1,
            msg: '解析错误'
        })
    }
}

/*
* callCount=1
page=/jwc/type/350312.html
httpSessionId=8FE90BA7D105DBC009F1182450ACCC5C
scriptSessionId=7078E15CF7AC0C6941D661DBB2D91375895
c0-scriptName=portalAjax
c0-methodName=getNewsXml
c0-id=0
c0-param0=string:3503
c0-param1=string:350312
c0-param2=string:news_
c0-param3=number:15
c0-param4=number:1
c0-param5=null:null
c0-param6=null:null
batchId=0


callCount=1
page=/jwc/type_zdtjgz/350320.html
httpSessionId=8FE90BA7D105DBC009F1182450ACCC5C
scriptSessionId=80C974DBC6E3BBBAF23BE1EAB50935F9770
c0-scriptName=portalAjax
c0-methodName=getNewsXml
c0-id=0
c0-param0=string:3503
c0-param1=string:350320
c0-param2=string:news_
c0-param3=number:15
c0-param4=number:1
c0-param5=null:null
c0-param6=null:null
batchId=0

* */