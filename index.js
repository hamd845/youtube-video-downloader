const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Main route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Download route
app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    const format = req.query.format;

    try {
        console.log(`Video URL: ${videoURL}`);
        console.log(`Format: ${format}`);

        const info = await ytdl.getInfo(videoURL);

        let stream;
        if (format === 'mp4') {
            stream = ytdl(videoURL, { filter: 'audioandvideo' });
            res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        } else if (format === 'mp3') {
            stream = ytdl(videoURL, { filter: 'audioonly' });
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
        }

        stream.pipe(res);
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).send('Error downloading video.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

