const express = require('express');
const path = require('node:path');
var cors = require('cors')


const app = express();
const allowedOrigins = [
    'http://localhost:5173'
];
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors((corsOptions)))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    const error = new Error('404 Not Found')
    error.code = 404;
    next(error)
})



// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.code || 500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || 500
    });
})
app.listen(3000, () => console.log('Server listening on port 3000!'))
