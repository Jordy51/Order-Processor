# OrderProcessor APIs

A simple REST API for order processing.
This API is built using the **NestJS** framework with **TypeScript** and uses **Bull** as an in-memory queue.

### Prerequisites

- Node.js installed
- Yarn package manager
- Database SQLite
- Redis

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Jordy51/Order-Processor.git
   cd order-processor
   ```
2. Install dependencies:

   `yarn install`

3. Set up environment variables (`.env` file):
   ```
    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
   ```
4. Run the server:

   `yarn start`

## To run tests

Run
`yarn test`

## API Documentation

The API documentation is available via Swagger(after server startup). You can access it at:

[Swagger UI](http://localhost:3000/api)

### 1. Create a Order

**POST** `/order`

#### Request:

```json
{
  "userId": "USR111",
  "orderId": "ORD222",
  "itemIds": ["ITM333"],
  "totalAmount": 555
}
```

#### Response:

```json
{
  "id": 8,
  "userId": "USR111",
  "orderId": "ORD222",
  "itemIds": ["ITM333"],
  "totalAmount": 555,
  "status": "PENDING",
  "createdAt": "2025-02-20T09:43:37.000Z",
  "updatedAt": "2025-02-20T09:43:37.000Z"
}
```

### 2. Get Order Status

**GET** `/order/:id/status`

#### Response:

```json
{
  "status": "COMPLETED"
}
```

### 3. Get Order Metrics

**GET** `/metrics/orders`

#### Response:

```json
{
  "totalCount": 2229,
  "pendingCount": 0,
  "processingCount": 1,
  "completedCount": 2228,
  "avgProcessingTime": 1.74
}
```

## Possible Improvements

- **Rate Limiting**: Introduce rate limiting.
- **Caching**: Use Redis to optimize API response times for frequently accessed data like matrices.
- **Metrics**: Improve matrices capturing with more generalized framework which can we used at multiple place just like aws cloud watch metrics posting works.
