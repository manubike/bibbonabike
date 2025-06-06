document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chatToggle");
  const box = document.getElementById("chatBox");
  const input = document.getElementById("chatInput");
  const send = document.getElementById("chatSend");
  const messages = document.getElementById("chatMessages");

  toggle.addEventListener("click", () => box.classList.toggle("hidden"));

  function appendMsg(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTypingDots() {
    const typing = document.createElement("div");
    typing.className = "msg bot typing";
    typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTypingDots() {
    const typing = document.querySelector(".typing");
    if (typing) typing.remove();
  }

  send.addEventListener("click", async () => {
    const userMsg = input.value.trim();
    if (!userMsg) return;

    appendMsg(userMsg, "user");
    input.value = "";

    showTypingDots(); // Mostra i puntini prima della richiesta

    try {
      const res = await fetch("https://black-glade-5e5b.zonkeynet.workers.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      const text = await res.text();
      removeTypingDots(); 
      appendMsg(text, "bot"); 
    } catch (err) {
      removeTypingDots();
      appendMsg("Errore nella risposta.", "bot");
    }
  });
});