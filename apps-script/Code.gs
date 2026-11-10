/**
 * Mesa Redonda Brasileira de Evangelização
 * Recebe as adesões do site e grava em uma Planilha Google.
 * A imagem da assinatura vai para uma pasta privada do Google Drive.
 *
 * Este arquivo NÃO contém chaves, senhas nem IDs. A planilha e a pasta são criadas
 * pela função setup() e seus IDs ficam guardados nas "Propriedades do script" do Google.
 *
 * Passo a passo completo: README.md
 */

var ABA = "Adesões";
var VERSAO_TERMO = "2026-11";
var CARGOS = ["Diretor", "Presidente", "Pastor Responsável"];
// Valores conhecidos recebem o nome da categoria; qualquer outro valor entra como "Outros valores"
var CATEGORIAS = { "300": "Organização Cooperadora", "700": "Organização Parceira", "1600": "Organização Mantenedora" };
var VALOR_MIN = 1, VALOR_MAX = 1000000;
var FORMAS = ["desenhada", "digitada"];

var LIMITES = {
  corpoMax: 3000000,       // bytes do corpo da requisição
  pngMax: 400000,          // bytes da imagem da assinatura
  pdfMax: 2000000,         // bytes do PDF do termo assinado
  tempoMinMs: 20000,       // tempo mínimo na página até enviar (robôs simples enviam em segundos)
  envios10min: 40,         // máximo de adesões aceitas a cada 10 minutos (todas as origens)
  dedupeSegundos: 21600    // mesma instituição + representante só uma vez a cada 6h (máximo do cache do Google)
};

/* ---------------- Preparação (rodar UMA vez) ---------------- */
function setup() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty("SHEET_ID")) {
    Logger.log("Já preparado. Planilha: " + SpreadsheetApp.openById(props.getProperty("SHEET_ID")).getUrl());
    return;
  }
  var ss = SpreadsheetApp.create("Mesa Redonda Brasileira, adesões");
  var sh = ss.getSheets()[0];
  sh.setName(ABA);
  sh.appendRow(["Recebido em", "Protocolo", "Instituição", "Representante legal", "Cargo", "Categoria",
                "Valor mensal (R$)", "Telefone/WhatsApp", "Local", "Data da assinatura", "Forma da assinatura", "Hash SHA-256",
                "Arquivo da assinatura", "Versão do termo", "Navegador", "Termo assinado (PDF)"]);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, 16).setFontWeight("bold");
  var pasta = DriveApp.createFolder("Mesa Redonda, assinaturas");
  props.setProperties({ SHEET_ID: ss.getId(), FOLDER_ID: pasta.getId() });
  Logger.log("Planilha criada: " + ss.getUrl());
  Logger.log("Pasta de assinaturas: " + pasta.getUrl());
}

/* ---------------- Recebimento ---------------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var raw = (e && e.postData && e.postData.contents) || "";
    if (!raw || raw.length > LIMITES.corpoMax) return json({ ok: false, erro: "invalido" });

    var d;
    try { d = JSON.parse(raw); } catch (x) { return json({ ok: false, erro: "invalido" }); }
    if (!d || typeof d !== "object") return json({ ok: false, erro: "invalido" });

    // Robôs: campo armadilha preenchido ou envio rápido demais
    if (d.website) return json({ ok: true });                       // finge sucesso, não grava
    if (!(Number(d.tempoMs) >= LIMITES.tempoMinMs)) return json({ ok: false, erro: "invalido" });

    var v = validar(d);
    if (!v.ok) return json({ ok: false, erro: "invalido" });
    d = v.dados;

    var cache = CacheService.getScriptCache();

    // Limite geral de envios (o Apps Script não informa o IP de quem envia)
    var n = Number(cache.get("n10") || 0);
    if (n >= LIMITES.envios10min) return json({ ok: false, erro: "limite" });

    // Mesma instituição + representante: uma vez por dia
    var chave = "dup:" + sha(d.instituicao.toLowerCase() + "|" + d.representante.toLowerCase());
    if (cache.get(chave)) return json({ ok: false, erro: "duplicado" });

    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty("SHEET_ID"), folderId = props.getProperty("FOLDER_ID");
    if (!sheetId || !folderId) { console.error("setup() não foi executado"); return json({ ok: false, erro: "servidor" }); }

    var sh = SpreadsheetApp.openById(sheetId).getSheetByName(ABA);
    var ult = sh.getLastRow();
    var protocolos = ult > 1 ? sh.getRange(2, 2, ult - 1, 1).getValues().map(function (r) { return r[0]; }) : [];
    if (protocolos.indexOf(d.protocolo) !== -1) return json({ ok: true, duplicado: true });

    var pasta = DriveApp.getFolderById(folderId);
    var arq = pasta.createFile(Utilities.newBlob(v.png, "image/png", "assinatura-" + d.protocolo + ".png"));
    var termo = pasta.createFile(Utilities.newBlob(v.pdf, "application/pdf", "termo-" + d.protocolo + ".pdf"));
    if (!sh.getRange(1, 16).getValue()) { sh.getRange(1, 16).setValue("Termo assinado (PDF)").setFontWeight("bold"); }  // planilhas criadas antes desta coluna

    sh.appendRow([new Date(), d.protocolo, seguro(d.instituicao), seguro(d.representante), d.cargo, d.categoria,
                  d.valorMensal, seguro(d.telefone), seguro(d.local), d.dataAssinatura, d.formaAssinatura, d.hash,
                  arq.getUrl(), d.versaoTermo, seguro(d.userAgent), termo.getUrl()]);

    cache.put("n10", String(n + 1), 600);
    cache.put(chave, "1", LIMITES.dedupeSegundos);

    var aviso = props.getProperty("AVISAR_EMAIL");
    if (aviso) {
      MailApp.sendEmail(aviso, "Nova adesão à Mesa Redonda: " + d.instituicao.slice(0, 80),
        "Protocolo: " + d.protocolo + "\nInstituição: " + d.instituicao + "\nRepresentante: " + d.representante +
        " (" + d.cargo + ")\nCategoria: " + d.categoria + "\nLocal: " + d.local);
    }
    return json({ ok: true });
  } catch (err) {
    console.error(String(err && err.stack || err));      // detalhes só no log do Google
    return json({ ok: false, erro: "servidor" });        // nada de detalhes para quem envia
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() { return json({ ok: true }); }

/* ---------------- Validação ---------------- */
function validar(d) {
  function txt(x, min, max) {
    if (typeof x !== "string") return null;
    var s = x.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    return s.length >= min && s.length <= max ? s : null;
  }
  var o = {
    protocolo: typeof d.protocolo === "string" && /^MRBE-\d{8}-[0-9A-Z]{5}$/.test(d.protocolo) ? d.protocolo : null,
    versaoTermo: d.versaoTermo === VERSAO_TERMO ? d.versaoTermo : null,
    instituicao: txt(d.instituicao, 2, 150),
    representante: txt(d.representante, 2, 120),
    cargo: CARGOS.indexOf(d.cargo) !== -1 ? d.cargo : null,
    valorMensal: valorOk(d.valorMensal),
    telefone: telefoneOk(d.telefone),
    local: txt(d.local, 2, 120),
    formaAssinatura: FORMAS.indexOf(d.formaAssinatura) !== -1 ? d.formaAssinatura : null,
    dataAssinatura: typeof d.dataAssinatura === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(d.dataAssinatura) ? d.dataAssinatura : null,
    hash: typeof d.hash === "string" && (/^[0-9a-f]{64}$/.test(d.hash) || d.hash === "indisponivel") ? d.hash : null,
    userAgent: (typeof d.userAgent === "string" ? d.userAgent : "").slice(0, 300)
  };
  for (var k in o) { if (o[k] === null) return { ok: false }; }

  o.categoria = CATEGORIAS[String(o.valorMensal)] || "Outros valores";

  var png = d.assinaturaPng;
  if (typeof png !== "string" || png.indexOf("data:image/png;base64,") !== 0) return { ok: false };
  var bytes = Utilities.base64Decode(png.slice(22));
  var sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 60 || bytes.length > LIMITES.pngMax) return { ok: false };
  for (var i = 0; i < 8; i++) { if ((bytes[i] & 255) !== sig[i]) return { ok: false }; }

  var pb = d.pdfBase64;
  if (typeof pb !== "string" || pb.length > LIMITES.pdfMax * 1.4) return { ok: false };
  var pdf = Utilities.base64Decode(pb);
  if (pdf.length < 1000 || pdf.length > LIMITES.pdfMax) return { ok: false };
  var cab = [0x25, 0x50, 0x44, 0x46, 0x2D];   // "%PDF-"
  for (var k = 0; k < 5; k++) { if ((pdf[k] & 255) !== cab[k]) return { ok: false }; }
  return { ok: true, dados: o, png: bytes, pdf: pdf };
}

function telefoneOk(x) {
  if (typeof x !== "string") return null;
  var s = x.trim(), dig = s.replace(/\D/g, "");
  return /^\+?[\d\s().-]{8,25}$/.test(s) && dig.length >= 10 && dig.length <= 13 ? s : null;
}

function valorOk(x) {
  if (typeof x !== "number" || !isFinite(x) || x < VALOR_MIN || x > VALOR_MAX) return null;
  return Math.round(x * 100) / 100;
}

/* Impede que um texto vire fórmula na planilha (= + - @) */
function seguro(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }

function sha(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ("0" + (b & 255).toString(16)).slice(-2); }).join("");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
