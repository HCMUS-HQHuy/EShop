CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOL NOT NULL DEFAULT FALSE,
    deleted_at INT,
    deleted_by INT
);

CREATE TABLE profile (
    profile_id INT UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    fullname VARCHAR(50) NOT NULL,
    birthday TIMESTAMP,
    sex CHAR(10) CHECK (sex IN ('Male', 'Female', 'Other')),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(1000),
    category_id INT NOT NULL,
    remaining_number INT NOT NULL,
    seller_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOL NOT NULL DEFAULT FALSE,
    deleted_by INT
);

CREATE TABLE product_reviews (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    number_stars INT NOT NULL CHECK (number_stars BETWEEN 1 AND 5),
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOL DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP,
    deleted_by INT,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE shopping_carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total INT NOT NULL,
    state CHAR(10) CHECK (state IN ('In_progress', 'Cancelled', 'Completed')) NOT NULL DEFAULT 'In_progress',
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOL NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    deleted_by INT
);

CREATE TABLE cart_items (
    item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    is_deleted BOOL NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    deleted_by INT
);

CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    checkout_id INT NOT NULL,
    payment_method_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TIMESTAMP,
    deleted_by INT
);

CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('credit card', 'cash', 'paypal')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checkout (
    checkout_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cart_id INT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    phone_number CHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL
);

ALTER TABLE profile
ADD CONSTRAINT fk_profile_users
FOREIGN KEY (profile_id)
REFERENCES users(user_id);

ALTER TABLE users
ADD CONSTRAINT fk_users_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES users(user_id);

ALTER TABLE product
ADD CONSTRAINT fk_product_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES users(user_id);

ALTER TABLE product
ADD CONSTRAINT fk_product_is_sold
FOREIGN KEY (seller_id)
REFERENCES users(user_id);

ALTER TABLE product
ADD CONSTRAINT fk_product_in_catagory
FOREIGN KEY (category_id)
REFERENCES categories(category_id);

ALTER TABLE product_reviews
ADD CONSTRAINT fk_reviews_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES users(user_id);

ALTER TABLE shopping_carts
ADD CONSTRAINT fk_carts_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES users(user_id);

ALTER TABLE cart_items
ADD CONSTRAINT fk_cart_items_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES users(user_id);

ALTER TABLE payment
ADD CONSTRAINT fk_payment_deleted_by
FOREIGN KEY (deleted_by)
REFERENCES users(user_id);

ALTER TABLE product_reviews
ADD CONSTRAINT fk_reivews_by_user
FOREIGN KEY (user_id)
REFERENCES users(user_id);

ALTER TABLE product_reviews
ADD CONSTRAINT fk_reivews_product
FOREIGN KEY (user_id)
REFERENCES product(product_id);

ALTER TABLE shopping_carts
ADD CONSTRAINT fk_shopping_of_user
FOREIGN KEY (user_id)
REFERENCES users(user_id);

ALTER TABLE cart_items
ADD CONSTRAINT fk_item_of_cart
FOREIGN KEY (cart_id)
REFERENCES shopping_carts(cart_id);

ALTER TABLE cart_items
ADD CONSTRAINT fk_item_is_product
FOREIGN KEY (product_id)
REFERENCES product(product_id);

ALTER TABLE payment
ADD CONSTRAINT fk_payment_method
FOREIGN KEY (payment_method_id)
REFERENCES payment_methods(payment_method_id);

ALTER TABLE payment
ADD CONSTRAINT fk_payment_of_checkout
FOREIGN KEY (checkout_id)
REFERENCES checkout(checkout_id);

ALTER TABLE checkout
ADD CONSTRAINT fk_checkout_of_cart
FOREIGN KEY (cart_id)
REFERENCES shopping_carts(cart_id);
