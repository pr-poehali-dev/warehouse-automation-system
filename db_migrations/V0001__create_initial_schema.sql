-- Создание схемы базы данных для СкладПро

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('buyer', 'operator', 'supplier')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий товаров
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица товаров
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контрагентов
CREATE TABLE contractors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Клиент', 'Поставщик')),
    contact VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    contractor_id INTEGER REFERENCES contractors(id),
    status VARCHAR(100) DEFAULT 'В обработке',
    total_items INTEGER DEFAULT 0,
    total_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица позиций заказа
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица приёмок
CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id INTEGER REFERENCES contractors(id),
    status VARCHAR(100) DEFAULT 'Ожидается',
    total_items INTEGER DEFAULT 0,
    notes TEXT,
    expected_date DATE,
    received_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица позиций приёмки
CREATE TABLE receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipts(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отгрузок
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    shipment_number VARCHAR(100) UNIQUE NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    customer_id INTEGER REFERENCES contractors(id),
    status VARCHAR(100) DEFAULT 'Готовится',
    total_items INTEGER DEFAULT 0,
    notes TEXT,
    shipped_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица позиций отгрузки
CREATE TABLE shipment_items (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица зон склада
CREATE TABLE warehouse_zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    current_items INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица инвентаризаций
CREATE TABLE inventories (
    id SERIAL PRIMARY KEY,
    inventory_number VARCHAR(100) UNIQUE NOT NULL,
    zone_id INTEGER REFERENCES warehouse_zones(id),
    status VARCHAR(100) DEFAULT 'В процессе',
    progress INTEGER DEFAULT 0,
    started_by INTEGER REFERENCES users(id),
    notes TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_receipts_number ON receipts(receipt_number);
CREATE INDEX idx_shipments_number ON shipments(shipment_number);
CREATE INDEX idx_users_email ON users(email);

-- Вставка начальных данных
INSERT INTO categories (name, description) VALUES 
('Категория 1', 'Основные товары'),
('Категория 2', 'Дополнительные товары');

INSERT INTO warehouse_zones (zone_name, location, capacity, current_items) VALUES
('Зона А', 'Стеллажи 1-10', 500, 450),
('Зона Б', 'Стеллажи 11-20', 500, 320),
('Зона В', 'Стеллажи 21-30', 400, 180);

INSERT INTO products (name, sku, category_id, quantity, price, location, description) VALUES
('Товар А', 'SKU-001', 1, 150, 1200.00, 'A-01-01', 'Описание товара А'),
('Товар Б', 'SKU-002', 2, 75, 850.00, 'A-02-03', 'Описание товара Б'),
('Товар В', 'SKU-003', 1, 200, 2100.00, 'B-01-05', 'Описание товара В');

INSERT INTO contractors (name, type, contact, email) VALUES
('Поставщик А', 'Поставщик', 'info@supplier-a.ru', 'info@supplier-a.ru'),
('Поставщик Б', 'Поставщик', 'contact@supplier-b.ru', 'contact@supplier-b.ru'),
('Клиент А', 'Клиент', 'sales@client-a.ru', 'sales@client-a.ru'),
('Клиент Б', 'Клиент', 'info@client-b.ru', 'info@client-b.ru');