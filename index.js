const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const Url = require('./models/Url');


require('dotenv').config();

const app = express()
app.enable('trust proxy');
const port = process.env.PORT || 3000

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(express.json());


//import routes
const urls = require('./routes/urls')
const redirect = require('./routes/redirect');
const auth = require('./routes/auth');

//Routes middleware
app.use('/url', urls)
app.use('/', redirect)
app.use('/auth', auth);

mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log('connected to DB');
});


app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    }
    res.json({
        'message': error.message
    });
});

app.listen(port, () => console.log(`Example app listening on port port!`))

