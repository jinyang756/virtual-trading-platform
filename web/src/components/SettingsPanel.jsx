import React, { useState } from 'react';

export function SettingsPanel() {
  return (
    <div className="bg-white rounded shadow divide-y">
      <SettingItem label="通知提醒" />
      <SettingItem label="语言切换" />
      <SettingItem label="深色模式" />
    </div>
  );
}

function SettingItem({ label }) {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span>{label}</span>
      <Switch isEnabled={isEnabled} onToggle={() => setIsEnabled(!isEnabled)} />
    </div>
  );
}

function Switch({ isEnabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isEnabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default SettingsPanel;