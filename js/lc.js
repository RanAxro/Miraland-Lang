// 最长公共前缀
function lcp(a, b) {
  let i = 0, n = Math.min(a.length, b.length);
  while (i < n && a[i] === b[i]) i++;
  return i;
}

// 最长公共后缀（从末尾往前比较）
function lcs(a, b, startA, startB) {
  let i = 0;
  while (i < a.length - startA && i < b.length - startB &&
         a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return i;
}