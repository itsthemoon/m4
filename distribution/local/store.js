//  ________________________________________
// / NOTE: You should use absolute paths to \
// | make sure they are agnostic to where   |
// | your code is running from! Use the     |
// \ `path` module for that purpose.        /
//  ----------------------------------------
//         \   ^__^
//          \  (oo)\_______
//             (__)\       )\/\
//                 ||----w |
//                 ||     ||
const fs = require('fs');
const path = require('path');
const {serialize, deserialize} = require('../util/serialization.js');
const {getID} = require('../util/id.js');

const baseDirectory = path.join(__dirname, '..', '..', 'store');

function getFilePath(key, gid) {
  // Use gid to create a subdirectory for each group.
  const directory = gid ?
    path.join(baseDirectory, gid.toString()) :
    baseDirectory;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {recursive: true});
  }
  return path.join(directory, key);
}

function put(value, key, callback, gid = null) {
  if (typeof gid === 'function') {
    temp = callback;
    callback = gid;
    gid = temp;
  }
  if (!key) {
    key = getID(value);
  }

  try {
    const filePath = getFilePath(key, gid);
    fs.writeFileSync(filePath, serialize(value)); // Serialize and write to disk
    callback(null, value);
  } catch (error) {
    callback(error, null);
  }
}

function get(key, callback, gid = null) {
  let actualKey;
  let actualGid;
  let actualCallback;
  if (typeof key === 'object' && key != null) {
    actualKey = key.key;
    actualGid = key.gid;
    key = actualKey;
    gid = actualGid;
    callback = callback;
  } else {
    actualKey = key;
    actualGid = gid;
    actualCallback = callback;
    if (typeof gid === 'function') {
      temp = callback;
      callback = gid;
      gid = temp;
    } else {
      callback = actualCallback;
    }
  }

  if (key == null) {
    // List all keys in the directory specified by gid
    const directory = gid ?
      path.join(baseDirectory, gid.toString()) :
      baseDirectory;
    fs.readdir(directory, (err, files) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, files);
    });
  } else {
    const filePath = getFilePath(key, gid);
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        const value = deserialize(fileContent.toString());
        callback(null, value);
      } else {
        callback(new Error('Object not found'), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
}

function del(key, callback, gid = null) {
  if (typeof gid === 'function') {
    temp = callback;
    callback = gid;
    gid = temp;
  }

  const filePath = getFilePath(key, gid);
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath);
      const value = deserialize(fileContent.toString());
      fs.unlinkSync(filePath);
      callback(null, value);
    } else {
      callback(new Error('Object not found'), null);
    }
  } catch (error) {
    callback(error, null);
  }
}

module.exports = {get, put, del};

// rm - rf./ store/*
