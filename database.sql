-- AutoCare Database Schema

-- Disable foreign key checks temporarily to allow dropping tables cleanly
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Notices;
DROP TABLE IF EXISTS ChatMessages;
DROP TABLE IF EXISTS Invoices;
DROP TABLE IF EXISTS AdditionalFaults;
DROP TABLE IF EXISTS JobCardPhotos;
DROP TABLE IF EXISTS RepairTimeline;
DROP TABLE IF EXISTS JobCardLabor;
DROP TABLE IF EXISTS JobCardParts;
DROP TABLE IF EXISTS RepairEstimates;
DROP TABLE IF EXISTS JobCards;
DROP TABLE IF EXISTS ServiceRequests;
DROP TABLE IF EXISTS SpareParts;
DROP TABLE IF EXISTS ServiceCategories;
DROP TABLE IF EXISTS Vehicles;
DROP TABLE IF EXISTS Users;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table (Admin, Workshop Managers, Mechanics, Vehicle Owners)
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('Admin', 'Manager', 'Mechanic', 'Owner') NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Active', 'Inactive') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles Table
CREATE TABLE Vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    model VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Service Categories
CREATE TABLE ServiceCategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_rate DECIMAL(10,2) DEFAULT 0.00
);

-- 4. Spare Parts Inventory
CREATE TABLE SpareParts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Service Requests (Bookings by Owners)
CREATE TABLE ServiceRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    category_id INT NOT NULL,
    requested_date DATE NOT NULL,
    description TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES ServiceCategories(id)
);

-- 6. Job Cards (Created by Managers)
CREATE TABLE JobCards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    manager_id INT NOT NULL,
    mechanic_id INT, -- Can be NULL initially until assigned
    status ENUM('Diagnosis', 'Repairing', 'Testing', 'Ready', 'Delivered') DEFAULT 'Diagnosis',
    delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES ServiceRequests(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES Users(id),
    FOREIGN KEY (mechanic_id) REFERENCES Users(id)
);

-- 7. Repair Cost Estimates (Sent by Manager, Approved by Owner)
CREATE TABLE RepairEstimates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    total_estimated_cost DECIMAL(10,2) NOT NULL,
    status ENUM('Pending Approval', 'Approved', 'Rejected') DEFAULT 'Pending Approval',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE
);

-- 8. Job Card Parts Usage (Requested by Mechanic, Approved by Manager)
CREATE TABLE JobCardParts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity INT NOT NULL,
    status ENUM('Pending Approval', 'Approved', 'Rejected') DEFAULT 'Pending Approval',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES SpareParts(id)
);

-- 9. Job Card Labor Hours
CREATE TABLE JobCardLabor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    mechanic_id INT NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    description TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE,
    FOREIGN KEY (mechanic_id) REFERENCES Users(id)
);

-- 10. Repair Timeline (Tracks live status updates)
CREATE TABLE RepairTimeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    stage VARCHAR(50) NOT NULL, -- e.g., Diagnosis, Repairing, Testing, Ready
    updated_by INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES Users(id)
);

-- 11. Job Card Photos (Before/After uploads by Mechanics)
CREATE TABLE JobCardPhotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    type ENUM('Before', 'After') NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE
);

-- 12. Additional Faults Found
CREATE TABLE AdditionalFaults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    description TEXT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE
);

-- 13. Invoices
CREATE TABLE Invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_card_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    pdf_url VARCHAR(255),
    status ENUM('Unpaid', 'Paid') DEFAULT 'Unpaid',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_card_id) REFERENCES JobCards(id) ON DELETE CASCADE
);

-- 14. Chat Messages
CREATE TABLE ChatMessages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 15. Notices & Broadcasts
CREATE TABLE Notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience ENUM('All', 'Managers', 'Mechanics', 'Owners') NOT NULL DEFAULT 'All',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Users(id) ON DELETE CASCADE
);
