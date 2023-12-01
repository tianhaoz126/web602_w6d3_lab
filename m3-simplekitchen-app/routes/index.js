const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

// Simple Kitchen main page
router.get('/', (req, res) => {
  res.render('index', { title: 'Simple Kitchen' });
});

// New Recipe Form
router.get('/new-form', (req, res) => {
  res.render('new-form', { title: 'New Recipe Form' });
});

// Thank You Page
router.get('/thank-you', (req, res) => {
  res.render('thank-you', { title: 'Thank You' });
});

// Registration Form
router.get('/register', (req, res) => {
  res.render('form', { title: 'Registration Form' });
});

// Registrations Listing
router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
}));

// POST endpoint for Registration
router.post('/register', 
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration.save()
        .then(() => { res.redirect('/thank-you'); })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
        });
    } else {
      res.render('form', { 
        title: 'Registration Form',
        errors: errors.array(),
        data: req.body,
      });
    }
  });

module.exports = router;
