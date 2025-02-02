const express = require('express');
const path = require('node:path');
var cors = require('cors')
const asyncHandler = require('express-async-handler');
const db = require('./db/queries');


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

// app.use(cors(corsOptions));
app.use(cors());
// app.options('*', cors((corsOptions)))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/check', asyncHandler(async(req, res) => {
    const {character, x, y} = req.body;
    const coords = await db.getCharacterCoordinates(character);
    if (!coords) {
        const error = new Error('Character Not Found');
        error.code = 400;
        throw error
    }
    if (x >= coords.x0 && x <= coords.x1 && y <= coords.y0 && y >= coords.y1) {
        return res.json({response: true})
    } else {
        return res.json({response: false})
    }
}))

app.use((req, res, next) => {
    const error = new Error('404 Not Found')
    error.code = 404;
    next(error)
})



// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.code || 500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || 500
    });
})
app.listen(3000, () => console.log('Server listening on port 3000!'))
