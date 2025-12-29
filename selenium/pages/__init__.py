"""
Page Objects for Pet Adoption System
使用 Selenium POM (Page Object Model) 架構
"""

from .pet_list_page import PetListPage
from .pet_detail_page import PetDetailPage

__all__ = ['PetListPage', 'PetDetailPage']
