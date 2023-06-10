// returns the state of *all* features for current user
function fetchAllFeatures() {
    // in reality, this would have been a `fetch` call:
    // `fetch("/api/features/all")`
    return new Promise(resolve => {
      const sampleFeatures = {
        "extended-summary": true,
        "feedback-dialog": false
  };
      setTimeout(resolve, 100, sampleFeatures);
    });
  }

function getFeatureState(flagKey) {
    return new Promise(function(resolve, reject) {
        fetchAllFeatures().then(features => {
            if(Object.keys(features).includes(flagKey)) {
                resolve(features[flagKey]);
            }
            reject('not a valid flag key');
        })
    });
}

// src/feature-x/summary.js
getFeatureState("extended-summary")
.then(function(isEnabled) {
  if (isEnabled) {
    // showExtendedSummary();
    console.log('showExtendedSummary()');
  } else {
    // showBriefSummary();
    console.log('showBriefSummary()');
  }
});
// src/feature-y/feedback-dialog.js
getFeatureState("feedback-dialog")
.then(function(isEnabled) {
  if (isEnabled) {
    // makeFeedbackButtonVisible();
    console.log('makeFeedbackButtonVisible()');
  } else {
    console.log('makeFeedbackButtonInvisible()')
  }
});
