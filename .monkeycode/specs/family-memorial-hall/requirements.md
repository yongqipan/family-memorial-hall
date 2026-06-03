# Requirements Document

## Introduction

亲人纪念堂是一个面向家族内部成员的私密性线上纪念空间，旨在为已故家族成员建立一个可长期保存的数字化纪念场所。系统支持 3D 虚拟场景祭拜、家族族谱管理、生平故事协作编辑、多媒体展示以及忌日提醒等功能，帮助家族成员寄托哀思、传承家族记忆。

## Glossary

- **纪念堂**：为已故家族成员创建的虚拟纪念空间，包含 3D 场景、生平信息、照片视频等内容
- **家族成员**：经过认证的用户，可以访问纪念堂并进行祭拜、留言等操作
- **祭拜动作**：用户在纪念堂中进行的仪式性互动行为，包括献花、点烛、上香、鞠躬、供奉祭品等
- **族谱**：展示家族成员关系的树状结构图
- **忌日提醒**：系统在逝者忌日前 7 天和当天通过邮件或站内通知提醒家族成员
- **生平故事**：记录逝者生平事迹的协作编辑文档，支持多位家族成员共同维护

## Requirements

### Requirement 1: 用户认证与权限管理

**User Story:** AS 家族管理员，I WANT 管理家族成员访问权限，SO THAT 确保纪念堂的私密性和安全性

#### Acceptance Criteria

1. WHEN 用户注册账号时，THE system SHALL 要求提供邀请码或管理员审批
2. WHILE 用户未登录时，THE system SHALL 禁止访问任何纪念堂内容
3. IF 用户连续 5 次输入错误密码，THE system SHALL 锁定账号 30 分钟
4. THE system SHALL 提供管理员角色和普通家族成员角色的权限区分
5. WHEN 管理员添加新家族成员时，THE system SHALL 发送邀请邮件包含激活链接
6. IF 账号被移除出家族，THE system SHALL 立即收回所有访问权限

### Requirement 2: 3D 虚拟纪念堂场景

**User Story:** AS 家族成员，I WANT 在 3D 虚拟场景中祭拜逝者，SO THAT 获得沉浸式的祭拜体验

#### Acceptance Criteria

1. THE system SHALL 提供祠堂和墓碑两种 3D 场景模板供用户选择
2. WHEN 用户进入纪念堂时，THE system SHALL 加载 3D 场景并展示逝者照片或雕像
3. WHEN 用户选择献花动作时，THE system SHALL 在祭台上显示虚拟花束并播放动画
4. WHEN 用户选择点烛动作时，THE system SHALL 点燃虚拟蜡烛并显示摇曳火焰效果
5. WHEN 用户选择上香动作时，THE system SHALL 显示香烟袅袅上升的粒子效果
6. WHEN 用户选择鞠躬动作时，THE system SHALL 播放角色鞠躬动画
7. WHEN 用户供奉祭品时，THE system SHALL 在祭台上摆放虚拟祭品模型
8. WHILE 用户在 3D 场景中，THE system SHALL 支持 360 度视角旋转和缩放
9. THE system SHALL 为每次祭拜动作记录时间并显示在祭拜记录中

### Requirement 3: 留言与追思

**User Story:** AS 家族成员，I WANT 在纪念堂留言表达思念，SO THAT 与逝者进行情感连接

#### Acceptance Criteria

1. WHEN 家族成员提交留言时，THE system SHALL 保存留言内容、作者和发布时间
2. THE system SHALL 支持文字形式的留言
3. WHILE 用户浏览留言时，THE system SHALL 按时间倒序展示所有留言
4. WHEN 用户编辑自己的留言时，THE system SHALL 更新内容并标注"已编辑"
5. IF 用户删除自己的留言，THE system SHALL 从列表中移除该留言
6. THE system SHALL 禁止非家族成员查看或添加留言

### Requirement 4: 家族族谱管理

**User Story:** AS 家族成员，I WANT 查看和编辑家族族谱，SO THAT 了解家族成员关系和传承

#### Acceptance Criteria

1. THE system SHALL 提供树状结构的族谱可视化展示
2. WHEN 管理员添加家族成员时，THE system SHALL 要求指定其在族谱中的位置和关系
3. WHILE 用户查看族谱时，THE system SHALL 标注已故成员 (使用特殊标记或颜色)
4. WHEN 创建纪念堂时，THE system SHALL 自动在族谱中标记该成员为已故
5. THE system SHALL 支持显示配偶、父母、子女等直系亲属关系
6. WHEN 用户点击族谱中的成员时，THE system SHALL 跳转到该成员的纪念堂或个人页面

### Requirement 5: 生平故事协作编辑

**User Story:** AS 家族成员，I WANT 共同编辑逝者生平故事，SO THAT 完整记录逝者的人生历程

#### Acceptance Criteria

1. THE system SHALL 提供富文本编辑器用于编写生平故事
2. WHEN 多位用户同时编辑时，THE system SHALL 支持实时协作和版本控制
3. THE system SHALL 保存每次编辑的历史版本并支持回溯
4. WHEN 用户查看生平故事时，THE system SHALL 显示最后更新者和更新时间
5. THE system SHALL 支持在故事中插入照片、视频等多媒体内容
6. IF 发生编辑冲突时，THE system SHALL 提示用户并保留两个版本供选择合并

### Requirement 6: 照片与视频展示

**User Story:** AS 家族成员，I WANT 上传和展示逝者的照片与视频，SO THAT 留存珍贵记忆

#### Acceptance Criteria

1. THE system SHALL 提供照片墙展示逝者的生平照片
2. WHEN 用户点击照片时，THE system SHALL 以全屏模式展示并支持缩放
3. THE system SHALL 支持上传 MP4、MOV 格式的视频文件
4. WHEN 用户上传媒体文件时，THE system SHALL 添加可选的说明文字和拍摄时间
5. THE system SHALL 按时间顺序或相册分类组织照片和视频
6. IF 上传文件大小超过 100MB，THE system SHALL 拒绝并提示用户
7. THE system SHALL 为每个家族成员提供至少 10GB 的媒体存储空间

### Requirement 7: 忌日提醒服务

**User Story:** AS 家族成员，I WANT 收到逝者忌日提醒，SO THAT 不错过重要的祭祀日期

#### Acceptance Criteria

1. THE system SHALL 在逝者忌日前 7 天的上午 9:00 发送提醒
2. THE system SHALL 在逝者忌日当天的上午 9:00 发送提醒
3. THE system SHALL 同时发送邮件和站内通知两种类型的提醒
4. WHEN 发送提醒时，THE system SHALL 包含逝者姓名、照片和快速进入纪念堂的链接
5. WHILE 用户设置提醒偏好时，THE system SHALL 允许选择接收邮件、站内通知或两者
6. IF 邮件发送失败，THE system SHALL 记录错误并重试最多 3 次
7. THE system SHALL 允许用户关闭特定逝者的提醒功能

### Requirement 8: 祭拜记录与统计

**User Story:** AS 家族成员，I WANT 查看祭拜历史记录，SO THAT 了解家族成员的祭拜情况

#### Acceptance Criteria

1. THE system SHALL 记录每次祭拜的时间、用户和祭拜动作类型
2. WHEN 用户进入纪念堂时，THE system SHALL 显示今日祭拜次数和累计祭拜次数
3. THE system SHALL 提供祭拜日历视图，展示每天的祭拜记录
4. WHILE 用户查看祭拜统计时，THE system SHALL 显示月度祭拜趋势图表
5. THE system SHALL 在特殊日期 (如清明节、中元节) 标注祭拜高峰

### Requirement 9: 数据持久化与备份

**User Story:** AS 家族管理员，I WANT 确保纪念堂数据长期保存，SO THAT 传承家族记忆给后代

#### Acceptance Criteria

1. THE system SHALL 每天自动备份所有数据到异地存储
2. THE system SHALL 提供数据导出功能，支持导出为 PDF 或压缩包格式
3. IF 系统检测到数据异常，THE system SHALL 发送告警通知给管理员
4. THE system SHALL 保证数据至少保存 50 年
5. WHEN 用户请求数据恢复时，THE system SHALL 从备份中恢复指定日期的数据
