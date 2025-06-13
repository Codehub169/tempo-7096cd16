const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Use in-memory database for simplicity, or specify a file path e.g., './plushie_paradise.db'
const DBSOURCE = process.env.DB_PATH || ':memory:'; 

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        // Create tables if they don't exist
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT UNIQUE,
                password_hash TEXT
            )`, (err) => {
                if (err) console.error("Error creating users table", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            )`, (err) => {
                if (err) console.error("Error creating categories table", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                price REAL,
                imageUrl TEXT,
                category_id INTEGER,
                stock_quantity INTEGER DEFAULT 10,
                popularity INTEGER DEFAULT 0, 
                dateAdded TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )`, (err) => {
                if (err) console.error("Error creating products table", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id),
                UNIQUE(user_id, product_id)
            )`, (err) => {
                if (err) console.error("Error creating cart_items table", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                total_amount REAL,
                status TEXT DEFAULT 'Pending',
                shipping_address TEXT,
                order_date TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, (err) => {
                if (err) console.error("Error creating orders table", err.message);
            });

            db.run(`CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                price_at_purchase REAL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )`, (err) => {
                if (err) console.error("Error creating order_items table", err.message);
            });
            console.log("Database tables ensured/created.");
            if (process.argv.includes('init')) {
                seedDatabase();
            }
        });
    }
});

const seedDatabase = () => {
    db.serialize(() => {
        console.log("Seeding database...");

        // Seed Categories
        const categories = [
            { name: 'Forest Friends' },
            { name: 'Ocean Buddies' },
            { name: 'Jungle Jammers' },
            { name: 'Fantasy Creatures' },
            { name: 'Classic Cuddlies' }
        ];
        const categoryStmt = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
        categories.forEach(cat => categoryStmt.run(cat.name));
        categoryStmt.finalize();
        console.log("Categories seeded.");

        // Seed Products
        // Get category IDs first to ensure foreign keys are valid
        db.all("SELECT id, name FROM categories", [], (err, rows) => {
            if (err) {
                console.error("Error fetching categories for seeding products:", err.message);
                return;
            }
            const categoryMap = {};
            rows.forEach(row => categoryMap[row.name] = row.id);

            const products = [
                { name: 'Barnaby Bear', description: 'A classic, cuddly brown bear, perfect for hugs and adventures. Made from super-soft, eco-friendly materials.', price: 29.99, imageUrl: 'https://placehold.co/400x400/fddde6/3a3a3a?text=Barnaby', category: 'Classic Cuddlies', stock: 15, popularity: 100 },
                { name: 'Flippy Penguin', description: 'A charming penguin from the Antarctic, always ready for a slide.', price: 24.99, imageUrl: 'https://placehold.co/400x400/a9def9/3a3a3a?text=Flippy', category: 'Ocean Buddies', stock: 20, popularity: 90 },
                { name: 'Leo the Lion', description: 'The king of the plushie jungle! Brave and soft.', price: 32.99, imageUrl: 'https://placehold.co/400x400/fcf6bd/3a3a3a?text=Leo', category: 'Jungle Jammers', stock: 12, popularity: 95 },
                { name: 'Hoppy Bunny', description: 'A soft bunny with long, floppy ears and a twitchy nose.', price: 27.99, imageUrl: 'https://placehold.co/400x400/c3b1e1/3a3a3a?text=Hoppy', category: 'Forest Friends', stock: 18, popularity: 85 },
                { name: 'Shelly Turtle', description: 'A wise old turtle, slow but steady, with a beautiful shell.', price: 22.99, imageUrl: 'https://placehold.co/400x400/bde0fe/3a3a3a?text=Shelly', category: 'Ocean Buddies', stock: 25, popularity: 70 },
                { name: 'Gigi Giraffe', description: 'A tall and graceful giraffe plush with a long neck for nuzzling.', price: 34.99, imageUrl: 'https://placehold.co/400x400/ffdfb0/3a3a3a?text=Gigi', category: 'Jungle Jammers', stock: 10, popularity: 80 },
                { name: 'Wally Whale', description: 'A giant, gentle whale of the ocean, perfect for big cuddles.', price: 39.99, imageUrl: 'https://placehold.co/400x400/84d2f6/3a3a3a?text=Wally', category: 'Ocean Buddies', stock: 8, popularity: 75 },
                { name: 'Foxy Fox', description: 'A clever and sly fox plush, with a bushy tail.', price: 28.99, imageUrl: 'https://placehold.co/400x400/ffb347/3a3a3a?text=Foxy', category: 'Forest Friends', stock: 16, popularity: 88 },
                { name: 'Sparkle Unicorn', description: 'A magical unicorn with a rainbow mane and a sparkly horn.', price: 35.99, imageUrl: 'https://placehold.co/400x400/E6E6FA/3a3a3a?text=Sparkle', category: 'Fantasy Creatures', stock: 10, popularity: 110 },
                { name: 'Dragonling Dave', description: 'A cute baby dragon, not too fiery, loves to play!', price: 33.99, imageUrl: 'https://placehold.co/400x400/90EE90/3a3a3a?text=Dragon', category: 'Fantasy Creatures', stock: 7, popularity: 105 }
            ];

            const productStmt = db.prepare("INSERT OR IGNORE INTO products (name, description, price, imageUrl, category_id, stock_quantity, popularity, dateAdded) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || CAST(ABS(RANDOM()) % 30 AS TEXT) || ' days'))");
            products.forEach(p => {
                if (categoryMap[p.category]) {
                    productStmt.run(p.name, p.description, p.price, p.imageUrl, categoryMap[p.category], p.stock, p.popularity);
                } else {
                    console.warn(`Category '${p.category}' not found for product '${p.name}'. Skipping.`);
                }
            });
            productStmt.finalize();
            console.log("Products seeded.");
        });

        // Seed a test user
        bcrypt.hash('testpassword', 10, (err, hash) => {
            if (err) {
                console.error("Error hashing password for test user:", err);
                return;
            }
            db.run("INSERT OR IGNORE INTO users (username, email, password_hash) VALUES (?, ?, ?)", 
                ['testuser', 'test@example.com', hash],
                (err) => {
                    if(err) console.error("Error seeding test user", err.message);
                    else console.log("Test user seeded.");
                }
            );
        });
    });
};

module.exports = db;
