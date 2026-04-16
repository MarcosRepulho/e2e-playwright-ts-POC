# Playwright E2E Boilerplate

Boilerplate mínimo para testes E2E com Playwright + TypeScript.

Comandos úteis:

```
npm install
npm run install:drivers
npm test
npm run test:headed
npm run test:report
```

Estrutura principal:


Boas práticas:


Guia rápido — como baixar, instalar e rodar os testes

1) Clonar o repositório

```bash
git clone <url-do-repo> my-e2e-project
cd my-e2e-project
```

2) Instalar dependências

```bash
npm install
# instalar navegadores (se necessário)
npx playwright install --with-deps
```

3) Comandos importantes (executar no diretório do projeto)

```bash
# rodar toda a suíte (usa o `playwright.config.ts`)
npx playwright test

# rodar apenas no Chromium (caso haja múltiplos projetos)
npx playwright test --project=chromium

# rodar um spec específico
npx playwright test tests/specs/auth/login.spec.ts --project=chromium

# rodar em modo headed (abrir janelas)
npx playwright test --headed

# abrir relatório HTML (servidor local)
npx playwright show-report reports/html --port=9334

# comando npm já configurado no projeto (exemplos)
npm run test
npm run show-report
```

4) Relatórios e artifacts

- Os relatórios HTML ficam em `reports/html`.
- Artifacts (screenshots, vídeos) são salvos em `reports/artifacts`.
- Para garantir que o relatório mostre a execução mais recente: execute os testes primeiro e só depois inicie `show-report`.

5) Estrutura principal

- `playwright.config.ts` - configuração global
- `tests/` - specs de teste (organizados por feature em `tests/specs`)
- `pages/` - Page Objects (POM)
- `fixtures/` - helpers/fixtures
- `reports/` - relatórios e artefatos

6) Dicas e troubleshooting

- Se o `show-report` não exibir falhas, certifique-se de que você executou os testes depois das alterações — o servidor serve os arquivos gerados pela última execução.
- Se a porta estiver em uso (EADDRINUSE), escolha outra porta: `--port=9335` ou finalize o processo que está usando a porta.
- Para rodar apenas Chromium permanentemente, remova outros projetos em `playwright.config.ts` ou use `--project=chromium` na CLI.
- Para ver artifacts diretamente:
	- screenshots: `reports/artifacts/<spec-dir>/test-failed-1.png`
	- vídeo: `reports/artifacts/<spec-dir>/video.webm`

Comandos úteis (resumo):

```
npm install
npx playwright install --with-deps
npx playwright test
npx playwright test --project=chromium
npx playwright show-report reports/html --port=9334
```

Boas práticas:

- Usar `Page Object Model` para organizar seletores e ações.
- Testes isolados e paralelizáveis (`fullyParallel: true`).
- Gerar screenshots/vídeo/trace apenas em falhas para economizar espaço.
