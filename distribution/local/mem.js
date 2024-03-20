const {getID} = require('../util/id.js');

const storage = new Map();

function createCompositeKey(key, gid) {
  return gid ? `${gid}:${key}` : key;
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
    const compositeKey = createCompositeKey(key, gid);
    storage.set(compositeKey, value);
    console.log('the storage at this point ', storage);
    callback(null, value);
  } catch (error) {
    callback(error, null);
  }
}

function get(key, callback, gid = null) {
  let actualKey;
  let actualGid;
  let actualCallback;
  console.log('the orig get args lol ', key, callback, gid);
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
  console.log('the get arguments lol ', key, callback, gid);
  if (key == null) {
    const allKeys = Array.from(storage.keys())
        .filter((k) => {
          return gid == null || k.startsWith(`${gid}:`);
        })
        .map((k) => {
          return gid == null ? k : k.substring(gid.length + 1);
        });
    callback(null, allKeys);
  } else {
    const compositeKey = createCompositeKey(key, gid);
    if (!storage.has(compositeKey)) {
      console.log('cant find it ', compositeKey, storage);
      const error = new Error('Object not found');
      return callback(error, null);
    } else {
      const value = storage.get(compositeKey);
      return callback(null, value);
    }
  }
}

function del(key, callback, gid = null) {
  if (typeof gid === 'function') {
    temp = callback;
    callback = gid;
    gid = temp;
  }
  const compositeKey = createCompositeKey(key, gid);
  console.log('this the storage and key', storage, compositeKey);

  if (!storage.has(compositeKey)) {
    const error = new Error('Object not found');
    callback(error, null);
  } else {
    const objectToDelete = storage.get(compositeKey);
    storage.delete(compositeKey);
    console.log('the storage deleted ', compositeKey);
    callback(null, objectToDelete);
  }
}

module.exports = {get, put, del};
