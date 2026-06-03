import { Gender } from './enums';

/**
 * 家族成员数据模型
 */
export interface FamilyMember {
  /** 成员唯一标识符 (UUID) */
  id: string;
  /** 家族 ID */
  familyId: string;
  /** 关联用户 ID (已故成员为 null) */
  userId: string | null;
  /** 姓名 */
  name: string;
  /** 性别 */
  gender: Gender;
  /** 出生日期 */
  birthDate: Date | null;
  /** 逝世日期 */
  deathDate: Date | null;
  /** 是否已故 */
  isDeceased: boolean;
  /** 关联纪念堂 ID */
  memorialId: string | null;
  /** 父亲 ID */
  parentId: string | null;
  /** 母亲 ID */
  motherId: string | null;
  /** 配偶 ID */
  spouseId: string | null;
  /** 第几代 */
  generation: number;
  /** 同级排序 */
  sortOrder: number;
  /** 个人简介 */
  biography: string | null;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 添加家族成员请求
 */
export interface AddFamilyMemberRequest {
  name: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
  parentId?: string;
  motherId?: string;
  spouseId?: string;
  biography?: string;
}

/**
 * 更新家族成员请求
 */
export interface UpdateFamilyMemberRequest {
  name?: string;
  gender?: Gender;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
}

/**
 * 更新成员关系请求
 */
export interface UpdateRelationRequest {
  parentId?: string | null;
  motherId?: string | null;
  spouseId?: string | null;
}

/**
 * 家族树节点
 */
export interface FamilyTreeNode extends FamilyMember {
  /** 子女节点 */
  children: FamilyTreeNode[];
  /** 配偶节点 (如果有) */
  spouse?: FamilyTreeNode | null;
}

/**
 * 家族树
 */
export interface FamilyTree {
  /** 家族 ID */
  familyId: string;
  /** 家族名称 */
  familyName: string;
  /** 树根节点列表 (第一代) */
  roots: FamilyTreeNode[];
  /** 总代数 */
  totalGenerations: number;
}

/**
 * 家族成员详情 (包含关联信息)
 */
export interface FamilyMemberDetail extends FamilyMember {
  /** 父亲姓名 */
  parentName?: string | null;
  /** 母亲姓名 */
  motherName?: string | null;
  /** 配偶姓名 */
  spouseName?: string | null;
  /** 子女数量 */
  childrenCount?: number;
}
