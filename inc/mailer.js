const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'matheus0verfl0w27@gmail.com',
               pass: '123de456'
           }
       });
    
    module.exports = transporter;