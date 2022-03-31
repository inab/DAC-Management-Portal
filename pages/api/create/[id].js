import { authentication } from "../../../src/middleware/auth";
import clientPromise from "../../../src/utils/db";
import sendMessage from "../../../src/utils/amqp";

export default authentication(async function handler(req, res) {
  const { id } = req.query;

  const client = await clientPromise;
  const db = await client.db("dac-portal-api");

  //const dacs = await db.collection('dacs').find({ 'dacId': "y" }).toArray();
  //const roles = await db.collection('userRoles').find({ 'sub': "z" }).toArray();

  // create collections in dac-portal DB

  const message = { source: "dac-management", userEmail: "test@bsc.es", dataset: "https://test-url/TF009", dacId: "x" };

  await sendMessage(JSON.stringify(message));

  res.status(200).json({ name: `DAC created successfully: ${id}` })
});
