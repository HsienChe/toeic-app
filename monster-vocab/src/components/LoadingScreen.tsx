interface LoadingScreenProps {
  progress?: number; // 0-100
  message?: string;
}

export default function LoadingScreen({ progress = 0, message = '載入冒險中...' }: LoadingScreenProps) {
  return (
    <div className="loading-overlay">
      {/* 背景装饰 */}
      <div className="loading-bg-stars" />
      <div className="loading-bg-clouds" />
      
      {/* 主容器 */}
      <div className="loading-container">
        <h1 className="loading-title">
          <span className="loading-title-main">擊退英文單字怪獸！</span>
        </h1>
        
        <div className="loading-character">👾</div>
        
        <div className="loading-message">
          {message}
        </div>
        
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <div className="loading-percentage">{Math.round(progress)}%</div>
        </div>
        
        <div className="loading-tip">
          ⭐ 小提示：連續答對可以提升 Combo，傷害會更高喔！
        </div>
      </div>
    </div>
  );
}
