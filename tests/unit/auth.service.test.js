import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userModel from '../../src/models/user.model.js';
import * as passwordUtil from '../../src/utils/password.util.js';
import * as jwtUtil from '../../src/utils/jwt.util.js';
import { registerUser, loginUser } from '../../src/services/auth.service.js';
import { AppError } from '../../src/utils/app-error.js';

// Mock dependencies
vi.mock('../../src/models/user.model.js');
vi.mock('../../src/utils/password.util.js');
vi.mock('../../src/utils/jwt.util.js');

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpass',
};

describe('auth.service.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser()', () => {
    it('should register a new user and return token and user info', async () => {
      userModel.findUserByEmail.mockResolvedValue(null);
      passwordUtil.hashPassword.mockResolvedValue('hashedpass');
      userModel.createUser.mockResolvedValue(1);
      userModel.findUserById.mockResolvedValue(mockUser);
      jwtUtil.generateToken.mockReturnValue('jwt-token');

      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'plainpass',
      });

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      expect(userModel.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('plainpass');
      expect(userModel.createUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpass',
      });
      expect(jwtUtil.generateToken).toHaveBeenCalledWith({ userId: 1 });
    });

    it('should throw error if email already exists', async () => {
      userModel.findUserByEmail.mockResolvedValue(mockUser);

      await expect(() =>
        registerUser({
          name: 'Test User',
          email: 'test@example.com',
          password: 'plainpass',
        })
      ).rejects.toThrowError(new AppError('Email already in use.', 409, "CONFLICT"));
    });
  });

  describe('loginUser()', () => {
    it('should login and return token and user info', async () => {
      userModel.findUserByEmail.mockResolvedValue(mockUser);
      passwordUtil.comparePassword.mockResolvedValue(true);
      jwtUtil.generateToken.mockReturnValue('jwt-token');

      const result = await loginUser({
        email: 'test@example.com',
        password: 'plainpass',
      });

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      expect(userModel.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(passwordUtil.comparePassword).toHaveBeenCalledWith('plainpass', 'hashedpass');
      expect(jwtUtil.generateToken).toHaveBeenCalledWith({ userId: 1 });
    });

    it('should throw error if email not found', async () => {
      userModel.findUserByEmail.mockResolvedValue(null);

      await expect(() =>
        loginUser({ email: 'ghost@example.com', password: 'any' })
      ).rejects.toThrowError(new AppError('Invalid credentials.', 401, "AUTH_ERROR"));
    });

    it('should throw error if password is invalid', async () => {
      userModel.findUserByEmail.mockResolvedValue(mockUser);
      passwordUtil.comparePassword.mockResolvedValue(false);

      await expect(() =>
        loginUser({ email: 'test@example.com', password: 'wrongpass' })
      ).rejects.toThrowError(new AppError('Invalid credentials.', 401, "AUTH_ERROR"));
    });
  });
});