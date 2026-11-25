const fsPromises = require('fs/promises');
const path = require('path');

const distPath = path.resolve(__dirname, 'dist');
const distAppDataPath = path.resolve(distPath, 'app-data.json');
const mainBundleRegex = /^main(?:\.[^.]+)?\.js$/;

async function getMainBundleName() {
  const distFiles = await fsPromises.readdir(distPath);
  const mainBundles = distFiles.filter(file => mainBundleRegex.test(file));

  if (mainBundles.length === 0) {
    throw new Error('Cannot find main bundle in dist. Run npm run build first.');
  }

  // Prefer hashed bundle when both main.js and main.<hash>.js are present.
  const hashedBundle = mainBundles.find(file => file !== 'main.js');
  return hashedBundle || 'main.js';
}

async function updateAppDataMainFile() {
  const mainBundleName = await getMainBundleName();
  const appDataTargets = [
    {
      filePath: distAppDataPath,
      displayPath: 'dist/app-data.json'
    }
  ];

  for (const target of appDataTargets) {
    const appDataRaw = await fsPromises.readFile(target.filePath, 'utf8');
    const appData = JSON.parse(appDataRaw);
    appData.mainFile = mainBundleName;

    await fsPromises.writeFile(target.filePath, `${JSON.stringify(appData, null, 2)}\n`, 'utf8');
    console.log(`Updated ${target.displayPath} mainFile to ${mainBundleName}`);
  }
}

updateAppDataMainFile().catch(error => {
  console.error(error);
  process.exit(1);
});


