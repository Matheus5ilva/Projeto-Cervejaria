var conn = require('./db');
var mailer = require('./mailer');

module.exports = {
    render(res, req, error, success) {
        res.render('beer', {
            title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
            background: 'images/537021-PJIXFO-194.jpg',
            body: req.body,
            error,
            success,
            results
        });
    },

    getExchange(id_beer) {
        return new Promise((resolve, reject) => {
            conn.query(`
            SELECT tb_beers.id_beer, tb_beers.title, tb_beers.description, tb_beers.categories, tb_beers.exchange, tb_beers.available, tb_users.id_cervejeiro, tb_users.name, tb_users.address,tb_users.city,tb_users.phone,tb_users.mobile_phone, tb_users.email FROM tb_beers INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro WHERE id_beer = ?    
            `, [
                id_beer
            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

    },

    getExchangeAdmin(req) {
        return new Promise((resolve, reject) => {
            let fields = req.session.user;
            conn.query(`
            SELECT tb_exchange.id_exchange, tb_exchange.id_beer, tb_exchange.name, tb_beers.title, tb_exchange.email, tb_exchange.phone, tb_exchange.address, tb_exchange.city, tb_exchange.n_bottle, tb_exchange.comments, tb_exchange.categories, tb_beers.title FROM tb_exchange INNER JOIN tb_beers ON tb_exchange.id_beer = tb_beers.id_beer INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro WHERE tb_users.id_cervejeiro = ?;
            `, [
                fields.id_cervejeiro
            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

    },

    save(fields) {
        return new Promise((resolve, reject) => {
            conn.query(`
            INSERT INTO tb_exchange (id_beer, name, email, phone, address, city, n_bottle, comments, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
                fields.id_beer,
                fields.name,
                fields.email,
                fields.phone,
                fields.address,
                fields.city,
                fields.n_bottle,
                fields.comments,
                fields.categories

            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });

    },

    confirm(id_exchange) {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT tb_exchange.email FROM tb_exchange WHERE id_exchange = ?`, [
                id_exchange
            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    mailer.sendMail({
                        from: 'TrocaBeer <matheus0verfl0w27@gmail.com>',
                        to: JSON.stringify(results),
                        subject: 'Confirmação de Troca',
                        text: "Olá! Sua proposta de troca foi aceita com sucesso.",
                        html: `
                        <img src="https://lh3.googleusercontent.com/oj_IlbveSzo3KKOuESSKBZjEpfMkXqNrZ2gd_EJMVEM4gBXvQBOtyinO7-Q35qO7aO9TobSyh2BQ2sYiiAExwhaygRDzV_l_L0xY4517tn_aOGo5gEQ9EvNdP6NkOMBklwjLi6yya90d33xSPa7QtC-Bn_TID_3yVKlbfRzzGEsHDBJ2VUDybnulQVqhVdCbICVNsuxTC-1flitwf0mbiUMBZQsrHG7D8rIkz6cHg5IbMJHk-1oVLozIjRT9WuoNBhoHRDD8-_J4Rd7sIdE8M8kzNrljNpvZxWacd8LviYf5NwySk7ny8QaxNDXyDFG2UqxL5bDJsIvN-LTNmVbUwLw4orIZ--MxcDRxhzdNITTnhCFe0vYIP4oRJZR2ULSJQM_2PJBgq3IIoTbiUNJL49toaIui3w8w2h0uoVZ3P7ijS1_srvK1-XchPRcZLXE0pABq7AyQ3sz1L_D9wWNt4AnWxf9lEK5nXDKyhOOJ73KufftfVe2f94XeK4oYNmT7NuTVpbwhzd_U_cd-wcAzrE6jLxU8N67LVCOtW8zDw-_rRQhN_vlTEBSwp2PTRR2goRpQmLBESRhKdlHHmiJIrhfC3IJgLY3nFlzQ3aJ-dgAhfFqwSb3DUBPdi5ZEKUMNqKn6u1oIuBn7EupRJrzMTXShioeSdoIW7_zZoughvytHglnzhIUpkpvqQnIM5A=w475-h671-no?authuser=0" alt="Parabéns, sua proposta foi aceita." style = "display: block; margin-left: auto; margin-right: auto; width: 50%;">
                        <p>* E-mail automatico, por favor não responda.</p>`

                    }).then(message => {
                        console.log(message.email);
                    }).catch(err => {
                        console.log(err);
                    });
                    resolve(results);
                }
            });
        });
    },

    delete(id_exchange) {
        return new Promise((resolve, reject) => {
            conn.query(`
            DELETE FROM tb_exchange WHERE id_exchange = ?
           `, [
                id_exchange
            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }

}