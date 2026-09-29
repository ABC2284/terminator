document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  
  if (!sendBtn) return;

  sendBtn.addEventListener("click", async () => {
    const targetInput = document.getElementById("target");
    const bugTypeInput = document.getElementById("bug-type");
    const loader = document.getElementById("loading-overlay");

    const target = targetInput ? targetInput.value.trim() : "";
    const bug = bugTypeInput ? bugTypeInput.value : "ComboAttack";

    // Hakikisha namba ya target imejazwa
    if (!target) {
      alert("⚠️ Tafadhali weka namba ya target kwanza!");
      if (targetInput) targetInput.focus();
      return;
    }

    // Onyesha loading animation ya kisasa
    if (loader) loader.classList.add("active");

    try {
      // Tuma ombi kwenda kwenye server (API ya /api/crash)
      const response = await fetch("/api/crash", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ target, bug })
      });

      const data = await response.json();

      // Ficha loading animation
      if (loader) loader.classList.remove("active");

      if (data.success) {
        alert(data.message || "🚀 Shambulio limetumwa kwa mafanikio!");
        if (targetInput) targetInput.value = ""; // Safisha namba
      } else {
        alert("❌ Imeshindikana: " + (data.message || "Hitilafu imetokea kwenye server."));
      }

    } catch (err) {
      // Ficha loading animation hata kama mtandao ukiwa umekata
      if (loader) loader.classList.remove("active");
      
      console.error("Critical Error:", err);
      alert("🚨 Kosa: Imeshindikana kuwasiliana na server ya mashambulizi!");
    }
  });
});
