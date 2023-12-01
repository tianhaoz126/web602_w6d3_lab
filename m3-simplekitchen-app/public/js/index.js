const express = require('express');
const bcrypt = require('bcrypt');
const Registration = require('./models/Registration'); // Adjust the path as necessary
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Registration({
      name,
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect('/registrants'); 
  } catch (error) {
    res.status(500).send("Error registering new user.");
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
