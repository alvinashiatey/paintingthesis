class PixelSlider {
        /* 
        @param string id - id of the canvas element
        */
        constructor(container) {
                if (typeof container === "string") {
                        this.container = document.querySelector(container);
                } else if (container instanceof HTMLDivElement) {
                        this.container = container;
                }
                this.handleOutOfWindow();
                this.init();
        }

        init() {
                this.#getImagePath().then((data) => {
                        this.container.appendChild(
                                this.generateImageContent(data)
                        );
                });
        }

        #getImagePath() {
                return fetch("../images.json")
                        .then((response) => response.json())
                        .then((res) => {
                                return res.data;
                        });
        }

        handleOutOfWindow() {
                // use Intersectional Observer to check if this.container is out of window and then remove it
                let options = {
                        root: null,
                        rootMargin: "0px",
                        threshold: 0.1
                };
                let observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                                if (!entry.isIntersecting) {
                                        this.container.remove();
                                        document.body.style.overflowY =
                                                "hidden";
                                }
                        });
                }, options);
                observer.observe(this.container);
        }

        generateImageContent(data) {
                this.images = data;
                let randomIndex = Math.floor(Math.random() * data.length);
                let el = data[randomIndex];
                let textDiv = document.createElement("div");
                textDiv.classList.add("text-wrapper");
                let imgContainer = document.createElement("div");
                imgContainer.classList.add("img-container");
                let src = el.src;
                let imgDiv = this.image(src);
                imgContainer.appendChild(imgDiv);
                textDiv.appendChild(this.getArtistName(el.name));
                textDiv.appendChild(this.caption(el.caption));
                imgContainer.appendChild(textDiv);
                imgDiv.addEventListener("click", () => {
                        let newRan = Math.floor(
                                Math.random() * this.images.length
                        );
                        let newEl = this.images[newRan];
                        imgContainer.querySelector("img").src = newEl.src;
                        imgContainer.querySelector(".caption").innerHTML =
                                this.#handleCaption(newEl.caption);
                        imgContainer.querySelector(".artist-name").innerHTML =
                                this.#handleArtistName(newEl.name);
                        this.images.splice(newRan, 1);
                        if (!this.images.length) this.init();
                });
                this.images.splice(randomIndex, 1);
                return imgContainer;
        }

        image(src) {
                let imgDiv = document.createElement("div");
                imgDiv.classList.add("img-wrapper");
                let img = document.createElement("img");
                img.src = src;
                imgDiv.appendChild(img);
                return imgDiv;
        }

        caption(caption) {
                let captionDiv = document.createElement("div");
                let cap = document.createElement("p");
                cap.classList.add("caption");
                captionDiv.classList.add("caption-div");
                cap.innerHTML = this.#handleCaption(caption);
                captionDiv.appendChild(cap);
                return captionDiv;
        }

        getArtistName(name) {
                let artistDiv = document.createElement("div");
                artistDiv.classList.add("artist-name-wrapper");
                let artistATag = document.createElement("a");
                artistATag.classList.add("artist-name");
                // remove the first element of the array and add it to the artist name
                name = this.#handleArtistName(name);
                artistATag.innerHTML = name;
                artistATag.href = `artists/${name
                        .toLowerCase()
                        .split(" ")
                        .join("-")}/`;

                artistDiv.appendChild(artistATag);
                return artistDiv;
        }

        #handleCaption(text) {
                return text.split(".")[0];
        }

        #handleArtistName(text) {
                let nameArr = text.split(" ");
                nameArr.shift();
                return nameArr.join(" ");
        }
}

const slider = document.querySelector(".slide__conatiner");
const pixelSlider = new PixelSlider(slider);
