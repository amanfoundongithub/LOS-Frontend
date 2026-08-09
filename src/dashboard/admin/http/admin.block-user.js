import axios from "axios"

import { config } from "../../../shared/config/environment.config";
import { getErrorType } from "../../../shared/http/error.handler";
import { httpErrorTypes } from "../../../shared/http/error.types";
import { getRefreshToken } from "../../../shared/session/refresh-token.refresh";
import { getAccessToken, setAccessToken } from "../../../shared/authStore/access_token.storage";

export const blockUser = async (request) => {
    try {
        return await tryBlockUser(request);
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing..df.");
            const newAccessToken = await getRefreshToken();
            setAccessToken(newAccessToken);
            return await tryBlockUser(request);
        } else {
            return null;
        }
    }
}

const tryBlockUser = async (request) => {
    try {
        const accessToken = getAccessToken();
        const res = await axios.post(`${config.BACKEND_SERVICE_BASE_URL}${config.BLOCK_USER_URI}`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return res.data;
    } catch (err) {
        throw err;
    }
}