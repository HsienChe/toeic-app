import type { FirebaseUser } from '../hooks/useFirebaseAuth';
import type { TabName } from '../types';

interface NavbarProps {
  streak: number;
  level: number;
  user: FirebaseUser | null;
  onAvatarClick: () => void;
}

export default function Navbar({ streak, level, user, onAvatarClick }: NavbarProps) {
  return (
    <div className="nav-bar">
      <div className="nav-title">⚔️ 擊退怪獸！</div>
      <div className="nav-stats">
        <div className="nav-stat">🔥 <span>{streak}</span></div>
        <div className="nav-stat">⭐ Lv.<span>{level}</span></div>
        <div className="user-avatar-placeholder" onClick={onAvatarClick}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #4ECDC4' }} />
          ) : (
            user ? (user.displayName || 'U')[0].toUpperCase() : '👤'
          )}
        </div>
      </div>
    </div>
  );
}
