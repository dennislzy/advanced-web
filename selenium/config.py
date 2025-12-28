"""
測試配置文件
"""

# 基礎 URL
BASE_URL = "http://localhost:3000"

# 頁面路徑
PATHS = {
    "pet_list": "/pet",
    "pet_detail": "/pet/",  # 需要加上 pet_id
}

# 等待時間設定（秒）
TIMEOUTS = {
    "implicit_wait": 10,  # 隱式等待
    "page_load": 30,      # 頁面載入超時
    "element_wait": 10,   # 元素等待超時
}

# 截圖設定
SCREENSHOT = {
    "on_failure": True,
    "save_path": "./screenshots/",
}

# Chrome 選項
CHROME_OPTIONS = {
    "headless": False,  # 是否使用無頭模式
    "start_maximized": True,
    "disable_automation": True,
}
