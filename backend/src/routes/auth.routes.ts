import { Router, Request, Response, NextFunction } from 'express';
import { register, login, refreshAccessToken } from '../services/auth.service';
import { RegisterDTO } from '../services/auth.service';
import { LoginDTO } from '../models/user.model';
import { AppError } from '../utils/errors';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roleId: string;
  };
}

export function authRouter() {
  // 用户注册
  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, nickName, inviteCode } = req.body;
      
      // 验证必填字段
      if (!email || !password || !nickName) {
        throw new AppError('邮箱、密码和昵称为必填项', 'VALIDATION_ERROR', 400);
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError('邮箱格式不正确', 'VALIDATION_ERROR', 400);
      }

      // 验证密码强度
      if (password.length < 8) {
        throw new AppError('密码长度至少为 8 位', 'VALIDATION_ERROR', 400);
      }

      const data: RegisterDTO = { email, password, nickName, inviteCode };
      const result = await register(data);
      
      res.json({
        code: 'SUCCESS',
        message: '注册成功',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  });

  // 用户登录
  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new AppError('邮箱和密码为必填项', 'VALIDATION_ERROR', 400);
      }

      const data: LoginDTO = { email, password };
      const result = await login(data);
      
      res.json({
        code: 'SUCCESS',
        message: '登录成功',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  });

  // 刷新 Token
  router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        throw new AppError('刷新令牌为必填项', 'VALIDATION_ERROR', 400);
      }

      const result = await refreshAccessToken(refreshToken);
      
      res.json({
        code: 'SUCCESS',
        message: '刷新成功',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export default authRouter;
