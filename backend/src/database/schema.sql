-- ========= BẢNG QUẢN LÝ NGƯỜI DÙNG & CỬA HÀNG =========

CREATE TABLE Tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone_number VARCHAR(15),
    role VARCHAR(10) NOT NULL CHECK (role IN ('Admin', 'User')) DEFAULT 'User',
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Banned')) DEFAULT 'Active',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE shops (
    shop_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    shop_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    shop_description TEXT,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending Verification', 'Active', 'Rejected', 'Closed', 'Banned')) DEFAULT 'Pending Verification',
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shop_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    iconName VARCHAR(100),
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INT,
    CONSTRAINT fk_category_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    sku VARCHAR(100) NOT NULL,
    short_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    discount DECIMAL(5, 2) NOT NULL CHECK (discount >= 0 AND discount <= 100) DEFAULT 0,
    description TEXT,
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    image_url VARCHAR(255),
    shop_id INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PendingApproval', 'Rejected', 'Active', 'Inactive', 'Banned')) DEFAULT 'PendingApproval',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INT,
    CONSTRAINT uq_product_sku_shop UNIQUE (sku, shop_id),
    CONSTRAINT fk_product_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
    CONSTRAINT fk_product_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE product_categories (
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
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

-- ========= BẢNG QUẢN LÝ ĐƠN HÀNG VÀ THANH TOÁN =========

-- Bảng các phương thức thanh toán mà hệ thống hỗ trợ
CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    -- 'MoMo', 'COD' (Cash on Delivery), 'BankTransfer'
    code VARCHAR(20) NOT NULL UNIQUE, 
    name VARCHAR(100) NOT NULL,
    img VARCHAR(255),
    link VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,

    shop_id INT NOT NULL,     -- Thêm liên kết trực tiếp đến shop
    user_id INT NOT NULL,

    receiver_name VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,

    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(12, 2) NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    payment_code VARCHAR(20) UNIQUE NOT NULL,
    payment_method_code VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),

    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_payment_method FOREIGN KEY (payment_method_code) REFERENCES payment_methods(code)
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- Tạo bảng Conversations
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,  -- Tự động tăng ID cho mỗi cuộc trò chuyện
    participant1_id INT NOT NULL,  -- ID của người tham gia đầu tiên
    participant2_id INT NOT NULL,  -- ID của người tham gia thứ hai
    participant1_role CHAR(10) CHECK (participant1_role IN ('Admin', 'Seller', 'Customer')) NOT NULL,  -- Vai trò của participant1
    participant2_role CHAR(10) CHECK (participant2_role IN ('Admin', 'Seller', 'Customer')) NOT NULL,  -- Vai trò của participant2
    context JSONB,  -- Lưu trữ thông tin context dưới dạng JSON
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo cuộc trò chuyện
    FOREIGN KEY (participant1_id) REFERENCES users(user_id) ON DELETE CASCADE,  -- Ràng buộc khóa ngoại với bảng users
    FOREIGN KEY (participant2_id) REFERENCES users(user_id) ON DELETE CASCADE  -- Ràng buộc khóa ngoại với bảng users
);

-- Tạo bảng Messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,  -- Tự động tăng ID cho mỗi tin nhắn
    conversation_id INT NOT NULL,  -- ID của cuộc trò chuyện
    sender_id INT NOT NULL,  -- ID của người gửi
    content TEXT NOT NULL,  -- Nội dung tin nhắn
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Thời gian gửi tin nhắn
    is_read BOOLEAN DEFAULT FALSE,  -- Trạng thái tin nhắn (đọc hay chưa đọc)
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,  -- Ràng buộc khóa ngoại với bảng conversations
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE  -- Ràng buộc khóa ngoại với bảng users
);
