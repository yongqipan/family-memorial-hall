import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickName: '',
    inviteCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ceremonial-gold/20 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <UserPlus className="w-16 h-16 text-ceremonial-gold" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">注册账号</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={formData.nickName}
              onChange={(e) => setFormData({ ...formData, nickName: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceremonial-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceremonial-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceremonial-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邀请码 (可选)
            </label>
            <input
              type="text"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceremonial-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ceremonial-gold text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          已有账号？{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-ceremonial-gold hover:text-yellow-600 font-medium"
          >
            登录
          </button>
        </p>
      </div>
    </div>
  );
}
