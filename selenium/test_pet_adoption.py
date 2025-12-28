"""
測試寵物領養流程
"""

import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from pages import PetListPage, PetDetailPage
from pages.login_page import LoginPage


def setup_driver():
    """設置 Chrome WebDriver"""
    chrome_options = Options()
    chrome_options.add_argument('--start-maximized')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])

    try:
        # 強制重新下載正確版本的 ChromeDriver
        driver_path = ChromeDriverManager().install()
        print(f"ChromeDriver 路徑: {driver_path}")
        
        service = Service(driver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.implicitly_wait(10)
        return driver
    except Exception as e:
        print(f"❌ 無法啟動 Chrome WebDriver: {e}")
        print("\n嘗試替代方案...")
        
        # 替代方案：不使用 Service
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.implicitly_wait(10)
            return driver
        except Exception as e2:
            print(f"❌ 替代方案也失敗: {e2}")
            raise


def test_pet_adoption_flow():
    """測試寵物領養流程"""
    driver = None
    
    try:
        driver = setup_driver()
        driver.get("http://localhost:3000/L")
        login_page = LoginPage(driver)
        login_page.enter_email('a0976278215@gmail.com')
        login_page.enter_password('123456')
        pet_list_page = login_page.click_login()
        time.sleep(2)

        pet_list_page.click_first_view_details_button()
        time.sleep(2)

        pet_detail_page = PetDetailPage(driver)
        pet_detail_page.click_adopt_button()
        time.sleep(1)

        # Step 4: 驗證確認對話框是否顯示
        assert pet_detail_page.is_dialog_displayed(), "❌ 確認對話框未顯示"

        dialog_title = pet_detail_page.get_dialog_title()
        assert "確認領養" in dialog_title, "❌ 對話框標題不正確"
        time.sleep(1)

        # Step 5: 點擊「確認領養」按鈕
        pet_detail_page.click_confirm_adopt_button()
        time.sleep(1)

        # Step 6: 驗證是否顯示感謝領養訊息
        assert pet_detail_page.is_thank_you_message_displayed(), "❌ 未顯示感謝領養訊息"

    except Exception as e:
        print(f"\n❌ 測試過程中發生錯誤: {str(e)}")
        raise

    finally:
        if driver:
            time.sleep(2)
            driver.quit()


if __name__ == "__main__":
    test_pet_adoption_flow()