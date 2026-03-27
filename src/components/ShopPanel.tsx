import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, CheckCircle } from 'lucide-react';
import type { Language } from '../types';
import { REPAIR_ITEMS } from '../utils/inventory';
import { getCurrency, CURRENCY_LABELS } from '../utils/currency';
import { SHOP_PRICES } from '../utils/gameBalance';
import { lt } from '../i18n/resolveText';
import { useEscapeKey } from '../hooks/useEscapeKey';

const LABELS = {
  zh:    { title: '军械库商店', subtitle: '用功勋和智略换取道具', buy: '购买', bought: '已购买', insufficientMerit: '功勋不足', insufficientWisdom: '智略不足', insufficientRations: '军粮不足', howToEarn: '⚔️ 赢得战斗获得功勋  ·  📜 完成练习获得智略', balance: '余额' },
  zh_TW: { title: '軍械庫商店', subtitle: '用功勳和智略換取道具', buy: '購買', bought: '已購買', insufficientMerit: '功勳不足', insufficientWisdom: '智略不足', insufficientRations: '軍糧不足', howToEarn: '⚔️ 贏得戰鬥獲得功勳  ·  📜 完成練習獲得智略', balance: '餘額' },
  en:    { title: 'Armory Shop', subtitle: 'Spend Merit & Wisdom for repair items', buy: 'Buy', bought: 'Bought', insufficientMerit: 'Not enough Merit', insufficientWisdom: 'Not enough Wisdom', insufficientRations: 'Not enough Rations', howToEarn: '⚔️ Win battles to earn Merit  ·  📜 Complete practice to earn Wisdom', balance: 'Balance' },
};

const TYPE_COLORS = {
  hammer: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', btn: 'bg-amber-600/70 hover:bg-amber-600 text-white' },
  scroll: { bg: 'bg-blue-500/15',  border: 'border-blue-500/30',  text: 'text-blue-400',  btn: 'bg-blue-600/70  hover:bg-blue-600  text-white' },
  crystal:{ bg: 'bg-purple-500/15',border: 'border-purple-500/30',text: 'text-purple-400',btn: 'bg-purple-600/70 hover:bg-purple-600 text-white' },
};

export const ShopPanel = ({
  lang,
  completedMissions,
  onBuyItem,
  onClose,
}: {
  lang: Language;
  completedMissions: Record<string, unknown>;
  onBuyItem: (itemId: string) => Promise<boolean>;
  onClose: () => void;
}) => {
  const l = LABELS[lang];
  useEscapeKey(onClose);
  const balance = getCurrency(completedMissions);

  const [buying, setBuying] = useState<string | null>(null);
  const [justBought, setJustBought] = useState<string | null>(null);

  const handleBuy = async (itemId: string) => {
    if (buying) return;
    setBuying(itemId);
    const success = await onBuyItem(itemId);
    setBuying(null);
    if (success) {
      setJustBought(itemId);
      setTimeout(() => setJustBought(null), 1500);
    }
  };

  const getInsufficientLabel = (type: 'merit' | 'wisdom' | 'rations') => {
    if (type === 'merit')   return l.insufficientMerit;
    if (type === 'wisdom')  return l.insufficientWisdom;
    return l.insufficientRations;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-yellow-400" />
            <h2 className="text-xl font-black text-white">{l.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="text-xs text-white/40 mb-4">{l.subtitle}</p>

        {/* Currency balance + earn hint */}
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex gap-2 flex-wrap mb-1.5">
            {(['merit', 'wisdom', 'rations'] as const).map(type => {
              const cl = CURRENCY_LABELS[type];
              return (
                <span key={type} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 font-bold flex items-center gap-1">
                  {cl.icon} {cl[lang]} <span className="text-white font-black">{balance[type]}</span>
                </span>
              );
            })}
          </div>
          <p className="text-[9px] text-white/30">{l.howToEarn}</p>
        </div>

        {/* Shop items */}
        <div className="grid grid-cols-1 gap-2">
          {REPAIR_ITEMS.map(item => {
            const price = SHOP_PRICES[item.id];
            if (!price) return null;
            const colors = TYPE_COLORS[item.type];
            const currLabel = CURRENCY_LABELS[price.type];
            const canAfford = balance[price.type] >= price.amount;
            const isBuying = buying === item.id;
            const boughtNow = justBought === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3 flex items-center gap-3 ${colors.border} ${colors.bg}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${colors.text}`}>{lt(item.name, lang)}</p>
                  <p className="text-[10px] text-white/40 truncate">{lt(item.description, lang)}</p>
                  <p className={`text-[10px] mt-0.5 font-bold ${canAfford ? 'text-white/60' : 'text-rose-400/70'}`}>
                    {currLabel.icon} {currLabel[lang]} × {price.amount}
                    {!canAfford && (
                      <span className="ml-1 text-white/30">
                        ({lang === 'en' ? 'have' : '当前'} {balance[price.type]})
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={!canAfford || isBuying || boughtNow}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black min-w-14 flex items-center justify-center gap-1 transition-all
                    ${boughtNow
                      ? 'bg-emerald-600/70 text-white'
                      : canAfford
                        ? `${colors.btn} active:scale-95`
                        : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                    }`}
                >
                  {boughtNow
                    ? <><CheckCircle size={12} /> {l.bought}</>
                    : canAfford
                      ? (isBuying ? '…' : l.buy)
                      : getInsufficientLabel(price.type)
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Rations earn hint */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-white/5 text-[10px] text-white/25">
          🍚 {lang === 'en' ? 'Rations: complete daily tasks' : lang === 'zh_TW' ? '軍糧：完成每日軍令' : '军粮：完成每日军令'}
        </div>
      </motion.div>
    </motion.div>
  );
};
