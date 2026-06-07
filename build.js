const fs = require('fs');
const path = require('path');

// Dynamically import your scraper modules
const scrapeChrome = require('./scrapers/chrome');
const scrapeAdobe = require('./scrapers/adobe');

async function buildVersioneer() {
    console.log("Starting Versioneer build pipeline...");
    const versions = {};

    try {
        console.log("Fetching Google Chrome version...");
        versions['GoogleChrome'] = await scrapeChrome();
        
        console.log("Fetching Adobe Acrobat version...");
        versions['AdobeAcrobat'] = await scrapeAdobe();
    } catch (error) {
        console.error("Error during scraping phase:", error);
        process.exit(1); // Fail the build if scraping fails
    }

    // Set up the public directory for web hosting
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

    // 1. Copy your sleek homepage over to the public folder
    // (Assuming the HTML file from earlier is saved as index.html in the root)
    if (fs.existsSync('index.html')) {
        fs.copyFileSync('index.html', path.join(publicDir, 'index.html'));
    }

    // 2. Create the master JSON for the homepage UI to read
    fs.writeFileSync(path.join(publicDir, 'versions.json'), JSON.stringify(versions, null, 2));
    console.log("✅ Created versions.json");

    // 3. Generate the static "API" files in the root of the public folder
    for (const [app, version] of Object.entries(versions)) {
        const appDir = path.join(publicDir, app);
        if (!fs.existsSync(appDir)) fs.mkdirSync(appDir);
        
        // Writing an index.html with JUST the version string.
        fs.writeFileSync(path.join(appDir, 'index.html'), version);
        console.log(`✅ Generated API endpoint: /${app}`);
    }
    
    console.log("Build complete! The /public folder is ready for deployment.");
}

buildVersioneer();