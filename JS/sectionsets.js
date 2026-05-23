// Declaração de variáveis
 // ── setinha e btnEmail ──
 const btnArrow = document.getElementById('btn-arrow');
 const content = document.getElementById('content-extra');
const icon = btnArrow.querySelector('i');
const emailBtn = document.querySelector('.email-wrap');
 // ── Seletor de vagas WhatsApp ──
const wppBtn = document.getElementById('wppVagaBtn');
const wppTexto = document.getElementById('wppVagaTexto');
const checkboxes = document.querySelectorAll('#vagasGrid input[type="checkbox"]');

// Funções
  // Sampa script base
  function btnEmailFunc(){
  setTimeout(()=>{window.location.href='mailto:contato@3em1pizzaria.com.br'},200)
  }
  function abrir() {
    icon.classList.replace('fa-angle-down', 'fa-angle-up');
    content.style.display = "block";
};
function fechar() {
    icon.classList.replace('fa-angle-up', 'fa-angle-down');
    content.style.display = "none";
};

function verificar() {
    const isOpen = content.style.display === 'block';
    if (isOpen) {
        fechar();
    }
    else {
        abrir();
    }
}
function atualizarWpp() {
    const selecionados = [...checkboxes]
      .filter(c => c.checked)
      .map(c => c.value);

    if (selecionados.length === 0) {
      wppBtn.classList.add('wpp-btn-disabled');
      wppBtn.href = '#';
      wppTexto.textContent = 'Selecione uma vaga acima';
      return;
    }

    const lista = selecionados.length === 1
      ? selecionados[0]
      : selecionados.slice(0, -1).join(', ') + ' e ' + selecionados.slice(-1);

    const msg = encodeURIComponent(
      'Olá! Gostaria de trabalhar no estabelecimento. ' +
      'O(s) serviço(s) que posso oferecer: ' + lista + '.'
    );

    wppBtn.classList.remove('wpp-btn-disabled');
    wppBtn.href = 'https://wa.me/5511997281316?text=' + msg;
    wppTexto.textContent = '(11) 99728-1316 — Enviar candidatura';
  }
// Eventos
btnArrow.addEventListener('click', verificar);
checkboxes.forEach(c => c.addEventListener('change', atualizarWpp));
