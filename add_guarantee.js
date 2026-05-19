const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const guaranteeHtml = `    <!-- Guarantee Section -->
    <section class="guarantee-section" style="padding: 4rem 0; background: var(--white);">
        <div class="container text-center" style="max-width: 800px; border: 2px dashed rgba(235, 182, 108, 0.5); border-radius: 15px; padding: 3rem 2rem; background: #fffcf8; box-shadow: 0 10px 30px rgba(0,0,0,0.02); margin: 0 auto;">
            <i class="fa-solid fa-shield-halved" style="font-size: 4rem; color: var(--accent); margin-bottom: 1.5rem;"></i>
            <h2 class="section-title" style="margin-bottom: 1rem;">Risco Zero: <span class="highlight">Garantia de 7 Dias</span></h2>
            <p style="color: #555; line-height: 1.8; font-size: 1.1rem; margin-bottom: 2.5rem;">
                Eu confio tanto no sabor e no resultado dessas receitas que decidi tirar todo o risco das suas costas. Você tem <strong>7 dias completos</strong> para testar as receitas na sua própria cozinha. Se você não amar o sabor, achar muito difícil ou simplesmente se arrepender, basta me enviar um único e-mail e eu devolvo 100% do seu dinheiro. Sem tentar te convencer do contrário.
            </p>
            <a href="https://pay.hotmart.com/P105611288V?checkoutMode=10" class="cta-btn pulse delay-2">QUERO TESTAR AS RECEITAS SEM RISCO <i class="fa-solid fa-arrow-right"></i></a>
        </div>
    </section>
`;

const insertionToken = '    <!-- Visual Proof / Demonstrativo -->';

if (content.includes('<!-- Guarantee Section -->')) {
    console.log("Guarantee section already exists!");
} else {
    content = content.replace(insertionToken, guaranteeHtml + '\\n' + insertionToken);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Guarantee section added successfully.");
}
