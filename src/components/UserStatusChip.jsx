import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const UserStatusChip = ({
    userStatus
}) => {
    const MAP_OF_USER_ROLE_TO_COLOR = {
        PENDING_VERIFICATION: {
            color : "warning",
            icon: <AccessTimeOutlinedIcon />
        },
        ACTIVE: {
            color : "success",
            icon : <CheckCircleIcon />
        },
        LOCKED: {
            color : "error",
            icon : <BlockIcon />
        },
        ARCHIVED: {
            color : "error",
            icon : <ClearOutlinedIcon />
        }
    };

    return (
        <Chip
            icon={MAP_OF_USER_ROLE_TO_COLOR[userStatus]["icon"]}
            label={userStatus}
            color={MAP_OF_USER_ROLE_TO_COLOR[userStatus]["color"]}
            size="small"
        />
    )
};

export default UserStatusChip;