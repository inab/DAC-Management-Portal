import { authentication } from "../../../src/middleware/auth";
import sendMessage from "../../../src/utils/amqp";
import { getUserByUsername } from '../../../src/getUsers';
import { generateIds, createTransaction } from '../../../src/services/helpers';

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { admin, controlledFiles } = req.body;
  console.log("OK")
  const controlledResourcesURN = [].concat.apply([], controlledFiles.map(el => "nc" + ":" + process.env.NEXTCLOUD_DOMAIN + ":" + el))

  const dacId = await generateIds("dacs");

  const role = dacId + ":" + "dac-admin";

  const users = await Promise.all(admin.map(async(user) => await getUserByUsername(user)));

  const emails = users.flat().map(el => el.email)

  const collections = ["dacs", "userRoles"]

  let transaction = await createTransaction(collections, users.flat(), dacId, role, controlledResourcesURN, id)

  if(transaction.response === false) {
    res.json({ alert: `Error during the creation of the DAC. Please go to manage resources/roles section and check if the DAC already existed`})
  }

  const message = { source: "dac-management", userEmail: emails.join(","), dacsEmail: emails.join(","), dataset: controlledFiles.join(","), dacId: dacId };

  await sendMessage(JSON.stringify(message), process.env.RABBITMQ_QUEUE_DATA);

  res.status(200).json({ alert: `DAC created successfully: ${id}` })
});
