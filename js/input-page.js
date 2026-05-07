// 运行时转换：按 group 分组，建立 displayName -> char 的映射
const maps = {};
for (const item of data) {
  const key = item.displayName;
  const val = item.char;
  if (!maps[item.group]) maps[item.group] = {};
  maps[item.group][key] = val;
  if (key !== key.toLowerCase()) maps[item.group][key.toLowerCase()] = val;
}
// heartcraft 和 terra 继承 miraland 的数字映射
for (const mode of ['heartcraft', 'terra']) {
  Object.assign(maps[mode], maps.miraland);
}

const ta = document.getElementById('input');
let lastVal = '';

ta.addEventListener('input', () => {
  const mode = document.querySelector('input[name="mode"]:checked')?.value || 'normal';
  if (mode === 'normal') { lastVal = ta.value; return; }
  const m = maps[mode];
  if (!m) { lastVal = ta.value; return; }

  const cur = ta.value;
  const sel = ta.selectionStart;

  // 定位变更区域
  const pre = lcp(lastVal, cur);
  const suf = lcs(lastVal, cur, pre, pre);

  const changedStart = pre;
  const changedEnd = cur.length - suf;
  const changedChars = cur.slice(changedStart, changedEnd);
  const replaced = changedChars.split('').map(c => m[c] || c).join('');

  const result = cur.slice(0, changedStart) + replaced + cur.slice(changedEnd);
  const delta = replaced.length - changedChars.length;
  const newSel = sel + delta;

  ta.value = result;
  lastVal = result;
  ta.setSelectionRange(newSel, newSel);
});

document.querySelectorAll('input[name="mode"]').forEach(r => {
  r.addEventListener('change', () => { lastVal = ta.value; });
});