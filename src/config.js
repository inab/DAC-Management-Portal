var keycloakAdminCredentials = {
    grantType: 'client_credentials',
    clientSecret: process.env.KEYCLOAK_ADMINCLI_SECRET,
    clientId: 'admin-cli'  
}

module.exports = {
    keycloakAdminCredentials
};