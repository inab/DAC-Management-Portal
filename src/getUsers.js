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
    return await kcClient.users.find()
}

const getUserByUsername = async (id) => {
    const kcClient = await initKcClient();
    return await kcClient.users.findOne({username: id})
}

export { getUsers, getUserByUsername }