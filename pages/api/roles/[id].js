import { authentication } from "../../../src/middleware/auth";
import { getUserIdFromUsername } from '../../../src/getUsers';
import { getMembers, rolesTransaction } from '../../../src/services/helpers';

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { users } = req.body;

  // Get the current list of dac-admin/dac-member users
  const currentAdmins = await Promise.all(users.admin.map(async (admin) => await getUserIdFromUsername(admin)))
  const currentMembers = await Promise.all(users.member.map(async (member) => await getUserIdFromUsername(member)))

  // Get the previous and the current DAC users list and extract the difference between them (intersection):
  const previousDacUsers = await getMembers('dacs', id);
  const currentDacUsers = currentAdmins.concat(currentMembers)
  const usersToDelete = previousDacUsers.filter(el => !currentDacUsers.includes(el));

  /*  Transaction (MongoDB): 
   *  A. Delete roles/membership for users that are no longer associated to this DAC.
   *  B. Update roles for users whose role has been changed.
   */

  const collections = ["dacs", "userRoles"];
  const roles = [`${id}:dac-admin`, `${id}:dac-member`];

  const transaction = await rolesTransaction(collections, roles, id, usersToDelete, currentDacUsers, currentAdmins, currentMembers)
  if(transaction.response === false) {
    res.json({ alert: `Error during the creation of the DAC. Please go to manage resources/roles section and check if the DAC already existed`})
  }

  res.status(200).json({ alert: `Roles updated successfully: ${id}` })
});
