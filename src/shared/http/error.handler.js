import { httpErrorTypes } from "./error.types";

export const getErrorType = (err) => {
    if (err.response) {
        switch (err.response.status) {
            case 400:
                return httpErrorTypes.BAD_REQUEST;
            case 401:
                return httpErrorTypes.UNAUTHORIZED;
            case 403:
                return httpErrorTypes.FORBIDDEN;
            case 404:
                return httpErrorTypes.NOT_FOUND;
            case 423:
                return httpErrorTypes.RESOURCE_LOCKED;
            default:
                return httpErrorTypes.INTERNAL_SERVER_ERROR;
        }
    }
    return httpErrorTypes.SERVICE_UNAVAILABLE;
}