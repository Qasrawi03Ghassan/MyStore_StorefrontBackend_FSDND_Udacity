# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

## API Endpoints

### Products

| Endpoint                              | Endpoint Description              | Method | Arguments                                     | Token Required | Optional |
|---------------------------------------|-----------------------------------|--------|-----------------------------------------------|----------------|----------|
|`GET /api/products`                    | List all products (Index)         | `GET`  | None                                          | No             | No       |
|`GET /api/products/:id`                | Get single product (Show)         | `GET`  | product id                                    | No             | No       |
|`POST /api/products`                   | Create product                    | `POST` | product data (name, price, category[optional])| Yes            | No       |
|`GET /api/products/most-popular`       | Top 5 most popular products       | `GET`  | None                                          | No             | Yes      |
|`GET /api/products/get-by-cat?cat=:cat`| Products by category              | `GET`  | product category                              | No             | Yes      |
|`PUT /api/products/:id`                | Update single product             | `PUT`  | product id & data                             | Yes            | Yes      |
|`DELETE /api/products/:id`             | Delete single product             |`DELETE`| product id                                    | Yes            | Yes      |

---

### Users

| Endpoint                              | Endpoint Description              | Method | Arguments                                  | Token Required | Optional |
|---------------------------------------|-----------------------------------|--------|--------------------------------------------|----------------|----------|
|`GET /api/users`                       | List all users (Index)            | `GET`  | None                                       | Yes            | No       |
|`GET /api/users/:id`                   | Get single user (Show)            | `GET`  | user id                                    | Yes            | No       |
|`POST /api/users`                      | Create user                       | `POST` | user data (first_name, last_name, password)| Yes            | No       |

---

### Orders

| Endpoint                              | Endpoint Description              | Method | Arguments                                     | Token Required | Optional |
|---------------------------------------|-----------------------------------|--------|-----------------------------------------------|----------------|----------|
|`GET /api/orders`                      | List active orders by user        | `GET`  | None                                          | Yes            | No       |
|`GET /api/orders/completed`            | List completed orders by user     |   `GET`| None                                          | Yes            | Yes      |
|`POST /api/orders`                     | Create order for user             | `POST` | (user_id, product_id, quantity[optional])     | Yes            | No       |
|`PUT /api/orders/:id`                  | Update single order               | `PUT`  | order id & data                               | No             | Yes      |
|`DELETE /api/orders/:id`               | Delete single order               |`DELETE`| order id                                      | Yes            | Yes      |

---

### Auth (Optional route)

| Endpoint                              | Endpoint Description              | Method | Arguments                                     | Token Required | Optional |
|---------------------------------------|-----------------------------------|--------|-----------------------------------------------|----------------|----------|
|`GET /api/auth`                        | return `auth is up`               | `GET`  | None                                          | No             | Yes      |
|`POST /api/auth/register`              | Register a new user               | `POST` | (first_name, last_name, password)             | No             | Yes      |
|`POST /api/auth/login`                 | Logs user in (Creates a token)    | `POST` | (first_name, last_name, password)             | No             | Yes      |

---

## Database Schema ( Tables / Relations)

### Product

| COLUMN                                | TYPE                 | IS NULL ALLOWED (DEFAULT?)|
|---------------------------------------|----------------------|---------------------------|
|id                                     | `SERIAL PRIMARY KEY` |    NO                     |
|name                                   | `VARCHAR(30)`        |    NO                     |
|price                                  |   `INTEGER`          |    NO(0)                  |
|category                               |   `VARCHAR(50)`      |    YES                    |

---

### User

| COLUMN                                | TYPE                 | IS NULL ALLOWED (DEFAULT?)|
|---------------------------------------|----------------------|---------------------------|
|id                                     | `SERIAL PRIMARY KEY` |    NO                     |
|first_name                             | `VARCHAR(30)`        |    NO                     |
|last_name                              |   `VARCHAR(30)`      |    NO                     |
|password_digest                        |   `VARCHAR(255)`     |    NO                     |

---

### Orders

| COLUMN                                | TYPE                          | IS NULL ALLOWED (DEFAULT?)|
|---------------------------------------|-------------------------------|---------------------------|
|id                                     | `SERIAL PRIMARY KEY`          |    NO                     |
|user_id (Foreign key)                  | `INTEGER REFERENCES users(id)`|    NO                     |
|status                                 |   `VARCHAR(20)`               |    NO   (`active`)        |

---

### Products_Orders (Junction table)

| COLUMN                                | TYPE                          | IS NULL ALLOWED (DEFAULT?)|
|---------------------------------------|-------------------------------|---------------------------|
|product_id  (Foreign key)              | `INTEGER PRIMARY KEY`         |    NO                     |
|order_id     (Foreign key)             | `INTEGER PRIMARY KEY`         |    NO                     |
|quantity                               | `INTEGER`                     |    NO   (0)               |

---

### Relations

Products : Orders ==> M : N (Implemented a junction table)  

Products : Users ==> M : 1  

Orders : Users ==> M : 1
