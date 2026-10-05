-- AutoCare Database Schema

-- 1. Users Table (Handles Admin, Manager, Mechanic, VehicleOwner)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Mechanic', 'VehicleOwner') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Workshops Table
CREATE TABLE Workshops (
    workshop_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- 3. Vehicles Table
CREATE TABLE Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Service Categories
CREATE TABLE ServiceCategories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Appointments (Booking Requests)
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    workshop_id INT NOT NULL,
    service_category_id INT,
    preferred_date DATETIME NOT NULL,
    issue_description TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    FOREIGN KEY (workshop_id) REFERENCES Workshops(workshop_id),
    FOREIGN KEY (service_category_id) REFERENCES ServiceCategories(category_id)
);

-- 6. Job Cards (Repair Orders)
CREATE TABLE JobCards (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT UNIQUE NOT NULL,
    mechanic_id INT,
    status ENUM('Assigned', 'In Progress', 'Testing', 'Completed') DEFAULT 'Assigned',
    fault_report TEXT,
    estimated_cost DECIMAL(10, 2),
    start_date DATETIME,
    completion_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id),
    FOREIGN KEY (mechanic_id) REFERENCES Users(user_id)
);

-- 7. Spare Parts Inventory
CREATE TABLE SpareParts (
    part_id INT AUTO_INCREMENT PRIMARY KEY,
    workshop_id INT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 5,
    supplier VARCHAR(100),
    FOREIGN KEY (workshop_id) REFERENCES Workshops(workshop_id)
);

-- 8. Job Parts & Labor (Cost Estimation & Tracking)
CREATE TABLE JobParts (
    job_part_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL, -- Price at the time of usage
    FOREIGN KEY (job_id) REFERENCES JobCards(job_id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES SpareParts(part_id)
);

CREATE TABLE JobLabor (
    labor_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    hours DECIMAL(5, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES JobCards(job_id) ON DELETE CASCADE
);

-- 9. Invoices (Revenue & Payment)
CREATE TABLE Invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    customer_id INT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('Unpaid', 'Pending Approval', 'Paid', 'Refunded') DEFAULT 'Unpaid',
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_date DATETIME,
    FOREIGN KEY (job_id) REFERENCES JobCards(job_id),
    FOREIGN KEY (customer_id) REFERENCES Users(user_id)
);

-- 10. Service Broadcast (Admin Notices)
CREATE TABLE ServiceBroadcasts (
    broadcast_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    audience ENUM('All', 'Managers', 'Mechanics', 'VehicleOwners') DEFAULT 'All',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Low',
    status ENUM('Draft', 'Scheduled', 'Published', 'Completed') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Chat Messages
CREATE TABLE ChatMessages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT,
    attachment_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 12. Repair Photos / Attachments
CREATE TABLE RepairPhotos (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES JobCards(job_id) ON DELETE CASCADE
);

-- 13. Service Offers
CREATE TABLE ServiceOffers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5, 2),
    valid_from DATETIME,
    valid_until DATETIME,
    status ENUM('Active', 'Scheduled', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
