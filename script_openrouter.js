const chat = document.getElementById("chat");

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.textContent = `${sender}: ${text}`;
  chat.appendChild(message);
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userMessage = input.value;
  if (!userMessage) return;

  addMessage("You", userMessage);
  input.value = "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
        "HTTP-Referer": "https://chatbot-homework-assistant.com",
        "X-Title": "Chatbot Homework Assistant"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const aiMessage = data.choices[0].message.content.trim();
      addMessage("Roxy", aiMessage);
    } else if (data.error) {
      addMessage("AI", `❌ Error: ${data.error.message}`);
    } else {
      addMessage("AI", "⚠️ No response from AI.");
    }

  } catch (error) {
    console.error("Fetch error:", error);
    addMessage("AI", "❌ Error connecting to OpenRouter AI.");
  }
}
