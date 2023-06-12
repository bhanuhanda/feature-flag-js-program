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
addDevOrderride('feedback-dialog', 'test1');

var fetchedAlready = false;

function getFeatureState(flagKey) {
    return new Promise(function (resolve, reject) {
        if(!fetchedAlready) {
            console.log('sent from network');
            fetchedAlready = false; // set true to enable caching

            fetchAllFeatures().then(features => {
                console.log({ features })
                globalCache = {...features, ...devOrderrides};
                console.log({ globalCache })

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
getFeatureState("extended-summary")
.then(function(featureValue) {
    console.log(featureValue);
}).catch(function() {
    console.log('flag key does not exist');
});

// src/feature-y/feedback-dialog.js
getFeatureState("feedback-dialog")
.then(function(featureValue) {
  console.log(featureValue);
}).catch(function () {
    console.log('flag key does not exist');
});

addDevOrderride('extended-summary', 'test2');
