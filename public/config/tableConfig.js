const TABLE_CONFIG = {
    "all-client": [
        { label: "ID", key: "id" },
        { label: "IP", key: "ip" },
        { label: "Name", key: "name" },
        { label: "Course", key: "course" },
        { label: "Year Level", key: "yearlevel" },
        { label: "Status", key: "status" },
        { label: "Time Remaining", key: "time_remaining" },
        { label: "Details", key: "details" },
    ],
    "account-management": [
        { label: "ID", key: "id" },
        { label: "Username", key: "username" },
        { label: "Role", key: "role" },
        { label: "Last Login", key: "last_login" },
        { label: "Created At", key: "created_at" },
        { label: "Details", key: "details"}
    ],
    "logs": [
        { label: "Timestamp", key: "timestamp" },
        { label: "Event", key: "name" },
        { label: "Description", key: "description" },
        { label: "Level", key: "level" }
    ]
};

export { TABLE_CONFIG };