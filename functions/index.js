const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.posts = functions.https.onRequest((request, response) => {
  const posts = [
    {
      caption: "Golden Gate Bride",
      location: "San Francisco"
    },
    {
      caption: "Golden Gate Bride",
      location: "San Francisco"
    }
  ];
  response.send(posts);
});
