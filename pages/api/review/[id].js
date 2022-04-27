import { authentication } from "../../../src/middleware/auth";
import { validateDacInfo } from "../../../src/services/helpers";

export default authentication(async function handler(req, res) {
  const { id } = req.query;
  const { status } = req.body;

  await validateDacInfo('dacs', id, status);

  res.status(200).send(`Status updated successfully: ${id}`)
});
