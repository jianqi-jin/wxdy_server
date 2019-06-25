var express = require('express');
var session = require('express-session');
var app = express();

app.use(session({
    secret: 'hubwiz app', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
}));
app.get('/test', function (req, res) {
    if (req.session.sign) {//检查用户是否已经登录
        console.log(req.session);//打印session的值
        res.send('wellcome hi');
    } else {//否则展示index页面4
        req.session.sign = true;
        res.send('first login')

    }
});
app.listen(80);