import { authentication } from "../../../src/middleware/auth";
import { getResources, updateResources } from '../../../src/services/helpers';

export default authentication(async function handler(req, res) {
    const { id } = req.query;
    const { controlledFiles } = req.body;

    const previousResources = await getResources("dacs", id);

    const resourcesIds = previousResources.map(el => el.fileId);

    const filesToAdd = controlledFiles.filter(el => !resourcesIds.includes(el))

    const controlledResourcesURN = [].concat.apply([], filesToAdd.map(el => "nc" + ":" + process.env.NEXTCLOUD_DOMAIN + ":" + el))

    const resourcesToAdd = filesToAdd.map((el, idx) => {
        return {
            fileId: el,
            policy: "",
            acl: id + ":" + controlledResourcesURN[idx]
        }
    })

    const resourcesToMantain = previousResources.map(el => el)
                                                .filter(el2 => controlledFiles.includes(el2.fileId))

    const updatedResources = [...resourcesToMantain, ...resourcesToAdd];

    const response = updateResources("dacs", id, updatedResources)

    //console.log(response)

    res.status(200).json({ alert: `DAC resources updated successfully: ${id}` })
});
