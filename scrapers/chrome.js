const https = require('https');

module.exports = async function() {
    return new Promise((resolve, reject) => {
        const url = 'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json';
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    // Extract the stable channel version string
                    resolve(parsed.channels.Stable.version);
                } catch (e) {
                    reject(`Chrome parse error: ${e.message}`);
                }
            });
        }).on('error', reject);
    });
};