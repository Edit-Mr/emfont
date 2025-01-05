-- MariaDB
CREATE TABLE users IF NOT EXISTS `users`(
    id int(11) NOT NULL AUTO_INCREMENT,-- I WNAT TO ADD ID CHECKNUMBER
    nickname varchar(10),
    github_id varchar(40) -- 39字元的 GitHuv 使用者名稱，唯一不可重複的
    PRIMARY KEY(id)
)
CREATE TABLE users IF NOT EXISTS `project`(
    project int(11) NOT NULL AUTO_INCREMENT PRIMARY ,
    name varchar(20),
    ower int(11),
    cloudflare TINYINT(1) DEFAULT 0 NOT NULL,
    all_in_on TINYINT(1) DEFAULT 0 NOT NULL,
    keep_font TINYINT(1) DEFAULT 0 NOT NULL,
    pagination JSON DEFAULT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_pudate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 檔案數量、網域數量
    PRIMARY KEY(project)
    FOREIGN KEY (ower) REFERENCES users(id) ON DELETE CASECADE
)
CREATE TALBE IF NOT EXISTS `domain`(
    domain_name varchar(100),
    project int(11),
    ower int(11),
    favicon varchar(20), -- 存圖片路徑,大小未定
    challenge_token varchar(30), -- 不確定確切長度

    PRIMARY KEY(domain_name)
    FOREIGN key (project) project (project),
    FOREIGN KEY (ower) REFERENCES users(id) ON DELETE CASECADE,
)
-- 待辦：varchar的位元數和真正字元數的對應
CREATE TALBE IF NOT EXISTS `font`(
    class varchar(25),
    font_weight int,
    zh_name varchar(30), -- 長度有待調整
    en_name varchar(30),
    font_license varchar(30),
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author varchar(25),
    PRIMARY KEY(class)
)

CREATE TABLE use_records IF NOT EXISTS `usage_records`(
    file_id int(11) AUTO_INCREMENT,
    ip_address har(15), -- IPv4,再用inet_aton 去轉換
    user_agant varchar(255) -- 為什麼需要這個欄位？
)
CREATE TABLE IF NOT EXISTS sessions (
    session_id CHAR(32) PRIMARY KEY,
    hashed_token CHAR(64),
    user_id INT,
    session_expires TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);