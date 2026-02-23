// FarmMap Config — persists settings in localStorage
function getConfig() {
  try {
    return JSON.parse(localStorage.getItem('farmmap_cfg') || '{}');
  } catch(e) { return {}; }
}

function saveConfig(cfg) {
  try {
    localStorage.setItem('farmmap_cfg', JSON.stringify(cfg));
  } catch(e) { console.error('saveConfig failed', e); }
}
