var express = require('express');
var router = express.Router();

var api = require('../api/index.js');




/* GET home page. */
router.get('/test', function(req, res) {
    if(req.session.sign)
        res.send('wellcome hi')
    else{
        req.session.sign = true;
        res.send('first login')
    }
})
router.get('/test2', function(req, res) {
    if(req.session.sign)
        res.send('wellcome hi')
    else{
        req.session.sign = true;
        res.send('first login')
    }
})
router.get('/index/banner', function(req, res, next) {
    res.status(200).send(api.getBanner('index'))
});
router.get('/index/card', function(req, res, next) {
    api.getCard(req, res)
});
router.get('/userInit', function(req, res, next) {
    api.userInit().then(response => {
        res.status(200).send(response)
    })
})
router.get('/login', function(req, res, next) {
    //console.log(req.query.code)
    api.login(req, res);
})
router.post('/bindUser', function(req, res) {
    //console.log('asd')
    api.bindUser(req, res);
})
router.get('/getVcode', (req, res) => {
    api.getVcode(req, res);
})

router.get('/getContent', (req, res) => {
    api.getContent(req, res);
})


router.get('/getClassTableList', (req, res) => {
    api.getClassTableList(req, res);
})

router.get('/getStuInfo', (req, res) => {
    api.getStuData(req, res);
})

router.get('/getOptions', (req, res) => {
    api.getOptions(req, res);
})

router.get('/getScore', (req, res) => {
    api.getScore(req, res);
})

router.get('/getStartTime', (req, res) => {
    api.getStartTime(req, res);
})

router.get('/setStartTime', (req, res) => {
    api.setStartTime(req, res);
})

module.exports = router;
