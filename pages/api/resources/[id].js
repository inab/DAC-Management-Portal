import { authentication } from "../../../src/middleware/auth";
import { resourcesTransaction } from '../../../src/services/helpers';
import { v4 as uuidv4 } from 'uuid';

export default authentication(async function handler(req, res) {
    const { id } = req.query;
    const { controlledFiles } = req.body;

    const resourcesURN = [].concat.apply([], controlledFiles.map(el => "nc" + ":" + process.env.NEXTCLOUD_DOMAIN + ":" + el))

    // Generate the domain object.
    const resources = controlledFiles.map((el, idx) => {
        return {
            _id: uuidv4(),
            fileId: el,
            value: "",
            acl: id + ":" + resourcesURN[idx]
        }
    })

    const collections = ["dacs", "policies"];

    const transaction = await resourcesTransaction(collections, id, resources)

    if(transaction.response === false) {
        res.json({ alert: `Error during the management of the DAC resources.`})
      }

    res.status(200).json({ alert: `DAC resources updated successfully: ${id}` })
});