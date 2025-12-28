from pages.common.base_page import BasePage
from pages.pet_list_page import PetListPage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC


class LoginPage(BasePage):
    """登入頁面 Page Object"""
    
    # Locators
    EMAIL_INPUT = (By.ID, "email")
    PASSWORD_INPUT = (By.ID, "password")
    LOGIN_BUTTON = (By.ID, "login-button")

    def enter_email(self, email):
        """輸入電子郵件"""
        email_field = self.wait.until(
            EC.visibility_of_element_located(self.EMAIL_INPUT)
        )
        email_field.clear()
        email_field.send_keys(email)

    def enter_password(self, password):
        """輸入密碼"""
        password_field = self.wait.until(
            EC.visibility_of_element_located(self.PASSWORD_INPUT)
        )
        password_field.clear()
        password_field.send_keys(password)

    def click_login(self):
        """點擊登入按鈕並返回寵物列表頁面"""
        login_button = self.wait.until(
            EC.element_to_be_clickable(self.LOGIN_BUTTON)
        )
        login_button.click()
        return PetListPage(self.driver)
    
    def login(self, email, password):
        """完整登入流程（組合方法）"""
        self.enter_email(email)
        self.enter_password(password)
        return self.click_login()