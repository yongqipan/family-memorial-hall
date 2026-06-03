import { useNavigate } from 'react-router-dom';
import { TreeDeciduous, Plus } from 'lucide-react';

export default function FamilyTree() {
  const navigate = useNavigate();

  // 示例家族树数据
  const familyMembers = [
    {
      id: '1',
      name: '张大山',
      isDeceased: true,
      memorialId: 'mem-001',
      gender: 'MALE',
      children: [
        {
          id: '2',
          name: '张小山',
          isDeceased: false,
          memorialId: null,
          gender: 'MALE',
          children: [],
        },
        {
          id: '3',
          name: '张小红',
          isDeceased: false,
          memorialId: null,
          gender: 'FEMALE',
          children: [],
        },
      ],
    },
  ];

  function renderTreeNode(member: any, level = 0) {
    return (
      <div key={member.id} className="flex flex-col items-center">
        <div
          className={`
            family-tree-node ${member.isDeceased ? 'family-tree-node-deceased' : 'family-tree-node-alive'}
            ${level === 0 ? 'border-4' : ''}
          `}
          onClick={() => {
            if (member.memorialId) {
              navigate(`/memorials/${member.memorialId}`);
            }
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {member.isDeceased ? (
                <TreeDeciduous className="w-8 h-8 text-ceremonial-gold" />
              ) : (
                <Plus className="w-8 h-8 text-green-600" />
              )}
            </div>
            <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
            {member.isDeceased && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">已故</div>
            )}
          </div>
        </div>

        {member.children && member.children.length > 0 && (
          <>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex space-x-8">
              {member.children.map((child: any) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  {renderTreeNode(child, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">家族族谱</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-ceremonial-gold text-white rounded-lg hover:bg-yellow-600"
          >
            返回
          </button>
        </div>
      </header>

      {/* 族谱内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 overflow-x-auto">
          <div className="flex justify-center min-w-max">
            {renderTreeNode(familyMembers[0])}
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TreeDeciduous className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                族谱说明
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <ul className="list-disc list-inside space-y-1">
                  <li>金色边框表示已故家族成员</li>
                  <li>绿色边框表示在世家族成员</li>
                  <li>点击已故成员可进入纪念堂</li>
                  <li>点击在世成员可查看详细信息</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
