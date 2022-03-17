import xml2js from 'xml2js';

const parseXml = async (xml) => {
    const promise = await new Promise((resolve, reject) => {
        xml2js.parseString(xml, (error, result) => {
            if (error) reject(error);
            let jsonString = JSON.stringify(result, null, 4)
            let parsed = JSON.parse(jsonString)["d:multistatus"]["d:response"].map(el => el["d:href"])
            resolve(parsed);
        });
    })
    return promise;
}

export default parseXml;