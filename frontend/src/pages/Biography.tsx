import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 生平故事数据类型
interface Story {
  id: number;
  title: string;
  content: string;
  date: string;
  location?: string;
  tags: string[];
  createdAt: string;
}

// 模拟数据
const mockStories: Story[] = [
  {
    id: 1,
    title: '出生',
    content: '1950 年春天，在一个阳光明媚的早晨，他出生在一个普通的农民家庭。家中排行老三，上有两个哥哥，下有一个妹妹。',
    date: '1950-03-15',
    location: '江苏省南京市',
    tags: ['出生', '童年'],
    createdAt: '2026-06-01',
  },
  {
    id: 2,
    title: '求学时光',
    content: '1968 年高中毕业后，响应国家号召下乡插队。在农村的三年里，他勤劳肯干，深受社员喜爱。1971 年被推荐上大学，攻读机械工程专业。',
    date: '1968-09-01',
    location: '安徽省滁州市',
    tags: ['求学', '青春'],
    createdAt: '2026-06-02',
  },
  {
    id: 3,
    title: '工作生涯',
    content: '1975 年大学毕业后分配到市机械厂工作。从技术员做起，兢兢业业，勇于创新，先后获得多项技术革新奖。1990 年晋升为高级工程师。',
    date: '1975-07-01',
    location: '江苏省南京市',
    tags: ['工作', '成就'],
    createdAt: '2026-06-03',
  },
  {
    id: 4,
    title: '组建家庭',
    content: '1978 年与相恋多年的女友结婚，婚后育有一子一女。他重视家庭教育，言传身教，培养出了优秀的子女。',
    date: '1978-10-01',
    location: '江苏省南京市',
    tags: ['家庭', '婚姻'],
    createdAt: '2026-06-04',
  },
  {
    id: 5,
    title: '退休生活',
    content: '2010 年正式退休。退休后热爱生活，培养了书法、摄影等兴趣爱好。经常与老友聚会，享受天伦之乐。',
    date: '2010-03-01',
    location: '江苏省南京市',
    tags: ['退休', '生活'],
    createdAt: '2026-06-05',
  },
];

export default function Biography() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'detail' | 'edit'>('list');
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [editingStory, setEditingStory] = useState<Partial<Story>>({});

  // 打开故事详情
  function handleViewStory(story: Story) {
    setSelectedStory(story);
    setView('detail');
  }

  // 打开新增页面
  function handleAddStory() {
    setEditingStory({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      tags: [],
    });
    setView('edit');
  }

  // 打开编辑页面
  function handleEditStory(story: Story) {
    setEditingStory({ ...story });
    setView('edit');
  }

  // 保存故事
  function handleSaveStory() {
    if (!editingStory.title || !editingStory.content) {
      alert('请填写标题和内容');
      return;
    }

    if (editingStory.id) {
      // 编辑
      setStories(stories.map(s => s.id === editingStory.id ? editingStory as Story : s));
    } else {
      // 新增
      const newStory: Story = {
        ...(editingStory as Story),
        id: Date.now(),
        tags: editingStory.tags || [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setStories([...stories, newStory]);
    }

    setView('list');
    setEditingStory({});
  }

  // 删除故事
  function handleDeleteStory(id: number) {
    if (confirm('确定要删除这个故事吗？')) {
      setStories(stories.filter(s => s.id !== id));
      setView('list');
    }
  }

  // 返回列表
  function goBack() {
    setView('list');
    setSelectedStory(null);
  }

  // 按日期排序
  const sortedStories = [...stories].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 渲染页面
  function renderContent() {
    switch (view) {
      case 'list':
        return renderList();
      case 'detail':
        return renderDetail();
      case 'edit':
        return renderEdit();
      default:
        return renderList();
    }
  }

  // 列表视图
  function renderList() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">生平故事</h1>
            <p className="text-gray-600 dark:text-gray-400">记录生命中的每一个重要时刻</p>
          </div>
          <button
            onClick={handleAddStory}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition"
          >
            ➕ 添加故事
          </button>
        </div>

        {/* 时间线 */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-amber-600"></div>
          
          <div className="space-y-8">
            {sortedStories.map((story, index) => (
              <div key={story.id} className="relative pl-20 group">
                {/* 时间线节点 */}
                <div className="absolute left-6 w-5 h-5 bg-amber-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg group-hover:scale-125 transition"></div>
                
                {/* 故事卡片 */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6"
                  onClick={() => handleViewStory(story)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{story.title}</h3>
                    <span className="text-sm text-amber-600 font-medium">{story.date}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {story.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {story.location && (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                        📍 {story.location}
                      </span>
                    )}
                    {story.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStory(story);
                      }}
                      className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory(story.id);
                      }}
                      className="px-3 py-1 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                    >
                      🗑️ 删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 详情视图
  function renderDetail() {
    if (!selectedStory) return null;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          ← 返回列表
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{selectedStory.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                📅 {selectedStory.date}
              </span>
              {selectedStory.location && (
                <span className="flex items-center gap-1">
                  📍 {selectedStory.location}
                </span>
              )}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {selectedStory.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {selectedStory.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 pt-6 border-t dark:border-gray-700">
            <button
              onClick={() => handleEditStory(selectedStory)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ✏️ 编辑
            </button>
            <button
              onClick={() => handleDeleteStory(selectedStory.id)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              🗑️ 删除
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 编辑视图
  function renderEdit() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          ← 返回
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {editingStory.id ? '编辑故事' : '添加故事'}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={editingStory.title || ''}
                onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                placeholder="如：出生、求学、工作..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                日期 *
              </label>
              <input
                type="date"
                value={editingStory.date || ''}
                onChange={(e) => setEditingStory({ ...editingStory, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                地点
              </label>
              <input
                type="text"
                value={editingStory.location || ''}
                onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                placeholder="如：江苏省南京市"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                内容 *
              </label>
              <textarea
                value={editingStory.content || ''}
                onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                placeholder="记录这个重要时刻的详细内容..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingStory.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => setEditingStory({
                        ...editingStory,
                        tags: editingStory.tags?.filter((_, idx) => idx !== i) || [],
                      })}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="tagInput"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="输入标签后按回车"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setEditingStory({
                          ...editingStory,
                          tags: [...(editingStory.tags || []), input.value.trim()],
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSaveStory}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition shadow-lg"
              >
                💾 保存
              </button>
              <button
                onClick={goBack}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/memorials/${id}`)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              ← 返回纪念堂
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">生平故事</h1>
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
}
