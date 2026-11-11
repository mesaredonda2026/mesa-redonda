(function () {
  "use strict";
  var D = window.MESA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dataExtenso(d) { return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear(); }

  /* ---------- Contagem regressiva ---------- */
  var cd = $("#countdown"), cdNote = $("#countdown-note");
  function plural(n, s, p) { return n + " " + (n === 1 ? s : p); }
  function tick() {
    var now = Date.now(), ini = new Date(D.CONFIG.INICIO_EVENTO).getTime(), fim = new Date(D.CONFIG.FIM_EVENTO).getTime();
    if (now < ini) {
      var diff = ini - now, dias = Math.floor(diff / 864e5), horas = Math.floor(diff % 864e5 / 36e5), min = Math.floor(diff % 36e5 / 6e4);
      cd.textContent = dias >= 1 ? "Faltam " + plural(dias, "dia", "dias") + " e " + plural(horas, "hora", "horas")
                                 : "Faltam " + plural(horas, "hora", "horas") + " e " + plural(min, "minuto", "minutos");
      cdNote.textContent = "para a recepção, às 12h30 de segunda";
    } else if (now < fim) {
      cd.textContent = "O encontro está acontecendo";
      cdNote.textContent = "Veja a programação do dia abaixo";
    } else {
      cd.textContent = "Encontro realizado";
      cdNote.textContent = "Obrigado por se sentar à mesa";
    }
  }
  tick(); setInterval(tick, 30000);

  /* ---------- Abas (genérico) ---------- */
  function initTabs(list, onSelect) {
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (list.dataset.tabs !== "sig") {
          var p = document.getElementById(t.getAttribute("aria-controls"));
          if (p) p.hidden = !on;
        }
      });
      if (focus) tab.focus();
      if (onSelect) onSelect(tab);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); select(tabs[(i + 1) % n], true); }
        else if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); select(tabs[(i - 1 + n) % n], true); }
        else if (k === "Home") { e.preventDefault(); select(tabs[0], true); }
        else if (k === "End") { e.preventDefault(); select(tabs[n - 1], true); }
      });
    });
    return { select: select, tabs: tabs };
  }
  initTabs($('[data-tabs="mesa"]'));

  /* ---------- Mesa redonda dos valores ---------- */
  var valorUI = (function () {
    var rt = $("#roundtable"), n = D.valores.length, seats = [], cur = 0, tocou = false;
    var pn = $("#valor-n"), pt = $("#valor-t"), pd = $("#valor-d"), panel = $("#valor-panel");
    function show(i, focus, anim) {
      cur = i;
      seats.forEach(function (s, k) { s.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      pn.textContent = i + 1; pt.textContent = D.valores[i][0]; pd.textContent = D.valores[i][1];
      if (anim) { panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap"); }
      if (focus) seats[i].focus();
    }
    D.valores.forEach(function (v, i) {
      var ang = (-90 + i * 360 / n) * Math.PI / 180, r = 39;
      var b = document.createElement("button");
      b.type = "button"; b.className = "seat"; b.textContent = i + 1;
      b.setAttribute("aria-label", "Valor " + (i + 1) + ": " + v[0]);
      b.setAttribute("aria-pressed", "false");
      b.style.left = (50 + r * Math.cos(ang)) + "%"; b.style.top = (50 + r * Math.sin(ang)) + "%";
      b.addEventListener("click", function () { tocou = true; show(i, false, true); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); tocou = true; show((i + 1) % n, true, true); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); tocou = true; show((i - 1 + n) % n, true, true); }
      });
      rt.appendChild(b); seats.push(b);
    });
    show(0, false, false);
    // Avança sozinho enquanto a pessoa não toca, só quando a mesa está na tela e se o movimento é permitido
    if (document.documentElement.classList.contains("js-motion") && "IntersectionObserver" in window) {
      var vis = false, timer = null;
      new IntersectionObserver(function (en) {
        vis = en[0].isIntersecting;
        if (vis && !timer && !tocou) timer = setInterval(function () {
          if (tocou || !vis) { clearInterval(timer); timer = null; return; }
          show((cur + 1) % n, false, true);
        }, 4800);
        if (!vis && timer) { clearInterval(timer); timer = null; }
      }, { threshold: 0.5 }).observe(rt);
    }
    return { seats: seats, rt: rt };
  })();

  /* ---------- Vozes ---------- */
  (function () {
    var ul = $("#voices");
    ul.innerHTML = D.palestrantes.map(function (p) {
      var ini = p.nome.split(" ").filter(function (w) { return w.toLowerCase() !== "pr"; }).slice(0, 2).map(function (w) { return w[0]; }).join("");
      return '<li class="voice"><div class="voice-ph"><span aria-hidden="true">' + esc(ini) + '</span>' +
        (p.foto ? '<img src="assets/palestrantes/' + esc(p.foto) + '" alt="Foto de ' + esc(p.nome) + '" loading="lazy">' : "") + '</div>' +
        '<h3>' + esc(p.nome) + '</h3><p>' + esc(p.papel) + '</p></li>';
    }).join("");
    $$("img", ul).forEach(function (im) { im.addEventListener("error", function () { im.remove(); }); });
  })();

  /* ---------- Os três dias e a programação completa ---------- */
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function stamp(iso, hm) { return new Date(iso + "T" + hm + ":00-03:00"); }
  var progTabs;
  (function () {
    // lista resumida de cada dia (cena do amanhecer)
    $("#days").innerHTML = D.dias.map(function (d) {
      var r = d.resumo;
      return '<li data-rv><div><span class="d-num">' + r.num + '</span><span class="d-dia">' + esc(r.dia) + '</span></div>' +
        '<div><h3 class="d-tit">' + esc(r.titulo) + '</h3><ul class="d-pts">' + r.destaques.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        (r.quem.length ? '<ul class="d-quem" aria-label="Quem conduz">' + r.quem.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") + '</div>' +
        '<div class="d-act"><button class="btn btn-line-dark btn-sm" type="button" data-open-day="' + d.id + '">Ver programa do dia</button></div></li>';
    }).join("");

    // abas e painéis do diálogo
    var tabsEl = $("#day-tabs"), panels = $("#day-panels");
    D.dias.forEach(function (d, idx) {
      var dt = stamp(d.iso, "12:00");
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.id = "day-tab-" + d.id;
      b.setAttribute("aria-controls", "day-panel-" + d.id);
      b.setAttribute("aria-selected", idx === 0 ? "true" : "false"); if (idx) b.tabIndex = -1;
      b.textContent = d.nome + " " + d.data;
      tabsEl.appendChild(b);

      var p = document.createElement("div");
      p.className = "tabpanel"; p.id = "day-panel-" + d.id; p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", b.id); if (idx) p.hidden = true;
      var rows = d.blocos.map(function (bl) {
        if (bl.kind === "session") return '<li class="t-session"><h4>' + esc(bl.titulo) + '</h4></li>';
        var sub = bl.sub ? '<ul class="t-sub">' + bl.sub.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "";
        return '<li class="' + (bl.kind === "break" ? "t-break" : "t-item") + '" data-ini="' + stamp(d.iso, bl.ini).getTime() + '" data-fim="' + stamp(d.iso, bl.fim).getTime() + '">' +
          '<div class="t-time">' + bl.ini + '<small>até ' + bl.fim + '</small></div>' +
          '<div><p class="t-title">' + esc(bl.titulo) + '</p>' + sub + '</div></li>';
      }).join("");
      p.innerHTML = '<div class="day-head"><h3>' + DIAS[dt.getDay()].charAt(0).toUpperCase() + DIAS[dt.getDay()].slice(1) + ", " + dt.getDate() + " de " + MESES[dt.getMonth()] + '</h3>' +
        '<button class="btn btn-line-dark btn-sm" type="button" data-ics="' + d.id + '">Adicionar ao calendário</button></div><ol class="tl">' + rows + '</ol>';
      panels.appendChild(p);
    });
    progTabs = initTabs(tabsEl);

    function marcarAgora() {
      var now = Date.now();
      $$(".tl li[data-ini]").forEach(function (li) {
        li.classList.toggle("is-now", now >= +li.dataset.ini && now < +li.dataset.fim);
      });
    }
    marcarAgora(); setInterval(marcarAgora, 30000);

    function utc(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z"; }
    panels.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-ics]"); if (!btn) return;
      var d = D.dias.filter(function (x) { return x.id === btn.dataset.ics; })[0];
      var itens = d.blocos.filter(function (b) { return b.ini; });
      var ini = stamp(d.iso, itens[0].ini), fim = stamp(d.iso, itens[itens.length - 1].fim);
      var desc = itens.map(function (b) { return b.ini + " " + b.titulo; }).join("\\n");
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mesa Redonda//PT-BR", "BEGIN:VEVENT",
        "UID:mesa-redonda-" + d.id + "-2026@mesaredonda", "DTSTAMP:" + utc(new Date()), "DTSTART:" + utc(ini), "DTEND:" + utc(fim),
        "SUMMARY:Mesa Redonda Brasileira de Evangelização (" + d.nome + " " + d.data + ")",
        "LOCATION:" + D.CONFIG.LOCAL_EVENTO.replace(/,/g, "\\,"), "DESCRIPTION:" + desc.replace(/,/g, "\\,"), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      a.download = "mesa-redonda-" + d.data.replace("/", "-") + ".ics";
      document.body.appendChild(a); a.click(); a.remove();
    });
  })();

  /* ---------- Diálogos ---------- */
  function openDlg(dlg) {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    document.documentElement.classList.add("lock");
    var body = $(".dlg-body", dlg); if (body) body.scrollTop = 0;
  }
  $$(".dlg").forEach(function (dlg) {
    dlg.addEventListener("close", function () { document.documentElement.classList.remove("lock"); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    $$("[data-close]", dlg).forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  });
  $$("[data-open]").forEach(function (b) { b.addEventListener("click", function () { openDlg(document.getElementById(b.dataset.open)); }); });
  $$("[data-open-day]").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = D.dias.map(function (d) { return d.id; }).indexOf(b.dataset.openDay);
      progTabs.select(progTabs.tabs[Math.max(0, i)]);
      openDlg($("#dlg-prog"));
    });
  });
  // durante o evento, a programação abre no dia de hoje
  (function () {
    var hoje = new Date(), key = hoje.getFullYear() + "-" + pad(hoje.getMonth() + 1) + "-" + pad(hoje.getDate());
    D.dias.forEach(function (d, i) { if (d.iso === key) progTabs.select(progTabs.tabs[i]); });
  })();

  /* ---------- Termo (leitura) ---------- */
  var termoEl = $("#termo"), toStep2 = $("#to-2");
  (function () {
    var html = "", openList = false;
    D.termo.forEach(function (b) {
      if (b.t !== "li" && openList) { html += "</ul>"; openList = false; }
      if (b.t === "title") html += '<p class="tt">' + esc(b.x) + "</p>";
      else if (b.t === "sub") html += '<p class="ts">' + esc(b.x) + "</p>";
      else if (b.t === "h") html += "<h4>" + esc(b.x) + "</h4>";
      else if (b.t === "p") html += "<p>" + esc(b.x) + "</p>";
      else if (b.t === "li") {
        if (!openList) { html += "<ul>"; openList = true; }
        html += "<li>" + (b.lead ? "<strong>" + esc(b.lead) + "</strong> " : "") + esc(b.x) + "</li>";
      }
    });
    if (openList) html += "</ul>";
    termoEl.innerHTML = html;
  })();

  function brl(n) {
    var s = n.toFixed(2).split("."), i = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "R$ " + i + "," + s[1];
  }
  D.contribuicoes.concat(["outros"]).forEach(function (v) {
    var o = document.createElement("option"); o.value = v; o.textContent = v === "outros" ? "Outros valores" : brl(v); $("#f-valor").appendChild(o);
  });
  $("#f-valor").addEventListener("change", function () {
    var outro = this.value === "outros";
    $("#valor-outro-wrap").hidden = !outro;
    if (outro) $("#f-valor-outro").focus(); else { $("#f-valor-outro").value = ""; setErr("f-valor-outro", ""); }
  });
  // aceita 450, 450,50, 2.500,00, R$ 2500
  function lerValor(txt) {
    var s = String(txt).replace(/R\$|\s/g, "");
    if (!/^[\d.,]+$/.test(s)) return null;
    if (s.indexOf(",") !== -1) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
    var n = parseFloat(s);
    return isFinite(n) && n >= 1 && n <= 1000000 ? Math.round(n * 100) / 100 : null;
  }
  function valorEscolhido() {
    var v = $("#f-valor").value;
    return v === "outros" ? lerValor($("#f-valor-outro").value) : (v ? Number(v) : null);
  }
  var T0 = Date.now();

  /* ---------- Fluxo em etapas ---------- */
  var steps = { 1: $("#step-1"), 2: $("#step-2"), 3: $("#step-3"), done: $("#step-done") };
  var stepsBar = $$("#steps li");
  function goto(n) {
    Object.keys(steps).forEach(function (k) { steps[k].hidden = String(k) !== String(n); });
    stepsBar.forEach(function (li) {
      var s = +li.dataset.step;
      li.classList.toggle("on", n !== "done" && s === n);
      li.classList.toggle("ok", n === "done" || s < n);
    });
    if (n === 2) { $("#f-data").value = dataExtenso(new Date()); }
    if (n === 3) { sigSetup(); }
    var target = n === "done" ? steps.done : steps[n];
    var first = n === 2 ? $("#f-inst") : n === 3 ? $("#tab-draw") : target;
    document.getElementById("flow").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (first && first.focus) first.focus({ preventScroll: true });
  }
  toStep2.addEventListener("click", function () { goto(2); });
  $$("[data-back]").forEach(function (b) { b.addEventListener("click", function () { goto(+b.dataset.back); }); });

  /* Validação do passo 2 */
  var form2 = steps[2];
  function setErr(id, msg) {
    var field = document.getElementById(id).closest(".field"), er = $('.err[data-for="' + id + '"]', field);
    field.classList.toggle("bad", !!msg); er.textContent = msg || "";
    document.getElementById(id).setAttribute("aria-invalid", msg ? "true" : "false");
  }
  form2.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    [["f-inst", "Informe o nome da instituição."], ["f-rep", "Informe o nome do representante legal."], ["f-local", "Informe a cidade e o estado."]].forEach(function (c) {
      var v = document.getElementById(c[0]).value.trim();
      if (v.length < 2) { setErr(c[0], c[1]); ok = false; } else setErr(c[0], "");
    });
    if (!$("#f-cargo").value) { setErr("f-cargo", "Selecione o cargo."); ok = false; } else setErr("f-cargo", "");
    if (!$("#f-valor").value) { setErr("f-valor", "Selecione o valor."); ok = false; } else setErr("f-valor", "");
    if ($("#f-valor").value === "outros" && valorEscolhido() === null) { setErr("f-valor-outro", "Informe um valor válido, por exemplo 450,00."); ok = false; } else setErr("f-valor-outro", "");
    var dig = $("#f-tel").value.replace(/\D/g, "");
    if (dig.length < 10 || dig.length > 13 || !/^\+?[\d\s().-]+$/.test($("#f-tel").value.trim())) { setErr("f-tel", "Informe um telefone com DDD, por exemplo (12) 90000-0000."); ok = false; } else setErr("f-tel", "");
    if (ok) goto(3); else { var bad = $(".field.bad input, .field.bad select", form2); if (bad) bad.focus(); }
  });
  ["f-inst", "f-rep", "f-local", "f-tel"].forEach(function (id) { document.getElementById(id).addEventListener("input", function () { setErr(id, ""); }); });
  $("#f-cargo").addEventListener("change", function () { setErr("f-cargo", ""); });
  $("#f-valor").addEventListener("change", function () { setErr("f-valor", ""); });
  // máscara de moeda: só números, formatados como R$ 1.234,56 conforme a pessoa digita
  $("#f-valor-outro").addEventListener("input", function () {
    var d = this.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 8);
    setErr("f-valor-outro", "");
    if (!d) { this.value = ""; return; }
    while (d.length < 3) d = "0" + d;
    this.value = brl(Number(d.slice(0, -2) + "." + d.slice(-2)));
  });

  /* ---------- Assinatura ---------- */
  var cv = $("#sig"), ctx = cv.getContext("2d"), box = $("#sig-box"), typeWrap = $("#sig-type-wrap"), typeIn = $("#sig-text");
  var mode = "draw", strokes = [], cur = null, lastW = 0, inkTyped = false;
  var COLOR = "#2E4356";
  function sigSetup() {
    var r = box.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var k = lastW ? r.width / lastW : 1;
    if (k !== 1) strokes.forEach(function (s) { s.forEach(function (p) { p.x *= k; p.y *= r.height / (box._h || r.height); }); });
    lastW = r.width; box._h = r.height;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = "round"; ctx.lineJoin = "round";
    sigRedraw();
  }
  function sigRedraw() {
    var w = box.clientWidth, h = box.clientHeight;
    ctx.clearRect(0, 0, w, h);
    if (mode === "draw") {
      ctx.strokeStyle = COLOR; ctx.lineWidth = 2.6;
      strokes.forEach(function (s) {
        ctx.beginPath(); ctx.moveTo(s[0].x, s[0].y);
        if (s.length === 1) ctx.lineTo(s[0].x + .1, s[0].y);
        for (var i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
        ctx.stroke();
      });
      box.classList.toggle("has-ink", strokes.length > 0);
    } else {
      var t = typeIn.value.trim(); inkTyped = t.length > 0;
      box.classList.toggle("has-ink", inkTyped);
      if (t) {
        var size = 72; ctx.fillStyle = COLOR; ctx.textBaseline = "alphabetic";
        do { ctx.font = "600 " + size + 'px "Caveat", cursive'; size -= 2; } while (ctx.measureText(t).width > w - 40 && size > 20);
        ctx.fillText(t, 20, h * 0.62);
      }
    }
  }
  function pt(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  cv.addEventListener("pointerdown", function (e) {
    if (mode !== "draw") return;
    e.preventDefault(); cv.setPointerCapture(e.pointerId);
    cur = [pt(e)]; strokes.push(cur); sigRedraw(); $("#sig-err").textContent = "";
  });
  cv.addEventListener("pointermove", function (e) {
    if (!cur) return; e.preventDefault();
    var p = pt(e), l = cur[cur.length - 1];
    if (Math.abs(p.x - l.x) + Math.abs(p.y - l.y) < 1.2) return;
    cur.push(p);
    ctx.strokeStyle = COLOR; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(p.x, p.y); ctx.stroke();
  });
  function endStroke() { cur = null; }
  cv.addEventListener("pointerup", endStroke); cv.addEventListener("pointercancel", endStroke);
  $("#sig-clear").addEventListener("click", function () { strokes = []; typeIn.value = ""; sigRedraw(); });
  $("#f-aceite").addEventListener("change", function () { $("#aceite-err").textContent = ""; });
  typeIn.addEventListener("input", function () { sigRedraw(); $("#sig-err").textContent = ""; });
  initTabs($('[data-tabs="sig"]'), function (tab) {
    mode = tab.id === "tab-type" ? "type" : "draw";
    typeWrap.hidden = mode !== "type"; box.classList.toggle("typed", mode === "type");
    if (mode === "type" && document.fonts && document.fonts.load) document.fonts.load('600 40px "Caveat"').then(sigRedraw);
    sigRedraw();
  });
  if (window.ResizeObserver) new ResizeObserver(function () { if (!steps[3].hidden) sigSetup(); }).observe(box);
  function temAssinatura() {
    if (mode === "draw") { var n = 0; strokes.forEach(function (s) { n += s.length; }); return n >= 8; }
    return typeIn.value.trim().length >= 3;
  }

  /* ---------- Envio ---------- */
  function protocolo() {
    var a = new Uint32Array(1); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : (a[0] = Math.random() * 4294967295);
    var d = new Date();
    return "MRBE-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + a[0].toString(36).toUpperCase().slice(0, 5).padEnd(5, "0");
  }
  function sha256(txt) {
    if (!(window.crypto && crypto.subtle)) return Promise.resolve("indisponivel");
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    }).catch(function () { return "indisponivel"; });
  }
  var ultimo = null, ultimoDoc = null;
  steps[3].addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, ae = $("#aceite-err"), se = $("#sig-err"), snd = $("#send-err");
    snd.textContent = ""; se.textContent = ""; ae.textContent = "";
    if (!temAssinatura()) { se.textContent = mode === "draw" ? "Desenhe sua assinatura no quadro acima." : "Digite seu nome para gerar a assinatura."; ok = false; }
    if (!$("#f-aceite").checked) { ae.textContent = "Marque a declaração para assinar."; ok = false; }
    if (!ok) return;
    var btn = $("#btn-send"); btn.disabled = true; btn.textContent = "Enviando";
    var agora = new Date();
    var p = {
      protocolo: protocolo(), versaoTermo: "2026-11",
      instituicao: $("#f-inst").value.trim(), representante: $("#f-rep").value.trim(), cargo: $("#f-cargo").value,
      telefone: $("#f-tel").value.trim(), valorMensal: valorEscolhido(),
      website: $("#f-site").value, tempoMs: Date.now() - T0,
      local: $("#f-local").value.trim(), dataAssinatura: agora.toISOString(), dataExibida: dataExtenso(agora),
      assinaturaPng: cv.toDataURL("image/png"), formaAssinatura: mode === "draw" ? "desenhada" : "digitada",
      userAgent: navigator.userAgent
    };
    sha256(JSON.stringify(p)).then(function (h) {
      p.hash = h;
      // Só a assinatura e os dados vão para o Google. O PDF é gerado no aparelho, apenas para a pessoa baixar.
      return enviar(p).then(function (demo) {
        try { ultimoDoc = montarPdf(p); } catch (x) { ultimoDoc = null; }
        return demo;
      });
    }).then(function (demo) {
      ultimo = p;
      $("#d-inst").textContent = p.instituicao; $("#d-prot").textContent = p.protocolo; $("#demo-note").hidden = !demo;
      goto("done");
    }).catch(function (err) {
      var m = err && err.message;
      snd.textContent = m === "duplicado" ? "Já recebemos uma adesão desta instituição com este representante. Para corrigir algo, fale com a coordenação."
        : m === "limite" ? "Muitas adesões em pouco tempo. Aguarde alguns minutos e tente de novo."
        : m === "invalido" || m === "servidor" ? "O servidor recusou o envio (" + m + "). Revise os campos e tente de novo. Se continuar, avise a coordenação."
        : "Não foi possível enviar agora. Confira a conexão e toque em Assinar e enviar de novo. Seus dados continuam preenchidos.";
    }).then(function () { btn.disabled = false; btn.textContent = "Assinar e enviar"; });
  });
  function enviar(p) {
    var url = D.CONFIG.ENDPOINT;
    if (!url) return Promise.resolve(true); // modo de demonstração
    var ctl = new AbortController(), to = setTimeout(function () { ctl.abort(); }, 25000);
    return fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p), signal: ctl.signal })
      .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error("http"); return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.erro) || "fail"); return false; });
  }

  /* ---------- PDF do termo assinado ---------- */
  function montarPdf(p) {
    if (!(window.jspdf && window.jspdf.jsPDF)) throw new Error("pdf");
    var doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    var L = 20, W = 170, PH = 297, B = 24, y = 22;
    function need(h) { if (y + h > PH - B) { doc.addPage(); y = 22; } }
    function texto(str, size, style, gap, lh, align) {
      doc.setFont("helvetica", style); doc.setFontSize(size);
      var lines = doc.splitTextToSize(str, W), h = lines.length * lh;
      need(h + gap);
      lines.forEach(function (ln, i) {
        if (align === "center") doc.text(ln, L + W / 2, y + i * lh, { align: "center" }); else doc.text(ln, L, y + i * lh);
      });
      y += h + gap;
    }
    D.termo.forEach(function (b) {
      if (b.t === "title") texto(b.x, 13, "bold", 3, 6, "center");
      else if (b.t === "sub") texto(b.x, 11, "bold", 6, 5, "center");
      else if (b.t === "h") { y += 3; need(12); texto(b.x, 10.5, "bold", 2, 5); }
      else if (b.t === "p") texto(b.x, 10, "normal", 2, 4.7);
      else texto("- " + (b.lead ? b.lead + " " : "") + b.x, 10, "normal", 1.6, 4.7);
    });
    // bloco de assinaturas
    need(110); y += 4;
    texto("Local: " + p.local + ", " + p.dataExibida + ".", 10, "normal", 8, 5);
    texto("Pelo Movimento Mesa Redonda Brasileira de Evangelização", 10, "bold", 1, 5);
    texto("Grupo Executivo / Pastor Executivo", 10, "normal", 6, 5);
    texto("Nome: ____________________________________________", 10, "normal", 10, 5);
    texto("Pela Organização Parceira", 10, "bold", 1, 5);
    texto("Nome da Instituição: " + p.instituicao, 10, "normal", 1, 5);
    texto("Nome do Representante Legal: " + p.representante, 10, "normal", 1, 5);
    texto("Cargo: " + p.cargo, 10, "normal", 1, 5);
    texto("Valor de contribuição mensal: " + brl(p.valorMensal), 10, "normal", 4, 5);
    try {
      var iw = 70, ih = iw * (cv.height / cv.width); if (ih > 32) { ih = 32; iw = ih * (cv.width / cv.height); }
      need(ih + 12); doc.addImage(p.assinaturaPng, "PNG", L, y, iw, ih); y += ih + 1;
      doc.setDrawColor(90); doc.line(L, y, L + 80, y); y += 4.5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.text("Assinado eletronicamente por " + p.representante, L, y);
    } catch (err) { /* sem imagem */ }
    // rodapé em todas as páginas
    var n = doc.getNumberOfPages(), dt = new Date(p.dataAssinatura);
    var carimbo = pad(dt.getDate()) + "/" + pad(dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + pad(dt.getHours()) + ":" + pad(dt.getMinutes());
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(90);
      doc.text("Protocolo " + p.protocolo + " | Assinado eletronicamente em " + carimbo + " | Página " + i + " de " + n, L, PH - 14);
      doc.text("Integridade (SHA-256): " + p.hash, L, PH - 10);
      doc.setTextColor(0);
    }
    return doc;
  }
  $("#btn-pdf").addEventListener("click", function () {
    if (!ultimo || !ultimoDoc) { alert("Não foi possível gerar o PDF agora. Tente novamente em instantes."); return; }
    ultimoDoc.save("termo-mesa-redonda-" + ultimo.protocolo + ".pdf");
  });

  /* ---------- Abertura automática ---------- */
  (function () {
    var root = document.documentElement;
    function showAll() { root.classList.remove("js-motion"); }
    if (!root.classList.contains("js-motion")) return;
    if (!window.gsap) { showAll(); return; }
    var W = window.innerWidth, H = window.innerHeight;
    var SC = { tl: [-.5, -.45, -35], tr: [.5, -.4, 40], bl: [-.5, .45, 28], br: [.5, .5, -38] };
    var tl = gsap.timeline({ delay: .25 });
    ["tl", "tr", "bl", "br"].forEach(function (k, n) {
      tl.fromTo(".p-" + k, { x: SC[k][0] * W, y: SC[k][1] * H, rotation: SC[k][2], opacity: 0, scale: 1.2 },
                           { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1.7, ease: "power3.inOut" }, n * .08);
    });
    tl.fromTo(".p-cross", { opacity: 0, scale: .2, rotation: -60 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(1.5)" }, 1.55);
    tl.fromTo(".hero-text > *", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8, stagger: .18, ease: "power2.out", clearProps: "transform" }, 2.3);
    // segurança: se algo travar, mostra tudo
    setTimeout(function () { if (tl.progress() < 1) tl.progress(1); }, 6000);
  })();

  /* ---------- Revelações e assentos ao rolar ---------- */
  (function () {
    var els = $$("[data-rv]"), rt = $("#roundtable");
    D.valores.forEach(function (v, i) { rt.children[i + 2] && rt.children[i + 2].style.setProperty("--i", i); });
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); rt.classList.add("pop"); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
    var io2 = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { rt.classList.add("pop"); io2.disconnect(); }
    }, { threshold: 0.3 });
    io2.observe(rt);
  })();
})();
