import { MongoClient } from 'mongodb'

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.DAC_PORTAL_DB}?authSource=${process.env.MONGO_AUTH}`;
const options = {}

let client;
let clientPromise;
client = new MongoClient(uri, options)
clientPromise = client.connect()

export default clientPromise
