const fetchRandomNation = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8080/db/nation?education=Nation");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (!data || !data.WORD || data.WORD.length === 0) {
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

const loadImages = async () => {
    try {
        // 모든 nation 데이터 가져오기
        const nations = await fetchRandomNation();

        // 무작위로 두 개의 나라 선택
        const nationIndex = getRandomInt(nations.length);
        let wrongNationIndex;
        do {
            wrongNationIndex = getRandomInt(nations.length);
        } while (wrongNationIndex === nationIndex);

        const nation = nations[nationIndex];
        const wrongNation = nations[wrongNationIndex];
        
        // 이미지 출력
        const contentDiv = document.querySelector(".content");
        contentDiv.innerHTML = ""; // 이전 이미지 지우기

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const image = document.createElement("img");
        image.src = nation.NATION_IMG;
        image.classList.add("centered");
        imageContainer.appendChild(image);

        // 버튼 생성
        const buttons = [
            {
                text: nation.NATION,
                onClick: () => {
                    alert("정답입니다!");
                    loadImages(); // 정답 메시지 후 새로운 이미지 로드
                }
            },
            {
                text: wrongNation.NATION,
                onClick: () => {
                    alert("다시 생각해보세요!");
                }
            }
        ];

        // 버튼을 무작위로 섞기
        shuffleArray(buttons);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        // 섞인 순서대로 버튼 추가
        buttons.forEach(button => {
            const btn = document.createElement("button");
            btn.textContent = button.text;
            btn.classList.add("button");
            btn.addEventListener("click", button.onClick);
            buttonsDiv.appendChild(btn);
        });

        // 이미지와 버튼을 contentDiv에 추가
        contentDiv.appendChild(imageContainer);
        contentDiv.appendChild(buttonsDiv);
    } catch (error) {
        console.error("Error loading images:", error);
    }
};

document.addEventListener("DOMContentLoaded", loadImages);
