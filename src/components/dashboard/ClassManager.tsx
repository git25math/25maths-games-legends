/**
 * ClassManager — Teacher creates classes, sees invite codes.
 * Shown at the top of DashboardScreen.
 */
import { useState, useEffect } from 'react';
import { Plus, Copy, Check, Archive } from 'lucide-react';
import type { Language } from '../../types';
import { createClass, getMyClasses, archiveClass, type TeacherClass } from '../../utils/classInvite';

type StudentInfo = { display_name: string; class_tags: string[] };

export function ClassManager({ lang, grade, students = [], onClassCreated }: {
  lang: Language;
  grade: number;
  students?: StudentInfo[];
  onClassCreated?: (className: string) => void;
}) {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
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
          {activeClasses.map(cls => {
            const members = students.filter(s => (s.class_tags || []).includes(cls.name));
            const isExpanded = expandedClassId === cls.id;
            return (
              <div key={cls.id} className="bg-slate-50 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3">
                  <button onClick={() => setExpandedClassId(isExpanded ? null : cls.id)} className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">{cls.name}</span>
                      <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">
                        {members.length} {en ? 'students' : '人'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-black rounded tracking-widest">
                        {cls.invite_code}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(cls.invite_code, cls.id); }}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {copiedId === cls.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </button>
                  <button
                    onClick={() => handleArchive(cls.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors ml-2"
                    title={en ? 'Archive' : '归档'}
                  >
                    <Archive size={14} />
                  </button>
                </div>
                {isExpanded && members.length > 0 && (
                  <div className="px-3 pb-3 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold mt-2 mb-1">{en ? 'Members' : '成员'}</p>
                    <div className="flex flex-wrap gap-1">
                      {members.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white text-slate-600 text-[10px] rounded border border-slate-200">
                          {m.display_name || 'Anonymous'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {isExpanded && members.length === 0 && (
                  <div className="px-3 pb-3 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 mt-2">{en ? 'No students yet. Share the code!' : '还没有学生，快分享邀请码！'}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
