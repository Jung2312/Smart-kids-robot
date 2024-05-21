async function loadImages(category) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8080/db?education=english&category=${category}`
    );
    console.log(response);
    const data = await response.json();

    const contentDiv = document.querySelector(".content");
    const images = data.WORD;
    let currentIndex = 0;

    // 음성 합성을 위한 함수
    function speakWord(word) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(word);
      synth.speak(utterance);
    }

    function showImage(index, category) {
      contentDiv.innerHTML = ""; // 이전 이미지 지움

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      // 이전 버튼 생성
      const prevButton = document.createElement("button");
      prevButton.classList.add("page-button");
      prevButton.textContent = "❮";
      prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          showImage(currentIndex, category);
        }
      });
      contentDiv.appendChild(prevButton);
      const image = document.createElement("img");
      if (category == "word") {
        image.src = images[index].EWORD_IMG;
      } else {
        image.src = images[index].ALPHABET_IMG;
      }
      image.classList.add("centered"); // 위치 정렬
      imageContainer.appendChild(image);

      contentDiv.appendChild(imageContainer);

      // 다음 버튼 생성
      const nextButton = document.createElement("button");
      nextButton.textContent = "❯";
      nextButton.classList.add("page-button");
      nextButton.addEventListener("click", () => {
        if (currentIndex < images.length - 1) {
          currentIndex++;
          showImage(currentIndex, category);
        }
      });
      contentDiv.appendChild(nextButton);

      // 음성 버튼 생성
      const audioButton = document.createElement("button");
      audioButton.classList.add("audio-button");
      // audioButton.addEventListener("click", () => {});
      const audioimage = document.createElement("img");
      audioimage.src =
        "https://img.icons8.com/fluency-systems-regular/36/high-volume.png";
      audioimage.classList.add("centered"); // 위치 정렬
      audioButton.appendChild(audioimage);
      contentDiv.appendChild(audioButton);

      // showImage 함수 내에 음성 버튼 클릭 이벤트 핸들러 추가
      audioButton.addEventListener("click", () => {
        const currentWord =
          category === "word"
            ? images[currentIndex].WORD
            : images[currentIndex].ALPHABET;
        speakWord(currentWord);
      });
    }

    showImage(currentIndex, category);
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadImages("ALPHABET"); // 페이지 로드 시 이미지 불러오기 시작
});
