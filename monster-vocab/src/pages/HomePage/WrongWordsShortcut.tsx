interface WrongWordsShortcutProps {
  count: number;
  onClick: () => void;
}

export default function WrongWordsShortcut({ count, onClick }: WrongWordsShortcutProps) {
  return (
    <div className="card wrong-shortcut" onClick={onClick}>
      <div className="wrong-shortcut-inner">
        <div className="wrong-count-circle">{count}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-game)', fontSize: 14, fontWeight: 800 }}>📖 錯題複習</div>
          <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>點擊前往複習答錯的單字</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 20 }}>→</div>
      </div>
    </div>
  );
}
