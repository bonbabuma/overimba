const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000


const owjs = require('overwatch-js');



//const db = client.db
app.set('view engine', 'pug');
app.use('/', express.static('front'));



app.get('/api/:platform/:btag', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const start = Date.now();
	
	owjs
		.getAll(platform, 'us', btag)
		.then((data) => {
				console.log(btag ': ' + (Date.now() - start) );
				res.send(data);
		});
	
	
	
});







app.listen(PORT, (err) => {
	if (err) {
		console.log('yo dawg, its been an error');
		return;
	}
	console.log('Example app listening on port 3000!');
});