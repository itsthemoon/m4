const assert = require('assert');
var crypto = require('crypto');

// The ID is the SHA256 hash of the JSON representation of the object
function getID(obj) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

// The NID is the SHA256 hash of the JSON representation of the node
function getNID(node) {
  node = {ip: node.ip, port: node.port};
  return getID(node);
}

// The SID is the first 5 characters of the NID
function getSID(node) {
  return getNID(node).substring(0, 5);
}

function idToNum(id) {
  let n = parseInt(id, 16);
  assert(!isNaN(n), 'idToNum: id is not in KID form!');
  return n;
}

function naiveHash(kid, nids) {
  nids.sort();
  return nids[idToNum(kid) % nids.length];
}

function consistentHash(kid, nids) {
  let kidNum = idToNum(kid);
  let sortedNids = [...nids].sort((a, b) => idToNum(a) - idToNum(b));

  let nodeIndex = sortedNids.findIndex((nid) => idToNum(nid) > kidNum);

  // Wrap around to the first node if needed
  if (nodeIndex === -1) {
    nodeIndex = 0;
  }

  return sortedNids[nodeIndex];
}

function rendezvousHash(kid, nids) {
  let maxHash = null;
  let maxNid = null;

  nids.forEach((nid) => {
    const concatenatedInput = kid + nid;
    const hashInput = JSON.stringify(concatenatedInput);
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
    const hashNum = parseInt(hash, 16);

    if (maxHash === null || hashNum > maxHash) {
      maxHash = hashNum;
      maxNid = nid;
    }
  });

  return maxNid;
}

module.exports = {
  getNID: getNID,
  getSID: getSID,
  getID: getID,
  idToNum: idToNum,
  naiveHash: naiveHash,
  consistentHash: consistentHash,
  rendezvousHash: rendezvousHash,
};
