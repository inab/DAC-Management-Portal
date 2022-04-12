import { authentication } from "../../../src/middleware/auth";
import sendMessage from "../../../src/utils/amqp";
import { getUserByUsername } from '../../../src/getUsers';
import { postRoles, postResources, postMembers } from '../../../src/services/helpers';

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { admin, controlledResources } = req.body;

  const dacId = "IPC00000000005";
  const role = dacId + ":" + "dac-admin";
  const users = await Promise.all(admin.map(async(user) => await getUserByUsername(user)));

  await Promise.all(users[0].map(async (userInfo) => {
    await postRoles('userRoles', userInfo.id, role);
  }))

  await Promise.all(controlledResources.map(async (file) => {
    await postResources('dacs', dacId, file) })
  );

  await Promise.all(users[0].map(async (userInfo) => {
    await postMembers('dacs', dacId, userInfo.id) })
  );

  const message = { source: "dac-management", userEmail: users[0].email, dataset: controlledResources, dacId: "x" };

  await sendMessage(JSON.stringify(message));

  res.status(200).json({ name: `DAC created successfully: ${id}` })
});
