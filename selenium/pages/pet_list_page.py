

from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC


class PetListPage(BasePage):
    """寵物列表頁面的 Page Object"""

    # URL 路徑
    PATH = "/pet"

    # Locators
    VIEW_DETAILS_BUTTONS = (By.XPATH, "//button[contains(text(), '查看詳細資訊')]")
    PET_CARDS = (By.CSS_SELECTOR, ".MuiCard-root")
    PET_CARD_TITLE = (By.CSS_SELECTOR, ".MuiCard-root h2, .MuiCard-root h3")
    LOADING_INDICATOR = (By.CSS_SELECTOR, ".MuiCircularProgress-root")

    def navigate(self):
        """導航到寵物列表頁面"""
        full_url = f"{self.base_url}{self.PATH}"
        self.driver.get(full_url)
        
        # 等待頁面載入完成
        self.wait.until(EC.url_contains(self.PATH))
        
        # 等待載入動畫消失（如果有的話）
        self.wait_for_page_load()

    def wait_for_page_load(self):
        """等待頁面完全載入"""
        try:
            # 等待載入指示器消失
            self.wait.until(
                EC.invisibility_of_element_located(self.LOADING_INDICATOR)
            )
        except:
            pass  # 如果沒有載入指示器，繼續執行
        
        # 等待至少一個寵物卡片出現
        self.wait.until(
            EC.presence_of_element_located(self.PET_CARDS)
        )

    def click_first_view_details_button(self):
        """點擊第一個「查看詳細資訊」按鈕"""
        button = self.wait.until(
            EC.element_to_be_clickable(self.VIEW_DETAILS_BUTTONS)
        )
        button.click()

    def click_view_details_by_index(self, index: int = 0):
        """
        點擊指定索引的「查看詳細資訊」按鈕
        
        Args:
            index: 按鈕索引（從 0 開始）
        """
        buttons = self.wait.until(
            EC.presence_of_all_elements_located(self.VIEW_DETAILS_BUTTONS)
        )
        
        if index < len(buttons):
            self.wait.until(EC.element_to_be_clickable(buttons[index]))
            buttons[index].click()
        else:
            raise IndexError(f"索引 {index} 超出範圍，只有 {len(buttons)} 個按鈕")

    def click_view_details_by_pet_name(self, pet_name: str):
        """
        根據寵物名稱點擊「查看詳細資訊」按鈕
        
        Args:
            pet_name: 寵物名稱
        """
        # 找到包含指定寵物名稱的卡片
        pet_card = self.wait.until(
            EC.presence_of_element_located(
                (By.XPATH, f"//h2[contains(text(), '{pet_name}')] | //h3[contains(text(), '{pet_name}')]")
            )
        )
        
        # 找到該卡片內的「查看詳細資訊」按鈕
        view_button = pet_card.find_element(
            By.XPATH, 
            "./ancestor::div[contains(@class, 'MuiCard-root')]//button[contains(text(), '查看詳細資訊')]"
        )
        
        self.wait.until(EC.element_to_be_clickable(view_button))
        view_button.click()

    def get_pet_card_count(self) -> int:
        """獲取寵物卡片數量"""
        cards = self.wait.until(
            EC.presence_of_all_elements_located(self.PET_CARDS)
        )
        return len(cards)

    def get_all_pet_names(self) -> list[str]:
        """獲取所有寵物名稱"""
        titles = self.wait.until(
            EC.presence_of_all_elements_located(self.PET_CARD_TITLE)
        )
        return [title.text for title in titles]

    def is_pet_card_visible(self, pet_name: str) -> bool:
        """
        檢查指定寵物卡片是否可見
        
        Args:
            pet_name: 寵物名稱
            
        Returns:
            True 如果寵物卡片可見，否則 False
        """
        try:
            self.wait.until(
                EC.visibility_of_element_located(
                    (By.XPATH, f"//h2[contains(text(), '{pet_name}')] | //h3[contains(text(), '{pet_name}')]")
                )
            )
            return True
        except:
            return False

    def wait_for_pets_to_load(self, expected_count: int = None):
        """
        等待寵物列表載入完成
        
        Args:
            expected_count: 期望的寵物數量（可選）
        """
        self.wait_for_page_load()
        
        if expected_count:
            self.wait.until(
                lambda driver: self.get_pet_card_count() >= expected_count
            )