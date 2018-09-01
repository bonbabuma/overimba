

const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const owStats = require('./stats.js');


const app = express();
const PORT = process.env.PORT || 3000;




let logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'access.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
}; 






app.use(morgan('combined', { "stream": logger.stream }));
app.set('view engine', 'pug');
app.use('/', express.static('front'));


app.get('/api/:platform/:btag', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const start = Date.now();
	
	owStats.getNewStats(platform, btag).then((data) => {
		res.send(data);
		console.log(Date.now() - start);
	});
	
	
});


app.listen(PORT, (err) => {
	if (err) {
		console.log('ERROR: Failed to start express sever');
		return;
	}
	console.log('Express listening on port ' + PORT);
});


