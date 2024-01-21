// let subscribers = {};

// function subscribe(eventName, callback) {
//   if (subscribers[eventName] === undefined) {
//     subscribers[eventName] = [];
//   }

//   subscribers[eventName] = [...subscribers[eventName], callback];

//   return function unsubscribe() {
//     subscribers[eventName] = subscribers[eventName].filter((cb) => {
//       return cb !== callback;
//     });
//   };
// }

// function publish(eventName, data) {
//   if (subscribers[eventName]) {
//     subscribers[eventName].forEach((callback) => {
//       callback(data);
//     });
//   }
// }
const subscribers = {};

function subscribe(eventName, callback) {
  if (!subscribers[eventName]) {
    subscribers[eventName] = new Set();
  }

  subscribers[eventName].add(callback);

  return function unsubscribe() {
    subscribers[eventName].delete(callback);
  };
}

function publish(eventName, data) {
  subscribers[eventName]?.forEach(callback => {
    callback(data);
  });
}
