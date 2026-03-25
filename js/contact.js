/**
 * contact.js — Discord Webhook Contact Form
 * -------------------------------------------
 * Handles the contact form submission:
 *  - Client-side field validation
 *  - POST to Discord webhook with a formatted embed
 *  - Displays a toast notification on success or error
 *  - Resets button state after send (success or failure)
 */

/* ---- Discord Webhook URL ---- */
const WEBHOOK_URL =
  'https://discord.com/api/webhooks/1474035966359507096/Ummuc7s5uJ39UhG4jPxft5bbyrXHBTIKA4VtK3pi3qnag4s9qRtAsSrr1XLz6EptF4B7';


/* ================================================================
   TOAST HELPER
   Shows a styled notification at the bottom-right of the screen.
   @param {string} message  - Text to display
   @param {string} type     - 'success' | 'error'
   ================================================================ */
function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast ${type} show`;

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    toast.className = 'toast';
  }, 4000);
}


/* ================================================================
   FORM SUBMIT HANDLER
   ================================================================ */
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  /* --- Collect field values --- */
  const name  = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg   = document.getElementById('c-msg').value.trim();

  /* --- Validation --- */
  if (!name || !email || !msg) {
    showToast('⚠ Tous les champs sont requis.', 'error');
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    showToast('⚠ Adresse email invalide.', 'error');
    return;
  }

  /* --- Loading state on button --- */
  const btn = document.getElementById('btn-send');
  btn.disabled = true;
  btn.classList.add('loading');
  btn.textContent = '[ Transmission en cours... ]';

  /* --- Build Discord embed payload --- */
  const payload = {
    username:   '🔐 NexusHack Contact',
    avatar_url: 'https://i.imgur.com/AfFp7pu.png',
    embeds: [
      {
        title: '📡 Nouveau message de contact',
        color: 0x00FFE7, // Cyan neon
        fields: [
          { name: '👤 Nom',     value: name,  inline: true },
          { name: '📧 Email',   value: email, inline: true },
          { name: '💬 Message', value: msg },
        ],
        footer: {
          text: `NexusHack Portfolio • ${new Date().toLocaleString('fr-FR')}`,
        },
      },
    ],
  };

  /* --- Send to Discord --- */
  try {
    const response = await fetch(WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    // Discord returns 204 No Content on success
    if (response.ok || response.status === 204) {
      showToast('✅ Transmission réussie — message reçu sur Discord !', 'success');
      document.getElementById('contact-form').reset();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }

  } catch (error) {
    console.error('[contact.js] Webhook error:', error);
    showToast('❌ Erreur de transmission. Réessayez plus tard.', 'error');

  } finally {
    /* --- Always restore button state --- */
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.textContent = '▶ Envoyer la transmission';
  }
});
