<!-- @format -->

users (使用者)

-   user_id: 使用者 ID
-   username: GitHub 使用者名稱
-   display_name: 使用者顯示名稱
-   email: GitHub 使用者電子郵件
-   github_id: GitHub 使用者 ID
-   profile_image: GitHub 使用者大頭貼

projects (專案)

-   project_id: 專案 ID
-   user_id: 屬於的使用者 ID
-   project_name: 專案名稱，可重複中文、英文、數字、底線、空白
-   created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
-   profile_image: 專案大頭貼
-   cloudflare: boolean, 是否啟用 Cloudflare
-   all_in_one: boolean, 是否整個專案共用同一個字體檔案
-   keep_font: boolean, 是否保留不再出現在網頁中的文字
-   pagination: list, 當作是分頁而不是參數的網址

domains (網域)

-   domain_id: 網域 ID
-   owner_id: 使用者 ID
-   project_id: 屬於哪個專案
-   domain_name: 網域名稱
-   verified: 是否已驗證 DNS、1 為 DNS 驗證通過、0 為未驗證、2 為檔案驗證通過，則一即可。
-   favicon: 網域 favicon 圖片 URL

fonts (原始字體檔案)

-   font_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-   font_class (字串，用來代表字體的 class)
-   font_name (字體原始名稱)
-   font_name_zh (字體中文名稱)
-   font_name_en (字體英文名稱)
-   font_license (字體授權)
-   updated_at (上次檔案更新時間)
-   font_weight (記錄所有字體包含的字重)
-   repo_url (字體原始檔案的 GitHub 連結)
-   author (字體作者)

font-generated (生成字體檔案)

-   url (給哪個網址使用的字體)
-   file_id (檔案 ID)
-   font_id (使用的字體)
-   font-weight (字重)
-   text (使用的文字)
-   cloudflare (bool, 檔案在 Cloudflare R2 還是本地端)
-   usage_count (INT, DEFAULT 0)
-   last_used_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
-   created_at (生成完的時間。如果還沒有生成，就是 NULL)

usage (使用紀錄)

-   visit_time (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
-   file_id (INT, FOREIGN KEY references font-generated(file_id))
-   ip_address (使用者 IP 位址)
-   user_agent (使用者瀏覽器資訊)

sessions (登入紀錄)

-   session_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-   hashed_token (字串，登入用的 token)
-   user_id (INT, FOREIGN KEY references users(user_id))
-   session_expires (TIMESTAMP)

api_keys (API 金鑰)

-   hashed_key (字串，API 金鑰)
-   salt (字串，加密用的鹽)
-   user_id (INT, FOREIGN KEY references users(user_id))
-   created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
-   last_used_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
-   usage_count (INT, DEFAULT 0)