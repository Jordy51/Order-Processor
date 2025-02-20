import http from 'k6/http';
import { check, sleep } from 'k6';

// Simple UUID v4 generator function
function uuidv4() {
  // https://stackoverflow.com/a/2117523/240730
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export let options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp-up to 100 users over 30 seconds
    { duration: '1m', target: 100 }, // Stay at 100 users for 1 minute
    { duration: '30s', target: 0 }, // Ramp-down to 0 users over 30 seconds
  ],
};

export default function () {
  // Replace with your API endpoint for order creation
  const url = 'http://localhost:3000/order';

  // Example payload for an order; adjust fields as needed
  const payload = JSON.stringify({
    userId: uuidv4(),
    orderId: uuidv4(),
    itemIds: [uuidv4(), uuidv4(), uuidv4()], // Generating multiple random item IDs
    totalAmount: Math.floor(Math.random() * 500) + 50, // Random amount between 50 and 550
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  // Basic checks to ensure the order request was successful
  check(res, {
    'order created successfully': (r) => r.status === 200 || r.status === 201,
  });

  // Optionally, add a sleep to simulate a realistic scenario between requests
  sleep(1);
}
