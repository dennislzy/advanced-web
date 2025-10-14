<!-- docs/zh-TW/index.md -->

# 寵物領養系統 說明文件

歡迎使用寵物領養系統說明文件。本文檔提供了完整的系統架構與功能說明、需求規格和開發指南。

## 📋 系統概述

本系統為小型寵物領養管理平台,提供寵物資訊管理、領養申請處理等核心功能,協助動物收容所或中途之家更有效率地管理領養流程。

### 核心功能 (Core Features)
- [寵物管理](core/pet/index.md)
    - [寵物基本資料](core/pet/basic_info/index.md)
    - [健康記錄](core/pet/health_record/index.md)
    - [照片管理](core/pet/photo/index.md)
    - [狀態管理](core/pet/status/index.md)

- [領養申請管理](core/adoption/index.md)
    - [申請表單](core/adoption/application/index.md)
    - [申請審核](core/adoption/review/index.md)
    - [申請狀態追蹤](core/adoption/status_tracking/index.md)

- [申請人管理](core/adopter/index.md)
    - [基本資料](core/adopter/basic_info/index.md)
    - [飼養環境評估](core/adopter/environment/index.md)
    - [申請歷史記錄](core/adopter/history/index.md)

### 輔助功能 (Supporting Features)
- [搜尋與篩選](features/search/index.md)
    - [寵物搜尋](features/search/pet_search/index.md)
    - [進階篩選](features/search/advanced_filter/index.md)

- [通知系統](features/notification/index.md)
    - [申請狀態通知](features/notification/application_status/index.md)
    - [Email 通知](features/notification/email/index.md)

- [報表統計](features/report/index.md)
    - [領養統計](features/report/adoption_stats/index.md)
    - [寵物統計](features/report/pet_stats/index.md)

### 系統管理 (System Management)
- [使用者管理](admin/user/index.md)
    - [帳號管理](admin/user/account/index.md)
    - [權限設定](admin/user/permission/index.md)

- [系統設定](admin/settings/index.md)
    - [基本設定](admin/settings/basic/index.md)
    - [參數設定](admin/settings/parameters/index.md)

## 🗂️ 資料結構

### 主要資料表
- **寵物資料表 (Pets)**
    - 基本資訊:編號、名稱、種類、品種、性別、年齡
    - 外觀特徵:體重、毛色、體型
    - 健康狀態:健康狀況、疫苗記錄、結紮狀態
    - 其他:照片、特殊需求、入所日期、領養狀態

- **領養申請表 (Applications)**
    - 申請資訊:申請編號、申請日期、寵物編號
    - 申請人資訊:姓名、聯絡方式、地址
    - 評估資訊:居住環境、飼養經驗、家庭成員
    - 審核資訊:審核狀態、審核結果、審核備註

- **申請人資料表 (Adopters)**
    - 個人資料:姓名、性別、年齡、職業
    - 聯絡資訊:電話、Email、地址
    - 環境資訊:住宅類型、是否有院子、家庭成員數
    - 經驗記錄:飼養經驗、過往領養記錄

## 🔧 功能需求

### CRUD 操作需求

**寵物管理**
- ✅ Create:新增寵物資料(含照片上傳)
- ✅ Read:查詢單一寵物詳細資料、列表顯示(分頁)
- ✅ Update:修改寵物資訊、更新領養狀態
- ✅ Delete:刪除寵物記錄(軟刪除建議)

**領養申請管理**
- ✅ Create:建立新領養申請
- ✅ Read:查看申請列表、查看申請詳情
- ✅ Update:更新申請狀態(待審核→已通過/已拒絕)、補充審核意見
- ✅ Delete:取消或刪除申請

**申請人管理**
- ✅ Create:註冊申請人資料
- ✅ Read:查詢申請人資訊、查看申請歷史
- ✅ Update:更新個人資料
- ✅ Delete:刪除申請人記錄

### 業務流程需求

1. **領養申請流程**
    - 瀏覽待領養寵物 → 填寫申請表 → 提交申請 → 管理員審核 → 通知申請結果 → 完成領養

2. **寵物狀態轉換**
    - 待領養 → 已預約 → 已領養 → 已結案

## 🎯 非功能需求
### 效能需求
- 頁面載入時間 < 2 秒
- 支援同時 100 人在線瀏覽
- 圖片壓縮與快取機制
