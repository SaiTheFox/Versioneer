const https = require('https');

module.exports = async function() {
    return new Promise((resolve, reject) => {
        const url = 'https://armmf.adobe.com/arm-manifests/win/AcrobatDC/acrobat/current_version.txt';
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // The endpoint returns raw text, we just trim any invisible newlines
                resolve(data.trim());
            });
        }).on('error', reject);
    });
};