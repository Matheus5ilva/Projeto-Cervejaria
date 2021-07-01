var conn = require('./db');
var mailer = require('./mailer');
var bcrypt = require('bcrypt');

module.exports = {

    render(req, res, error) {
        res.render('admin/login', {
            body: req.body,
            error
        });
    },

    renderRegister(req, res, error) {
        res.render('register', {
            body: req.body,
            error
        });
    },

    login(email, password) {

        return new Promise((resolve, reject) => {
            conn.query(`
                SELECT * FROM tb_users WHERE email = ?
            `, [
                email
            ], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (!results.length > 0) {
                        reject('Usuário ou senha incorretos.');
                    } else {
                        let row = results[0];
                        if (row.password !== password) {
                            reject('Usuário ou senha incorretos.');
                        } else {
                            resolve(row);
                        }
                    }
                }
            });
        });
    },
    getUsers(req) {
        return new Promise((resolve, reject) => {
            let fields = req.session.user;
            conn.query(`
                SELECT * FROM tb_users WHERE id_cervejeiro = ?
            `, [
                fields.id_cervejeiro,
            ], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results[0]);
            });
        });
    },
    save(fields) {
        let saltRounds = 10;
        let salt = bcrypt.genSaltSync(saltRounds);
        return new Promise((resolve, reject) => {
            let query, params = [
                fields.name,
                fields.email,
                fields.phone,
                fields.mobile_phone,
                fields.address,
                fields.city,
            ];
            if (parseInt(fields.id_cervejeiro) > 0) {
                params.push(fields.id_cervejeiro);
                query = `
                    UPDATE tb_users
                    SET name = ?, email = ?, phone = ?, mobile_phone = ?, address = ?, city = ? WHERE id_cervejeiro = ?
                `;
            } else {
                query = `
                INSERT INTO tb_users (name, email, phone, mobile_phone, address, city, password)
                VALUE(?, ?, ?, ?, ?, ?, ?)
                `;
                params.push(bcrypt.hashSync(fields.password, salt));
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

    fogout(email) {
        return new Promise((resolve, reject) => {

            conn.query(`SELECT * FROM tb_users WHERE tb_users.email = ?`, [
                email
            ], (err, results) => {
                if (err) {
                    reject("Verifique se o email esta correto.");
                } else {
                    if (!results.length > 0) {
                        reject("Verifique se o email esta correto.");
                    } else {
                        let row = results[0];
                        if (row.email !== email) {
                            reject("Verifique se o email esta correto.");

                        } else {
                            mailer.sendMail({
                                from: 'TrocaBeer <matheus0verfl0w27@gmail.com>',
                                to: JSON.stringify(row.email),
                                subject: 'Troca de senha',
                                text: "Olá! Sua reserva no restaurante Saboroso foi confirmado com sucesso.",
                                html: `<h1>Olá! ${row.name}.</h1>
                                        <h3>Acesse o <a href="http://localhost:3000/change-password">link</a> para alterar sua senha. O seu id é ${row.id_cervejeiro}</h3>
                                         <p>* Este e-mail é automatico. Por favor não responda.</p>`

                            }).then(message => {
                                console.log(message.email);
                                console.log(results);
                            }).catch(err => {
                                console.log(err);
                            });
                            resolve(results);
                        }
                    }

                }
            });
        });
    },

    changePassword(req) {
        return new Promise((resolve, reject) => {
            if (!req.fields.password) {
                reject('Preencha a senha.');
            } else if (req.fields.password !== req.fields.passwordConfirm) {
                reject('Confirme a senha corretamente.');
            } else {
                conn.query(`
                    UPDATE tb_users SET password = ? WHERE id_cervejeiro = ?
                 `, [
                    req.fields.password,
                    req.fields.id_cervejeiro
                ], (err, results) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    }
}