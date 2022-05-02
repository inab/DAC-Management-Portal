import { MongoClient } from 'mongodb'

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.DAC_PORTAL_DB}?connectTimeoutMS=300000&replicaSet=${process.env.MONGO_REPLICASET}&authSource=${process.env.MONGO_AUTH}`;
const options = {}

let client;
let clientPromise;
client = new MongoClient(uri)
clientPromise = client.connect()

export default clientPromise
