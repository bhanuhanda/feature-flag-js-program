// returns the state of *all* features for current user
function fetchAllFeatures() {
    // in reality, this would have been a `fetch` call:
    // `fetch("/api/features/all")`
    return new Promise(resolve => {
        const sampleFeatures = {
            "extended-summary": 250,
            "feedback-dialog": 'Your feedbacks would be highly welcomed'
        };
      setTimeout(resolve, 100, sampleFeatures);
    });
}

let globalCache = {}
let devOrderrides = {}
addDevOrderride('feedback-dialog', 'test1'); // synchronous thread

var fetchedAlready = false;

function getFeatureState(flagKey) {
    return new Promise(function (resolve, reject) {
        if(!fetchedAlready) {
            console.log('sent from network');
            fetchedAlready = true; // set true to enable caching

            fetchAllFeatures().then(features => {
                globalCache = {...features, ...devOrderrides};

                if(globalCache[flagKey]) {
                    resolve(globalCache[flagKey]);
                }
                reject(false);
            }).catch(function () {
                // handling network failure -> return from cache
                console.log('sent from cache', { globalCache });
                if(globalCache[flagKey]) {
                    resolve(globalCache[flagKey]);
                }
                reject(false);
            });
        } else {
            // handling caching
            console.log('sent from cache', { globalCache });
            if(globalCache[flagKey]) {
                resolve(globalCache[flagKey]);
            }
            reject(false);
        }
    })
}

function addDevOrderride(flag, value) {
    // globalCache = { ...globalCache, [flag] : value }
    devOrderrides[flag] = value;
}

// src/feature-x/summary.js
// asynchronous thread
// getFeatureState("extended-summary")
// .then(function(featureValue) {
//     console.log(featureValue);
// }).catch(function() {
//     console.log('flag key does not exist');
// });

// src/feature-y/feedback-dialog.js
// asynchronous thread (falls into race condition as JS engine runs below line before above Promise is resolved & globalCache is set
// so either write this call in above's .then call or use async await on the returned promise.
// getFeatureState("feedback-dialog")
// .then(function(featureValue) {
//   console.log(featureValue);
// }).catch(function () {
//     console.log('flag key does not exist');
// });

addDevOrderride('extended-summary', 'test2'); // synchronous thread

// race condition fixed
(async function main () {
    const res1 = await getFeatureState("extended-summary");
    const res2 = await getFeatureState("feedback-dialog");

    console.log({ res1, res2 });
})();
