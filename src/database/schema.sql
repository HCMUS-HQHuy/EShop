-- ========= BẢNG QUẢN LÝ NGƯỜI DÙNG & HỒ SƠ BÁN HÀNG =========

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fullname VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(15),
    -- Vai trò cơ bản, 'User' cho cả người mua và người bán. 'Admin' là vai trò đặc biệt.
    role VARCHAR(10) NOT NULL CHECK (role IN ('Admin', 'User')) DEFAULT 'User',
    -- Trạng thái chung của tài khoản
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Banned')) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- BẢNG MỚI: Chứa thông tin đăng ký bán hàng của một user.
CREATE TABLE seller_profiles (
    seller_profile_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, -- Mỗi user chỉ có một hồ sơ bán hàng
    shop_name VARCHAR(100) NOT NULL,
    shop_description TEXT,
    -- Trạng thái của việc bán hàng, quyết định quyền truy cập vào Seller Portal
    status VARCHAR(20) NOT NULL CHECK (status IN ('PendingVerification', 'Active', 'Rejected', 'Closed', 'Banned')) DEFAULT 'PendingVerification',
    rejection_reason TEXT, -- Lý do bị từ chối, nếu có
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_seller_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- ========= BẢNG QUẢN LÝ SẢN PHẨM =========

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INT,
    CONSTRAINT fk_category_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    image_url VARCHAR(255),
    category_id INT NOT NULL,
    shop_id INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PendingApproval', 'Active', 'Inactive')) DEFAULT 'PendingApproval',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INT,

    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT fk_product_shop FOREIGN KEY (shop_id) REFERENCES seller_profiles(seller_profile_id),
    CONSTRAINT fk_product_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INT,

    CONSTRAINT fk_image_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_image_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INT,

    CONSTRAINT fk_review_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    UNIQUE (user_id, product_id)
);

-- ========= BẢNG QUẢN LÝ GIỎ HÀNG =========

CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);

-- ========= BẢNG QUẢN LÝ ĐƠN HÀNG VÀ THANH TOÁN =========

CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('Cash on Delivery', 'Bank Transfer', 'Credit Card'))
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')) DEFAULT 'Pending',
    payment_method_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_order_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id)
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,

    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL -- SET NULL để nếu sản phẩm bị xóa, đơn hàng vẫn còn lịch sử
);