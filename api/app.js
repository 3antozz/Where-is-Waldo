const express = require('express');
const path = require('node:path');
var cors = require('cors')
const asyncHandler = require('express-async-handler');
const db = require('./db/queries');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./db/client')
const {body, validationResult} = require('express-validator')
require('dotenv')

const allowedOrigins = ['http://localhost:5173', process.env.FRONT_END_URL]
const app = express();
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.set('trust proxy', 1)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const nameValidation = body("name").trim().notEmpty().withMessage("Name must not be empty").bail().matches(/^[a-zA-Z0-9_ ]+$/).withMessage("Name must only contain alphabet and numbers").isLength({min: 3, max: 20}).withMessage("Name must be between 3 and 20 characters");

app.use(
    expressSession({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: null,
        secure: true,
        sameSite: 'none'
      },
      store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
          ttl: 1000 * 60 * 60 * 3
        }
      )
    })
)

app.get('/start', asyncHandler(async(req, res) => {
    req.session.startTime = Date.now()
    return res.json({
        response: true,
        startTime: req.session.startTime
    })
}))

app.get('/finish', asyncHandler(async(req, res) => {
    if (!req.session.startTime) {
        const error = new Error("Game Didn't start")
        error.code = 400;
        throw error;
    }
    const elapsedTime = Date.now() - req.session.startTime;
    req.session.time = elapsedTime;
    return res.json({time: elapsedTime})
}))

app.post('/score', nameValidation, async(req, res, next) => {
    if (!req.session.startTime) {
        const error = new Error("Game Didn't start")
        error.code = 400;
        return next(error);
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.errors.map(err => err.msg);
        return next(errors)
    }
    const name = req.body.name
    const elapsedTime = req.session.time;
    try {
        await db.addScore(name, elapsedTime)
        req.session.destroy(function(err) {
            if (err) {
                return next(err)
            }
        })
        return res.send({response: true})
    } catch(err) {
        return next(err)
    }
})

app.get('/scoreboard', asyncHandler(async(req, res, next) => {
    try {
        const results = await db.getTop10();
        const bigIntToString = results.map((score) => ({...score, time: score.time.toString()}))
        return res.json({scoreboard: bigIntToString})
    } catch(err) {
        return next(err);
    }
}))

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
    console.log(error);
    if (Array.isArray(error)) {
        return res.status(error.code || 500).json({
            errors: error,
            code: error.code || 500
        });
    }
    res.status(error.code || 500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || 500
    });
})
app.listen(3000, () => console.log('Server listening on port 3000!'))
