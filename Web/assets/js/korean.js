async function loadImages(category) {
  try {
    const response = await fetch(
      `http://192.168.0.3:8080/db?education=korean&category=${category}`
    );
    const data = await response.json();

    const contentDiv = document.querySelector(".content");
    const images = data.WORD_IMG;
    let currentIndex = 0;

    function showImage(index) {
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
          showImage(currentIndex);
        }
      });
      contentDiv.appendChild(prevButton);

      const image = document.createElement("img");
      image.src = images[index].KWORD_IMG;
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
          showImage(currentIndex);
        }
      });
      contentDiv.appendChild(nextButton);

      // 음성 버튼 생성
      const audioButton = document.createElement("button");
      audioButton.classList.add("audio-button");
      audioButton.addEventListener("click", () => {});
      const audioimage = document.createElement("img");
      audioimage.src =
        "https://img.icons8.com/fluency-systems-regular/36/high-volume.png";
      audioimage.classList.add("centered"); // 위치 정렬
      audioButton.appendChild(audioimage);
      contentDiv.appendChild(audioButton);
    }

    showImage(currentIndex);
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadImages);
