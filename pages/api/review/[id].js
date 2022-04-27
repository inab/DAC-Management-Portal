import { authentication } from "../../../src/middleware/auth";
import sendMessage from "../../../src/utils/amqp";
import { getUserById } from '../../../src/getUsers';
import { getRoles, getMembers, validateDacInfo } from '../../../src/services/helpers';

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { status } = req.body;

  const members = await getMembers('dacs', id);

  const roles = await Promise.all(members.map(async (userId) => await getRoles('userRoles', userId)));

  const admin = roles.filter((member) => member.roles.includes(id + ":" + "dac-admin"))
  
  const users = await Promise.all(admin.map(async(user) => await getUserById(user.sub)));

  const emails = users.flat().map(el => el.email)

  await validateDacInfo('dacs', id, status);

  const message = { source: "dac-management", userEmail: emails.join(","), dacsEmail: emails.join(","), dacId: id };

  await sendMessage(JSON.stringify(message));

  res.status(200).send(`Status updated successfully: ${id}`)
});
