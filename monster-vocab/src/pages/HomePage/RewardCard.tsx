interface RewardCardProps {
  lastLogin: string | null;
  onClaim: () => void;
}

export default function RewardCard({ lastLogin, onClaim }: RewardCardProps) {
  const today = new Date().toDateString();
  const claimed = lastLogin === today;
  return (
    <div className="card reward-card">
      <div className="reward-inner">
        <div className="reward-icon-wrap">🎁</div>
        <div className="reward-info">
          <h4>每日登入獎勵</h4>
          <p>{claimed ? '今天已領取 ✓' : '今天還沒領取！+15 EXP'}</p>
        </div>
        <button className="claim-btn" onClick={onClaim} disabled={claimed}>領取</button>
      </div>
    </div>
  );
}
