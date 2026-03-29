// 1. දිනය ලස්සනට පෙන්වන්න (Format Date)
// උදා: "2026-02-04"
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// 2. අහඹු ID එකක් හදන්න (Unique ID Generator)
// ෆයිල් වලට නම් දාන්න වගේ ඕන වෙන්න පුළුවන්
const generateRandomId = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// 3. තත්පර ගණනක් රැඳී සිටීම (Delay/Sleep)
// Testing වලදී ඕන වෙන්න පුළුවන්
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
    formatDate,
    generateRandomId,
    sleep
};