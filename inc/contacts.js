var conn = require('./db')
module.exports = {
    render(res, req, error, success){
        res.render('contact', { 
            title: 'Troca Beer - Trocar a sua cerveja é bem fácil!',
            background: 'images/PostBlogOpa.jpg',
            span: 'Gostou da iniciativa?',
            h1: 'Entre em contato conosco!',
            body:req.body,
            error,
            success
        });
    },

    save(fields){
        return new Promise((resolve, reject)=>{
            conn.query(`
            INSERT tb_contacts INTO(name, email, message) VALUES (?, ?, ?)
        `,[
            fields.name,
            fields.email,
            fields.categories

        ], (err, results)=>{
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        })
        });
        
    }

}