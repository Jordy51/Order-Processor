# OrderProcessor APIs

A simple REST API for order processing.

### Prerequisites

- Node.js installed
- Yarn package manager
- Database SQlite
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

## Endpoints

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
