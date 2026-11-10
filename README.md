# Mesa Redonda Brasileira de Evangelização, landing page

Site estático (HTML, CSS e JavaScript), pronto para o GitHub Pages. Não precisa de build, servidor próprio nem chaves de API.

## Estrutura
- `index.html`, `css/style.css`, `js/` : o site. Textos, programação e termo ficam em `js/data.js`.
- `assets/` : fontes, imagens e bibliotecas (GSAP e jsPDF, copiadas para dentro do projeto, sem CDN).
- `apps-script/Code.gs` : o código que roda na sua conta Google e grava as adesões. Não faz parte do site público e não tem nenhum ID ou chave.

## Pendências
- Fotos dos palestrantes (opcional): coloque em `assets/palestrantes/` e escreva o nome do arquivo em `foto` no `js/data.js`. Sem foto aparecem as iniciais.
- Colar a URL do Google no campo `ENDPOINT` de `js/data.js` (passo 6 abaixo). Vazio = modo de demonstração, nada é enviado.

---

## Ligar o formulário à sua Planilha Google (passo a passo)

Use a conta Google que vai ser a dona dos dados. Leva uns 10 minutos.

1. Abra **script.google.com** e entre com essa conta. Clique em **Novo projeto**. Troque o nome "Projeto sem título" por **Mesa Redonda, adesões**.
2. Apague o conteúdo do arquivo `Código.gs` e cole todo o conteúdo de `apps-script/Code.gs`. Clique no disquete (Salvar).
3. **Preparar a planilha e a pasta (uma vez só):**
   - No menu de funções acima do código, escolha **setup** e clique em **Executar**.
   - O Google pede autorização: **Revisar permissões**, escolha sua conta. Se aparecer "O Google não verificou este app", clique em **Avançado** e depois em **Acessar Mesa Redonda, adesões (não seguro)**. É normal para scripts próprios. Clique em **Permitir**.
   - Abra **Execuções** (ou o painel de registro) e copie os dois links mostrados: a planilha "Mesa Redonda Brasileira, adesões" e a pasta "Mesa Redonda, assinaturas". Guarde os dois. Os dois são privados.
4. **Publicar:**
   - Clique em **Implantar > Nova implantação**. Na engrenagem, escolha **App da Web**.
   - Descrição: `v1`. **Executar como: Eu.** **Quem pode acessar: Qualquer pessoa.** (Precisa ser "Qualquer pessoa" para o site conseguir enviar. As proteções ficam dentro do código.)
   - Clique em **Implantar** e copie a **URL do app da Web**, que termina em `/exec`.
5. **Testar:** cole a URL em uma aba do navegador. Deve aparecer `{"ok":true}`.
6. **Ligar ao site:** em `js/data.js`, cole a URL entre as aspas de `ENDPOINT: ""` e suba a alteração no GitHub. Ou me envie a URL e eu coloco.
7. **Teste real:** abra o site publicado, assine um termo de teste e confira se a linha apareceu na planilha e a imagem na pasta. Depois apague a linha e o arquivo de teste.

### Receber um e-mail a cada adesão (opcional)
No projeto do script: **Configurações do projeto (engrenagem) > Propriedades do script > Adicionar propriedade**. Nome `AVISAR_EMAIL`, valor o seu e-mail. O e-mail fica só no Google, não no código.

### Se mudar o `Code.gs` depois
Salvar não basta. Vá em **Implantar > Gerenciar implantações > lápis (editar) > Versão: Nova versão > Implantar**. A URL continua a mesma. Sem isso o site continua usando o código antigo.

### O que fica guardado em cada adesão
- Uma linha na planilha, com os dados, o telefone, a categoria e o valor mensal.
- Na pasta de assinaturas do Drive: `assinatura-PROTOCOLO.png` e `termo-PROTOCOLO.pdf` (o termo completo, já assinado).
- Os links dos dois arquivos ficam nas colunas "Arquivo da assinatura" e "Termo assinado (PDF)" da planilha.
- Se a planilha foi criada antes da coluna "Termo assinado (PDF)", ela é criada sozinha na primeira adesão, na coluna P.

### Quem acessa os dados
Só a conta dona do script e quem você convidar para a planilha. Não compartilhe a pasta de assinaturas com "qualquer pessoa com o link". Cada assinatura é um dado pessoal (LGPD): compartilhe só com quem precisa.

---

## Subir no GitHub Pages
1. Crie um repositório e envie todo o conteúdo desta pasta.
2. Em **Settings > Pages**, escolha a branch `main` e a pasta `/ (root)`. O site sai em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
3. O GitHub Pages gratuito exige repositório público. Não há segredos neste projeto, então é seguro. A pasta `apps-script` pode ficar fora do repositório, se preferir.

## Segurança, em resumo
- Sem chaves, senhas ou IDs no repositório. Planilha e pasta são identificadas por dentro do Google.
- A URL do Google aparece no código do site. É inevitável num site estático. Ela só recebe envios e não dá acesso a nada.
- O servidor confere cada campo, aceita só cargos e categorias da lista, só imagem PNG real e de tamanho limitado, e calcula o valor mensal sozinho.
- Contra robôs: campo armadilha oculto, tempo mínimo de preenchimento, limite de adesões a cada 10 minutos e bloqueio de repetição da mesma instituição.
- Textos que começam com `=`, `+`, `-` ou `@` são neutralizados antes de entrar na planilha.
- O navegador recebe uma política de segurança (CSP) que só permite scripts do próprio site.
- O hash SHA-256 do PDF ajuda a notar alterações, mas é gerado no navegador de quem assina. Não substitui assinatura digital com certificado.
