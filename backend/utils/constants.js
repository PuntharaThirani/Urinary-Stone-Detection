module.exports = {
    // පරිශීලක වර්ග (User Roles)
    ROLES: {
        ADMIN: 'admin',
        DOCTOR: 'doctor',
        PATIENT: 'patient',
        STAFF: 'staff',
        ADMIN:   'admin'
    },

    // Report එකේ තත්ත්වය (Status)
    REPORT_STATUS: {
        PENDING: 'pending',   // තාම බලල නෑ
        VERIFIED: 'verified', // දොස්තර බැලුවා
        REJECTED: 'rejected'  // වැරදියි කියලා අයින් කළා
    },

    // Upload කළ හැකි ෆයිල් වර්ග
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],

    // Token එක කල් ඉකුත් වන කාලය
    TOKEN_EXPIRY: '1h'
};