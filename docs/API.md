# 🔌 APIs do FisioPrescribe

Documentação completa das APIs e fontes de dados utilizadas pela plataforma.

## 🎯 Estratégia Geral

O FisioPrescribe adota uma arquitetura híbrida em camadas para garantir que a
análise sempre funcione, mesmo sem internet:

```
┌──────────────────────────────────────────────────────┐
│  CAMADA 1 · BASE LOCAL (offline, instantânea)         │
│  8 patologias curadas — NUNCA falha                   │
├──────────────────────────────────────────────────────┤
│  CAMADA 2 · NIH CLINICAL TABLES (fallback online)     │
│  Milhares de condições — timeout de 7s                │
├──────────────────────────────────────────────────────┤
│  CAMADA 3 · RxNorm (enriquecimento, não-bloqueante)   │
│  Validação de medicamentos — timeout de 5s            │
└──────────────────────────────────────────────────────┘
```

**Princípio:** as APIs externas são opcionais. Se falharem, a plataforma exibe
a base local ou um relatório conservador — nunca trava.

## 1️⃣ NIH Clinical Table Search Service

**Função:** identificar e descrever patologias fora da base local.

| Propriedade | Valor |
|---|---|
| Provedor | National Library of Medicine (NLM / NIH) |
| Custo | 🟢 Gratuito |
| Chave de API | ❌ Não necessária |
| Autenticação | Nenhuma |
| CORS | ✅ Liberado (funciona direto no navegador) |
| Documentação | https://clinicaltables.nlm.nih.gov/apidoc/conditions/v3/doc.html |

### Endpoint

```
GET https://clinicaltables.nlm.nih.gov/api/conditions/v3/search
    ?terms={patologia}
    &maxList={n}
```

### Parâmetros

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `terms` | string | Termo de busca (ex.: `anemia`) |
| `maxList` | int | Máximo de resultados — a plataforma usa `1` |
| `df` | string | Campos a retornar (opcional, não usado pela plataforma) |

### Exemplo de requisição

```js
const r = await fetch(
  'https://clinicaltables.nlm.nih.gov/api/conditions/v3/search' +
  '?terms=' + encodeURIComponent('anemia') + '&maxList=1'
);
const d = await r.json();
```

### Exemplo de resposta

```json
[
  22,
  ["2151", "10856", "16133"],
  null,
  [["Anemia - iron deficiency"], ["Anemia - refractory"]]
]
```

| Índice | Conteúdo |
|---|---|
| `[0]` | Código do resultado |
| `[1]` | Lista de IDs |
| `[2]` | Metadados (`null`) |
| `[3][0][0]` | Nome oficial da condição ← usado pela plataforma |

### Tratamento na plataforma

Trecho real de `index.html` (função `run`):

```js
const r = await fT(
  'https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=' +
  encodeURIComponent(q) + '&maxList=1', 7000);
const d = await r.json();
let nome = null;
if (d && d[3] && d[3][0] && d[3][0][0]) nome = d[3][0][0];
if (nome) { render(generic(nome), true); }   // relatório conservador
else { showErr(); }                          // mensagem de erro amigável
```

O nome retornado passa por `esc()` dentro de `generic()` antes de ser inserido
no DOM, para evitar XSS a partir de uma resposta inesperada da API.

## 2️⃣ RxNorm REST API

**Função:** validar e identificar medicamentos pelo código único RXCUI.

| Propriedade | Valor |
|---|---|
| Provedor | National Library of Medicine (NLM / NIH) |
| Custo | 🟢 Gratuito |
| Chave de API | ❌ Não necessária |
| CORS | ✅ Liberado |
| Documentação | https://lhncbc.nlm.nih.gov/RxNorm/ |

### Endpoint

```
GET https://rxnav.nlm.nih.gov/REST/drugs.json?name={medicamento}
```

### Exemplo de requisição

```js
const r = await fetch(
  'https://rxnav.nlm.nih.gov/REST/drugs.json?name=metformin'
);
const d = await r.json();
```

### Exemplo de resposta (resumida)

```json
{
  "drugGroup": {
    "name": null,
    "conceptGroup": [
      { "tty": "BPCK" },
      { "tty": "GPCK" },
      {
        "tty": "SBD",
        "conceptProperties": [
          {
            "rxcui": "1043567",
            "name": "24 HR metformin hydrochloride 1000 MG...",
            "tty": "SBD",
            "language": "ENG"
          }
        ]
      }
    ]
  }
}
```

### ⚠️ Ponto de atenção

Nem todo `conceptGroup` contém `conceptProperties` (ex.: `BPCK` e `GPCK` vêm
vazios). A plataforma varre todos os grupos até achar um `rxcui` válido —
trecho real de `index.html` (função `verifyMeds`):

```js
var id = null;
try {
  var cg = d.drugGroup.conceptGroup;
  for (var c = 0; c < cg.length; c++) {
    if (cg[c].conceptProperties && cg[c].conceptProperties[0] && cg[c].conceptProperties[0].rxcui) {
      id = cg[c].conceptProperties[0].rxcui;
      break;
    }
  }
} catch (_) {}
```

Se `id` for encontrado, a interface mostra o badge `RxNorm RXCUI {id}`; caso
contrário, mostra `Base local`. Em caso de falha de rede, mostra
`Base local (offline)` — a verificação é assíncrona e nunca bloqueia a
exibição do relatório.

## ⏱️ Timeouts e resiliência

Todas as chamadas externas passam pelo wrapper `fT()`, que corre a `fetch`
contra um timer e rejeita a promise mais lenta:

```js
const fT = (url, ms) => Promise.race([
  fetch(url),
  new Promise((res, rej) =>
    setTimeout(() => rej(new Error('timeout')), ms || 6000)
  )
]);

// Uso:
await fT(urlNIH, 7000);    // 7s para NIH
await fT(urlRxNorm, 5000); // 5s para RxNorm
```

| API | Timeout | Ação em caso de falha |
|---|---|---|
| NIH Clinical Tables | 7s | Mostra tela de erro amigável (`showErr()`) |
| RxNorm | 5s | Mostra badge `Base local (offline)` no card do medicamento |

## 🔮 APIs candidatas (roadmap)

APIs avaliadas para fases futuras — **ainda não utilizadas no MVP**:

- **DATASUS / API de Dados Abertos do SUS** — https://apidadosabertos.saude.gov.br/v1/
  ✅ Dados epidemiológicos, CNES (estabelecimentos), vacinação
  ⚠️ Não fornece descrição clínica de patologias
  💡 Uso futuro: estatísticas de prevalência por região
- **BrasilAPI** — https://brasilapi.com.br/
  ✅ CEP, CNPJ, bancos, hospitais de referência
  ⚠️ Sem conteúdo clínico
  💡 Uso futuro: localizar centros de tratamento próximos ao cliente
- **CID-10 / CID-11**
  💡 Uso futuro: mapeamento automático patologia → código CID oficial
- **CADSUS**
  ⚠️ Descartado no MVP — envolve dados pessoais sensíveis (LGPD)

## 📊 Comparativo das APIs ativas

| Critério | NIH Clinical Tables | RxNorm | Base Local |
|---|:---:|:---:|:---:|
| Custo | 🟢 Grátis | 🟢 Grátis | 🟢 Grátis |
| Chave necessária | ❌ | ❌ | — |
| CORS | ✅ | ✅ | — |
| Offline | ❌ | ❌ | ✅ |
| Latência típica | ~300ms | ~300ms | ⚡ 0ms |
| Papel | Fallback | Enriquecimento | Núcleo |
| Falha bloqueia a experiência? | Não | Não | Nunca falha |

## 🔐 Segurança e boas práticas

- ✅ Sem chaves de API expostas no frontend (as usadas não exigem chave).
- ✅ Timeout em todas as chamadas externas (`fT()`).
- ✅ Fallback gracioso — falha de rede nunca quebra a experiência.
- ✅ Nenhum dado pessoal é enviado às APIs (apenas termos de busca).
- ✅ Requisições apenas via HTTPS.
- ✅ Resposta da NIH é escapada (`esc()`) antes de entrar no DOM.
- ⚠️ Para produção com alto volume, considere um proxy backend para cache e
  rate-limiting.

---

<sub>FisioPrescribe · APIs públicas + diretrizes oficiais = prescrição responsável.</sub>
