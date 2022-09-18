"use strict";

require('dotenv').config();

const axios = require('axios');
const express = require('express');
const app = express();
const csrf = require('csurf')
const port = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
const csrfProtection = csrf({ cookie: true });

const sendFeedBackMail = require('./utils/send-feedback-mail');
const { body, query, validationResult } = require('express-validator');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Inspiring technology across connected industries' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { pageTitle: 'Projects & Capabilities' });
});

app.get('/contact', csrfProtection, (req, res) => {
    res.render('contact', { pageTitle: 'Contact', csrfToken: req.csrfToken() });
});

app.post(
    '/contact',
    csrfProtection, [
        body('g-recaptcha-response').exists({ checkFalsy: true }),
        body('name', 'Name is required').exists({ checkFalsy: true }),
        body('email', 'A valid email is required').isEmail(),
        body('subject', 'Subject is required').exists({ checkFalsy: true }),
        body('message', 'Message is required').exists({ checkFalsy: true })
    ],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            let errorBag = {};

            errors.array().forEach(element => {
                errorBag[element.param] = element.msg;
            });

            res.json({ status: false, message: 'Invalid Form Fields!', errors: errorBag });
        } else {
            let isNotRobot = await verifyCaptcha(req.body['g-recaptcha-response']);

            if (isNotRobot) {
                sendContactFeedBack(req, res);
            } else {
                res.json({ status: false, message: 'Invalid Form Fields!' });
            }
        }
    });

async function verifyCaptcha(captcha) {

    return axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captcha}`)
        .then(function(response) {
            if (response.data.success) {
                return true;
            }
            return false;
        })
        .catch(function(error) {
            console.log(error);
            return false;
        });

}

async function sendContactFeedBack(req, res) {
    let message = "<h4>A new Feedback Message</h4>";
    message += `<p><b>Name: </b>${req.body.name}</p>`;
    message += `<p><b>Email: </b>${req.body.email}</p>`;
    message += `<p>${req.body.message}</p>`;

    let subject = req.body.subject;

    sendFeedBackMail(message, subject)
        .then(() => res.json({ status: true, message: 'Your feedback was sent. Thank you!' }))
        .catch((error) => {
            console.log(error);
            res.json({ status: false, message: 'Please try again. Thank you!' });
        });
}

app.get('/privacy', (req, res) => {
    res.render('privacy', { pageTitle: 'Privacy' });
});

app.get('/cookies', (req, res) => {
    res.render('cookies', { pageTitle: 'Cookies Policy' });
});

app.get('/terms', (req, res) => {
    res.render('terms', { pageTitle: 'Terms & Conditions' });
});

app.post('/subscriptions', (req, res) => {
    axios.post('https://dashboard.witeroo.com/api/subscriptions', req.body)
        .then(function(response) {
            res.json(response.data);
        })
        .catch(function(error) {
            console.log(error);
            res.json({ success: false, message: 'Please try again later' });
        });
});

app.get(
    '/subscriptions/unsubscribe', [
        query('type').isIn(['Business', 'Individual']),
        query('mailId').isInt({ allow_leading_zeroes: false }),
        query('email').isEmail(),
        query('tId').isInt({ allow_leading_zeroes: false })
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.redirect('/');
        } else {
            next();
        }
    }, (req, res) => {
        axios.post('https://dashboard.witeroo.com/api/subscriptions/unsubscribe', {
                type: req.query.type,
                mailId: req.query.mailId,
                email: req.query.email,
                tId: req.query.tId
            })
            .then(function(response) {
                if (response.data.success) {
                    res.render('unsubscribed', { pageTitle: 'Unsubscribed' });
                } else {
                    res.redirect('/');
                }
            })
            .catch(function(error) {
                console.log(error);
                res.redirect('/');
            });
    });

app.listen(port, () => {
    console.log(`Witeroo app listening on port: ${port}`);
});