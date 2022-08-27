"use strict";

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// const sendFeedBackMail = require('./utils/send-feedback-mail');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Inspiring technology across connected industries' });
});

// app.post('/contact', (req, res) => {

//     let message = "<h4>A new Feedback Message</h4>";
//     message += `<p><b>Name: </b>${req.body.name}</p>`;
//     message += `<p><b>Email: </b>${req.body.email}</p>`;
//     message += `<p>${req.body.message}</p>`;

//     sendFeedBackMail(message)
//         .then(() => res.json({ status: true, message: 'Your feedback was sent. Thank you!' }))
//         .catch((error) => {
//             console.log(error);
//             res.json({ status: false, message: 'Please try again. Thank you!' });
//         });

// });

app.listen(port, () => {
    console.log(`Witeroo app listening on port: ${port}`);
});