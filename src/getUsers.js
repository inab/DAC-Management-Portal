import KcAdminClient from 'keycloak-admin';
import { keycloakAdminCredentials } from './config'

const initKcClient = async () => {
    const kcAdminClient = new KcAdminClient({
        baseUrl: process.env.KEYCLOAK_URL,
        realmName: 'master'
    });

    await kcAdminClient.auth(keycloakAdminCredentials);

    kcAdminClient.setConfig({
        realmName: 'IPC',
    });

    return await kcAdminClient

}

const getUsers = async () => {
    const kcClient = await initKcClient();
    return await kcClient.users.find({max: 1000})
}

const getUserByUsername = async (id) => {
    const kcClient = await initKcClient();
    return await kcClient.users.findOne({username: id})
}

const getUserById = async (id) => {
    const kcClient = await initKcClient();
    return await kcClient.users.findOne({id: id})
}

const getUserIdFromUsername = async(username) => {
    let { id } = (await getUserByUsername(username))[0]
    return id
  }

export { getUsers, getUserByUsername, getUserById, getUserIdFromUsername }