/**
 * ClassManager — Teacher creates classes, sees invite codes.
 * Shown at the top of DashboardScreen.
 */
import { useState, useEffect } from 'react';
import { Plus, Copy, Check, Archive } from 'lucide-react';
import type { Language } from '../../types';
import { createClass, getMyClasses, archiveClass, type TeacherClass } from '../../utils/classInvite';

export function ClassManager({ lang, grade, onClassCreated }: {
  lang: Language;
  grade: number;
  onClassCreated?: (className: string) => void;
}) {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const en = lang === 'en';

  useEffect(() => {
    getMyClasses().then(setClasses);
  }, []);

  const activeClasses = classes.filter(c => c.is_active && c.grade === grade);

  const handleCreate = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    const result = await createClass(newName, grade);
    setCreating(false);
    if (result.class) {
      setClasses(prev => [result.class!, ...prev]);
      setNewName('');
      setShowCreate(false);
      onClassCreated?.(result.class.name);
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleArchive = async (id: string) => {
    if (await archiveClass(id)) {
      setClasses(prev => prev.map(c => c.id === id ? { ...c, is_active: false } : c));
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-slate-700">
          {en ? 'My Classes' : '我的班级'}
        </h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors"
        >
          <Plus size={12} />
          {en ? 'New Class' : '创建班级'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder={en ? 'Class name (e.g., 7A Math)' : '班级名称（如 7A 数学）'}
              className="flex-1 px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {creating ? '...' : en ? 'Create' : '创建'}
            </button>
          </div>
          <p className="text-[10px] text-indigo-500 mt-2">
            {en
              ? 'Students will use the invite code to join this class.'
              : '学生将使用邀请码加入这个班级。'}
          </p>
        </div>
      )}

      {/* Class list */}
      {activeClasses.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-2">
          {en ? 'No classes yet. Create one to get an invite code.' : '还没有班级。创建一个来获取邀请码。'}
        </p>
      ) : (
        <div className="space-y-2">
          {activeClasses.map(cls => (
            <div key={cls.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-slate-700">{cls.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-black rounded tracking-widest">
                    {cls.invite_code}
                  </span>
                  <button
                    onClick={() => handleCopy(cls.invite_code, cls.id)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                    title={en ? 'Copy code' : '复制邀请码'}
                  >
                    {copiedId === cls.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleArchive(cls.id)}
                className="text-slate-300 hover:text-rose-500 transition-colors"
                title={en ? 'Archive class' : '归档班级'}
              >
                <Archive size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
