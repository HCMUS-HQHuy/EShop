// file: dbtester.ts

import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import database from '../database/index.database'; // Đường dẫn tới file cấu hình DB của bạn
import * as utils from 'utils/index.utils'; // Đường dẫn tới file utils của bạn

/**
 * =================================================================================
 * HÀM HỖ TRỢ ĐỂ TẠO DỮ LIỆU MẪU
 * =================================================================================
 */

// Hàm tạo người dùng (bao gồm cả người bán và người mua)
async function seedUsers(db: Client, count: number): Promise<number[]> {
    console.log('Seeding users...');
    const userIds: number[] = [];
    for (let i = 0; i < count; i++) {
        const hashedPassword = utils.hashPassword('Hqh123123@'); // Mật khẩu chung cho tất cả user test
        const query = `
            INSERT INTO users (username, password, email, fullname, role, status)
            VALUES ($1, $2, $3, $4, $5, 'Active')
            RETURNING user_id;
        `;
        const values = [
            faker.internet.username().toLowerCase() + i, // Thêm i để đảm bảo unique
            hashedPassword,
            faker.internet.email(),
            faker.person.fullName(),
            'User' // Mọi người đều là 'User' theo luồng mới
        ];
        const result = await db.query(query, values);
        userIds.push(result.rows[0].user_id);
    }
    console.log(`  -> Seeded ${count} users.`);
    return userIds;
}

// Hàm tạo cửa hàng cho một số người dùng
async function seedShops(db: Client, userIds: number[], count: number): Promise<number[]> {
    console.log('Seeding shops...');
    const shopIds: number[] = [];
    // Chỉ tạo shop cho một nửa số người dùng đầu tiên
    const sellerUserIds = userIds.slice(0, Math.floor(userIds.length / 2));

    for (const userId of sellerUserIds) {
        if (shopIds.length >= count) break;
        const query = `
            INSERT INTO shops (user_id, shop_name, shop_description, status)
            VALUES ($1, $2, $3, 'Active')
            RETURNING shop_id;
        `;
        const values = [
            userId,
            faker.company.name() + ' Shop',
            faker.lorem.sentence()
        ];
        const result = await db.query(query, values);
        shopIds.push(result.rows[0].shop_id);
    }
    console.log(`  -> Seeded ${shopIds.length} shops.`);
    return shopIds;
}

// file: dbtester.ts

async function seedCategories(db: Client): Promise<number[]> {
    console.log('Seeding hierarchical categories...');

    // 1. Định nghĩa cấu trúc danh mục cha-con
    const categoriesHierarchy = [
        {
            name: 'Thời Trang & Phụ Kiện',
            description: 'Các sản phẩm thời trang và phụ kiện thủ công.',
            children: [
                { name: 'Quần Áo Dệt Tay', description: 'Trang phục được làm từ vải dệt thủ công.' },
                { name: 'Túi Xách & Ví Da', description: 'Túi xách và ví được làm bằng tay.' },
                { name: 'Trang Sức Thủ Công', description: 'Trang sức độc đáo từ các nghệ nhân.' },
            ],
        },
        {
            name: 'Nhà Cửa & Đời Sống',
            description: 'Vật dụng trang trí và sử dụng trong gia đình.',
            children: [
                { name: 'Đồ Gốm Sứ', description: 'Ly, chén, đĩa, bình hoa làm từ gốm sứ.' },
                { name: 'Nội Thất Gỗ', description: 'Bàn, ghế, kệ sách nhỏ làm từ gỗ tự nhiên.' },
                { name: 'Đèn Trang Trí', description: 'Đèn lồng, đèn bàn mang phong cách nghệ thuật.' },
            ],
        },
        {
            name: 'Nghệ Thuật & Sưu Tầm',
            description: 'Các tác phẩm nghệ thuật và đồ sưu tầm có giá trị.',
            children: [
                { name: 'Tranh Vẽ', description: 'Tranh sơn dầu, sơn mài, màu nước...' },
                { name: 'Tượng Điêu Khắc', description: 'Tượng gỗ, tượng đá, tượng đồng...' },
            ],
        },
    ];

    const allInsertedIds: number[] = [];

    // 2. Hàm đệ quy để chèn danh mục vào DB
    // Nó sẽ tự gọi lại chính nó để xử lý các danh mục con
    const insertCategory = async (category: any, parentId: number | null) => {
        const query = `
            INSERT INTO categories (name, description, parent_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name -- Cập nhật để có thể lấy RETURNING
            RETURNING category_id;
        `;
        const result = await db.query(query, [category.name, category.description, parentId]);
        
        // Nếu không có kết quả (do ON CONFLICT DO NOTHING), thì truy vấn lại để lấy ID
        let categoryId;
        if (result.rows.length > 0) {
            categoryId = result.rows[0].category_id;
        } else {
            const selectResult = await db.query('SELECT category_id FROM categories WHERE name = $1', [category.name]);
            categoryId = selectResult.rows[0].category_id;
        }

        allInsertedIds.push(categoryId);

        // Nếu danh mục này có con, tiếp tục gọi đệ quy cho các con của nó
        if (category.children && category.children.length > 0) {
            for (const child of category.children) {
                await insertCategory(child, categoryId); // Truyền ID của cha vào
            }
        }
    };

    // 3. Bắt đầu quá trình bằng cách lặp qua các danh mục cấp cao nhất
    for (const topLevelCategory of categoriesHierarchy) {
        await insertCategory(topLevelCategory, null); // Danh mục cấp cao nhất không có parentId (null)
    }

    console.log(`  -> Seeded ${allInsertedIds.length} categories with parent-child relationships.`);
    return allInsertedIds;
}

// Hàm tạo sản phẩm
async function seedProducts(db: Client, shopIds: number[], count: number): Promise<number[]> {
    console.log('Seeding products...');
    const productIds: number[] = [];
    for (let i = 0; i < count; i++) {
        const query = `
            INSERT INTO products (name, description, price, stock_quantity, image_url, shop_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'Active')
            RETURNING product_id;
        `;
        const values = [
            faker.commerce.productName(),
            faker.commerce.productDescription(),
            faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
            faker.number.int({ min: 10, max: 100 }),
            faker.image.urlLoremFlickr({ category: 'technics' }),
            faker.helpers.arrayElement(shopIds), // Chọn ngẫu nhiên một shop
        ];
        const result = await db.query(query, values);
        productIds.push(result.rows[0].product_id);
    }
    console.log(`  -> Seeded ${count} products.`);
    return productIds;
}

// Hàm nối sản phẩm với danh mục
async function seedProductCategories(db: Client, productIds: number[], categoryIds: number[]) {
    console.log('Seeding product-category relationships...');
    let count = 0;
    for (const productId of productIds) {
        const numCategories = faker.number.int({ min: 1, max: 2 });
        const selectedCategories = faker.helpers.arrayElements(categoryIds, numCategories);
        for (const categoryId of selectedCategories) {
            const query = `INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
            await db.query(query, [productId, categoryId]);
            count++;
        }
    }
    console.log(`  -> Created ${count} product-category links.`);
}

/**
 * =================================================================================
 * HÀM CHÍNH ĐỂ CHẠY TOÀN BỘ QUÁ TRÌNH SEEDING
 * =================================================================================
 */
export default async function seedDatabase() {
    let db: Client | undefined = undefined;

    try {
        db = await database.getConnection();
        console.log('🚀 Starting database seeding...');

        // Chạy các hàm seeding theo đúng thứ tự phụ thuộc
        const userIds = await seedUsers(db, 10);
        const shopIds = await seedShops(db, userIds, 5);
        const categoryIds = await seedCategories(db);
        
        // Chỉ tạo sản phẩm nếu có shop được tạo
        if (shopIds.length > 0 && categoryIds.length > 0) {
            const productIds = await seedProducts(db, shopIds, 20); // Tạo 20 sản phẩm
            await seedProductCategories(db, productIds, categoryIds);
        } else {
             console.log('Skipping product seeding because no shops or categories were created.');
        }

        // TODO: Bạn có thể thêm các hàm seed cho orders, reviews, cart_items... ở đây
        // theo logic tương tự.

        console.log('✅ Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error during database seeding:', error);
    } finally {
        if (db) {
            await database.releaseConnection(db);
            console.log('Database connection released.');
        }
    }
}