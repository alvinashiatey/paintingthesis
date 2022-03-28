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
                this.mainDiv = document.querySelector("main");
                if (!this.container) return;
                if (this.isMobile()) return;
                this.handleOnScrollAnimation();
                this.#headerSmoothScroll();
                this.init();
        }

        isMobile() {
                return window.innerWidth < 600;
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

        #headerSmoothScroll() {
                let containerTop = this.container.offsetTop;
                let containerBottom =
                        containerTop + this.container.offsetHeight;
                let headerLink = document.querySelector(".home__link a");
                headerLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        let target = headerLink.getAttribute("href");
                        let targetPosition =
                                document.querySelector(target).offsetTop;
                        this.mainDiv.scrollTo({
                                top: containerBottom,
                                behavior: "smooth"
                        });
                });
        }

        handleOnScrollAnimation() {
                let containerTop = this.container.offsetTop;
                let containerBottom =
                        containerTop + this.container.offsetHeight;
                let listener = () => {
                        let scrollTop = Math.ceil(this.mainDiv.scrollTop);
                        let scaleValue = this.map(
                                scrollTop,
                                0,
                                containerBottom,
                                100,
                                0
                        );
                        let webkitScaleValue = this.map(
                                scaleValue,
                                100,
                                0,
                                1,
                                0
                        );
                        console.log(scaleValue);
                        this.container.style.transformOrigin = "top center";
                        this.container.style.transform = `scaleY(${scaleValue}%)`;
                        // webkit-transform version
                        this.container.style.webkitTransformOrigin =
                                "top center";
                        this.container.style.webkitTransform = `scale(${webkitScaleValue})`;

                        if (scaleValue <= 0) {
                                let currentOffset = this.container.offsetTop - this.mainDiv.scrollTop;
                                this.container.remove();
                                // mainting scroll position
                                this.mainDiv.scrollTo({
                                        top: this.container.offsetTop - currentOffset,
                                        behavior: "smooth"
                                });
                                this.mainDiv.removeEventListener(
                                        "scroll",
                                        listener
                                );
                        }
                };

                this.mainDiv.addEventListener("scroll", listener);
        }

        // function that maps value x and y to a range b to y
        map(x, in_min, in_max, out_min, out_max) {
                return (
                        ((x - in_min) * (out_max - out_min)) /
                        (in_max - in_min) +
                        out_min
                );
        }

        handleOutOfWindow() {
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
                        imgDiv.style.backgroundImage = `url(${this.interimImage.src})`;
                        this.container.querySelector(".caption").innerHTML =
                                this.interimImage.caption;
                        this.container.querySelector(".artist-name").innerHTML =
                                this.interimImage.name;
                        this.container.querySelector(".artist-name").href =
                                this.#handleArtistUrl(this.interimImage.name);
                        this.interimImage = this.nextImage();
                });
                this.images.splice(randomIndex, 1);
                let interimDiv = document.createElement("div");
                interimDiv.classList.add("interim-wrapper");
                this.container.appendChild(interimDiv);
                this.interimImage = this.nextImage();
                return imgContainer;
        }

        nextImage() {
                let randomIndex = Math.floor(
                        Math.random() * this.images.length
                );
                let imageDiv = document.querySelector(".interim-wrapper");
                let el = this.images[randomIndex];
                imageDiv.style.backgroundImage = `url(${el.src})`;
                this.images.splice(randomIndex, 1);
                if (!this.images.length) this.init();
                return {
                        el: imageDiv,
                        src: el.src,
                        caption: this.#handleCaption(el.caption),
                        name: this.#handleArtistName(el.name)
                };
        }

        image(src) {
                let imgDiv = document.createElement("div");
                imgDiv.classList.add("img-wrapper");
                imgDiv.style.backgroundImage = `url(${src})`;
                imgDiv.style.backgroundSize = "cover";
                imgDiv.style.backgroundPosition = "center";
                imgDiv.style.backgroundRepeat = "no-repeat";
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
                artistATag.href = this.#handleArtistUrl(name);
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

        #handleArtistUrl(name) {
                return `artists/${name.toLowerCase().split(" ").join("-")}/`;
        }
}

const slider = document.querySelector(".slide__container");
const pixelSlider = new PixelSlider(slider);
