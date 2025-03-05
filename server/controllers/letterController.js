import { google } from 'googleapis';

export const saveLetter = async (req, res) => {
    const { letter, letterTitle } = req.body;
    const googleAccessToken = req.headers['x-google-access-token'];

    // Validate inputs
    if (!letter?.trim()) {
        return res.status(400).json({ message: 'Letter content is required.' });
    }
    if (!googleAccessToken) {
        return res.status(400).json({ message: 'Google access token missing.' });
    }

    try {
        // Initialize OAuth2 client with the user's access token.
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: googleAccessToken });

        // Create the Drive client using the OAuth2 client.
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client,
        });

        // Upload file to the user's Drive.
        const driveResponse = await drive.files.create({
            requestBody: {
                name: letterTitle ? `${letterTitle}.txt` : 'Untitled Letter.txt',
                mimeType: 'text/plain',
            },
            media: {
                mimeType: 'text/plain',
                body: letter,
            },
            fields: 'id, name',
        });

        return res.status(200).json({
            message: 'Letter saved to your Google Drive!',
            file: driveResponse.data,
        });
    } catch (error) {
        console.error('Drive API Error:', {
            code: error.code,
            message: error.message,
            stack: error.stack,
        });

        let status = 500;
        let message = 'Failed to save letter';

        if (error.code === 401) {
            status = 401;
            message = 'Invalid Google access token';
        } else if (error.code === 'ECONNRESET') {
            status = 503;
            message = 'Connection error. Please try again.';
        }

        return res.status(status).json({ message });
    }
};
