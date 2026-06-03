-- 创建枚举类型
CREATE TYPE user_status AS ENUM ('ACTIVE', 'LOCKED', 'DISABLED');
CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE');
CREATE TYPE scene_type AS ENUM ('HALL', 'TOMBSTONE');
CREATE TYPE ritual_type AS ENUM ('FLOWER', 'CANDLE', 'INCENSE', 'BOW', 'OFFERING');
CREATE TYPE media_type AS ENUM ('PHOTO', 'VIDEO');
CREATE TYPE reminder_type AS ENUM ('EMAIL', 'IN_APP', 'BOTH');
CREATE TYPE reminder_status AS ENUM ('PENDING', 'SENT', 'FAILED');
CREATE TYPE notification_type AS ENUM ('DEATH_ANNIVERSARY', 'SYSTEM', 'INVITATION');

-- 家族表
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nick_name VARCHAR(50) NOT NULL,
  avatar VARCHAR(500),
  role_id user_role NOT NULL DEFAULT 'MEMBER',
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  status user_status NOT NULL DEFAULT 'ACTIVE',
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  lock_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_family_id ON users(family_id);

-- 家族成员表
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  gender gender NOT NULL,
  birth_date DATE,
  death_date DATE,
  is_deceased BOOLEAN NOT NULL DEFAULT FALSE,
  memorial_id UUID,
  parent_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  mother_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  generation INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_family_members_parent_id ON family_members(parent_id);
CREATE INDEX idx_family_members_mother_id ON family_members(mother_id);

-- 纪念堂表
CREATE TABLE memorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deceased_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  scene_type scene_type NOT NULL DEFAULT 'HALL',
  scene_config JSONB NOT NULL DEFAULT '{}',
  biography TEXT,
  birth_date DATE,
  death_date DATE,
  death_anniversary VARCHAR(5) NOT NULL,
  total_ritual_count INTEGER NOT NULL DEFAULT 0,
  today_ritual_count INTEGER NOT NULL DEFAULT 0,
  last_ritual_reset_date DATE,
  storage_used BIGINT NOT NULL DEFAULT 0,
  storage_quota BIGINT NOT NULL DEFAULT 10737418240,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memorials_deceased_id ON memorials(deceased_id);
CREATE INDEX idx_memorials_family_id ON memorials(family_id);

-- 祭拜记录表
CREATE TABLE ritual_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ritual_type ritual_type NOT NULL,
  ritual_data JSONB NOT NULL DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ritual_records_memorial_id ON ritual_records(memorial_id);
CREATE INDEX idx_ritual_records_user_id ON ritual_records(user_id);
CREATE INDEX idx_ritual_records_created_at ON ritual_records(created_at);

-- 留言表
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_memorial_id ON messages(memorial_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);

-- 媒体文件表
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  description TEXT,
  capture_date DATE,
  album_id UUID,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_memorial_id ON media(memorial_id);
CREATE INDEX idx_media_type ON media(type);

-- 相册表
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  media_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_albums_memorial_id ON albums(memorial_id);

-- 提醒表
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  deceased_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  type reminder_type NOT NULL,
  schedule_date DATE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status reminder_status NOT NULL DEFAULT 'PENDING',
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reminders_memorial_id ON reminders(memorial_id);
CREATE INDEX idx_reminders_schedule_date ON reminders(schedule_date);
CREATE INDEX idx_reminders_status ON reminders(status);

-- 通知表
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- 邀请码表
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255),
  role_id user_role NOT NULL DEFAULT 'MEMBER',
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_by UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_family_id ON invite_codes(family_id);

-- 生平故事版本表
CREATE TABLE biography_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  change_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_biography_versions_memorial_id ON biography_versions(memorial_id);
CREATE UNIQUE INDEX idx_biography_versions_memorial_version ON biography_versions(memorial_id, version_number);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要自动更新 updated_at 的表添加触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memorials_updated_at BEFORE UPDATE ON memorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 更新纪念堂的今日祭拜次数重置函数
CREATE OR REPLACE FUNCTION reset_today_ritual_count()
RETURNS void AS $$
BEGIN
  UPDATE memorials
  SET today_ritual_count = 0,
      last_ritual_reset_date = CURRENT_DATE
  WHERE last_ritual_reset_date IS NULL 
     OR last_ritual_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
