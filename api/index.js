
const xnId = '2019-2020-1';
//const serverUri = 'https://nepu.fun:3001/';
const serverUri = 'https://127.0.0.1:3001/';
//我的库
var axios = require('axios')
const Entities = require('html-entities').XmlEntities
const cheerio = require('cheerio')
const request = require('request')
const mysql = require('mysql')

const query = require('./mysqlpool')

const session = require('express-session')


var app = require('../app')


//我的库

//初始化mysql
/*
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'jin7422373',
	database: 'wxdy'
})
connection.connect();
*/



_register: (userInfo) => {
//数据库增操作，userInfo 包含数据库条目，至少包含openid
return new Promise(reject => {
	//检查数据库
})
}


var user = {

}

function getBanner(page){
    var res = {
        banner: [
            {
                id: 123,
                imgUrl: serverUri+"images/banner/banne1.png",
                title: "东北banner1"
            },
            {
                id: 123,
                imgUrl: serverUri+"images/banner/banne1.png",
                title: "东北banner1"
            },
            {
                id: 123,
                imgUrl: serverUri+"images/banner/banne1.png",
                title: "东北banner1"
            }
        ]
    };
    return res;
}
function getCard(req, res){
    let type = req.query.type;
    console.log(type)
    let sql = '';
    if(type){
        sql = 'SELECT * FROM `page` where `type` = "'+type+'" ORDER BY id desc';
        query(sql, (err, response) => {
            if(err){
                console.log(err)
                res.json({
                    err: 1,
                    msg: '数据库解析失败'
                })
            }else{
                var reData = [
                    {
                        id: 123,
                        classId: 1,
                        classTitle: "校园新闻",
                        type,
                        cardData: []
                    }
                ]
                reData[0].cardData = response
                res.json(reData)
            }
        })
        return

    }else{
        var reData = []
        let typeList = [
            {
                title: '重要通知',
                type: 'notice',
                id: 2,
            },{
                title: '考试安排',
                type: 'exam',
                id: 3,
            },{
                title: '校园新闻',
                type: 'new',
                id: 1,
            }
        ]
        var n = 0;
        typeList.forEach((val, index) => {


            sql = 'SELECT * FROM `page` where `type` = "'+val.type+'" ORDER BY id desc LIMIT 0, 5';
            query(sql, (err, response) => {
                if(err){
                    console.log(err)
                }else{
                    if(reData.length < 1){
                        reData.push({
                            id: val.id,
                            classId: 1,
                            classTitle: val.title,
                            type: val.type,
                            cardData: response
                        })
                    }else{
                        var reDataNew = reData;
                        for (let i = 0; i < reDataNew.length; i++) {
                            if(val.id < reDataNew[i].id){
                                reData.splice(i, 0, {
                                    id: val.id,
                                    classId: 1,
                                    classTitle: val.title,
                                    type: val.type,
                                    cardData: response
                                })
                                break
                            }else{
                                if(i == reDataNew.length - 1){
                                    reData.push({
                                        id: val.id,
                                        classId: 1,
                                        classTitle: val.title,
                                        type: val.type,
                                        cardData: response
                                    })
                                    break
                                }
                            }
                        }

                    }
                }
                n += 1;
                if(n == typeList.length){

                    res.json(reData)
                }
            })
        })

    }



/*
    var res = [
        {
            id: 123,
            classId: 1,
            classTitle: "校园动态",
            cardData: [
                {
                    id: 131,
                    title: "校长蒋户名出席黑龙江省13界人民代表大会",
                    info: "校长蒋明湖出席黑龙江省第13届人民代表大会，此次大会	的目的是为了加强合作，他在从中发言，并进行了很多市场调	查",
                    imgUrl: "../../res/imgs/card4.jpg"
                },
                {
                    id: 131,
                    title: "校长蒋户名出席黑龙江省13界人民代表大会",
                    info: "校长蒋明湖出席黑龙江省第13届人民代表大会，此次大会	的目的是为了加强合作，他在从中发言，并进行了很多市场调	查",
                    imgUrl: "../../res/imgs/card5.jpg"
                },
                {
                    id: 131,
                    title: "校长蒋户名出席黑龙江省13界人民代表大会",
                    info: "校长蒋明湖出席黑龙江省第13届人民代表大会，此次大会	的目的是为了加强合作，他在从中发言，并进行了很多市场调	查",
                    imgUrl: "../../res/imgs/card4.jpg"
                }
            ]
        },
        {
            id: 123,
            classId: 1,
            classTitle: "校园动态",
            cardData: [
                {
                    id: 131,
                    title: "校长蒋户名出席黑龙江省13界人民代表大会",
                    info: "校长蒋明湖出席黑龙江省第13届人民代表大会，此次大会	的目的是为了加强合作，他在从中发言，并进行了很多市场调	查",
                    imgUrl: "../../res/imgs/card7.jpg"
                }
            ]
        },
        {
            id: 123,
            classId: 1,
            classTitle: "校园动态",
            cardData: [
                {
                    id: 131,
                    title: "校长蒋户名出席黑龙江省13界人民代表大会",
                    info: "校长蒋明湖出席黑龙江省第13届人民代表大会，此次大会	的目的是为了加强合作，他在从中发言，并进行了很多市场调	查",
                    imgUrl: "../../res/imgs/card5.jpg"
                }
            ]
        }
    ]*/
    //return res;
}


function _login(code){
    //数据库登录操作，返回登录信息以及session信息
    return new Promise(resolve => {
        request.get({//进入微信进行信息换取。
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx1fd87268bdcc4ea0&secret=d2235ae1efa106b1d768f837293d6ee6&js_code='+code+'&grant_type=authorization_code',
            json: true
        }, (err, res, body) => {
            try{
                if(err){
                    console.log(err)
                }else{
                    //数据库查询
                    var openId = body.openid;//o-dEc5DRsWCJHM6bef0eXQSUWHwU
                    //console.log(body)
                    var option = {

                    }
                    query({
                        sql: 'SELECT * FROM `user` WHERE `openid` = ?',
                        nestTables: true
                    }, [openId], function(error, results, fields) {
                        console.log(results.length)
                        console.log(error)
                        if(error){
                            resolve({
                                err: 1,
                                msg: '查询错误'
                            })
                            return;
                        }else{
                            if(results.length < 1){//创建账号
                                console.log(results.length)
                                query('INSERT INTO `user`(`id`, `openid`, `user`, `psw`, `table`) values (null, ?, null, null, null)', [openId], (error, res) => {
                                    console.log(error, res)
                                    if(error){
                                        resolve({
                                            err: 1,
                                            msg: '插入失败'
                                        })
                                        return;
                                    }else{
                                        resolve({
                                            err: 0,
                                            msg: '注册成功',
                                            session: {
                                                sign: true,
                                                userInfo: {
                                                    openid: openId
                                                }
                                            }
                                        })
                                        return;
                                    }
                                })
                            }//已存在账号
                            //对帐号数据进行返回
                            //console.log(JSON.parse(results));
                            else{
                                try{
                                    var userInfo = results[0].user;
                                    //console.log(JSON.parse(results[0]).solution)
                                    resolve({
                                        err: 0,
                                        msg: '登录成功',
                                        session: {
                                            sign: true,
                                            userInfo
                                        }
                                    })
                                }catch(e){
                                    console.log(e)
                                    resolve({
                                        err: 1,
                                        msg: 'loginFail',
                                        session: {
                                            sign: false
                                        }
                                    })
                                }
                            }

                        }
                    })

                    //不存在用户信息则返回给前端进行绑定操作
                    //resolve(body)
                }
            }catch(e){
                console.log(e)
                resolve({
                    err: 1,
                    msg: '解析失败'
                })
            }
            
        })
    })
}

function login(req, res){
    //调用_login进行登录，设置session并返回前端数据
    var code = req.query.code;
    _login(code).then(response => {
        var temp_data = {
            err: response.err,
            msg: response.msg,
        };
        if(response.session && response.session.sign){
        	//console.log(response.session)

            req.session.sign = true;
            req.session.userInfo = response.session.userInfo;
            temp_data = {
                err: response.err,
                msg: response.msg,
                user: response.session.userInfo.user,
                psw: response.session.userInfo.psw,
                table: response.session.userInfo.table
            }
        }
        res.status(200).send(temp_data);
    });
}

function userInit(){
    return new Promise((resolve) => {
        var url = 'http://jwgl.nepu.edu.cn/'
        axios.get(url, {
            headers: {
                Host: 'jwgl.nepu.edu.cn'
            }
        }).then((response) => {
            resolve(response.headers['set-cookie'][0])
        })
    })
}
function bindUser(req, res){
	//console.log(req.session)
    //console.log(req.headers)
    let bind = req.body.bind;
    var _data = {
        USERNAME: req.body.user,
        PASSWORD: req.body.psw,
        useDogCode: '',
        RANDOMCODE: req.body.vCode,
        x: 14,
        y: 33
    };
    var jCk = req.headers.cookie;
    _loginjw(_data, jCk).then(response => {
        try{
            if(response.data.status == 'OK'){
                if(req.session.sign && req.session.userInfo.openid){
                    //mysql改操作。查找openid并进行绑定
                    if(bind){
                        query("UPDATE `user` SET `user`='"+req.body.user+"', `psw`='"+req.body.psw+"' WHERE (`openid`='"+req.session.userInfo.openid+"')", (err, resp) => {
                            if(err){
                                res.status(200).send({
                                    err: 1,
                                    status: false,
                                    msg: '数据库操作失败'
                                }).end()
                            }else{
                                if(resp.affectedRows > 0){
                                    res.status(200).send({
                                        err: 0,
                                        status: true,
                                        msg: '登录并绑定成功'
                                    }).end()
                                }

                            }
                        })
                    }else{
                        res.status(200).send({
                            err: 0,
                            status: true,
                            msg: '登录成功'
                        }).end()
                    }
                    
                }else{
                    res.status(200).send({
                        err: 0,
                        status: false,
                        errCode: 22,
                        msg: '授权信息失效，请重新授权小程序'
                    }).end()
                }
            }else{
                res.status(200).send({
                    err: 0,
                    status: false,
                    errCode: 34,
                    msg: '登录教务网失败',
                    data: response
                }).end()
            }
        }catch(e){
            console.log(e)
            res.status(200).send({
                err: 1,
                status: false,
                msg: '解析或网络错误'
            }).end()
        }
    })
}




function _loginjw(_data, jCk){
    var url = 'http://jwgl.nepu.edu.cn/Logon.do?method=logon'
    return new Promise(resolve => {
        request.post({
            url: url,
            form: _data,
            headers: {
                "Host": "jwgl.nepu.edu.cn",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": jCk
            }
        }, (error, response) => {
            if (error) {
                console.log(error)
            } else {
                var _content = response.body
                request.post({
                    url: 'http://jwgl.nepu.edu.cn/Logon.do?method=logonBySSO',
                    form: {},
                    headers: {
                        "Host": "jwgl.nepu.edu.cn",
                        "Cookie": jCk
                    }
                }, (error, response) => {
                    if(error){
                        resolve({
                            error: 1,
                            data: {
                                status: _content.indexOf('window.location.href') > 0 ? 'OK' : 'NO',
                                msg: '网络繁忙'
                            }
                        })
                    }else{
                        var status = _content.indexOf('window.location.href') > 0 ? 'OK' : 'NO';
                        var msg = status == 'OK' ? '登录成功' : '账号或密码或验证码错误'
                        resolve({
                            error: 0,
                            data: {
                                status,
                                msg
                            }
                        })
                    }

                })

            }
        })
    })
}


function getScore(req, res){
    var _data = 'kksj=' + req.query.option + '&kcxz=&kcmc=&xsfs=qbcj&ok='
    var _cookie = req.headers.cookie
    //var _data = _searchJson(appData.score.scoresList, 'openTime', req.query.option)
    request.post({
        url: 'http://jwgl.nepu.edu.cn/xszqcjglAction.do?method=queryxscj',
        form: _data,
        headers: {
            "Cookie": _cookie
        }
    }, (error, response) => {
        var $ = cheerio.load(response.body)
        var _classList = $('.smartTr').toArray()
        var _scoresList = []
        for (var item in _classList) {
            var msg = _classList[item].children
            _scoresList.push({
                "userId": msg[1].attribs.title,
                "userName": msg[2].attribs.title,
                "openTime": msg[3].attribs.title,
                "className": msg[4].attribs.title,
                "score": msg[5].attribs.title,
                "classCharacter": msg[7].attribs.title,
                "classType": msg[8].attribs.title,
                "classTime": msg[9].attribs.title,
                "classScore": msg[10].attribs.title,
                "examCharacter": msg[11].attribs.title
            })
            //"scoresList": [
            //       {
            //         "userId": "160203140126",
            //         "userName": "靳建奇",
            //         "openTime": "2017-2018-2",
            //         "className": "2018创新创业",
            //         "score": "95",
            //         "classCharacter": "公共选修课",
            //         "classType": "公选",
            //         "classTime": "16",
            //         "classScore": "1",
            //         "examCharacter": "正常考试"
            //       }
        }
        res.json({
            error: 0,
            data: _scoresList
        })
    })
}

function getOptions(req, res){
    //判断登录session

    if(!req.session.userInfo || !req.session.sign){
        res.json({
            err: 0,
            status: false,
            errCode: 22,
            msg: '授权信息失效，请重新授权小程序'
        })
        return
    }
    var _cookie = req.headers.cookie
    request.get({
        url: 'http://jwgl.nepu.edu.cn/jiaowu/cjgl/xszq/query_xscj.jsp?tktime=1531234170000',
        headers: {
            "Cookie": _cookie
        }
    }, (error, response) => {
        var optionList = []
        try{
            var stringObj = response.body
        }catch (e){
            res.json({
                error: 0,
                data: optionList
            })
            return;
        }

        var reg = /option value=\"(.*?)\">/g
        var regContent = []
        var optionList = []
        while (regContent = reg.exec(stringObj)) {
            if (regContent[1].length > 5) {
                optionList.push(regContent[1])
            }
        }
        res.json({
            error: 0,
            data: optionList
        })
    })
}

function getClassTableList(req, res){
    let jCk = req.headers.cookie;
    try{
//var _data = appData.classTableList_new
        console.log(jCk)
        //判断登录session
        if(!req.session.userInfo || !req.session.sign){
            res.json({
                err: 0,
                status: false,
                errCode: 22,
                msg: '授权信息失效，请重新授权小程序'
            })
            return
        }
        request.get({//' + req.query.option + '
            url: 'http://jwgl.nepu.edu.cn/tkglAction.do?method=goListKbByXs&sql=&xnxqh='+xnId+'&zc=&xs0101id='+req.session.userInfo.user,
            headers: {
                'Cookie': jCk
            }
        }, (error, response) => {
            //console.log(response.body)

            var $ = cheerio.load(response.body)
            var entities = new Entities()
            var classTableList = []
            for (var i = 1; i<=7; i++) {
                var classes1 = []
                for (var j = 1; j<=6; j++) {
                    var content = entities.decode($('#' + j + '-' + i + '-2').html())
                    var classesList = content.split('<br>')
                    var n = parseInt(classesList.length / 5)
                    var classes2 = []
                    for (var k = 0; k < n; k++) {
                        var classTimeList_new = []
                        var classTime = cheerio.load(classesList[k * 5 + 3]).text().replace(/ /g, '').split('周')[0]
                        var classTimeList_old = classTime.split(',')
                        for (var b in classTimeList_old) {
                            var tempList = classTimeList_old[b].split('-')
                            if (tempList.length >= 2) {
                                tempList = [parseInt(tempList[0]), parseInt(tempList[1])]
                                for (var o = tempList[0]; o <= tempList[1]; o++) {
                                    classTimeList_new.push(parseInt(o))
                                }
                            } else {
                                classTimeList_new.push (parseInt(classTimeList_old[b]))
                            }
                        }
                        classes2.push({
                            "className": cheerio.load(classesList[k * 5 + 0]).text().replace(/ /g, ''),
                            "classPlace": cheerio.load(classesList[k * 5 + 4]).text().replace(/ /g, ''),
                            "classTime": classTimeList_new
                        })
                    }
                    classes1.push({
                        "classIndex": j,
                        "classes": classes2
                    })
                }
                classTableList.push({
                    "week": i,
                    "classes": classes1
                })
            }

            query("UPDATE `user` SET `table`='"+JSON.stringify(classTableList)+"' WHERE (`openid`='"+req.session.userInfo.openid+"')", (err, request) => {
                if(err){
                    res.json({
                        err: 1,
                        status: false,
                        msg: '数据库保存课表信息出错'
                    })
                    return;
                }else{
                    if(request.affectedRows > 0){
                        res.json({
                            err: 0,
                            status: true,
                            classTableList,
                            msg: '上传成功'
                        })
                        return;
                    }else{
                        res.json({
                            err: 0,
                            status: false,
                            classTableList,
                            msg: '上传失败'
                        })
                        return;
                    }
                }
            })
        })

    }catch (e) {
        console.log(e)
        res.json({
            err: 0,
            status: false,
            msg: '请求出错'
        })
        return
    }

}

function getStuData(req, res){
    console.log('StuData')
    console.log(req.headers)
    console.log(req.session)
    if(req.session.sign && req.session.userInfo){
        res.json({
            err: 0,
            status: true,
            msg: '获取成功',
            stuData: {
                user: req.session.userInfo.user,
                table: req.session.userInfo.table
            }
        })
    }else{
        res.json({
            err: 0,
            status: false,
            errCode: 22,
            msg: '没有授权记录，请重新授权'
        })
    }
}


function getVcode(req, res) {
    var _cookie = req.headers.cookie
    request.get({
        url: 'http://jwgl.nepu.edu.cn/verifycode.servlet?0.19982840599998708',
        encoding: null,
        headers: {
            'Accept-Encoding': 'gzip, deflate',
            'Cookie': _cookie
        }
    }, (error, response) => {
        console.log(response.headers)
        const base64 = response.body.toString('base64')
        res.json({
            error: 0,
            data: {
                base64: base64
            }
        })
    })
}


function getNowWeekBeginStamp(){
    let nowDate = new Date();
    let Year = nowDate.getYear() + 1900;
    let Month = nowDate.getMonth()+1;
    let date = nowDate.getDate();
    let dateStr = Year+'-'+Month+'-'+date
    console.log(dateStr)
    let stamp = (new Date(dateStr)).getTime();
    let weekDay = (new Date(dateStr)).getDay();
    stamp = stamp - (weekDay - 1) * 24 * 60 * 60 * 1000;
    return stamp;
}

function getStartTime(req, res){
    let sql = 'SELECT * from `basedata` WHERE `id` = 1'
    query(sql, function(err, resquest) {
        if(err){
            res.json({
                err: 1,
                msg: '数据库获取失败'
            })   
        }else{/*
            try{
                let timeStamp = resquest.startTime;
                let startDate = new Date(parseInt(timeStamp)).toLocaleString();
                console.log(new Date(parseInt(timeStamp)).toLocaleString())
                stamp = getNowWeekBeginStamp();
                let nowWeekNum = (stamp - timeStamp) / (24*60*60*1000*7) + 1;

                res.json({
                    err: 0,
                    data: {
                        timeStamp,
                        startDate,
                        nowWeekNum
                    }
                })   
            }catch(e){
                console.log(e)
                res.json({
                    err: 1,
                    msg: '计算出错'
                })   
            }
            console.log(resquest)*/
            
            res.json({
                err: 0,
                res: resquest[0]
            })   
        }

    })
}

function setStartTime(req, res){
    let timeStamp = req.query.timeStamp;
    let sql = 'UPDATE `wxdy`.`basedata` SET `startTime` = '+timeStamp+' WHERE `id` = 1';
    query(sql, (err, resquest) => {
        if(err){
            res.json({
                err: 1,
                msg: '数据库更新失败'
            })   
        }else{/*
            res.json({
                    err: 0,
                    msg: '更新成功',
                    res: resquest
                }); 
            return*/
            if(resquest.affectedRows == 1){

                res.json({
                    err: 0,
                    msg: '更新成功'
                }); 
            }else{
                res.json({
                    err: 1,
                    msg: '更新失败'
                }); 
            }
        }
    })
}
function getContent(req, res) {
    let id  = req.query.id;
    query('SELECT * FROM `page` where `id` = "'+id+'"', (err, response) => {
        if(err){
            res.json({
                err: 1,
                msg: '数据库查询失败'
            })
        }else{
            res.json(response[0])
        }
    })
}

//初始化mysql
module.exports = {
	getCard,//获取教务信息卡片
	getBanner,//获取轮播图
    login,//登陆
	userInit,//用户初始化
	bindUser,//用户绑定
    getVcode,//获取验证码
    getClassTableList,//获取课程表信息
    getStuData,//获取用户信息
    getOptions,//获取学年
    getScore,//获取成绩
    getStartTime,//获取开始周次信息
    setStartTime,//设置开始周次信息
    getContent//获取教务信息详情
}