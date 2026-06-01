import { useEffect, useState } from 'react';

interface XpGainAnimationProps {
  amount: number | null;
  onDone: () => void;
}

export default function XpGainAnimation({ amount, onDone }: XpGainAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (amount === null) return;
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); onDone(); }, 1200);
    return () => clearTimeout(t);
  }, [amount]);

  if (!visible || amount === null) return null;
  return <div className="xp-gain">+{amount} EXP</div>;
}
