### **README.md**

```markdown
# Inventory Service

The Inventory Service is a microservice for managing stock details in an e-commerce system. It is built using Node.js, TypeScript, Express, MongoDB, and Kafka for event-driven communication. This README provides comprehensive instructions on building, running, testing the service, and using it with tools like Insomnia or Postman.

---

## **Features**
- Add new items with stock details.
- Update stock levels for items.
- Retrieve stock information for items.
- Publish events on stock updates using Kafka.

---

## **Technologies**
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Event Communication**: Kafka (using `kafkajs`)
- **Testing**: Jest and Supertest

---

## **Setup Instructions**

### **1. Prerequisites**
- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (for Kafka and MongoDB)
- A REST client like [Insomnia](https://insomnia.rest/) or Postman

---

### **2. Environment Variables**
Create a `.env` file in the project root with the following keys:
```plaintext
PORT=3000
MONGO_URI=mongodb://localhost:27017/inventory
KAFKA_BROKER=localhost:9092
```

---

### **3. Installing Dependencies**
Install the required dependencies:
```bash
npm install
```

---

### **4. Running the Application**
1. Start Kafka and MongoDB with Docker:
   ```bash
   docker-compose up
   ```
2. Run the server:
   ```bash
   npm run dev
   ```
   The service will start at [http://localhost:3000](http://localhost:3000).

---

## **Testing**

### **Run Tests**
Execute unit and integration tests:
```bash
npm test
```

### **Using Insomnia for API Testing**

#### **Base URL**
```
http://localhost:3000/api/items
```

#### **Endpoints**

1. **Add a New Item**
   - **URL**: `/add`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "name": "Sample Item",
       "price" : "1000",
       "description": "A test item",
       "stock": 100
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Item added successfully",
       "item": {
		"name": "Sample Item",
		"description": "A test item",
		"price": 1000,
		"stock": 100,
		"_id": "674f639e82376dc36e00f349",
		"createdAt": "2024-12-03T20:01:34.709Z",
		"updatedAt": "2024-12-03T20:01:34.709Z",
		"__v": 0
	}
     }
     ```

2. **Update Stock for an Item**
   - **URL**: `/update-stock/:itemId`
   - **Method**: `PATCH`
   - **Body**:
     ```json
     {
       "stock": 50
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Stock updated successfully",
       "item": {
         "_id": "item_id",
         "name": "Sample Item",
         "description": "A test item",
         "stock": 50
       }
     }
     ```

3. **Get Stock Information**
   - **URL**: `/stock/:itemId`
   - **Method**: `GET`
   - **Response**:
     ```json
     {
       "name": "Sample Item",
       "description": "A test item",
       "stock": 100
     }
     ```

---

## **Design Decisions**

### **1. Domain-Driven Design (DDD)**
- **Domain Layer**: Models represent the core entities (e.g., `Item`).
- **Application Layer**: Routes and controllers handle HTTP communication.
- **Infrastructure Layer**: MongoDB and Kafka manage data storage and messaging.

### **2. Event-Driven Communication**
- Kafka was chosen for loose coupling between microservices. Stock updates are published as events, enabling downstream services (e.g., an Order Service) to subscribe and respond asynchronously.

### **3. Modular Code Structure**
The project follows the MVC architecture, ensuring clear separation of concerns.

---

## **Assumptions**
- **Single Topic for Events**: All stock-related events are published to a single Kafka topic.
- **Validation**: Basic request validation is implemented; additional checks (e.g., authentication) are assumed to be handled externally.
- **Scalability**: Kafka and MongoDB are assumed to be sufficient for scaling the service.

---

## **Contributing**
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---