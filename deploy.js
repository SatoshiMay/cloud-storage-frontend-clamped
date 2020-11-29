const S3 = require("aws-sdk/clients/s3"); // imports AWS SDK
const mime = require('mime-types'); // mime type resolver
const fs = require("fs"); // utility from node.js to interact with the file system
const path = require("path"); // utility from node.js to manage file/folder paths

// configuration necessary for this script to run
const config = {
  s3BucketName: 'www.cloudstore.com',
  folderPath: './dist', // path relative script's location
  index: 'index.html', // to be uploaded last
  skip: ['3rdpartylicenses.txt']
};

// initialise S3 client
const s3 = new S3({ signatureVersion: 'v4' });
let localFiles, remoteFiles;

readRemoteDir()
  .then(_ => readLocalDir(config.folderPath))
  .then(uploadFiles)
  .then(delay(5000))
  .then(_ => deleteOldRemotes())
  .then(_ => { console.log('Done!'); return _; })
  .catch(err => { console.log(`Deploy failed: ${err}`); })


/**
 * @param {String[]} files names of files to upload
 * @returns promise which resolves to true upon successful upload
 */
function uploadFiles(files) {
  // filter out first group of files to upload
  const first = files
    .filter(fileName => fileName !== config.index && config.skip.indexOf(fileName) === -1)
  // map array of filenames to array of promises
  const putObjects = first
    .map(fileName => uploadFile(path.join(__dirname, config.folderPath, fileName), 'max-age=86400'));
  // return a promise which resolves when all files have been uploaded
  return Promise.all(putObjects)
    .then(_ => { first.forEach(f => console.log(`Successfully uploaded ${f}`)); return _; })
    .then(delay(5000)) // wait 5sec for S3 to reach consistency for other uploaded files
    .then(_ => uploadFile(path.join(__dirname, config.folderPath, config.index), 'max-age=0, must-revalidate')) // upload index
    .then(_ => { console.log(`Successfully uploaded ${config.index}`); return true; })
}

/**
 * @param {String} file absolute path of file to upload
 * @returns promise which resolves upon successful upload
 */
function uploadFile(file, cacheType) {
  return fsReadFile(file).then((content) => {
    const fileName = path.basename(file);
    const mimeType = mime.contentType(fileName);

    const request = s3.putObject({
      // ACL: 'public-read',
      Bucket: config.s3BucketName,
      Key: fileName,
      Body: content,
      ContentType: `${mimeType}`,
      CacheControl: `${cacheType}`
    });
    return request.promise();
  });
}

/**
 * @returns a promise which resolves upon succesful deletion of array of remote files
 */
function deleteOldRemotes() {
  return Promise.all(remoteFiles
    .filter(file => localFiles.indexOf(file) === -1)
    .map(file => deleteRemoteFile(file)));
}

/**
 * @param {any} fileName name of file to delete
 * @returns promise which solves upon successful deletion
 */
function deleteRemoteFile(fileName) {
  const request = s3.deleteObject({
    Bucket: config.s3BucketName,
    Key: fileName,
  });
  return request.promise();
}

/**
 *
* @param {Number} ms amoutn of time in milliseconds
* @returns a function which returns a promise which resolves after ms milliseconds to the same value
*/
function delay(ms) {
  return value => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(value), ms);
    });
  }
}

function readLocalDir(dir) {
  return fsReadDir(path.join(__dirname, dir))
    .then(fileNames => { localFiles = fileNames; return fileNames })
}

function readRemoteDir() {
  const listRequest = s3.listObjectsV2({
    Bucket: config.s3BucketName,
  });
  return listRequest
    .promise()
    .then(data => data.Contents.map(item => item.Key)) // extract filenames
    .then(fileNames => { remoteFiles = fileNames; return fileNames; }); // store filenames
}

// promisified version of fs.readFile
function fsReadFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

// promisified version of fs.readdir
function fsReadDir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
