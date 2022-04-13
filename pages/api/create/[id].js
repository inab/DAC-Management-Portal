import { authentication } from "../../../src/middleware/auth";
import sendMessage from "../../../src/utils/amqp";
import { getUserByUsername } from '../../../src/getUsers';
import { postRoles, postResources, postMembers, generateIds, updateIds } from '../../../src/services/helpers';

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { admin, controlledFiles } = req.body;

  const controlledResourcesURN = [].concat.apply([], controlledFiles.map(el => "nc" + ":" + process.env.NEXTCLOUD_DOMAIN + ":" + el))

  const dacId = await generateIds("dacs");

  const role = dacId + ":" + "dac-admin";

  const users = await Promise.all(admin.map(async(user) => await getUserByUsername(user)));

  await Promise.all(users[0].map(async (userInfo) => {
    await postRoles('userRoles', userInfo.id, role);
  }))

  await Promise.all(controlledResourcesURN.map(async (resource) => {
    await postResources('dacs', dacId, resource) })
  );

  await Promise.all(users[0].map(async (userInfo) => {
    await postMembers('dacs', dacId, userInfo.id) })
  );

  await updateIds('dacs', dacId);

  const message = { source: "dac-management", userEmail: users[0].email, dataset: controlledFiles, dacId: "x" };

  await sendMessage(JSON.stringify(message));

  res.status(200).json({ name: `DAC created successfully: ${id}` })
});
