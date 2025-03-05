import { google } from 'googleapis';

export const saveLetter = async (req, res) => {
    try {
        const { letter, letterTitle } = req.body;
        if (!letter) {
            return res.status(400).json({ message: 'Letter content is required' });
        }

        // Set up an OAuth2 client with the authenticated user's credentials.
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: req.user.accessToken,
            refresh_token: req.user.refreshToken,
        });

        // Initialize the Google Drive API client.
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // File metadata for the new Google Docs file.
        const fileMetadata = {
            name: letterTitle || 'Untitled Letter',
            mimeType: 'application/vnd.google-apps.document',
            // To save in a specific folder, add a 'parents' array with the folder ID.
        };

        // Prepare the content to be saved by converting plain text to HTML.
        const media = {
            mimeType: 'text/html',
            body: `<html><body>${letter}</body></html>`,
        };

        // Create the file on Google Drive.
        const file = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id',
        });

        return res.status(200).json({ message: 'Letter saved successfully', fileId: file.data.id });
    } catch (error) {
        console.error('Error saving letter:', error);
        return res.status(500).json({ message: 'Error saving letter' });
    }
};

export default { saveLetter };
