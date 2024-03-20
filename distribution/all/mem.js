const {naiveHash, getID, getNID} = require('../util/id.js');

const mem = function(config) {
  let context = {};
  let nodeMap = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || naiveHash;

  function fetchNodeIDs(callback) {
    global.distribution.local.groups.get(context.gid, (e, v) => {
      if (e && Object.keys(e).length > 0) {
        return callback(new Error(e));
      } else {
        let allNodeInformation = Object.values(v);
        let nids = []; // Array to hold the node IDs

        allNodeInformation.forEach((node) => {
          let nodeID = getNID(node);
          nids.push(nodeID); // Add nodeID to the array
          nodeMap[nodeID] = node; // Map nodeID to the entire node object
        });

        // Return both the array of nodeIDs and the map via the callback
        return callback(null, nids);
      }
    });
  }

  const put = (value, key, callback, gid = context.gid) => {
    // check if we have the key
    if (!key) {
      key = getID(value);
    }

    fetchNodeIDs((error, nodeIDs) => {
      if (error) {
        return callback(error, null);
      }

      const targetNode = context.hash(getID(key), nodeIDs);
      const remote = {node: nodeMap[targetNode], service: 'mem', method: 'put'};
      // send a call via the local comm to the local mem
      global.distribution.local.comm.send([value, key, gid], remote, (e, v) => {
        if (e) {
          return callback(e, null);
        }
        if (v) {
          return callback(null, v);
        }
      });
    });
  };

  const get = (key, callback, gid = context.gid) => {
    fetchNodeIDs((error, nodeIDs) => {
      if (error) {
        return callback(error, null);
      }

      if (key) {
        const targetNode = context.hash(getID(key), nodeIDs);
        const remote = {
          node: nodeMap[targetNode],
          service: 'mem',
          method: 'get',
        };
        global.distribution.local.comm.send([key, gid], remote, (e, v) => {
          if (e) {
            return callback(e, null);
          }
          return callback(null, v);
        });
      } else {
        let aggregatedResults = [];
        let completedRequests = 0;

        // Request data from each node
        nodeIDs.forEach((nodeID) => {
          const remote = {node: nodeMap[nodeID], service: 'mem', method: 'get'};
          global.distribution.local.comm.send([null, gid], remote, (e, v) => {
            if (e) {
              console.log(`Error fetching data from node ${nodeID}:`, e);
            } else {
              aggregatedResults.push(...v);
            }

            completedRequests++;
            if (completedRequests === nodeIDs.length) {
              return callback({}, aggregatedResults);
            }
          });
        });
      }
    });
  };

  const del = (key, callback, gid = context.gid, nids) => {
    if (!key) {
      key = getID(value);
    }

    if (nids) {
      const targetNode = context.hash(getID(key), nids);
      const remote = {node: nodeMap[targetNode], service: 'mem', method: 'del'};
      global.distribution.local.comm.send([key, gid], remote, callback);
    } else {
      fetchNodeIDs((error, nodeIDs) => {
        if (error) {
          return callback(error);
        }

        const targetNode = context.hash(getID(key), nodeIDs);
        const remote = {
          node: nodeMap[targetNode],
          service: 'mem',
          method: 'del',
        };
        global.distribution.local.comm.send([key, gid], remote, callback);
      });
    }
  };

  const reconf = (previousState, callback, gid = context.gid) => {
    // Fetch current node IDs and map
    fetchNodeIDs((error, currentNodeIDs) => {
      if (error) {
        return callback(error);
      }

      const previousNodeIDs = Object.values(previousState).map((node) =>
        getNID(node),
      );
      let keysToRelocate = [];

      // Step 1: Identify all keys that need to be relocated
      get(null, (error, allKeys) => {
        if (error && Object.keys(error).length !== 0) {
          return callback(error);
        }

        allKeys = [...new Set(allKeys)];

        allKeys.forEach((key) => {
          const previousNode = context.hash(getID(key), previousNodeIDs);
          const currentNode = context.hash(getID(key), currentNodeIDs);

          if (previousNode !== currentNode) {
            keysToRelocate.push(key);
          }
        });

        // Step 2: Relocate each key
        let relocationErrors = [];
        let processedKeys = 0;

        keysToRelocate.forEach((key) => {
          get(key, (getError, value) => {
            if (getError && Object.keys(getError).length !== 0) {
              relocationErrors.push({key, error: getError});
              checkCompletion();
              return;
            }

            del(
                key,
                (delError, value) => {
                  if (delError) {
                    relocationErrors.push({key, error: delError});
                    checkCompletion();
                    return;
                  }

                  // Determine the new target node after deletion
                  const newTargetNode = context.hash(getID(key),
                      currentNodeIDs);
                  const remote = {
                    node: nodeMap[newTargetNode],
                    service: 'mem',
                    method: 'put',
                  };

                  global.distribution.local.comm.send(
                      [value, key, gid],
                      remote,
                      (e, v) => {
                        if (e) {
                          relocationErrors.push({key, error: putError});
                        }
                        checkCompletion();
                      },
                  );
                },
                gid,
                previousNodeIDs,
            );
          });
        });

        if (keysToRelocate.length === 0) {
          // If there are no keys to relocate, immediately call the callback
          return callback(null);
        }

        function checkCompletion() {
          processedKeys++;
          if (processedKeys === keysToRelocate.length) {
            // All keys processed, return any errors encountered
            callback(relocationErrors.length > 0 ? relocationErrors : null);
          }
        }
      });
    });
  };

  return {put, get, del, reconf};
};
module.exports = mem;
