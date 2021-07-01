var express = require('express');
var router = express.Router();
var exchange = require('./../inc/exchange');
var contacts = require('./../inc/contacts');
var beers = require('./../inc/beers');
var users = require('./../inc/users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
    background: 'images/bg-cervejas.jpg',
    span: 'Jeito fácil de trocar a sua cerveja artesanal é na',
    h1: 'Troca Beer!'
  });
});

router.get('/beers', function (req, res, next) {
  let title = req.query.title;
  let name = req.query.name;
  let categories = req.query.categories;
  let city = req.query.city;
  beers.getBeers(req).then(results => {
    res.render('beers', {
      title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
      beers: results,
      text: {
        title,
        name,
        categories,
        city
      },
    });
    console.log(req)
  });
});

router.get(`/beer/:id_beer`, function (req, res, next) {
  exchange.getExchange(req.params.id_beer).then(results => {
    res.render('beer', {
      title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
      body: req.body,
      beer: results
    });
  });

});

router.post(`/beer/:id_beer`, function (req, res, next) {

  if (!req.body.name) {
    exchange.getExchange(req.params.id_beer).then(results => {
      res.render('beer', {
        title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
        body: req.body,
        beer: results,
        error: 'Digite um nome',
        success: null
      });
    });
  } else if (!req.body.email) {
    exchange.getExchange(req.params.id_beer).then(results => {
      res.render('beer', {
        title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
        body: req.body,
        beer: results,
        error: 'Digite o email',
        success: null
      });
    });
  } else if (!req.body.phone) {
    exchange.getExchange(req.params.id_beer).then(results => {
      res.render('beer', {
        title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
        body: req.body,
        beer: results,
        error: 'Digite o número de telefone',
        success: null
      });
    });
  } else if (!req.body.address) {
    exchange.getExchange(req.params.id_beer).then(results => {
      res.render('beer', {
        title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
        body: req.body,
        beer: results,
        error: 'Digite seu endereço',
        success: null
      });
    });
  } else if (!req.body.city) {
    exchange.getExchange(req.params.id_beer).then(results => {
      res.render('beer', {
        title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
        body: req.body,
        beer: results,
        error: 'Digite a cidade',
        success: null
      });
    });
  } else {
    exchange.save(req.body).then(results => {
      req.body = {};
      exchange.getExchange(req.params.id_beer).then(results => {
        res.render('beer', {
          title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
          body: req.body,
          beer: results,
          error: null,
          success: 'Pedido de troca realizada com sucesso. Aguarde a confirmação.'
        });
      });
    }).catch(err => {
      exchange.getExchange(req.params.id_beer).then(results => {
        res.render('beer', {
          title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
          body: req.body,
          beer: results,
          error: err,
          success: null
        });
      });
    });

  }
});

router.get(`/contacts`, function (req, res, next) {
  contacts.render(res, req);
});

router.post(`/contacts`, function (req, res, next) {
  if (!req.body.name) {
    contacts.render(res, req, 'Digite um nome');
  } else if (!req.body.email) {
    contacts.render(res, req, 'Digite o e-mail');
  } else if (!req.body.message) {
    contacts.render(res, req, 'Digite o conteúdo do e-mail');
  } else {
    contacts.save(req.body).then(results => {
      req.body = {};
      contacts.render(req, res, null, 'Seu e-mail foi enviado com sucesso!');
    }).catch(err => {
      contacts.render(req.res.err.message);
    });
  }

});

router.get('/register', function (req, res, next) {
  users.renderRegister(req, res, null);
});

router.post('/register', function (req, res, next) {

  if (!req.body.name) {
    users.renderRegister(req, res, 'Preencha o campo do nome');
  } else if (!req.body.email) {
    users.renderRegister(req, res, "Preencha o campo do e-mail");
  } else if (!req.body.password) {
    users.renderRegister(req, res, "Preencha o campo da senha");
  } else if (!req.body.phone) {
    users.renderRegister(req, res, "Preencha o campo do telefone");
  } else if (!req.body.address) {
    users.renderRegister(req, res, "Preencha o campo do endereço");
  } else if (!req.body.city) {
    users.renderRegister(req, res, "Preencha o campo da cidade");
  } else {
    users.save(req.fields).then(results => {
      res.redirect('/admin/login')
    }).catch(err => {
      users.renderRegister(req, res, err.message || err);
    });
  }
});

router.get('/forgot', function (req, res, next) {
  res.render('forgot', {});
});

router.post('/forgot', function (req, res, next) {
  users.fogout(req.body.email).then(results => {
    res.redirect('/forgot')

  })
});

router.get('/change-password', function (req, res, next) {
  res.render('change-password', {});
});
router.post('/change-password', function (req, res, next) {
  users.changePassword(req).then(results => {
    res.redirect('/admin/login')
  }).catch(err => {
    res.send({
      error: err
    });
  });
});


module.exports = router;
