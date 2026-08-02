import {
    Card,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";

import { LIST_OF_ALL_NOTIFICATION_TEMPLATE_PERMISSIONS } from "../../../constants/notification_admin.permissions";

export const NotificationAdminProfile = ({
    checkPermission
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2.5, md: 3 },
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                🔐 Your Permissions
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                }}
            >
                {LIST_OF_ALL_NOTIFICATION_TEMPLATE_PERMISSIONS.map((permission) => {
                    const allowed = checkPermission(permission);
                    return (
                        <Chip
                            key={permission}
                            label={permission}
                            icon={allowed ? <GppGoodRoundedIcon />: <GppBadRoundedIcon />}
                            sx={{
                                height: 42,
                                px: 1,
                                borderRadius: "12px",
                                fontWeight: 600,
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.85rem",
                                },
                                transition: "all 0.2s ease",
                                cursor: "default",

                                ...(allowed
                                    ? {
                                        bgcolor: "#E8F5E9",
                                        color: "#1B5E20",
                                        border: "1px solid #81C784",

                                        "& .MuiChip-icon": {
                                            color: "#2E7D32",
                                            fontSize: 20,
                                        },
                                    }
                                    : {
                                        bgcolor: "#FAFAFA",
                                        color: "#616161",
                                        border: "1px solid #E0E0E0",

                                        "& .MuiChip-icon": {
                                            color: "#9E9E9E",
                                            fontSize: 20,
                                        },
                                    }),

                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: 2,
                                },
                            }}
                        />
                    );
                })}
            </Box>
        </Card>
    );
};