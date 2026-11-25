const fsPromises = require('fs/promises');

async function checkMainJs() {
  const distFiles = await fsPromises.readdir('./dist');
  const hasMainBundle = distFiles.some(file => /^main(?:\.[^.]+)?\.js$/.test(file));

  if (!hasMainBundle) {
    throw new Error('main bundle was not generated in dist');
  }
}

setTimeout(() => {
  checkMainJs()
    .then(() => {
      console.log('ng build generate application');
      return process.exit(0)
    })
    .catch(err => {
      console.error(err);
      console.error("ng build doesn't generate application. " +
        "Try to add longer timeout interval for build inside build-timeout.js");
      process.exit(-1);
    });
}, 180000);

