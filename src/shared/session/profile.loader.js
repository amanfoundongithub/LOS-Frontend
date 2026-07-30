import { getAccessToken } from "../authStore/access_token.storage";
import axios from "axios";
import { config } from "../config/environment.config";
import { getErrorType } from "../http/error.handler";
import { httpErrorTypes } from "../http/error.types";
import { getRefreshToken } from "./refresh-token.refresh";

export const getUserProfile = async () => {
    const accessToken = getAccessToken();
    try {
        const res = await axios.get(
            `${config.BACKEND_SERVICE_BASE_URL}${config.USER_DETAILS_URI}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return res.data;
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refreshing...");
            const newAccessToken = await getRefreshToken();
            console.log(newAccessToken);
        }
    }
};