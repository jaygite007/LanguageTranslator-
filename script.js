const selectTag = document.querySelectorAll('select');
const translateBtn = document.querySelector("#Transfer");
const fromText = document.querySelector("#fromText");
const toText = document.querySelector("#toText");
const icons = document.querySelectorAll("img");



document.getElementById("darkToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("darkToggle");
    btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});



selectTag.forEach((tag, id) => {
    for (const countriesCode in countries) {
        if (countriesCode.length > 2) continue;

        let selected = "";
        if (id === 0 && countriesCode === "en") {
            selected = "selected";
        } else if (id === 1 && countriesCode === "hi") {
            selected = "selected";
        }
        let option = `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Translate button click event
translateBtn.addEventListener("click", () => {
    const text = fromText.value.trim();
    if (!text) return alert("Please enter text to translate.");

    const translateFrom = selectTag[0].value; // e.g., 'en'
    const translateTo = selectTag[1].value;   // e.g., 'hi'

    // Google Translate unofficial API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${translateFrom}&tl=${translateTo}&dt=t&q=${encodeURIComponent(text)}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            // data[0] contains translated segments
            toText.value = data[0].map(item => item[0]).join("");
        })
        .catch(err => console.error("Translation error:", err));
});


// Copy & Speak functionality
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.alt === "Copy") {
            if (target.closest(".select1")) {
                navigator.clipboard.writeText(fromText.value);
                alert("Copied source text!");
            } else if (target.closest(".select2")) {
                navigator.clipboard.writeText(toText.value);
                alert("Copied translated text!");
            }
        }
        else if (target.alt === "Speak") {
            let utterance;
            if (target.closest(".select1")) {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else if (target.closest(".select2")) {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});

