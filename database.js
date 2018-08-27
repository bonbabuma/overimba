const mongoClient = require('mongodb').MongoClient;
const MONGOURI = 'mongodb://admin:MonsterEnergy3197@127.0.0.1:27017';




let database = function () {
    //var self = this;
	
	mongoClient.connect(url, function (err, client) {
		let collection = client.db('comics').collection('superheroes');
		
		
		collection.find({}).toArray((error, documents) => {
			console.log(documents);
			client.close();
			
			//res.send(documents);
			let docu = {};
			docu.heroArray = documents;
			
			res.render('index', docu);
		});
		
	});
}
