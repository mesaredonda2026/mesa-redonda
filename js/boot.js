/* Movimento só quando o navegador aceita e a pessoa não pediu menos animação */
(function () {
  var ok = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (ok) document.documentElement.className += " js-motion";
})();
