<div align="center">

<img src="assets/icon.svg" alt="Ícone do FisioPrescribe" width="120" height="120">

# FisioPrescribe

**Digite a patologia. Receba o protocolo.**

Ferramenta de apoio à decisão para personal trainers e equipes de educação física:
o que é a condição, tratamentos possíveis e indicação de exercício físico — com
fontes NIH, RxNorm e diretrizes ACSM/OMS.

[![Status](https://img.shields.io/badge/status-ativo-14c56c)](#)
[![Licença](https://img.shields.io/badge/licença-não%20definida-lightgrey)](#)
[![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20Tailwind%20%2B%20JS-1b6ff5)](#)
[![Spec--Driven](https://img.shields.io/badge/spec--driven-Spec%20Kit-338fff)](#-desenvolvimento-orientado-por-especificação-spec-kit)

</div>

---

## ✨ O que é

O **FisioPrescribe** é um app web de página única (`index.html`) que transforma o
nome de uma patologia em um relatório técnico pronto para uso em consultoria de
exercício físico, dividido em quatro abas:

| Aba | Conteúdo |
|---|---|
| 📖 **O que é** | Descrição clínica, CID-10, prevalência, sinais/sintomas e classificação de risco para o exercício |
| 💊 **Tratamento** | Abordagens não farmacológicas e medicamentos comuns (verificados ao vivo na RxNorm), com o efeito de cada um no desempenho físico |
| 🏋️ **Exercício Físico** | Protocolo de volume, intensidade e frequência, exercícios recomendados e contraindicações |
| 📄 **Relatório Final** | Relatório consolidado, pronto para **imprimir/gerar PDF**, **copiar** ou **baixar em .txt** |

Se a patologia buscada não estiver na base local, o app consulta a **NIH Clinical
Table Search Service** em tempo real como fallback.

## 🚀 Como usar

Não há build, servidor ou dependências para instalar — é um arquivo HTML estático.

```bash
# Clone o repositório
git clone https://github.com/Gegeu-sp/FisioPrescribe.git
cd FisioPrescribe

# Abra diretamente no navegador...
xdg-open index.html   # Linux
open index.html       # macOS

# ...ou sirva localmente (recomendado, evita restrições de file://)
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

Digite uma patologia na busca (ex.: *hipertensão*, *diabetes tipo 2*,
*osteoartrite*) ou use um dos atalhos rápidos na tela inicial.

## 🩺 Patologias na base local

Hipertensão Arterial Sistêmica · Diabetes Mellitus Tipo 2 · Obesidade ·
Osteoartrite (Osteoartrose) · Asma Brônquica · Transtorno Depressivo Maior ·
Lombalgia Crônica · Osteoporose

Qualquer outra condição é buscada dinamicamente via NIH Clinical Tables.

## 🧱 Stack técnica

- **HTML5** semântico em página única
- **Tailwind CSS** (via CDN, com tema claro/escuro persistido em `localStorage`)
- **JavaScript** puro (sem framework, sem build)
- **Lucide Icons** (via CDN)
- **APIs públicas gratuitas**:
  - [NIH Clinical Table Search Service](https://clinicaltables.nlm.nih.gov/) — busca de condições clínicas
  - [RxNorm REST (NLM)](https://rxnav.nlm.nih.gov/) — verificação de medicamentos
  - Base própria de diretrizes ACSM/OMS para prescrição de exercício

```
FisioPrescribe/
├── index.html            # aplicação completa (markup + estilos + lógica)
├── assets/
│   ├── icon.svg           # ícone do projeto (fonte vetorial)
│   └── icon-512.png        # ícone renderizado (favicon / preview social)
├── .specify/               # Spec Kit — templates e memória do projeto
└── .claude/skills/          # skills do Spec Kit para o Claude Code
```

## 📐 Desenvolvimento orientado por especificação (Spec Kit)

Este projeto usa o [GitHub Spec Kit](https://github.com/github/spec-kit) para guiar
novas funcionalidades por especificação → plano → tarefas → implementação, em vez
de código ad hoc direto no `index.html`. A constituição do projeto (princípios,
padrões técnicos e fluxo de trabalho) está em
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).

Fluxo recomendado para novas features (via Claude Code):

```
/speckit-constitution   # revisar/ajustar princípios do projeto
/speckit-specify        # descrever a nova funcionalidade
/speckit-plan            # gerar o plano técnico
/speckit-tasks           # quebrar em tarefas executáveis
/speckit-implement       # implementar
```

## ⚠️ Aviso legal

Conteúdo **educativo**, de apoio à decisão para profissionais de educação física.
**Não substitui avaliação médica ou fisioterapêutica.** A prescrição final de
exercícios é sempre responsabilidade do profissional habilitado.

---

<div align="center">
<sub>Feito para personal trainers e equipes que precisam de contexto clínico rápido e confiável.</sub>
</div>
