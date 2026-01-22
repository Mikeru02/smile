const TABLE_CONFIG = {
    "all-users": [
        { label: "IP", key: "ip" },
        { label: "Name", key: "name" },
        { label: "Course", key: "course" },
        { label: "Year Level", key: "yearlevel" },
        { label: "Time", key: "time_remaining" },
        { label: "Details", key: "details" }
    ],
    "account-management": [
        { label: "UserID", key: "id" },
        { label: "Name", key: "name" },
        { label: "Role", key: "role" },
        { label: "Details", key: "details" },
    ],
    "logs": [
        { label: "Timestamp", key: "timestamp" },
        { label: "Event", key: "event" },
        { label: "Description", key: "description" },
    ]
};

export { TABLE_CONFIG };