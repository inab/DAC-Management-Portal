import axios from "axios";

const basicAuthRequest = async (object) => {
    const response = await axios({
        method: object.method,
        url: process.env.NEXTCLOUD_URL + object.endpoint,
        withCredentials: true,
        auth: {
            username: process.env.NEXTCLOUD_ADMIN_USER,
            password: process.env.NEXTCLOUD_ADMIN_PASSWORD
        },
        data: object.data
    })

    return response
}

const basicAuthRequestWithHeaders = async (object) => {
    const response = await axios({
        method: object.method,
        url: process.env.NEXTCLOUD_URL + object.endpoint,
        withCredentials: true,
        auth: {
            username: process.env.NEXTCLOUD_ADMIN_USER,
            password: process.env.NEXTCLOUD_ADMIN_PASSWORD
        },
        headers: object.headers
    })

    return response
}

export { basicAuthRequest, basicAuthRequestWithHeaders }