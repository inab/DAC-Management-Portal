import xml2js from 'xml2js';

const parseXml = async (xml) => {
    const promise = await new Promise((resolve, reject) => {
        xml2js.parseString(xml, (error, result) => {
            if (error) reject(error);
            let jsonString = JSON.stringify(result, null, 4)
            let fileIds = JSON.parse(jsonString)["d:multistatus"]["d:response"].map(el => el["d:propstat"][0]["d:prop"])
            let filePath = JSON.parse(jsonString)["d:multistatus"]["d:response"].map(el => el["d:href"])
            resolve({ fileIds: fileIds, filePath: filePath });
        });
    })
    return promise;
}

const parseGroupFoldersXml = async (xml) => {
    const promise = await new Promise((resolve, reject) => {
        xml2js.parseString(xml, (error, result) => {
            if (error) reject(error);
            let jsonString = JSON.stringify(result, null, 4)
            let resourceType = JSON.parse(jsonString)["d:multistatus"]["d:response"].map(el => el["d:propstat"][0]["d:prop"][0]["d:resourcetype"][0] !== "")
            let path = JSON.parse(jsonString)["d:multistatus"]["d:response"].map(el => el["d:href"][0])
            let folders = path.filter((item, i) => resourceType[i])

            resolve({ folders: folders });
        });
    })
    return promise;
}

export { parseXml, parseGroupFoldersXml };