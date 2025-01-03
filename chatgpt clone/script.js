// Sahifa to'liq yuklanganda kodni ishga tushirish
document.addEventListener("DOMContentLoaded", function() {
    
    const chatInput = document.querySelector("#chat-input");
    const sendButton = document.querySelector("#send-btn");
    const chatContainer = document.querySelector(".chat-container");
    const themeButton = document.querySelector("#theme-btn");
    const deleteButton = document.querySelector("#delete-btn");

    let userText = null;
    const API_KEY = "sk-fgY7FGg72ztsFVmkR0GHCHV-Z66df3umQrJ_9ydsAzT3BlbkFJGEQrk-EfRIOUI93oeq3T_Hp5HQ2mJayfvg0SJuH2EA";

    const loadDataFromLocalstorage = () => {

        const themeColor = localStorage.getItem("themeColor");

        document.body.classList.toggle("light-mode", themeColor === "light_mode");
        themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

        const defaultText = `
        <div class="default-text">
        <h1>ChatGPT 2.0</h1>
        <p>Let's chat and discover the amazing abilities of AI. Your previous messages will appear here.</p>
        </div>
        `
        chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }

    const createChatElement = (content, className) => {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat", className);
        chatDiv.innerHTML = content;
        return chatDiv; 
    }

    const getChatResponse = async (incomingChatDiv) => {
        const API_URL = "https://api.openai.com/v1/completions"
        const pElement = document.createElement("P");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: userText,
                max_tokens: 2048,
                temperature: 0.2,
                n: 1,
                stop: null
            })
        }

        try {
            const response = await (await fetch(API_URL, requestOptions)).json();
            pElement.textContent = response.choices[0].text.trim();
        } catch (error) {
            pElement.classList.add("error");
            pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
        }

        incomingChatDiv.querySelector(".typing-animation").remove();
        incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        localStorage.setItem("all-chats", chatContainer.innerHTML);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }

    const copyResponse = (copyBtn) => {
        const responseTextElement = copyBtn.parentElement.querySelector("p");
        navigator.clipboard.writeText(responseTextElement.textContent);
        copyBtn.textContent = "done";
        setTimeout(() => copyBtn.textContent = "content_copy", 1000);
    }

    const showTypingAnimation = () => {
        const html = `
        <div class="chat-content">
            <div class="chat-details">
                <img src="images/chatbot.png" alt="chatbot-img">
                <div class="typing-animation">
                    <div class="typing-dot" style="--delay: 0.2s"></div>
                    <div class="typing-dot" style="--delay: 0.3s"></div>
                    <div class="typing-dot" style="--delay: 0.4s"></div>
                </div> 
            </div>
            <span onclick="copyResponse(this)" class="material-symbols-outlined">content_copy</span>
        </div>
        `;

        const incomingChatDiv = createChatElement(html, "incoming");
        chatContainer.appendChild(incomingChatDiv);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
        getChatResponse(incomingChatDiv);
    }

    const handleOutgoingChat = () => {
        userText = chatInput.value.trim();
        if(!userText) return;

        chatInput.value = "";
        chatInput.style.height = `${initialInputHeight}px`

        const html = `
        <div class="chat-content">
            <div class="chat-details">
                <img src="images/user.png" alt="user-image">
                <p>${userText}</p>
            </div>
        </div>
        `;

        const outgoingChatDiv = createChatElement(html, "outgoing");
        chatContainer.querySelector(".default-text")?.remove();
        chatContainer.appendChild(outgoingChatDiv);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
        setTimeout(showTypingAnimation, 500);
    }

    deleteButton.addEventListener("click", () => {
        if(confirm("Are you sure you want to delete all the chats?")) {
            localStorage.removeItem("all-chats");
            loadDataFromLocalstorage();
        }
    });

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("themeColor", themeButton.innerText);
        themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
    });

    const initialInputHeight = chatInput.scrollHeight;

    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${initialInputHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && !e.shiftKey && window.innerHeight > 800) {
            e.preventDefault();
            handleOutgoingChat();            
        }
    });

    loadDataFromLocalstorage();
    sendButton.addEventListener("click", handleOutgoingChat);
});





































