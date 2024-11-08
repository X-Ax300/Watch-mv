1const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const TMDB_BEARER_TOKEN = 'f04dcdf0234a51eeaa40083ac3596bff';

app.get('/create-guest-session', async (req, res) => {
    const url = 'https://api.themoviedb.org/3/authentication/guest_session/new';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error creating guest session' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
