let conn = require('./db');
let path = require('path');

module.exports = {

    getBeers(req) {
        return new Promise((resolve, reject) => {
            let query, params = [
                ctitle = req.query.title,
                cname = req.query.name,
                ccategories = req.query.categories,
                ccity = req.query.city,

            ];
            if (!ctitle && !cname && !ccategories && !ccity) {
                query = `
                SELECT *, tb_users.name, tb_users.city FROM tb_beers INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro; 
                `;
            } else {
                query = `
                SELECT *, tb_users.name, tb_users.city FROM tb_beers INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro WHERE tb_beers.title = ? OR tb_users.name = ? OR tb_beers.categories = ? OR tb_users.city = ?
                `;
            }
            conn.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                    console.log(err)
                } else {
                    resolve(results);
                    console.log(results)
                }
            });
        });

    },
    getBeersAdmin(req) {
        return new Promise((resolve, reject) => {
            let fields = req.session.user;
            conn.query(`
            SELECT *, tb_users.name, tb_users.city FROM tb_beers INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro WHERE tb_users.id_cervejeiro = ?; 
             `, [
                fields.id_cervejeiro
            ], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    },
    save(fields, files) {
        return new Promise((resolve, reject) => {
            fields.photo = `images/${path.parse(files.photo.path).base}`;
            let query, queryPhoto = '', newPhoto = '', params = [
                fields.id_cervejeiro,
                fields.title,
                fields.description,
                fields.categories,
                fields.exchange,
                fields.available,
            ];
            if (files.photo.name) {
                queryPhoto = ',photo = ?';
                params.push(fields.photo);
            }
            if (parseInt(fields.id_beer) > 0) {
                params.push(fields.id_beer);
                query = `
                    UPDATE tb_beers
                    SET id_cervejeiro = ?, title = ?, description = ?, categories = ?, exchange = ?, available = ? ${queryPhoto} WHERE id_beer = ?
                `;
            } else {
                if (!files.photo.name) {
                    fields.photo = `images/rotulo-TrocaBeer.png`
                    newPhoto = ',images/rotulo-TrocaBeer.png';
                    params.push(fields.photo);
                    query = `
                         INSERT INTO tb_beers (id_cervejeiro, title, description, categories, exchange, available, photo)
                         VALUE(?, ?, ?, ?, ?, ? ${newPhoto})
                     `;
                }
                query = `
                INSERT INTO tb_beers (id_cervejeiro, title, description, categories, exchange, available, photo)
                VALUE(?, ?, ?, ?, ?, ?, ?)
                `;
            }
            conn.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }

            });
        });
    },

    delete(id_beer) {
        return new Promise((resolve, reject) => {
            conn.query(`
            DELETE FROM tb_beers WHERE id_beer = ?
           `, [
                id_beer
            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }
};