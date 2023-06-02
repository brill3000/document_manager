export const Permissions = {
    NONE: 0, // 0000
    READ: 1, // 0001
    WRITE: 2, // 0010
    DELETE: 4, // 0100
    SECURITY: 8, // 1000

    // Extended security
    // Extended security
    DOWNLOAD: 1024,
    START_WORKFLOW: 2048,
    COMPACT_HISTORY: 4096,
    PROPERTY_GROUP: 8192,

    // All grants
    // All grants
    ALL_GRANTS: 15
};
