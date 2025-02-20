import http from 'k6/http';
import { check, sleep } from 'k6';

// Simple UUID v4 generator function
function uuidV4() {
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
  const url = 'http://localhost:3000/order';

  const payload = JSON.stringify({
    userId: uuidV4(),
    orderId: uuidV4(),
    itemIds: [uuidV4(), uuidV4(), uuidV4()],
    totalAmount: Math.floor(Math.random() * 500) + 50,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'order created successfully': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}
