import clientPromise from "../utils/db";

const connectToDACdb = async () => {
    const client = await clientPromise;
    return await client.db("dac-portal-api");
}

const connectToMgtdb = async () => {
    const client = await clientPromise;
    return await client.db("dac-management");
}

const createTransaction = async (collections, users, dacId, role, resources) => {
    const client = await clientPromise;
    let session = await client.startSession();
    let isCompleted = false;

    try {
        session.startTransaction();
        // console.log(session.transaction.state)

        const firstResponse = await Promise.all(resources.map(async (resource) => {
            return await postResources(collections[0], dacId, resource, session)
        }));

        if(firstResponse[0].upsertedCount === 0) {
            throw new Error("Error: Unsuccessful resources addition.")
        }

        const secondResponse = await Promise.all(users.map(async (userInfo) => {
            return await postMembers(collections[0], dacId, userInfo.id, session)
        }));

        if(secondResponse[0].modifiedCount === 0) {
            throw new Error("Error: Unsuccessful members addition.")
        }
        
        const thirdResponse = await Promise.all(users.map(async (userInfo) => {
            return await postRoles(collections[1], userInfo.id, role, session);
        }));

        if(thirdResponse[0].upsertedCount === 0) {
            throw new Error("Error: Unsuccessful user/s role addition.")
        }

        const fourthResponse = await updateIds(collections[0], dacId, session)

        await session.commitTransaction();
        // console.log(session.transaction.state)

    } catch (e) {
        await session.abortTransaction();
        // console.log(session.transaction.state)
        console.error(e)
        return { response : false };
    } finally {
        if(session.transaction.state === "TRANSACTION_COMMITTED"){
            isCompleted = true;
        } else {
            isCompleted = false;
        }
        await session.endSession();
        await client.close();
        return { response : isCompleted };
    }
    
}

const postRoles = async (col, userId, role, session) => {
    const db = await connectToDACdb();
    const response = await db.collection(col).updateOne(
        { 'sub': userId },
        { $addToSet: { "roles": role } },
        { new: true, upsert: true, session: session })
    return response
}

const postResources = async (col, dacId, resource, session) => {
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
        { new: true, upsert: true, session: session })
    return response
}

const postMembers = async (col, dacId, userId, session) => {
    const db = await connectToDACdb();
    const response = await db.collection(col).updateOne(
        { 'dacId': dacId },
        {
            $push: {
                'members': userId
            }
        },
        { new: true, upsert: true, session: session })
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
    const data = await db.collection(col).find({ 'dacId': dacId }).toArray()
    const { info } = { ...data[0] }
    return info
}

const getRoles = async (col, userId) => {
    const db = await connectToDACdb();
    const data = await db.collection(col).find({ 'sub': userId }).toArray()
    const { sub, roles } = { ...data[0] }
    return { sub, roles }
}

const getMembers = async (col, dacId) => {
    const db = await connectToDACdb();
    const data = await db.collection(col).find({ 'dacId': dacId }).toArray()
    const { members } = { ...data[0] }
    return members
}

const generateIds = async (col) => {
    const db = await connectToMgtdb();
    const docs = await db.collection(col).find().toArray()
    const { ids } = { ...docs[0] }
    const largest = ids
        .map(el => parseInt(el.split('IPC')[1]))
        .reduce((prev, current) => {
            return Math.max(prev, current)
        })
    const zeroes = 11 - largest.toString().length;
    const id = "IPC" + "0".repeat(zeroes) + (largest + 1);

    return id
}

const updateIds = async (col, dacId, session) => {
    const db = await connectToMgtdb();
    const docs = await db.collection(col).find().toArray()
    const { _id } = { ...docs[0] }
    const response = await db.collection(col).updateOne(
        { _id: _id },
        { $push: { ids: dacId } },
        { session: session })
    return response
}

const getIds = async (col) => {
    const db = await connectToMgtdb();
    const docs = await db.collection(col).find().toArray()
    const { ids } = { ...docs[0] }
    return ids
}


export {
    postRoles,
    postResources,
    postMembers,
    generateIds,
    updateIds,
    getIds,
    getDacInfo,
    validateDacInfo,
    getRoles,
    getMembers,
    createTransaction
};
