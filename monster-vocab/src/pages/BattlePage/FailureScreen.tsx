interface FailureScreenProps {
  correct: number;
  total: number;
  onBack: () => void;
  onRestart: () => void;
}

export default function FailureScreen({ correct, total, onBack, onRestart }: FailureScreenProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg,#6b1a1a,#AC2B2B)', zIndex: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>💔</div>
      <div style={{ fontFamily: 'var(--font-game)', fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>戰鬥失敗</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>需要全部答對才能過關！</div>
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: 20, width: '100%', maxWidth: 320, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(255,255,255,0.9)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <span>🎯 答對題數</span><span style={{ fontFamily: 'var(--font-game)', fontWeight: 700 }}>{correct} / {total}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(255,255,255,0.9)', padding: '6px 0' }}>
          <span>⚠️ 經驗值</span><span style={{ fontFamily: 'var(--font-game)', fontWeight: 700 }}>+0</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320 }}>
        <button onClick={onBack} style={{ flex: 1, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontFamily: 'var(--font-zh)', cursor: 'pointer', fontWeight: 600, background: '#fff', color: '#6b1a1a' }}>回地圖</button>
        <button onClick={onRestart} style={{ flex: 1, border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontFamily: 'var(--font-zh)', cursor: 'pointer', fontWeight: 600, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>再來一次</button>
      </div>
    </div>
  );
}
