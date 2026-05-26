import { useState } from 'react';
import { CAT_INFO } from '../data/gameData';
import type { Word } from '../types';

interface AddWordPageProps {
  onAdd: (word: Word) => void;
  onToast: (msg: string) => void;
}

export default function AddWordPage({ onAdd, onToast }: AddWordPageProps) {
  const [form, setForm] = useState({
    word: '', phonetic: '', meaning: '', example: '',
    cat: 'business', country: 'au',
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function handleSubmit() {
    if (!form.word.trim() || !form.meaning.trim()) {
      onToast('請至少填入單字和意思');
      return;
    }
    onAdd({
      id: Date.now(),
      word: form.word.trim(),
      meaning: form.meaning.trim(),
      phonetic: form.phonetic.trim(),
      example: form.example.trim(),
      cat: form.cat,
      country: form.country,
      monster: 'book',
      day: 1,
    });
    onToast(`✨ 已新增「${form.word}」到怪獸資料庫！`);
    setForm({ word: '', phonetic: '', meaning: '', example: '', cat: 'business', country: 'au' });
  }

  return (
    <div className="page" id="page-add">
      <div className="add-container">
        <div className="section-title">➕ 新增單字</div>
        <div className="section-sub">把你想背的單字加進怪獸資料庫！</div>
        <div className="add-form">
          <div className="form-row">
            <div className="form-group">
              <label>英文單字</label>
              <input type="text" placeholder="e.g. negotiate" value={form.word} onChange={e => set('word', e.target.value)} />
            </div>
            <div className="form-group">
              <label>音標</label>
              <input type="text" placeholder="e.g. /nɪˈɡoʊʃieɪt/" value={form.phonetic} onChange={e => set('phonetic', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>中文意思</label>
              <input type="text" placeholder="e.g. 協商、談判" value={form.meaning} onChange={e => set('meaning', e.target.value)} />
            </div>
            <div className="form-group">
              <label>分類</label>
              <select value={form.cat} onChange={e => set('cat', e.target.value)}>
                {Object.entries(CAT_INFO).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>例句（選填）</label>
            <textarea placeholder={`e.g. We need to ${form.word || '...'} the contract terms.`} value={form.example} onChange={e => set('example', e.target.value)} />
          </div>
          <div className="form-group">
            <label>所屬國家</label>
            <select value={form.country} onChange={e => set('country', e.target.value)}>
              <option value="au">🇦🇺 澳洲</option>
              <option value="uk">🇬🇧 英國</option>
              <option value="us">🇺🇸 美國</option>
              <option value="ca">🇨🇦 加拿大</option>
            </select>
          </div>
          <button className="add-submit" onClick={handleSubmit}>✨ 加入怪獸資料庫</button>
        </div>
      </div>
    </div>
  );
}
