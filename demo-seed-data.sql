-- ============================================================
-- MedSync City — Demo Seed Data
-- ============================================================
-- This file populates the database with demo accounts and data
-- for testing the MedSync City application.
--
-- HOW TO USE:
-- 1. Create database: CREATE DATABASE medsync_db;
-- 2. Run migrations/schema
-- 3. Run this seed file: mysql -u medsync_user -p medsync_db < demo-seed-data.sql
--
-- DEMO ACCOUNTS:
-- Admin:      admin@medsync.com / Admin@123
-- Hospital 1: hospital1@medsync.com / Hospital@123  
-- Hospital 2: hospital2@medsync.com / Hospital@123
--
-- BCrypt Notes:
-- The passwords below are BCrypt hashes (cost 10).
-- To generate your own: https://www.bcryptool.com/
-- Or use Java: new BCryptPasswordEncoder().encode("YourPassword")
-- ============================================================

-- ============================================================
-- 1. USERS (Admin & Hospital Representatives)
-- ============================================================

INSERT INTO user (username, email, password, role, institution_name, status, created_at) VALUES
(
  'admin',
  'admin@medsync.com',
  '$2a$10$slYQmyNdGzin7olVN3p5OPST9/PgBkqquzi8Ay0IQW3FxQubMu9Ky',
  'CITY_ADMIN',
  'MedSync City Admin',
  'ACTIVE',
  NOW()
),
(
  'hospital1',
  'hospital1@medsync.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36BGbnm6',
  'HOSPITAL',
  'City General Hospital',
  'ACTIVE',
  NOW()
),
(
  'hospital2',
  'hospital2@medsync.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36BGbnm6',
  'HOSPITAL',
  'Metro Care Hospital',
  'ACTIVE',
  NOW()
);

-- ============================================================
-- 2. HOSPITALS (Institution Details)
-- ============================================================

INSERT INTO hospital (name, address, license_number, contact_phone, contact_email, user_id, status, created_at) VALUES
(
  'City General Hospital',
  '123 Medical Lane, Downtown, City',
  'REG-CGH-2024-001',
  '+91-11-4567-8901',
  'contact@citygeneralhospital.com',
  (SELECT id FROM user WHERE email = 'hospital1@medsync.com' LIMIT 1),
  'APPROVED',
  NOW()
),
(
  'Metro Care Hospital',
  '456 Health Avenue, Midtown, City',
  'REG-MCH-2024-002',
  '+91-11-8765-4321',
  'contact@metrohospital.com',
  (SELECT id FROM user WHERE email = 'hospital2@medsync.com' LIMIT 1),
  'APPROVED',
  NOW()
);

-- ============================================================
-- 3. MEDICINES (Master Catalog - All APPROVED)
-- ============================================================

INSERT INTO medicine (name, generic_name, category, manufacturer, unit, status, created_at) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Analgesic', 'Cipla Ltd', 'tablet', 'APPROVED', NOW()),
('Amoxicillin 250mg', 'Amoxicillin', 'Antibiotic', 'Glaxo Smith Kline', 'capsule', 'APPROVED', NOW()),
('Insulin Regular', 'Insulin (Human)', 'Endocrine', 'Novo Nordisk', 'injection', 'APPROVED', NOW()),
('Metformin 500mg', 'Metformin', 'Anti-diabetic', 'Lupin Ltd', 'tablet', 'APPROVED', NOW()),
('Omeprazole 20mg', 'Omeprazole', 'Anti-acid', 'Sun Pharma', 'capsule', 'APPROVED', NOW());

-- ============================================================
-- 4. MEDICINE BATCHES (10 batches with varying expiry status)
-- ============================================================
-- Status Distribution:
-- - 3 SAFE (6-12 months away)
-- - 4 NEAR_EXPIRY (15-30 days away)  
-- - 3 CRITICAL_EXPIRY (3-7 days away, including Insulin for demo)
-- ============================================================

-- SAFE BATCHES (6-12 months expiry)
INSERT INTO medicine_batch (medicine_id, hospital_id, batch_number, quantity, expiry_date, manufacture_date, purchase_price, status, created_at) VALUES
(
  (SELECT id FROM medicine WHERE name = 'Paracetamol 500mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  'BCH-PAR-2024-001',
  500,
  DATE_ADD(CURDATE(), INTERVAL 10 MONTH),
  DATE_ADD(CURDATE(), INTERVAL -2 MONTH),
  1500.00,
  'SAFE',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Metformin 500mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'Metro Care Hospital' LIMIT 1),
  'BCH-MET-2024-002',
  1000,
  DATE_ADD(CURDATE(), INTERVAL 8 MONTH),
  DATE_ADD(CURDATE(), INTERVAL -1 MONTH),
  3000.00,
  'SAFE',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Omeprazole 20mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  'BCH-OME-2024-003',
  300,
  DATE_ADD(CURDATE(), INTERVAL 12 MONTH),
  DATE_ADD(CURDATE(), INTERVAL -3 MONTH),
  2500.00,
  'SAFE',
  NOW()
);

-- NEAR_EXPIRY BATCHES (15-30 days away)
INSERT INTO medicine_batch (medicine_id, hospital_id, batch_number, quantity, expiry_date, manufacture_date, purchase_price, status, created_at) VALUES
(
  (SELECT id FROM medicine WHERE name = 'Amoxicillin 250mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'Metro Care Hospital' LIMIT 1),
  'BCH-AMX-2024-004',
  200,
  DATE_ADD(CURDATE(), INTERVAL 25 DAY),
  DATE_ADD(CURDATE(), INTERVAL -11 MONTH),
  1800.00,
  'NEAR_EXPIRY',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Paracetamol 500mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'Metro Care Hospital' LIMIT 1),
  'BCH-PAR-2024-005',
  400,
  DATE_ADD(CURDATE(), INTERVAL 20 DAY),
  DATE_ADD(CURDATE(), INTERVAL -11 MONTH),
  1400.00,
  'NEAR_EXPIRY',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Metformin 500mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  'BCH-MET-2024-006',
  600,
  DATE_ADD(CURDATE(), INTERVAL 30 DAY),
  DATE_ADD(CURDATE(), INTERVAL -11 MONTH),
  2900.00,
  'NEAR_EXPIRY',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Omeprazole 20mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'Metro Care Hospital' LIMIT 1),
  'BCH-OME-2024-007',
  150,
  DATE_ADD(CURDATE(), INTERVAL 18 DAY),
  DATE_ADD(CURDATE(), INTERVAL -11 MONTH),
  2200.00,
  'NEAR_EXPIRY',
  NOW()
);

-- CRITICAL_EXPIRY BATCHES (3-7 days away - URGENT)
INSERT INTO medicine_batch (medicine_id, hospital_id, batch_number, quantity, expiry_date, manufacture_date, purchase_price, status, created_at) VALUES
(
  (SELECT id FROM medicine WHERE name = 'Insulin Regular' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  'BCH-INS-2024-CRITICAL',
  200,
  DATE_ADD(CURDATE(), INTERVAL 5 DAY),
  DATE_ADD(CURDATE(), INTERVAL -12 MONTH),
  15000.00,
  'CRITICAL_EXPIRY',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Amoxicillin 250mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  'BCH-AMX-2024-008',
  100,
  DATE_ADD(CURDATE(), INTERVAL 4 DAY),
  DATE_ADD(CURDATE(), INTERVAL -12 MONTH),
  1600.00,
  'CRITICAL_EXPIRY',
  NOW()
),
(
  (SELECT id FROM medicine WHERE name = 'Paracetamol 500mg' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  'BCH-PAR-2024-009',
  250,
  DATE_ADD(CURDATE(), INTERVAL 7 DAY),
  DATE_ADD(CURDATE(), INTERVAL -12 MONTH),
  1200.00,
  'CRITICAL_EXPIRY',
  NOW()
);

-- ============================================================
-- 5. MEDICINE REQUESTS (Transfer Requests)
-- ============================================================
-- One PENDING request: Hospital 1 requesting 200 units of Insulin
-- ============================================================

INSERT INTO medicine_request (from_hospital_id, to_hospital_id, medicine_id, quantity, urgency, status, request_details, created_at) VALUES
(
  (SELECT id FROM hospital WHERE name = 'City General Hospital' LIMIT 1),
  (SELECT id FROM hospital WHERE name = 'Metro Care Hospital' LIMIT 1),
  (SELECT id FROM medicine WHERE name = 'Insulin Regular' LIMIT 1),
  200,
  'CRITICAL',
  'PENDING',
  'Critical patient needs - CRITICAL_EXPIRY batch available at our facility. Need immediate transfer.',
  NOW()
);

-- ============================================================
-- VERIFICATION QUERIES (Run these to verify data was loaded)
-- ============================================================
-- SELECT COUNT(*) as user_count FROM user;
-- SELECT COUNT(*) as hospital_count FROM hospital;
-- SELECT COUNT(*) as medicine_count FROM medicine;
-- SELECT COUNT(*) as batch_count FROM medicine_batch;
-- SELECT COUNT(*) as request_count FROM medicine_request;
-- SELECT * FROM user WHERE role = 'CITY_ADMIN';
-- SELECT * FROM medicine_batch WHERE status = 'CRITICAL_EXPIRY';
