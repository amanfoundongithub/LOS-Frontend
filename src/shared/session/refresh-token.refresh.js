import axios from "axios";
import { config } from "../config/environment.config";
import { getErrorType } from "../http/error.handler";
import { httpErrorTypes } from "../http/error.types";

export const getRefreshToken = async () => {
    try {
        const res = await axios.post(
            `${config.BACKEND_SERVICE_BASE_URL}${config.REFRESH_TOKEN}`,
            {},
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (err) {
        const errorType = getErrorType(err);
        if (errorType === httpErrorTypes.UNAUTHORIZED) {
            console.log("Refresh token denied.");
        }
        return null;
    }
};