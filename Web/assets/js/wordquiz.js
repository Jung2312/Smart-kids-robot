const fetchRandomNation = async (category) => { // 'category' 파라미터 추가
    try {
        const response = await fetch(`http://127.0.0.1:8080/db/wordquiz?education=wordQuiz&category=${category}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (!data || !data.WORD || data.WORD.length === 0) { // 데이터 구조 수정
            throw new Error("Received empty or invalid data");
        }
        return data.WORD;
    } catch (error) {
        console.error("Error fetching random nation:", error);
        throw error;
    }
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const loadQuiz = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (!category) {
            console.error("No category specified");
            return;
        }

        const words = await fetchRandomNation(category);

        const wordIndex = getRandomInt(words.length);
        let wrongWordIndex;
        do {
            wrongWordIndex = getRandomInt(words.length);
        } while (wrongWordIndex === wordIndex);

        const word = words[wordIndex];
        const wrongWord = words[wrongWordIndex];

        const contentDiv = document.querySelector(".content");
        contentDiv.innerHTML = ""; // 이전 이미지 지우기

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const image = document.createElement("img");
        image.src = word.WORD_IMG;
        image.classList.add("centered");
        imageContainer.appendChild(image);

        const buttons = [
            {
                text: word.WORD,
                onClick: () => {
                    alert("정답입니다!");
                    loadQuiz(); // 정답 메시지 후 새로운 퀴즈 로드
                }
            },
            {
                text: wrongWord.WORD,
                onClick: () => {
                    alert("틀렸습니다!");
                }
            }
        ];

        shuffleArray(buttons);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        buttons.forEach(button => {
            const btn = document.createElement("button");
            btn.textContent = button.text;
            btn.classList.add("button");
            btn.addEventListener("click", button.onClick);
            buttonsDiv.appendChild(btn);
        });

        contentDiv.appendChild(imageContainer);
        contentDiv.appendChild(buttonsDiv);
    } catch (error) {
        console.error("Error loading quiz:", error);
    }
};

document.addEventListener("DOMContentLoaded", loadQuiz);
