export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">个人资料</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                {user?.nickName?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.nickName || '用户'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email || ''}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">角色</span>
              <span className="text-gray-900 dark:text-white">{user?.roleId || 'MEMBER'}</span>
            </div>
            <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
