
const ObjectId = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
const MONGOURI = 'mongodb://127.0.0.1:27017';


function Mongodatabase( database ) {
		let mongoClient;  
		let mongoDB;
		
		this.query = (collection, query, limit, skip = 0) => {
			return mongoDB.collection(collection).find( query ).skip(skip).limit( limit ).toArray();
		}
		
		this.querySort = (collection, query, sort, limit, skip = 0) => {
			return mongoDB.collection(collection).find( query ).sort(sort).skip(skip).limit( limit ).toArray();
		}
		
		this.replaceDocument = (collection, query, document) => {
			mongoDB.collection(collection).replaceOne(query, document,{upsert: true});
		}
		
		this.setDB = ( db ) => {
			if ( mongoClient != null) {
				mongoDB = mongoClient(db);
			} else {
				throw Error ('Connection has not been established.')
			}
		}
		
		this.ObjectId = (id) => {
			return ObjectId(id);
		}

		this.close = () => {
			return mongoClient.close();
		}
		
		
		this.connect = () => {
			return mongo.connect(MONGOURI, { useNewUrlParser: true } )
			.then( (client) => {
				mongoClient = client;
				mongoDB = mongoClient.db(database);
			})
			.catch( (error) => {
				console.log('ERROR:', error);
			});
		}
}


module.exports = Mongodatabase;