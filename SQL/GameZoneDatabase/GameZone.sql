-- =====================================================================
-- GameZone: relational database for a gaming lounge
-- Members book gaming stations, pay for sessions and enter tournaments.
-- Target: MySQL 8.0.16+ / MariaDB 10.4+
-- =====================================================================

DROP DATABASE IF EXISTS GameZone;
CREATE DATABASE GameZone;
USE GameZone;

-- Reporting period used by the analytical queries below.
-- The sample data covers early 2025, so reports run against 2025.
SET @ReportYear = 2025;


-- =====================================================================
-- 1. SCHEMA
-- =====================================================================

CREATE TABLE MembershipType (
    TypeID        INT AUTO_INCREMENT PRIMARY KEY,
    TypeName      VARCHAR(50)   NOT NULL UNIQUE,
    MonthlyFee    DECIMAL(8,2)  NOT NULL CHECK (MonthlyFee >= 0),
    HoursIncluded INT           NOT NULL CHECK (HoursIncluded >= 0)
);

CREATE TABLE Staff (
    StaffID     INT AUTO_INCREMENT PRIMARY KEY,
    FirstName   VARCHAR(50)   NOT NULL,
    LastName    VARCHAR(50)   NOT NULL,
    Role        VARCHAR(50)   NOT NULL,
    HireDate    DATE          NOT NULL,
    HourlyWage  DECIMAL(8,2)  NOT NULL CHECK (HourlyWage >= 0)
);

CREATE TABLE Member (
    MemberID    INT AUTO_INCREMENT PRIMARY KEY,
    FirstName   VARCHAR(50)   NOT NULL,
    LastName    VARCHAR(50)   NOT NULL,
    Email       VARCHAR(100)  NOT NULL UNIQUE,
    Phone       VARCHAR(20),
    JoinDate    DATE          NOT NULL DEFAULT (CURDATE()),
    TypeID      INT           NOT NULL,
    CONSTRAINT fk_member_type FOREIGN KEY (TypeID) REFERENCES MembershipType(TypeID)
);

CREATE TABLE Station (
    StationID   INT AUTO_INCREMENT PRIMARY KEY,
    StationName VARCHAR(50)   NOT NULL UNIQUE,
    StationType VARCHAR(30)   NOT NULL,
    HourlyRate  DECIMAL(8,2)  NOT NULL CHECK (HourlyRate >= 0),
    IsAvailable TINYINT(1)    NOT NULL DEFAULT 1
);

CREATE TABLE Game (
    GameID      INT AUTO_INCREMENT PRIMARY KEY,
    GameTitle   VARCHAR(100)  NOT NULL,
    Genre       VARCHAR(50)   NOT NULL,
    Platform    VARCHAR(50)   NOT NULL,
    ReleaseYear INT           NOT NULL
);

-- Many-to-many: which games are installed on which station
CREATE TABLE StationGame (
    StationID   INT NOT NULL,
    GameID      INT NOT NULL,
    PRIMARY KEY (StationID, GameID),
    CONSTRAINT fk_sg_station FOREIGN KEY (StationID) REFERENCES Station(StationID),
    CONSTRAINT fk_sg_game    FOREIGN KEY (GameID)    REFERENCES Game(GameID)
);

CREATE TABLE Booking (
    BookingID   INT AUTO_INCREMENT PRIMARY KEY,
    MemberID    INT           NOT NULL,
    StationID   INT           NOT NULL,
    StaffID     INT,
    StartTime   DATETIME      NOT NULL,
    EndTime     DATETIME,
    TotalCost   DECIMAL(10,2) CHECK (TotalCost >= 0),
    Status      VARCHAR(20)   NOT NULL DEFAULT 'Scheduled',
    CONSTRAINT fk_booking_member  FOREIGN KEY (MemberID)  REFERENCES Member(MemberID),
    CONSTRAINT fk_booking_station FOREIGN KEY (StationID) REFERENCES Station(StationID),
    CONSTRAINT fk_booking_staff   FOREIGN KEY (StaffID)   REFERENCES Staff(StaffID),
    CONSTRAINT chk_booking_status CHECK (Status IN ('Scheduled', 'Completed', 'Cancelled')),
    CONSTRAINT chk_booking_times  CHECK (EndTime IS NULL OR EndTime > StartTime)
);

-- One payment per booking
CREATE TABLE Payment (
    PaymentID     INT AUTO_INCREMENT PRIMARY KEY,
    BookingID     INT           NOT NULL UNIQUE,
    Amount        DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
    PaymentDate   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod VARCHAR(30)   NOT NULL,
    Status        VARCHAR(20)   NOT NULL DEFAULT 'Pending',
    CONSTRAINT fk_payment_booking FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
    CONSTRAINT chk_payment_method CHECK (PaymentMethod IN ('Card', 'Cash')),
    CONSTRAINT chk_payment_status CHECK (Status IN ('Pending', 'Paid', 'Refunded'))
);

CREATE TABLE Tournament (
    TournamentID    INT AUTO_INCREMENT PRIMARY KEY,
    TournamentName  VARCHAR(100)  NOT NULL,
    GameID          INT           NOT NULL,
    StartDate       DATE          NOT NULL,
    EndDate         DATE          NOT NULL,
    PrizePool       DECIMAL(10,2) NOT NULL CHECK (PrizePool >= 0),
    MaxParticipants INT           NOT NULL CHECK (MaxParticipants > 0),
    CONSTRAINT fk_tournament_game  FOREIGN KEY (GameID) REFERENCES Game(GameID),
    CONSTRAINT chk_tournament_dates CHECK (EndDate >= StartDate)
);

-- A member can enter each tournament once
CREATE TABLE TournamentEntry (
    EntryID          INT AUTO_INCREMENT PRIMARY KEY,
    TournamentID     INT  NOT NULL,
    MemberID         INT  NOT NULL,
    RegistrationDate DATE NOT NULL DEFAULT (CURDATE()),
    Placement        INT  CHECK (Placement IS NULL OR Placement > 0),
    CONSTRAINT fk_entry_tournament FOREIGN KEY (TournamentID) REFERENCES Tournament(TournamentID),
    CONSTRAINT fk_entry_member     FOREIGN KEY (MemberID)     REFERENCES Member(MemberID),
    CONSTRAINT uq_entry UNIQUE (TournamentID, MemberID)
);


-- =====================================================================
-- 2. SAMPLE DATA
-- =====================================================================

INSERT INTO MembershipType (TypeName, MonthlyFee, HoursIncluded) VALUES
    ('Basic',     49.99, 10),
    ('Pro',       89.99, 25),
    ('Elite',    149.99, 60),
    ('Day Pass',   9.99,  3);

INSERT INTO Staff (FirstName, LastName, Role, HireDate, HourlyWage) VALUES
    ('Rami',   'Hassan',  'Manager',      '2022-03-01', 45.00),
    ('Sara',   'Al-Nour', 'Receptionist', '2023-06-15', 25.00),
    ('Khalid', 'Yusuf',   'Technician',   '2023-09-20', 28.00),
    ('Lina',   'Farouk',  'Receptionist', '2024-01-10', 25.00);

INSERT INTO Member (FirstName, LastName, Email, Phone, JoinDate, TypeID) VALUES
    ('Ahmed',  'Al-Rashid', 'ahmed@email.com',  '+971501234567', '2024-01-15', 2),
    ('Fatima', 'Khalil',    'fatima@email.com', '+971509876543', '2024-02-01', 3),
    ('Omar',   'Saeed',     'omar@email.com',   '+971555555555', '2024-03-10', 1),
    ('Nour',   'Ibrahim',   'nour@email.com',   NULL,            '2024-04-05', 2),
    ('Ziad',   'Mansour',   'ziad@email.com',   '+971501112233', '2024-05-20', 3),
    ('Hana',   'Al-Zaabi',  'hana@email.com',   '+971507654321', '2024-06-12', 1),
    ('Tariq',  'Nasser',    'tariq@email.com',  '+971504445566', '2024-07-08', 4),
    ('Dina',   'Fouad',     'dina@email.com',   NULL,            '2024-08-22', 2);

INSERT INTO Station (StationName, StationType, HourlyRate, IsAvailable) VALUES
    ('VIP Booth 1',    'VIP',     75.00, 1),
    ('VIP Booth 2',    'VIP',     75.00, 1),
    ('Standard PC 1',  'PC',      35.00, 1),
    ('Standard PC 2',  'PC',      35.00, 1),
    ('Console Zone 1', 'Console', 45.00, 1),
    ('Console Zone 2', 'Console', 45.00, 0),
    ('Simulator Pod',  'VR',      90.00, 1),
    ('Streaming Desk', 'Stream',  60.00, 1);

INSERT INTO Game (GameTitle, Genre, Platform, ReleaseYear) VALUES
    ('Valorant',          'FPS',           'PC',      2020),
    ('FIFA 25',           'Sports',        'Console', 2024),
    ('Elden Ring',        'RPG',           'PC',      2022),
    ('Call of Duty: BO6', 'FPS',           'Console', 2024),
    ('Fortnite',          'Battle Royale', 'PC',      2017),
    ('Street Fighter 6',  'Fighting',      'Console', 2023),
    ('Beat Saber',        'Rhythm',        'VR',      2018),
    ('Cyberpunk 2077',    'RPG',           'PC',      2020);

INSERT INTO StationGame (StationID, GameID) VALUES
    (1, 1), (1, 3), (1, 5), (1, 8),
    (2, 1), (2, 3), (2, 5), (2, 8),
    (3, 1), (3, 3), (3, 5), (3, 8),
    (4, 1), (4, 3), (4, 5), (4, 8),
    (5, 2), (5, 4), (5, 6),
    (6, 2), (6, 4), (6, 6),
    (7, 7),
    (8, 1), (8, 5);

-- TotalCost = hours x station HourlyRate
INSERT INTO Booking (MemberID, StationID, StaffID, StartTime, EndTime, TotalCost, Status) VALUES
    (1, 1, 2, '2025-01-10 14:00:00', '2025-01-10 16:00:00', 150.00, 'Completed'),
    (2, 7, 2, '2025-01-12 10:00:00', '2025-01-12 11:30:00', 135.00, 'Completed'),
    (3, 3, 4, '2025-01-15 18:00:00', '2025-01-15 20:00:00',  70.00, 'Completed'),
    (4, 5, 2, '2025-02-01 13:00:00', '2025-02-01 15:00:00',  90.00, 'Completed'),
    (5, 1, 3, '2025-02-05 11:00:00', '2025-02-05 14:00:00', 225.00, 'Completed'),
    (6, 4, 4, '2025-02-10 16:00:00', '2025-02-10 17:30:00',  52.50, 'Completed'),
    (7, 3, 2, '2025-03-01 09:00:00', '2025-03-01 10:00:00',  35.00, 'Completed'),
    (1, 8, 2, '2025-03-05 15:00:00', NULL,                    NULL, 'Cancelled'),
    (2, 2, 3, '2025-03-10 12:00:00', '2025-03-10 14:00:00', 150.00, 'Completed'),
    (8, 5, 4, '2025-03-15 20:00:00', '2025-03-15 22:00:00',  90.00, 'Completed'),
    (1, 2, 3, '2025-03-22 13:00:00', '2025-03-22 17:00:00', 300.00, 'Completed'),
    (3, 7, 2, '2025-04-12 18:00:00', '2025-04-12 19:00:00',  90.00, 'Scheduled'),
    (6, 5, 4, '2025-04-14 16:00:00', '2025-04-14 18:00:00',  90.00, 'Scheduled');

INSERT INTO Payment (BookingID, Amount, PaymentDate, PaymentMethod, Status) VALUES
    (1,  150.00, '2025-01-10 16:05:00', 'Card', 'Paid'),
    (2,  135.00, '2025-01-12 11:35:00', 'Cash', 'Paid'),
    (3,   70.00, '2025-01-15 20:05:00', 'Card', 'Paid'),
    (4,   90.00, '2025-02-01 15:05:00', 'Card', 'Paid'),
    (5,  225.00, '2025-02-05 14:05:00', 'Card', 'Paid'),
    (6,   52.50, '2025-02-10 17:35:00', 'Cash', 'Paid'),
    (7,   35.00, '2025-03-01 10:05:00', 'Cash', 'Paid'),
    (9,  150.00, '2025-03-10 14:05:00', 'Card', 'Paid'),
    (10,  90.00, '2025-03-15 22:05:00', 'Card', 'Paid'),
    (11, 300.00, '2025-03-22 17:05:00', 'Card', 'Paid');

INSERT INTO Tournament (TournamentName, GameID, StartDate, EndDate, PrizePool, MaxParticipants) VALUES
    ('Valorant Spring Cup',  1, '2025-02-20', '2025-02-22', 2000.00, 32),
    ('FIFA League Season 1', 2, '2025-03-01', '2025-03-15', 1500.00, 16),
    ('FPS Frenzy',           4, '2025-03-20', '2025-03-21',  500.00, 16),
    ('Elden Ring Speedrun',  3, '2025-04-05', '2025-04-05',  300.00,  8);

INSERT INTO TournamentEntry (TournamentID, MemberID, RegistrationDate, Placement) VALUES
    (1, 1, '2025-02-15', 1),
    (1, 2, '2025-02-15', 2),
    (1, 5, '2025-02-16', 3),
    (1, 8, '2025-02-16', NULL),
    (2, 3, '2025-02-25', 1),
    (2, 4, '2025-02-26', 2),
    (2, 6, '2025-02-27', NULL),
    (3, 1, '2025-03-10', 1),
    (3, 7, '2025-03-11', 2),
    (4, 2, '2025-03-20', NULL),
    (4, 5, '2025-03-21', NULL);


-- =====================================================================
-- 3. QUERIES
-- =====================================================================

-- Q1. Completed VIP sessions, most expensive first.
SELECT m.MemberID,
       CONCAT(m.FirstName, ' ', m.LastName) AS MemberName,
       s.StationName,
       b.StartTime,
       b.TotalCost
FROM Member m
JOIN Booking b ON b.MemberID  = m.MemberID
JOIN Station s ON s.StationID = b.StationID
WHERE s.StationType = 'VIP'
  AND b.Status = 'Completed'
ORDER BY b.TotalCost DESC;


-- Q2. Tournament players with a phone number on file and no cancelled
--     bookings (contact list for the next tournament).
SELECT m.MemberID,
       CONCAT(m.FirstName, ' ', m.LastName) AS MemberName,
       m.Email,
       m.Phone
FROM Member m
WHERE m.Phone IS NOT NULL
  AND EXISTS (
      SELECT 1
      FROM TournamentEntry te
      WHERE te.MemberID = m.MemberID
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Booking b
      WHERE b.MemberID = m.MemberID
        AND b.Status = 'Cancelled'
  )
ORDER BY m.MemberID;


-- Q3. Financial summary for the reporting year: booking revenue in,
--     tournament prize money out, and the net result.
SELECT rev.BookingRevenue,
       prizes.PrizePayouts,
       rev.BookingRevenue - prizes.PrizePayouts AS NetResult
FROM (
    SELECT COALESCE(SUM(p.Amount), 0) AS BookingRevenue
    FROM Payment p
    WHERE p.Status = 'Paid'
      AND YEAR(p.PaymentDate) = @ReportYear
) AS rev
CROSS JOIN (
    SELECT COALESCE(SUM(t.PrizePool), 0) AS PrizePayouts
    FROM Tournament t
    WHERE YEAR(t.EndDate) = @ReportYear
) AS prizes;


-- Q4. Upcoming (scheduled) bookings in start-time order.
SELECT b.BookingID,
       CONCAT(m.FirstName, ' ', m.LastName) AS MemberName,
       s.StationName,
       b.StartTime,
       b.EndTime
FROM Booking b
JOIN Member  m ON m.MemberID  = b.MemberID
JOIN Station s ON s.StationID = b.StationID
WHERE b.Status = 'Scheduled'
ORDER BY b.StartTime;


-- Q5. Paid revenue by station type.
SELECT s.StationType,
       COUNT(*)      AS PaidSessions,
       SUM(p.Amount) AS TotalRevenue
FROM Payment p
JOIN Booking b ON b.BookingID = p.BookingID
JOIN Station s ON s.StationID = b.StationID
WHERE p.Status = 'Paid'
GROUP BY s.StationType
ORDER BY TotalRevenue DESC;


-- Q6. Tournament results with game titles; unplaced entries listed last.
SELECT t.TournamentName,
       g.GameTitle,
       CONCAT(m.FirstName, ' ', m.LastName) AS MemberName,
       te.Placement
FROM Tournament t
JOIN Game            g  ON g.GameID        = t.GameID
JOIN TournamentEntry te ON te.TournamentID = t.TournamentID
JOIN Member          m  ON m.MemberID      = te.MemberID
ORDER BY t.TournamentName,
         te.Placement IS NULL,
         te.Placement;


-- Q7. Completed sessions, newest first (derived table in FROM).
SELECT CONCAT(m.FirstName, ' ', m.LastName) AS MemberName,
       s.StationName,
       completed.StartTime,
       completed.EndTime,
       completed.TotalCost
FROM (
    SELECT MemberID, StationID, StartTime, EndTime, TotalCost
    FROM Booking
    WHERE Status = 'Completed'
) AS completed
JOIN Member  m ON m.MemberID  = completed.MemberID
JOIN Station s ON s.StationID = completed.StationID
ORDER BY completed.StartTime DESC;


-- =====================================================================
-- 4. DATA MAINTENANCE
-- =====================================================================

-- M1. Upgrade members who have paid more than AED 400 in total to Elite
--     (members already on Elite are left unchanged).
UPDATE Member
SET TypeID = (SELECT TypeID FROM MembershipType WHERE TypeName = 'Elite')
WHERE TypeID <> (SELECT TypeID FROM MembershipType WHERE TypeName = 'Elite')
  AND MemberID IN (
      SELECT b.MemberID
      FROM Booking b
      JOIN Payment p ON p.BookingID = b.BookingID
      WHERE p.Status = 'Paid'
      GROUP BY b.MemberID
      HAVING SUM(p.Amount) > 400
  );

-- Check M1: membership type and total paid per member.
SELECT m.MemberID,
       CONCAT(m.FirstName, ' ', m.LastName) AS MemberName,
       mt.TypeName,
       COALESCE(SUM(p.Amount), 0) AS TotalPaid
FROM Member m
JOIN MembershipType mt ON mt.TypeID    = m.TypeID
LEFT JOIN Booking b    ON b.MemberID   = m.MemberID
LEFT JOIN Payment p    ON p.BookingID  = b.BookingID AND p.Status = 'Paid'
GROUP BY m.MemberID, m.FirstName, m.LastName, mt.TypeName
ORDER BY TotalPaid DESC;


-- M2. Remove unplaced entries from tournaments that have already finished.
DELETE FROM TournamentEntry
WHERE Placement IS NULL
  AND TournamentID IN (
      SELECT TournamentID
      FROM Tournament
      WHERE EndDate < CURDATE()
  );

-- Check M2: remaining entries per tournament.
SELECT t.TournamentName,
       COUNT(te.EntryID) AS Entries
FROM Tournament t
LEFT JOIN TournamentEntry te ON te.TournamentID = t.TournamentID
GROUP BY t.TournamentID, t.TournamentName
ORDER BY t.StartDate;
