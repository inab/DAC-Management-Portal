import { authentication } from "../../../src/middleware/auth";
import sendMessage from "../../../src/utils/amqp";
import { getUserByUsername } from '../../../src/getUsers';
import { generateIds, createTransaction } from '../../../src/services/helpers';
import { v4 as uuidv4 } from 'uuid';

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { admin, controlledFiles } = req.body;

  const controlledResourcesURN = [].concat.apply([], controlledFiles.map(el => "nc" + ":" + process.env.NEXTCLOUD_DOMAIN + ":" + el))

  const dacId = await generateIds("dacs");

  const role = dacId + ":" + "dac-admin";

  const users = await Promise.all(admin.map(async(user) => await getUserByUsername(user)));

  const emails = users.flat().map(el => el.email)

  const collections = ["dacs", "policies", "userRoles"]

  const userIds = users.flat().map(user => user.id)

  const policiesIds = controlledResourcesURN.map(res => uuidv4())

  // Generate the domain objects: dacs, policies, roles.
  const dac = {
    dacId: dacId,
    policies: policiesIds,
    members: userIds,
    info: {
      _id: uuidv4(),
      dacName: "",
      dacStudy: "",
      datasets: "",
      adminName: "",
      adminSurname: "",
      emailAddress: "",
      studyDescription: "",
      status: false
    },
    requests: []
  }

  const policies = controlledFiles.map((el, idx) => {
    const policy = {
      _id: policiesIds[idx],
      fileId: el,
      value: "",
      acl: dacId + ":" + controlledResourcesURN[idx]
    }
    return policy
  })

  const roles = users.flat().map(user => {
    const userRole = {
      sub: user.id,
      roles: [role]
    }
    return userRole
  })

  let transaction = await createTransaction(collections, dac, policies, roles, id)

  if(transaction.response === false) {
    res.json({ alert: `Error during the creation of the DAC. Please go to manage resources/roles section and check if the DAC already existed`})
  }

  const message = { source: "dac-management", userEmail: emails.join(","), dacsEmail: emails.join(","), dataset: controlledFiles.join(","), dacId: dacId };

  await sendMessage(JSON.stringify(message), process.env.RABBITMQ_QUEUE_DATA);

  res.status(200).json({ alert: `DAC created successfully: ${id}` })
});
