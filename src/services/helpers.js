import clientPromise from "../utils/db";

const connectToDACdb = async () => {
    const client = await clientPromise;
    return await client.db("dac-portal-api");
}

const connectToMgtdb = async () => {
    const client = await clientPromise;
    return await client.db("dac-management");
}

const postRoles = async (col, userId, role) => {
    const db = await connectToDACdb();
    const response = await db.collection(col).updateOne(
        { 'sub': userId },
        { $push: { "roles": role } },
        { new: true, upsert: true })

    return response
}

const postResources = async (col, dacId, resource) => {
    const db = await connectToDACdb();
    const fileId = resource.split(":").pop();
    const acl = dacId + ":" + resource;
    
    const response = await db.collection(col).updateOne(
        { 'dacId': dacId },
        {
            $push: {
                'files': {
                    'fileId': fileId,
                    'policy': "",
                    'acl': acl
                }
            }
        },
        { new: true, upsert: true })

    return response
}

const postMembers = async (col, dacId, userId) => {
    const db = await connectToDACdb();
    const response = await db.collection(col).updateOne(
        { 'dacId': dacId },
        {
            $push: {
                'members': userId
            }
        },  
        { new: true, upsert: true })

    return response
}

const validateDacInfo = async (col, dacId, status) => {
    const db = await connectToDACdb();
    const response = await db.collection(col).updateOne(
        { 'dacId': dacId },
        {
            $set: {
                'info.status': status
            }
        },  
        { new: true, upsert: true })

    return response 
}

const getDacInfo = async (col, dacId) => {
    const db = await connectToDACdb();
    const data = await db.collection(col).find({ 'dacId' : dacId }).toArray()
    const { info } = {...data[0]}                                     
    return info
}

const getRoles = async (col, userId) => {
    const db = await connectToDACdb();
    const data = await db.collection(col).find({ 'sub' : userId }).toArray()
    const { sub, roles } = {...data[0]}
    return { sub, roles }
}

const getMembers = async (col, dacId) => {
    const db = await connectToDACdb();
    const data = await db.collection(col).find({ 'dacId' : dacId }).toArray()
    const { members } = {...data[0]}
    return members
}

const generateIds = async (col) => {
    const db = await connectToMgtdb();
    const docs = await db.collection(col).find().toArray()
    const { ids } = {...docs[0]}
    const largest = ids
        .map(el => parseInt(el.split('IPC')[1]))
        .reduce((prev, current) => {
            return Math.max(prev, current)
    })
    const zeroes = 11 - largest.toString().length;
    const id = "IPC" + "0".repeat(zeroes) + (largest + 1);

    return id
}

const updateIds = async (col, dacId) => {
    const db = await connectToMgtdb();
    const docs = await db.collection(col).find().toArray()
    const { _id } = {...docs[0]}
    const response = await db.collection(col).updateOne( 
        { _id : _id },
        { $push: { ids: dacId } }
    )

    return response
}

const getIds = async (col) => {
    const db = await connectToMgtdb();
    const docs = await db.collection(col).find().toArray()
    const { ids } = {...docs[0]}
    return ids
}


export { postRoles, 
         postResources, 
         postMembers, 
         generateIds, 
         updateIds, 
         getIds, 
         getDacInfo, 
         validateDacInfo, 
         getRoles,
         getMembers };