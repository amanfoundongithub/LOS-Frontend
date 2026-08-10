// Sort direction mapper
export const SORT_DIRECTION_MAP = {
    ASCENDING : "asc",
    DESCENDING: "desc",
};
export const SORT_DIRECTION_LIST = Object.entries(SORT_DIRECTION_MAP).map(([key, value]) => ({
    key,
    value : SORT_DIRECTION_MAP[key]
}));

// Sort by mapper
export const SORT_BY_MAP = {
    USERNAME : "username",
    EMAIL : "email",
    CREATED_DATE: "createdDate",
    LAST_LOGIN_DATE: "lastLoginDate",
    USER_ROLE : "role",
    USER_STATUS: "status",
};
export const SORT_BY_LIST = Object.entries(SORT_BY_MAP).map(([key, value]) => ({
    key,
    value : SORT_BY_MAP[key]
}));


// All direction helper
export const ALL_VALUES_KEY = "ALL";

// Convert from array to list and value
export const convertToKeyAndValue = (listOfValues) => {
    return listOfValues.map((val) => {
        return {
            key: val, 
            value: val
        }
    })
};