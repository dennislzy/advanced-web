

from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC


class PetDetailPage(BasePage):
    """寵物詳細頁面的 Page Object"""

    # Locators
    ADOPT_BUTTON = (By.XPATH, "//button[contains(text(), '我想領養')]")
    CONFIRM_DIALOG = (By.XPATH, "//div[@role='dialog']")
    CONFIRM_DIALOG_TITLE = (By.XPATH, "//h2[contains(text(), '確認領養')]")
    CONFIRM_ADOPT_BUTTON = (By.XPATH, "//button[contains(text(), '確認領養')]")
    CANCEL_BUTTON = (By.XPATH, "//button[contains(text(), '取消')]")

    def click_adopt_button(self):
        """點擊「我想領養」按鈕"""
        button = self.wait.until(
            EC.element_to_be_clickable(self.ADOPT_BUTTON)
        )
        button.click()

    def is_dialog_displayed(self) -> bool:
        """檢查確認對話框是否顯示"""
        try:
            self.wait.until(
                EC.visibility_of_element_located(self.CONFIRM_DIALOG)
            )
            return True
        except:
            return False

    def get_dialog_title(self) -> str:
        """獲取對話框標題文字"""
        title_element = self.wait.until(
            EC.visibility_of_element_located(self.CONFIRM_DIALOG_TITLE)
        )
        return title_element.text

    def click_confirm_adopt_button(self):
        """點擊對話框中的「確認領養」按鈕"""
        button = self.wait.until(
            EC.element_to_be_clickable(self.CONFIRM_ADOPT_BUTTON)
        )
        button.click()

    def click_cancel_button(self):
        """點擊對話框中的「取消」按鈕"""
        button = self.wait.until(
            EC.element_to_be_clickable(self.CANCEL_BUTTON)
        )
        button.click()

    def wait_for_alert_and_get_text(self) -> str:
        """等待 alert 出現並獲取文字（感謝領養訊息）"""
        self.wait.until(EC.alert_is_present())
        alert = self.driver.switch_to.alert
        alert_text = alert.text
        alert.accept()  # 關閉 alert
        return alert_text

    def is_thank_you_message_displayed(self) -> bool:
        """驗證是否顯示感謝領養訊息"""
        try:
            alert_text = self.wait_for_alert_and_get_text()
            # 檢查是否包含「感謝」關鍵字
            return "感謝" in alert_text
        except:
            return False

    def get_pet_name(self) -> str:
        """獲取寵物名稱（額外方法）"""
        pet_name = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//h1 | //h2"))
        )
        return pet_name.text

    def get_pet_info(self, info_type: str) -> str:
        """
        獲取寵物資訊
        
        Args:
            info_type: 資訊類型，如 '品種', '年齡', '性別' 等
            
        Returns:
            對應的資訊文字
        """
        info_element = self.wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, f"//dt[contains(text(), '{info_type}')]/following-sibling::dd")
            )
        )
        return info_element.text

    def complete_adoption(self):
        """完整的領養流程（組合方法）"""
        self.click_adopt_button()
        
        if self.is_dialog_displayed():
            self.click_confirm_adopt_button()
            return self.is_thank_you_message_displayed()
        
        return False