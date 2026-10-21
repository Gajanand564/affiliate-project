// Amazon's image CDN serves smaller renditions via a size token, e.g.
// ..._AC_SL1500_.jpg -> ..._AC_SL500_.jpg (or one is added before the
// extension). Other hosts and uploaded images are left as they are.
export function sizedImage(url, px) {
  if (typeof url !== 'string' || !/^https:\/\/m\.media-amazon\.com\/images\/I\//.test(url)) return url;
  if (/\._[A-Z]{2}_[A-Z]{2}\d+_\./.test(url)) return url.replace(/\._[A-Z]{2}_[A-Z]{2}\d+_\./, `._AC_SL${px}_.`);
  return url.replace(/\.(jpe?g|png|webp)$/i, `._AC_SL${px}_.$1`);
}
