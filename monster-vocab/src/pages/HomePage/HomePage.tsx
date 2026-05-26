import HeroBanner from './HeroBanner';
import RewardCard from './RewardCard';
import DailyQuestCard from './DailyQuestCard';
import WrongWordsShortcut from './WrongWordsShortcut';
import { getLevel } from '../../utils/xpUtils';
import type { GameState, TabName } from '../../types';

interface HomePageProps {
  state: GameState;
  isDailyDone: boolean;
  onClaim: () => void;
  onSwitchTab: (tab: TabName) => void;
}

export default function HomePage({ state, isDailyDone, onClaim, onSwitchTab }: HomePageProps) {
  const level = getLevel(state.xp);
  return (
    <div className="page active" id="page-home">
      <HeroBanner level={level} xp={state.xp} />
      <div className="home-content">
        <RewardCard lastLogin={state.lastLogin} onClaim={onClaim} />

        <DailyQuestCard
          goal={state.goal}
          stamina={state.stamina}
          todayKilled={state.todayKilled}
          maxCombo={state.maxCombo}
          isDailyDone={isDailyDone}
          onClick={() => onSwitchTab('daily')}
        />

        <WrongWordsShortcut
          count={(state.wrongWords || []).length}
          onClick={() => onSwitchTab('review')}
        />

        <div
          className="card"
          style={{
            cursor: 'pointer',
            background: 'linear-gradient(135deg,#E8F7FF,#D4F1F4)',
            border: '2px solid var(--ocean-light)',
          }}
          onClick={() => onSwitchTab('map')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 32 }}>🗺️</div>
            <div>
              <div style={{ fontFamily: 'var(--font-game)', fontSize: 14, fontWeight: 800 }}>英文冒險地圖</div>
              <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>選擇國家開始冒險！</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 20 }}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
