import { z } from 'zod';
import { UserStatus, UserRole, Gender, SceneType, RitualType, MediaType, ReminderType } from './enums';

/**
 * 邮箱格式正则
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 密码强度正则 (至少 8 位，包含字母和数字)
 */
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

/**
 * 用户注册验证模式
 */
export const registerSchema = z.object({
  email: z.string().email('无效的邮箱格式').regex(EMAIL_REGEX, '无效的邮箱格式'),
  password: z
    .string()
    .min(8, '密码至少 8 位')
    .regex(PASSWORD_REGEX, '密码必须包含字母和数字'),
  nickName: z.string().min(1, '昵称不能为空').max(50, '昵称最多 50 个字符'),
  inviteCode: z.string().optional(),
});

/**
 * 用户登录验证模式
 */
export const loginSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  password: z.string().min(1, '密码不能为空'),
});

/**
 * 邀请成员验证模式
 */
export const inviteMemberSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  roleId: z.nativeEnum(UserRole),
});

/**
 * 创建纪念堂验证模式
 */
export const createMemorialSchema = z.object({
  deceasedId: z.string().uuid('无效的逝者 ID'),
  name: z.string().min(1, '纪念堂名称不能为空').max(100, '名称最多 100 个字符'),
  sceneType: z.nativeEnum(SceneType),
  sceneConfig: z
    .object({
      templateId: z.string(),
      background: z.string(),
      lighting: z.object({
        ambientIntensity: z.number().min(0).max(1),
        ambientColor: z.string(),
        directionalIntensity: z.number().min(0).max(1),
        directionalColor: z.string(),
        shadowsEnabled: z.boolean(),
      }),
      decorations: z
        .array(
          z.object({
            type: z.string(),
            modelUrl: z.string(),
            position: z.tuple([z.number(), z.number(), z.number()]),
            rotation: z.tuple([z.number(), z.number(), z.number()]),
            scale: z.tuple([z.number(), z.number(), z.number()]),
          })
        )
        .optional(),
      backgroundMusic: z.string().optional(),
    })
    .optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  biography: z.string().optional(),
});

/**
 * 更新纪念堂验证模式
 */
export const updateMemorialSchema = createMemorialSchema.partial();

/**
 * 祭拜动作验证模式
 */
export const ritualSchema = z.object({
  ritualType: z.nativeEnum(RitualType),
  ritualData: z.record(z.any()),
  message: z.string().max(500, '留言最多 500 个字符').optional(),
});

/**
 * 添加家族成员验证模式
 */
export const addFamilyMemberSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名最多 100 个字符'),
  gender: z.nativeEnum(Gender),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  parentId: z.string().uuid().optional(),
  motherId: z.string().uuid().optional(),
  spouseId: z.string().uuid().optional(),
  biography: z.string().optional(),
});

/**
 * 更新家族成员验证模式
 */
export const updateFamilyMemberSchema = addFamilyMemberSchema.partial();

/**
 * 上传媒体验证模式
 */
export const uploadMediaSchema = z.object({
  memorialId: z.string().uuid(),
  type: z.nativeEnum(MediaType),
  fileName: z.string().min(1),
  fileSize: z.number().positive().max(100 * 1024 * 1024, '文件大小不能超过 100MB'),
  mimeType: z.string(),
  description: z.string().max(500).optional(),
  captureDate: z.string().optional(),
  albumId: z.string().uuid().optional(),
});

/**
 * 创建留言验证模式
 */
export const createMessageSchema = z.object({
  content: z.string().min(1, '留言内容不能为空').max(1000, '留言最多 1000 个字符'),
});

/**
 * 更新留言验证模式
 */
export const updateMessageSchema = createMessageSchema;

/**
 * 调度提醒验证模式
 */
export const scheduleReminderSchema = z.object({
  memorialId: z.string().uuid(),
  deceasedId: z.string().uuid(),
  type: z.nativeEnum(ReminderType),
  scheduleDate: z.string().datetime(),
});
