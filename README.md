### Documents API

## Prerequisites
Docker: Install Docker

## Clone the Repository
```
git clone https://github.com/amarkantku/doc-api.git
cd doc-api
```

## Initialize Node.js Project
```
npm init -y
npm install express pg cors
```

## Build and Run Containers
```
docker-compose up --build
```

## Seed the Database:
Open a new terminal
```
docker-compose run --rm app npm run seed
```

## Access the API
Your API will be available at http://localhost:3001.


## API Endpoints

### Get All Documents

**GET** `/documents`

Fetches all documents ordered by their position.

**Response:**
- `200 OK` with an array of document objects.

### Update Document Position

**PUT** `/documents/:type/position`

Updates the position of a specific document.

**Path Parameters:**
- `type` (string): The type of the document to update.

**Request Body:**
- `position` (number): The new position for the document.

**Response:**
- `200 OK` with the updated document object if successful.


**Example Request:**

```sh
curl -X PUT http://localhost:3001/documents/bill-of-lading/position \
     -H "Content-Type: application/json" \
     -d '{"newPosition": 10}'


