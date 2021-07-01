var conn = require('./db');

module.exports = {

    dashboard(req){

        return new Promise((resolve, reject)=>{
            let fields = req.session.user;
            conn.query(`
            SELECT
            (SELECT COUNT(*) FROM tb_beers INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro WHERE tb_users.id_cervejeiro = ?) AS nrbeers,
            (SELECT COUNT(*) FROM tb_exchange INNER JOIN tb_beers ON tb_exchange.id_beer = tb_beers.id_beer INNER JOIN tb_users ON tb_beers.id_cervejeiro = tb_users.id_cervejeiro WHERE tb_beers.id_cervejeiro = ?) AS nrexchange;
            `,[
                fields.id_cervejeiro,
                fields.id_cervejeiro
            ], (err, results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results[0]);
                }
            });
        });
    },

    getParams(req, params) {
        return Object.assign({}, {
            date: {},
            menus: req.menus,
            user: req.session.user
        }, params);
    },


    getMenus(req){
        let menus = [
            {
                text: "Tela Inicial",
                href: "/admin/",
                icon: "home",
                active: false
            },
            {
                text: "Cervejas",
                href: "/admin/cervejas",
                icon: "beer",
                active: false
            },
            {
                text: "Trocas",
                href: "/admin/trocas",
                icon: "exchange",
                active: false
            },
        ];

        menus.map(menus=>{
            if(menus.href === `/admin${req.url}`) menus.active = true;
        });
        return menus;
    }
};