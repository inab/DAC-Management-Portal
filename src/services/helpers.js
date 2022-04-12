import clientPromise from "../utils/db";

const connectToDACdb = async () => {
    const client = await clientPromise;
    return await client.db("dac-portal-api");
}

const postRoles = async (col, userId, role) => {
    const db = await connectToDACdb();
    const response = await db.collection(col).updateOne(
        { 'sub': userId },
        { $push: { "roles": role } },
        { new: true, upsert: true })

    return response
}

const postResources = async (col, dacId, fileId) => {
    const db = await connectToDACdb();
    const acl = dacId + ":" + fileId;
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

export { postRoles, postResources, postMembers };