const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db.js'); // SQLite database connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 9000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-plushies'; // Change in production!

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// --- Helper function for authentication middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if token is no longer valid
        req.user = user;
        next(); // proceed to the guarded route
    });
};

// --- API Routes ---

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error hashing password.' });
        db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ message: 'Username or email already exists.' });
                }
                return res.status(500).json({ message: 'Error creating user.', error: err.message });
            }
            res.status(201).json({ message: 'User created successfully.', userId: this.lastID });
        });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ message: 'Server error.', error: err.message });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords.' });
            if (!result) return res.status(401).json({ message: 'Invalid credentials.' });

            const tokenPayload = { userId: user.id, username: user.username };
            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
            res.json({ message: 'Login successful.', token, user: {id: user.id, username: user.username, email: user.email } });
        });
    });
});

// Product Routes
app.get('/api/products', (req, res) => {
    let sql = 'SELECT p.*, c.name as categoryName FROM products p JOIN categories c ON p.category_id = c.id';
    const params = [];
    const conditions = [];

    if (req.query.category) {
        conditions.push('c.name = ?');
        params.push(req.query.category);
    }
    if (req.query.search) {
        conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        params.push(`%${req.query.search}%`);
        params.push(`%${req.query.search}%`);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    if (req.query.sort) {
        switch (req.query.sort) {
            case 'price_asc': sql += ' ORDER BY p.price ASC'; break;
            case 'price_desc': sql += ' ORDER BY p.price DESC'; break;
            case 'name_asc': sql += ' ORDER BY p.name ASC'; break;
            case 'name_desc': sql += ' ORDER BY p.name DESC'; break;
            case 'newest': sql += ' ORDER BY p.dateAdded DESC'; break;
            case 'popularity': sql += ' ORDER BY p.popularity DESC, p.name ASC'; break;
            default: sql += ' ORDER BY p.popularity DESC, p.name ASC';
        }
    } else {
        sql += ' ORDER BY p.popularity DESC, p.name ASC'; // Default sort
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get('SELECT p.*, c.name as categoryName FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Product not found.' });
        res.json(row);
    });
});

// Category Routes
app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Cart Routes (Protected)
app.get('/api/cart', authenticateToken, (req, res) => {
    db.all('SELECT ci.*, p.name, p.price, p.imageUrl FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?', [req.user.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/cart', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null || quantity < 1) {
        return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
    }
    // Check if item already in cart, if so, update quantity, else insert
    db.get('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.userId, productId], (err, item) => {
        if (err) return res.status(500).json({ error: err.message });
        if (item) {
            // If item exists, sum new quantity with existing quantity
            const newQuantity = item.quantity + quantity;
            db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, item.id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Cart item quantity updated.', id: item.id, productId, quantity: newQuantity });
            });
        } else {
            db.run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.userId, productId, quantity], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Item added to cart.', id: this.lastID, productId, quantity });
            });
        }
    });
});

app.put('/api/cart/:productId', authenticateToken, (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    if (quantity == null || quantity < 0) { // Allow 0 to remove, but not negative
        return res.status(400).json({ message: 'Valid quantity is required (0 or more).' });
    }
    if (quantity === 0) { // If quantity is 0, effectively remove the item
        db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.userId, productId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Item not found in cart or no change made.'});
            res.json({ message: 'Item removed from cart.' });
        });
    } else {
        db.run('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, req.user.userId, productId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Item not found in cart or no change made.'});
            res.json({ message: 'Cart item quantity updated.', productId, quantity });
        });
    }
});

app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
    const { productId } = req.params;
    db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.userId, productId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Item not found in cart.'});
        res.json({ message: 'Item removed from cart.' });
    });
});

// Order Routes (Protected)
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { shippingAddress, items, totalAmount } = req.body; // items should be an array from cart: [{product_id, quantity, price_at_purchase}]
    if (!shippingAddress || !items || items.length === 0 || totalAmount == null) {
        return res.status(400).json({ message: 'Shipping address, items, and total amount are required.' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run('INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)', 
            [req.user.userId, totalAmount, JSON.stringify(shippingAddress), 'Confirmed'], 
            function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message, step: 'insertOrder' });
            }
            const orderId = this.lastID;
            const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
            let itemInsertError = null;
            for (const item of items) {
                stmt.run(orderId, item.product_id, item.quantity, item.price_at_purchase, (err) => {
                    if (err) itemInsertError = err;
                });
                // Optionally, update product stock quantity here
                db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?', [item.quantity, item.product_id, item.quantity], function(errUpdateStock) {
                    if (errUpdateStock) console.error("Stock update error: ", errUpdateStock.message); 
                    if (this.changes === 0 && !errUpdateStock) console.warn(`Stock not updated for product ${item.product_id} or insufficient stock.`);
                });
            }
            stmt.finalize((errFinalize) => { // Finalize after all runs are queued
                 if(errFinalize) itemInsertError = itemInsertError || errFinalize; // Catch finalize error, preserve earlier error
            });

            if (itemInsertError) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: itemInsertError.message, step: 'insertOrderItemsOrFinalize' });
            }

            // Clear cart for the user
            db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user.userId], (errCart) => {
                if (errCart) {
                    // This is less critical, so maybe just log it but still commit the order
                    console.error('Error clearing cart after order:', errCart.message);
                     // Potentially rollback if cart clearing is critical: db.run('ROLLBACK'); return res.status(500).json({error: 'Failed to clear cart'});
                }
                db.run('COMMIT', (errCommit) => {
                    if (errCommit) {
                        // This is a critical error if commit fails
                        return res.status(500).json({ error: errCommit.message, step: 'commitTransaction' });
                    }
                    res.status(201).json({ message: 'Order placed successfully.', orderId });
                });
            });
        });
    });
});

app.get('/api/orders/:orderId', authenticateToken, (req, res) => {
    db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.orderId, req.user.userId], (err, order) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!order) return res.status(404).json({ message: 'Order not found or access denied.' });
        db.all('SELECT oi.*, p.name, p.imageUrl FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [req.params.orderId], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...order, items });
        });
    });
});

app.get('/api/orders', authenticateToken, (req, res) => {
    db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [req.user.userId], (err, orders) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(orders);
    });
});


// Catch-all to serve index.html for any other GET request (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`Serving frontend from: ${path.join(__dirname, '..', 'frontend', 'dist')}`);
});
