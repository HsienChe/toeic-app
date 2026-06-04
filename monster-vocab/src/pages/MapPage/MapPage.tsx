import { useState } from 'react';
import { CAT_INFO, COUNTRIES } from '../../data/gameData';
import CatGlossary from './CatGlossary';
import FlashCardStudy from './FlashCardStudy';
import type { Word, GameState } from '../../types';

interface MapPageProps {
  customWords: Word[];
  wordBankWords: Word[];
  state: GameState;
  onSelectAccent: (cat: string, country: string) => void;
}

type MapStep = 'cat' | 'glossary' | 'study' | 'accent';

export default function MapPage({ customWords, wordBankWords, state, onSelectAccent }: MapPageProps) {
  const [step, setStep] = useState<MapStep>('cat');
  const [selectedCat, setSelectedCat] = useState('');

  if (step === 'cat') {
    return (
      <div className="page" id="page-map">
        <div className="map-page">
          <div className="map-title">🗺️ 英文冒險地圖</div>
          <div className="map-subtitle" style={{ color: '#2BB5AC', fontWeight: 600, marginBottom: 12 }}>
            👆 請選擇你想挑戰的單字類別
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.entries(CAT_INFO).map(([key, info]) => (
              <div
                key={key}
                onClick={() => { setSelectedCat(key); setStep('glossary'); }}
                style={{
                  background: info.bg,
                  border: `2px solid ${info.color}40`,
                  borderRadius: 16, padding: 14, cursor: 'pointer', transition: 'all .2s',
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={e => (e.currentTarget.style.transform = '')}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{info.icon}</div>
                <div style={{ fontFamily: 'var(--font-game)', fontSize: 13, fontWeight: 800, color: info.color, marginBottom: 2 }}>{info.name}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{info.monsterName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'glossary') {
    return (
      <div className="page" id="page-map" style={{ display: 'flex', flexDirection: 'column' }}>
        <CatGlossary
          cat={selectedCat}
          catInfo={CAT_INFO[selectedCat]}
          customWords={customWords}
          wordBankWords={wordBankWords}
          state={state}
          onStudy={() => setStep('study')}
          onBack={() => { setStep('cat'); setSelectedCat(''); }}
        />
      </div>
    );
  }

  if (step === 'study') {
    return (
      <div className="page" id="page-map">
        <FlashCardStudy
          cat={selectedCat}
          catInfo={CAT_INFO[selectedCat]}
          customWords={customWords}
          wordBankWords={wordBankWords}
          state={state}
          onFinish={() => setStep('accent')}
          onBack={() => setStep('glossary')}
        />
      </div>
    );
  }

  const catInfo = CAT_INFO[selectedCat];
  return (
    <div className="page" id="page-map">
      <div className="map-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button onClick={() => setStep('study')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280', padding: '4px 8px' }}>←</button>
          <div>
            <div className="map-title" style={{ margin: 0 }}>{catInfo.icon} {catInfo.name}</div>
            <div className="map-subtitle" style={{ color: '#2BB5AC', fontWeight: 600, margin: 0 }}>🌍 選擇口音，準備迎戰 {catInfo.monsterName}！</div>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1.5px solid #6ee7b7', borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>單字背誦完成！</div>
            <div style={{ fontSize: 12, color: '#047857' }}>選擇口音開始戰鬥，運用你剛學到的單字</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(COUNTRIES).map(([key, c]) => (
            <div key={key} onClick={() => onSelectAccent(selectedCat, key)}
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 16, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={e => (e.currentTarget.style.transform = '')}
            >
              <div style={{ fontSize: 32 }}>{c.flag}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-game)', fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>{c.accent}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 24, color: '#fff' }}>→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
