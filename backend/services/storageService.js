const fs = require('fs');
const path = require('path');

// Uploads Folder Path
const uploadDir = path.join(__dirname, '..', 'uploads');

/**
 * ගොනුවක් මැකීම (Delete File)
 * AI එක Run කළාට පස්සේ පින්තූරය මකන්න ඕන නම් මේක ගන්න.
 */
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted file: ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Error deleting file: ${error.message}`);
        return false;
    }
};

/**
 * (Optional) අනාගතයේදී Cloudinary වලට දානවා නම් මෙතන ලියන්න පුළුවන්
 */
const uploadToCloud = async (filePath) => {
    // Cloudinary logic will go here later
    console.log("Mock: Uploading to cloud...");
    return "https://fake-cloud-url.com/image.jpg";
};

module.exports = { deleteFile, uploadToCloud };