# Maria Lisboa, LP Bio

Implementação da página **Maria Lisboa | Lash Designer & Mentora**, baseada no frame do Figma da página `Lp -bio`.

O site usa as exportações oficiais e completas dos frames `Maria Lisboa Links Mobile` (800×3791) e `Maria Lisboa Links Desktop` (1920×2949), alternando automaticamente o layout conforme a largura da tela. As exportações são WebP lossless e foram verificadas pixel a pixel contra os PNGs fornecidos pelo Figma. As faixas dos cards e da apresentação continuam com animações de entrada durante a rolagem, e as áreas dos cards permanecem clicáveis.

## Fluxo

Figma → GPT → GitHub → Build → ZIP → Stay

## Links dos cards

Os botões do Figma não possuem hyperlinks configurados. Preencha os destinos em `src/config.js`:

* `mentoriaOnline`
* `mentoriaAoVivo`
* `tecnicaPodio`
* `cursoIniciante`
* `palestras`
* `studio`

## Build local

Na primeira execução, os assets precisam ser baixados enquanto os links temporários do Figma ainda estão válidos:

```bash
npm run assets
npm run build
```

Depois, compacte apenas o conteúdo de `dist/` para enviar à Stay.

## GitHub Actions

O workflow `.github/workflows/build-stay.yml` faz automaticamente:

1. Baixa os quatro exports oficiais do Figma na primeira execução.
2. Persiste os assets no próprio repositório.
3. Gera a pasta `dist/`.
4. Cria `maria-lisboa-stay.zip`.
5. Publica o ZIP como artifact do GitHub Actions.
