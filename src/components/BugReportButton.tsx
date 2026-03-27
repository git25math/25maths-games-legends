/**
 * BugReportButton — floating button + modal for reporting question problems.
 * Appears during practice and battle. Submits to gl_bug_reports table.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, XCircle, Send, CheckCircle2 } from 'lucide-react';
import type { Language, Mission } from '../types';
import { supabase } from '../supabase';

type Category = 'question' | 'answer' | 'display' | 'other';

const LABELS: Record<Language, {
  btnTitle: string;
  modalTitle: string;
  categoryLabel: string;
  categories: Record<Category, string>;
  descLabel: string;
  descPlaceholder: string;
  submit: string;
  cancel: string;
  success: string;
  errorMsg: string;
}> = {
  zh: {
    btnTitle: '报告问题',
    modalTitle: '发现问题？告诉我们！',
    categoryLabel: '问题类型',
    categories: {
      question: '题目有误',
      answer: '答案判断有误',
      display: '显示问题',
      other: '其他',
    },
    descLabel: '详细描述（选填）',
    descPlaceholder: '例如：题目数字算出来是负数，但系统不接受……',
    submit: '提交报告',
    cancel: '取消',
    success: '收到！我们会尽快修复，谢谢你！',
    errorMsg: '提交失败，请稍后再试',
  },
  zh_TW: {
    btnTitle: '回報問題',
    modalTitle: '發現問題？告訴我們！',
    categoryLabel: '問題類型',
    categories: {
      question: '題目有誤',
      answer: '答案判斷有誤',
      display: '顯示問題',
      other: '其他',
    },
    descLabel: '詳細描述（選填）',
    descPlaceholder: '例如：題目數字算出來是負數，但系統不接受……',
    submit: '提交回報',
    cancel: '取消',
    success: '收到！我們會盡快修復，謝謝你！',
    errorMsg: '提交失敗，請稍後再試',
  },
  en: {
    btnTitle: 'Report a problem',
    modalTitle: 'Found a problem? Let us know!',
    categoryLabel: 'Problem type',
    categories: {
      question: 'Wrong question',
      answer: 'Wrong answer check',
      display: 'Display issue',
      other: 'Other',
    },
    descLabel: 'Details (optional)',
    descPlaceholder: 'e.g. The answer should be negative but the system rejects it…',
    submit: 'Submit report',
    cancel: 'Cancel',
    success: 'Got it! We\'ll fix it soon. Thanks!',
    errorMsg: 'Submission failed, please try again later',
  },
};

const CATEGORY_ORDER: Category[] = ['question', 'answer', 'display', 'other'];

export function BugReportButton({
  mission,
  lang,
}: {
  mission: Mission;
  lang: Language;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>('question');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const L = LABELS[lang];

  const handleOpen = () => {
    setOpen(true);
    setSubmitted(false);
    setError(false);
    setDescription('');
    setCategory('question');
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: dbError } = await supabase.from('gl_bug_reports').insert({
        mission_id: mission.id,
        mission_type: mission.type,
        grade: mission.grade,
        lang,
        category,
        description: description.trim() || null,
        user_id: user?.id ?? null,
      });
      if (dbError) throw dbError;
      setSubmitted(true);
      setTimeout(() => setOpen(false), 2000);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={handleOpen}
        title={L.btnTitle}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-800/70 hover:bg-slate-700/90 border border-white/10 text-white/50 hover:text-white/80 text-xs font-bold backdrop-blur-sm transition-all shadow-md"
      >
        <Bug size={14} />
        <span className="hidden sm:inline">{L.btnTitle}</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-black text-base flex items-center gap-2">
                  <Bug size={18} className="text-amber-400" />
                  {L.modalTitle}
                </h3>
                <button onClick={handleClose} disabled={submitting} className="text-white/40 hover:text-white/70 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 py-4 text-center"
                >
                  <CheckCircle2 size={40} className="text-emerald-400" />
                  <p className="text-white font-bold">{L.success}</p>
                </motion.div>
              ) : (
                <>
                  {/* Mission context (read-only info) */}
                  <div className="mb-4 px-3 py-2 bg-white/5 rounded-lg text-xs text-white/40">
                    #{mission.id} · {mission.type} · Y{mission.grade}
                  </div>

                  {/* Category */}
                  <p className="text-white/60 text-xs font-bold mb-2 uppercase tracking-wider">{L.categoryLabel}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {CATEGORY_ORDER.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-3 rounded-xl text-sm font-bold border transition-all ${
                          category === cat
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                        }`}
                      >
                        {L.categories[cat]}
                      </button>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-white/60 text-xs font-bold mb-2 uppercase tracking-wider">{L.descLabel}</p>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={L.descPlaceholder}
                    rows={3}
                    maxLength={500}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/25 resize-none focus:outline-none focus:border-amber-500/50 mb-4"
                  />

                  {error && (
                    <p className="text-rose-400 text-xs mb-3">{L.errorMsg}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
                    >
                      {L.cancel}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={14} />
                      {submitting ? '…' : L.submit}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
