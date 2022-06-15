/*
 *  Written By: Jared Hunter
 *
 *  This function was written to reliably list all taskrouter queues for a 
 *  flex workspace and maintains them in a sync map (adding and removing 
 *  from the sync map as queues are added or deleted)
 * 
 *  this sync map can then be used to manage metadata for each queue.  
 *  Each time this function is run stats for the queue are fetched and 
 *   merged with the metadata.
 * 
 *  all this data is returned to the calling location which is intended to be 
 *  a backend system that can periodically calls this function, caches the result, 
 *  and expose the cache via its own API.  This is useful when a solution wants to 
 *  expose queue stats or queue configuration to something outside of flex such as
 *  the IVR.  An example use case might be for returning operational hours 
 *  (metadata) and approximate wait times to be used in the IVR in a scalable 
 *  manner.  
 * 
 *  the sync map allows for managing the metadata through an admin panel
 *  in a custom component in flex ui
 *
 *  DEPENDENCIES: After creating function ensure environment variable is added
 *     TWILIO_FLEX_WORKSPACE_SID    - assign the value of your flex workspace
 *     TWILIO_FLEX_SYNC_SID         - assign the value of the sync service to map 
 *                                  stats
 * 
 *     TWILIO_SERVICE_RETRY_LIMIT   - max number of retry attempts, 
 *                                  applicable to sync and task router queries
 *     TWILIO_SERVICE_MAX_BACKOFF   - max back of period the queries to task router
 *                                  will take when retrying, recommend 0 if twilio
 *                                  hosted
 *     TWILIO_SERVICE_MIN_BACKOFF   - min back of period the queries to task router
 *                                  will take when retrying, recommend 0 if twilio 
 *                                  hosted
 * 
 *     TWILIO_SYNC_MAX_BACKOFF      - max back of period the queries to sync will 
 *                                  take when retrying, recommend 2000
 *     TWILIO_SYNC_MIN_BACKOFF      - min back of period the queries to task router 
 *                                  will take when retrying, recommend 1000
 *     
 *     QUEUE_STATS_MAP_NAME         - name of syncMap to store stats
 *     QUEUE_STATS_CUMULATIVE_PERIOD_MINUTES  - period in minutes from which to 
 *                                            count stats backwards from now
 *     QUEUE_STATS_SLA_SPLIT_PERIODS - split periods to cut cumulative stats 
 *                                    by 30,60,120
 *     QUEUE_STATS_TASKROUTER_STATS_BATCH_SIZE - throttle on max concurrent requests 
 *                                             to task router
 *     QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE - throttle on max concurrent 
 *                                            requests to sync
 */

exports.handler = function refreshStats (context, event, callback) {
    const client = context.getTwilioClient();
    const syncService = client.sync.services(context.TWILIO_FLEX_SYNC_SID);
    const response = new Twilio.Response();

    const QUEUE_STATS_MAP_NAME = process.env.QUEUE_STATS_MAP_NAME
    const START_DATE = new Date((new Date()) - process.env.QUEUE_STATS_CUMULATIVE_PERIOD_MINUTES*60000);
    const QUEUE_STATS_SLA_SPLIT_PERIODS = process.env.QUEUE_STATS_SLA_SPLIT_PERIODS
    const TWILIO_SERVICE_MAX_BACKOFF = process.env.TWILIO_SERVICE_MAX_BACKOFF
    const TWILIO_SERVICE_MIN_BACKOFF = process.env.TWILIO_SERVICE_MIN_BACKOFF
    const TWILIO_SYNC_MAX_BACKOFF = process.env.TWILIO_SYNC_MAX_BACKOFF
    const TWILIO_SYNC_MIN_BACKOFF = process.env.TWILIO_SYNC_MIN_BACKOFF
    const TWILIO_SERVICE_RETRY_LIMIT = process.env.TWILIO_SERVICE_RETRY_LIMIT
    const QUEUE_STATS_TASKROUTER_STATS_BATCH_SIZE = process.env.QUEUE_STATS_TASKROUTER_STATS_BATCH_SIZE
    const QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE = process.env.QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE

    var errorMessages;
  
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
    response.appendHeader("Content-Type", "application/json");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  
    const validateParameters = function(context, event) {
      errorMessages = "";
      errorMessages += context.TWILIO_FLEX_WORKSPACE_SID
        ? ""
        : "Missing TWILIO_FLEX_WORKSPACE_SID from context environment variables, ";
      errorMessages += context.TWILIO_FLEX_SYNC_SID
        ? ""
        : "Missing TWILIO_FLEX_SYNC_SID from context environment variables, ";
      errorMessages += context.QUEUE_STATS_MAP_NAME
        ? ""
        : "Missing QUEUE_STATS_MAP_NAME from context environment variables, ";
      errorMessages += context.QUEUE_STATS_CUMULATIVE_PERIOD_MINUTES
        ? ""
        : "Missing QUEUE_STATS_CUMULATIVE_PERIOD_MINUTES  from context environment variables, ";
      errorMessages += context.QUEUE_STATS_SLA_SPLIT_PERIODS
      ? ""
      : "Missing QUEUE_STATS_SLA_SPLIT_PERIODS from context environment variables, ";
      errorMessages += context.TWILIO_SERVICE_MAX_BACKOFF
      ? ""
      : "Missing TWILIO_SERVICE_MAX_BACKOFF from context environment variables, ";
      errorMessages += context.TWILIO_SERVICE_MIN_BACKOFF
      ? ""
      : "Missing TWILIO_SERVICE_MIN_BACKOFF from context environment variables, ";
      errorMessages += context.TWILIO_SYNC_MAX_BACKOFF
      ? ""
      : "Missing TWILIO_SYNC_MAX_BACKOFF from context environment variables, ";
      errorMessages += context.TWILIO_SYNC_MIN_BACKOFF
      ? ""
      : "Missing TWILIO_SYNC_MIN_BACKOFF from context environment variables, ";
      errorMessages += context.TWILIO_SERVICE_RETRY_LIMIT
      ? ""
      : "Missing TWILIO_SERVICE_RETRY_LIMIT from context environment variables, ";
      errorMessages += context.QUEUE_STATS_TASKROUTER_STATS_BATCH_SIZE
      ? ""
      : "Missing QUEUE_STATS_TASKROUTER_STATS_BATCH_SIZE from context environment variables, ";
      errorMessages += context.QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE
      ? ""
      : "Missing QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE from context environment variables, ";
      if (errorMessages === "") {
        return true;
      } else {
        return false;
      }
    };

    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

    const getRandomIntInclusive = function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
    }

    const chunkArray = function (array, size) {
      let result = []
      for (value of array){
          let lastArray = result[result.length -1 ]
          if(!lastArray || lastArray.length == size){
              result.push([value])
          } else{
              lastArray.push(value)
          }
      }
      return result
    }

    const listQueues = function(twilioClient) {
      return new Promise(function(resolve, reject) {
        twilioClient.taskrouter
          .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
          .taskQueues.list()
          .then(result => {
            var queueArray = [];
            result.forEach(arrayItem => {
              queueArray.push({
                sid: arrayItem.sid,
                friendlyName: arrayItem.friendlyName,
                realTimeStats: {},
                cumulativeStats: {},
                customQueueConfiguration: {}
              });
            });
            resolve({ success: true, queueArray: queueArray });
          })
          .catch(err => {
            console.log("err message: ", err.message);
            resolve({ success: false, message: err.message });
          });
      });
    }

    // retrieves all queues for the environment configured workspace
    // then proceeds to fetch all stats data for them
    // returns an array of objects for each queue populated with the relevant stats nested on
    // the object.  This is done by batching up the requests as promises and execute the promises 
    // in batches
    // {
    //   sid:   // queue SID
    //   friendlyName: // queue friendly name
    //   realTimeStats: {}, // queue real time stats information
    //   cumulativeStats: {}, // queue cumulative stats for the preset configured period
    //   customQueueConfiguration: {} // configuration object for the custom queue meta data such as open and close times
    // }
    const fetchAllQueueStatistics = function(twilioClient) {
      return new Promise(async function(resolve, reject) {
        listQueues(twilioClient).then(result => {
          if (result.success) {
            var queueResultsArray = result.queueArray;
            var getStatsPromiseArray = [];
            queueResultsArray.forEach(queueItem => {
              
              // Every cycle retreive realtime stats and cumulative stats for all known channels
              // comment out the channel if it is not used,
              // to save on redundent calls to backend

              getStatsPromiseArray.push(
                populateRealTimeStatsForQueueItem(twilioClient, queueItem, null, 0, 0)
              );
  
              //get stats filtered by channel
              getStatsPromiseArray.push(
                populateRealTimeStatsForQueueItem(twilioClient, queueItem, "voice", 0, 0)
              );

               getStatsPromiseArray.push(
                populateRealTimeStatsForQueueItem(twilioClient, queueItem, "chat", 0, 0)
              );
              
  
              //Now get cumulative stats for each queue, broken down by channel
              getStatsPromiseArray.push(
                populateCumulativeStatsForQueueItem(twilioClient, queueItem, null, 0, 0)
              );
  
              getStatsPromiseArray.push(
                populateCumulativeStatsForQueueItem(twilioClient, queueItem, "voice", 0, 0)
              );
  
              getStatsPromiseArray.push(
                populateCumulativeStatsForQueueItem(twilioClient, queueItem, "chat", 0, 0)
              );
  
            });

            //break the array into batches and process each batch sequentially to throttle max API calls used
            // remember there is a max of 100 concurrent inbound calls to twilio and there are other
            // customer solutions/features that will be making calls.
            var batchedArrays = chunkArray(getStatsPromiseArray, QUEUE_STATS_TASKROUTER_STATS_BATCH_SIZE);

            processPromiseBatchArray(batchedArrays.reverse())
            .then(() => {
              resolve(queueResultsArray)
            });

          }
          else {
            console.log(`ERROR: Failure retrieving queues`);
            reject('ERROR: Failed to retrieve queues');
          }
        })
        .catch(err => {
          console.log(`ERROR: Failure retrieving queues: ${err}`);
          reject(`ERROR: Failed to retrieve queuest. ${err.message}`);
        })
      });
    }

    // Generic function for processing a batched array of promise arrays
    const processPromiseBatchArray = function(promiseBatchArray){
      return new Promise(async function(resolve, reject) {
        var batch = promiseBatchArray.pop()
        if(batch){
          Promise.all(batch)
          .then(() => {
            if(promiseBatchArray.length > 0){
              processPromiseBatchArray(promiseBatchArray)
              .then(() => {
                resolve()
              });
            }
            else{
              resolve();
            }
          })
          .catch(err => {
            console.log(`ERROR DURING processing BATCH`);
          });
        }
        else{
          console.log(`batch empty`)
          resolve();
        }
      });
    }

    // function for retrieving or creating sync map which will retry recursively
    const fetchOrCreateSyncMap = function(mapName, create, delay, retryAttempts) {
      return new Promise(async function(resolve, reject) {

        // delay random backoff period
        await snooze(delay);

        if(create == false){
          syncService
          .syncMaps(mapName)
          .fetch()
          .then(syncMap => {
            resolve(syncMap)
          })
          .catch(err => {
            // 20404 item not found https://www.twilio.com/docs/api/errors/20404
            // attempt to create it
            if(err.code == 20404){
              console.log(`syncMap ${mapName} not found, attempting to create it`);
              fetchOrCreateSyncMap(mapName, true, delay, retryAttempts+1)
              .then(syncMap => {
                resolve(syncMap)
              })
              .catch(err => {
                reject(err);
              })
            }
            // sync rate limit exceeded https://www.twilio.com/docs/api/errors/54009
            // retry after a delay
            else{
              if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
                console.log(`error fetching syncMap ${mapName}, sync rate limit reached, retrying ${retryAttempts+1}`);
                fetchOrCreateSyncMap(mapName, create, ((delay*2)+getRandomIntInclusive(TWILIO_SYNC_MIN_BACKOFF, TWILIO_SYNC_MAX_BACKOFF)), retryAttempts+1)
                .then(syncMap => {
                  resolve(syncMap)
                })
                .catch(err => {
                  reject(err);
                })
              }
              else{
                // too many retry attempts
                console.log(`error fetching syncMap ${mapName}, too many retry attempts`);
                reject(err);
              }
            }
          });
        }
        else{
          syncService
          .syncMaps
          .create({ uniqueName: mapName })
          .then(sync_map => {
            console.log("sync map created: " + sync_map.sid);
            resolve();
          })
          .catch(err =>{
            if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
              console.log(`error creating syncMap ${mapName}, sync rate limit reached, retrying ${retryAttempts+1}`);
              fetchOrCreateSyncMap(mapName, create, ((delay*2)+getRandomIntInclusive(TWILIO_SYNC_MIN_BACKOFF, TWILIO_SYNC_MAX_BACKOFF)), retryAttempts+1)
              .then(syncMap => {
                resolve(syncMap)
              })
              .catch(err => {
                reject(err);
              })
            }
            else{
              // too many retry attempts
              console.log(`error creating syncMap ${mapName}, too many retry attempts`);
              reject(err);
            }
          });
        }
      });
    };

    // function for retrieving sync map items which will retry recursively
    const fetchSyncMapItems = function(mapName, delay, retryAttempts) {
      return new Promise(async function(resolve, reject) {

        // delay random backoff period
        await snooze(delay);

        syncService
        .syncMaps(mapName)
        .syncMapItems
        .list({limit: 100})
        .then(syncMapItems => {
          resolve(syncMapItems)
        })
        .catch(err => {
          // if map doesnt exist create it first then retry
          if(err.code == 20404){
            console.log(`syncMap ${mapName} not found, attempting to create it`);
            fetchOrCreateSyncMap(mapName, true, 0, 0)
            .then(syncMap => {
              fetchSyncMapItems(mapName, 0, retryAttempts+1)
              .then(syncMapItems => {
                resolve(syncMapItems)
              })
              .catch(err => {
                reject(err);
              })
            })
            .catch(err => {
              reject(err);
            })
          }
          // sync rate limit exceeded https://www.twilio.com/docs/api/errors/54009
          // retry after a delay
          else if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
            console.log(`error fetching syncMap items ${mapName}, sync rate limit reached, retrying ${retryAttempts+1}`);
            fetchSyncMapItems(mapName, ((delay*2)+getRandomIntInclusive(TWILIO_SYNC_MIN_BACKOFF, TWILIO_SYNC_MAX_BACKOFF)), retryAttempts+1)
            .then(syncMapItems => {
              resolve(syncMapItems)
            })
            .catch(err => {
              reject(err);
            })
          }
          else{
            // too many retry attempts
            console.log(`error fetching syncMap ${mapName}, too many retry attempts`);
            reject(err);
          }
        });
      });
    };

    // function for updating or creating an item in a given sync map which will retry recursively
    const updateOrCreateSyncMapItem = function(mapName, queueItem, create, delay, retryAttempts) {
      return new Promise(async function(resolve, reject) {

        // delay random backoff period
        await snooze(delay);

        if(create == false)
        {
          syncService
          .syncMaps(mapName)
          .syncMapItems(queueItem.sid)
          .update({ data: queueItem })
          .then(item => {
            resolve(item);
          })
          .catch(err => {
            // 20404 item not found https://www.twilio.com/docs/api/errors/20404
            // attempt to create it
            if(err.code == 20404){
              console.log(`syncItem ${mapName}:${queueItem.sid} not found, attempting to create it`);
              updateOrCreateSyncMapItem(mapName, queueItem, true, delay, retryAttempts+1)
              .then(item => {
                resolve(item)
              })
              .catch(err => {
                reject(err);
              })
            }
            else{
              if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
                console.log(`error updating syncItem ${mapName}:${queueItem.sid}, sync rate limit reached, retrying ${retryAttempts+1}`);
                updateOrCreateSyncMapItem(mapName, queueItem, create, ((delay*2)+getRandomIntInclusive(TWILIO_SYNC_MIN_BACKOFF, TWILIO_SYNC_MAX_BACKOFF)), retryAttempts+1)
                .then(item => {
                  resolve(item)
                })
                .catch(err => {
                  reject(err);
                })
              }
              else{
                // too many retry attempts
                console.log(`error updating syncItem ${mapName}:${queueItem.sid}, too many retry attempts`);
                reject(err);
              }
            }
          });
        }
        else
        {
          syncService
          .syncMaps(mapName)
          .syncMapItems.create({
            key: queueItem.sid,
            data: queueItem
          })
          .then(item => {
            console.log(`Item created ${mapName}:${queueItem.sid}`);
            resolve(item);
          })
          .catch(err => {
            // sync rate limit exceeded https://www.twilio.com/docs/api/errors/54009
            // retry after a delay
              if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
                console.log(`error creating syncItem ${mapName}:${queueItem.sid}, sync rate limit reached, retrying ${retryAttempts+1}`);
                updateOrCreateSyncMapItem(mapName, queueItem, create, ((delay*2)+getRandomIntInclusive(TWILIO_SYNC_MIN_BACKOFF, TWILIO_SYNC_MAX_BACKOFF)), retryAttempts+1)
                .then(item => {
                  resolve(item)
                })
                .catch(err => {
                  reject(err);
                })
              }
              else{
                // too many retry attempts
                console.log(`error creating syncItem ${mapName}:${queueItem.sid}, too many retry attempts`);
                reject(err);
              }
          });
        }
      });
    };

    // function for deleting an item in a given sync map which will retry recursively
    const deleteSyncMapItem = function(mapName, item, delay, retryAttempts) {
      return new Promise(async function(resolve, reject) {

        // delay random backoff period
        await snooze(delay);

          syncService
          .syncMaps(mapName)
          .syncMapItems(item.key)
          .remove()
          .then(() => {
            console.log(`Succesffully removed sync item ${mapName}:${item.key}`);
            resolve(item);
          })
          .catch(err => {
            // 20404 item not found https://www.twilio.com/docs/api/errors/20404
            // already removed
            if(err.code == 20404){
                console.log(`Already removed sync item ${mapName}:${item.key}`);
                resolve(item)
            }
            else{
              if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
                console.log(`error deleting syncItem ${mapName}:${item.key}, sync rate limit reached, retrying ${retryAttempts+1}`);
                deleteSyncMapItem(mapName, item, ((delay*2)+getRandomIntInclusive(TWILIO_SYNC_MIN_BACKOFF, TWILIO_SYNC_MAX_BACKOFF)), retryAttempts+1)
                .then(() => {
                  resolve(item)
                })
                .catch(err => {
                  reject(err);
                })
              }
              else{
                // too many retry attempts
                console.log(`error deleting syncItem ${mapName}:${item.key}, too many retry attempts`);
                reject(err);
              }
            }
          });
      });
    };
  
    // given a queue item from the listQueues function, query the realtime stats API and place it on the queue object.
    const populateRealTimeStatsForQueueItem = function (twilioClient, queueItem, taskChannel, delay, retryAttempts) {
      return new Promise(async function(resolve) {

        await snooze(delay);

        twilioClient.taskrouter
          .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
          .taskQueues(queueItem.sid)
          .realTimeStatistics()
          .fetch({ taskChannel: taskChannel ? taskChannel : undefined })
          .then(result => {
            taskChannel = !taskChannel ? "all" : taskChannel;
            queueItem.realTimeStats[taskChannel] = minimizeRealTimeStats(result);
            queueItem.realTimeStats[taskChannel]["error"] = null;
            resolve(queueItem);
          })
          .catch(err => {
            if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
              console.log(`error fetching realtimestats for ${queueItem.sid}, retrying ${retryAttempts+1}`);
              populateRealTimeStatsForQueueItem(twilioClient, queueItem, taskChannel, ((delay*2)+getRandomIntInclusive(TWILIO_SERVICE_MIN_BACKOFF, TWILIO_SERVICE_MAX_BACKOFF)), retryAttempts+1)
              .then(() => {
                resolve(queueItem);
              })
            }
            else{
              // too many retry attempts
              console.log(`error fetching realtimestats for ${queueItem.sid}, too many retry attempts`);
              queueItem.realTimeStats[taskChannel]["error"] = err;
              resolve(queueItem);
            }
          });
      });
    }
  
    // given a queue item from the listQueues function, query the cumulative stats API and place it on the queue object.
    const populateCumulativeStatsForQueueItem = function (twilioClient, queueItem, taskChannel, delay, retryAttempts) {
      return new Promise(async function(resolve) {
        
        await snooze(delay);

        twilioClient.taskrouter
          .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
          .taskQueues(queueItem.sid)
          .cumulativeStatistics()
          .fetch({
            taskChannel: taskChannel ? taskChannel : undefined,
            startDate: START_DATE,
            splitByWaitTime: QUEUE_STATS_SLA_SPLIT_PERIODS
          })
          .then(result => {
            taskChannel = !taskChannel ? "all" : taskChannel;
            queueItem.cumulativeStats[taskChannel] = minimizeCumulativeStats(result);
            queueItem.cumulativeStats[taskChannel]["error"] = null;
            resolve(queueItem);
          })
          .catch(err => {
            if(retryAttempts < TWILIO_SERVICE_RETRY_LIMIT){
              console.log(`error fetching cumulative stats for ${queueItem.sid}, retrying ${retryAttempts+1}`);
              populateCumulativeStatsForQueueItem(twilioClient, queueItem, taskChannel, ((delay*2)+getRandomIntInclusive(TWILIO_SERVICE_MIN_BACKOFF, TWILIO_SERVICE_MAX_BACKOFF)), retryAttempts+1)
              .then(() => {
                resolve(queueItem)
              })
            }
            else{
              // too many retry attempts
              console.log(`error fetching cumulative stats for ${queueItem.sid}, too many retry attempts`);
              queueItem.cumulativeStats[taskChannel] = {"error": err };
              resolve(queueItem);
            }
          });
      });
    }
  
    // As there is a maximum size of 16KB per sync map item, minimize the text in the object to minimize the footprint on the object
    const minimizeRealTimeStats = function(realTimeStats) {
      if (realTimeStats) {
        var result = {};
        result.activityStatistics = [];
  
        realTimeStats.activityStatistics.forEach(activity => {
          result.activityStatistics.push({
            friendly_name: activity.friendly_name,
            workers: activity.workers
          });
        });
  
        result.oldestTask = realTimeStats.longestTaskWaitingAge;
        result.tasksByPriority = realTimeStats.tasksByPriority;
        result.tasksByStatus = realTimeStats.tasksByStatus;
        result.availableWorkers = realTimeStats.totalAvailableWorkers;
        result.eligibleWorkers = realTimeStats.totalEligibleWorkers;
        result.totalTasks = realTimeStats.totalTasks;
  
        return result;
      } else {
        return null;
      }
    }
  
    // As there is a maximum size of 16KB per sync map item, minimize the text in the object to minimize the footprint on the object
    const minimizeCumulativeStats = function(cumulativeStatistics) {
      if (cumulativeStatistics) {
        var minimizedCumulativeStats = {
          rCreated: cumulativeStatistics.reservationsCreated,
          rRej: cumulativeStatistics.reservationsRejected,
          rAccepted: cumulativeStatistics.reservationsAccepted,
          rTimedOut: cumulativeStatistics.reservationsTimedOut,
          rCancel: cumulativeStatistics.reservationsCanceled,
          rRescind: cumulativeStatistics.reservationsRescinded,
  
          tCompl: cumulativeStatistics.tasksCompleted,
          tMoved: cumulativeStatistics.tasksMoved,
          tEnter: cumulativeStatistics.tasksEntered,
          tCanc: cumulativeStatistics.tasksCanceled,
          tDel: cumulativeStatistics.tasksDeleted,
  
          waitUntilCancel: cumulativeStatistics.waitDurationUntilCanceled,
          waitUntilAccept: cumulativeStatistics.waitDurationUntilAccepted,
          splitByWaitTime: cumulativeStatistics.splitByWaitTime,
  
          endTime: cumulativeStatistics.endTime,
          startTime: cumulativeStatistics.startTime,
  
          avgTaskAcceptanceTime: cumulativeStatistics.avgTaskAcceptanceTime
        };
  
        return minimizedCumulativeStats;
      } else {
        return null;
      }
    }


    // MAIN Function
    // validate the parameters are setup for the account then fetch all the queues and their associated statistics
    // fetch or create the sync map to ensure it exists
    // then for each queue item, generate a promise to update or create it in the sync map
    // batch up the promises and update the sync map in batches with a backoff and retry period set in the configuration
    // finally remove from the sync map and items that appear that arent in the queue list (queue has been deleted)
    if (validateParameters(context, event)) {
        fetchAllQueueStatistics(client)
        .then(queueStatsArray => {
          fetchSyncMapItems(QUEUE_STATS_MAP_NAME, 0, 0)
          .then(items => {
            var updateSyncMapPromiseArray = [];
            var itemsToDeleteArray = [];

            items.forEach(item =>{
              const matchingQueueStats = queueStatsArray.find(queue => queue.sid === item.key);
              if (matchingQueueStats) {
                // Copy over customQueueConfiguration property to queueStats object
                matchingQueueStats.customQueueConfiguration = item.data.customQueueConfiguration;
              } else {
                // Delete any SyncMap Items for queues that no longer exist in TaskRouter
                itemsToDeleteArray.push(deleteSyncMapItem(QUEUE_STATS_MAP_NAME, item, 0, 0));
              }
            });

            queueStatsArray.forEach(queueItem => {
              const { sid, friendlyName, customQueueConfiguration } = queueItem;
              const matchingSyncMapItem = items.find(item => item.key === sid);

              // Create any missing SyncMap Items for queues that were added to TaskRouter since last refresh
              if (matchingSyncMapItem === undefined) {
                const newSyncMapItemData = { sid, friendlyName, customQueueConfiguration };
                updateSyncMapPromiseArray.push(updateOrCreateSyncMapItem(QUEUE_STATS_MAP_NAME, newSyncMapItemData, true, 0, 0));
              }

              // Update any SyncMap Items for queues that have been changed in TaskRouter since last refresh
              if (matchingSyncMapItem !== undefined && matchingSyncMapItem.data.friendlyName !== friendlyName) {
                const { friendlyName } = queueItem;
                const updatedSyncMapItemData = { ...matchingSyncMapItem.data, friendlyName };
                updateSyncMapPromiseArray.push(updateOrCreateSyncMapItem(QUEUE_STATS_MAP_NAME, updatedSyncMapItemData, false, 0, 0));
              }
            });

            var batchedArrays = chunkArray(updateSyncMapPromiseArray, QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE);
            processPromiseBatchArray(batchedArrays.reverse()).then(() => {
              response.setBody(queueStatsArray);
              // chunk the items to be deleted into batches and delete them
              if (itemsToDeleteArray.length > 0) {
                batchedArrays = chunkArray(itemsToDeleteArray, QUEUE_STATS_SYNC_MAP_UPDATE_BATCH_SIZE);
                processPromiseBatchArray(batchedArrays.reverse()).finally(() => {
                  callback(null, response);
                });
              } else {
                callback(null, response);
              }
            });
          })
          .catch(() => {
            response.setBody(queueStatsArray);
            callback(null, response);
          });
        })
        .catch(err => {
          console.error(err);
          // an error occurred somewhere in the promise chain
          callback(null, { success: false, message: err })
        })
    } else {
      // An error occurred checking valid environment variables were setup
      callback(null, { success: false, message: errorMessages });
    }
  };
  