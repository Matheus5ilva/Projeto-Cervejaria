var express = require('express');
var router = express.Router();
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var beers = require('./../inc/beers');
var conn = require('./../inc/db');
var exchange = require('./../inc/exchange');

/* GET home page. */
router.use(function (req, res, next) {
    if (['/login'].indexOf(req.url) === -1 && !req.session.user) {

        if (['/register'].indexOf(req.url) > -1) {
            res.redirect('/register');
        } else if (['/forgot'].indexOf(req.url) > -1) {
            res.redirect('/forgot');
        } else {
            res.redirect('/admin/login');
        }
    } else {
        next();

    }
});

router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.clearCookie("user");
    res.redirect('admin/login');
});

router.use(function (req, res, next) {
    req.menus = admin.getMenus(req);
    next();
});
router.get('/', function (req, res, next) {
    admin.dashboard(req).then(data => {
        res.render('admin/index', admin.getParams(req, { data }));
    }).catch(err => {
        console.error(err);
    });
});

router.get('/login', function (req, res, next) {
    users.render(req, res, null);
});
router.post('/login', function (req, res, next) {
    this.login = {
        'email': req.body.email,
        'password': req.body.password
    }
    if (!req.body.email) {
        users.render(req, res, 'Preencha o campo e-mail');
    } else if (!req.body.password) {
        users.render(req, res, "Preencha o campo senha");
    } else {
        users.login(req.body.email, req.body.password).then(user => {
            res.cookie("user", this.login, {maxAge: 790000000});
            req.session.user = user;
            res.redirect('/admin');
        }).catch(err => {
            users.render(req, res, err.message || err);
        });
    }
});

router.get('/cervejas', function (req, res, next) {
    beers.getBeersAdmin(req).then(data => {
        res.render('admin/cervejas', admin.getParams(req, {
            data
        }));
    });
});

router.post('/cervejas', function (req, res, next) {
    beers.save(req.fields, req.files).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

router.delete('/cervejas/:id_beer', function (req, res, next) {
    beers.delete(req.params.id_beer).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/trocas', function (req, res, next) {
    exchange.getExchangeAdmin(req).then(data => {
        res.render('admin/trocas', admin.getParams(req, {
            data
        }));
    });
});

//Rota para mandar o e-mail de confirmação
router.post('/trocas/:id_exchange', function (req, res, next) {
    exchange.confirm(req.params.id_exchange).then(results => {
        res.send(results);
    }).catch(err => {
        res.send({
            error: err
        });
    });
});

router.delete('/trocas/:id_exchange', function (req, res, next) {
    exchange.delete(req.params.id_exchange).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/edit', function (req, res, next) {
    users.getUsers(req).then(data => {
        res.render('admin/edit', admin.getParams(req, {
            data
        }));
    });
});

router.post('/edit', function (req, res, next) {
    users.save(req.fields).then(results => {
        res.redirect('/admin/');
        res.send(results)
    }).catch(err => {
        res.send(err);
    });
});

module.exports = router;