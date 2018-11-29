'use strict';

const savesModel = require('../models/save');
const moment = require('moment');
const nodemailer = require('nodemailer');

function notification() {
    console.log('called');
    savesModel.find({}, (err, savings) => {
        if (err) return;

        for (let index = 0; index < savings.length; index++) {
            const saving = savings[index];

            if (saving.amountPaidTillDate >= 0 && saving.next_payment) {
                let today = moment().day();
                let next_payment = moment(saving.next_payment);
                let diff_day = next_payment.diff(today, 'day');

                if (diff_day <= 3) {
                    email(saving.email, diff_day);
                }
            }

        }
    })
}

function email(user_email, days) {
    const output = `
            <p>Welcome to Biry Inc</p>
            <h3>Payment notification</h3>
            <hr>
            <p> This is a friendly reminder that you have ${days} day(s), to pay your monthly savings.
            <hr>
            <h3>Click the link below to login to your account and make a payment. Failure to do so before time 
            elapses result in a penalty</h3>
            <a href = http://127.0.0.1:5500/index.html#/home>Activate</a>
        `;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'amaugosomto@gmail.com',
            pass: 'nokia130'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let HelperOptions = {
        from: '"AmaugoSomto" <amaugosomto@gmail.com>',
        to: user_email,
        subject: 'Reminder for payment',
        html: output
    };

    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return
        }
        console.log("The message was sent!");
        console.log(info);
    });
}

module.exports = notification;