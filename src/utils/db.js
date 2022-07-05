import { MongoClient } from 'mongodb'

let host = process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? process.env.MONGO_HOST : process.env.MONGO_HOST_TEST;	
let db = process.env.MONGO_DB_MANAGEMENT;
let username = process.env.MONGO_USER;
let password = process.env.MONGO_PASS;
let authSource = process.env.MONGO_AUTH;
let replicaSet = process.env.MONGO_REPLICASET;

let uri = process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? `mongodb://${username}:${password}@${host}/${db}?authSource=${authSource}` :
        `mongodb://${username}:${password}@${host}/${db}?connectTimeoutMS=300000&replicaSet=${replicaSet}&authSource=${authSource}`

let client;
let clientPromise;
client = new MongoClient(uri)
clientPromise = client.connect()

export default clientPromise
