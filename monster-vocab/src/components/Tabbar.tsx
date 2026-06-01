import type { TabName } from '../types';

interface TabbarProps {
  activeTab: TabName;
  onSwitch: (tab: TabName) => void;
}

const TABS: { id: TabName; icon: string; label: string }[] = [
  { id: 'home',     icon: '🏠', label: '首頁' },
  { id: 'map',      icon: '🗺️', label: '地圖' },
  { id: 'glossary', icon: '📖', label: '圖鑑' },   // ← 新增
  { id: 'review',   icon: '❌',  label: '錯題' },
  { id: 'add',      icon: '➕', label: '新增' },
  { id: 'settings', icon: '⚙️', label: '設定' },
];

export default function Tabbar({ activeTab, onSwitch }: TabbarProps) {
  return (
    <div className="tab-bar">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
          onClick={() => onSwitch(t.id)}
        >
          <div className="tab-icon">{t.icon}</div>
          {t.label}
        </button>
      ))}
    </div>
  );
}
