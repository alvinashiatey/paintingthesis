class PixelSlider {
        /* 
        @param string id - id of the canvas element
        */
        constructor(container) {
                if (typeof container === "string") {
                        this.canvas = document.querySelector(container);
                } else if (canvas instanceof HTMLDivElement) {
                        this.container = container;
                }
                this.init();
        }

        init() {
                this.#getImagePath().then((data) => {
                        for (let img of data) {
                                this.image = new Image();
                                this.image.src = data[60];
                                this.image.crossOrigin = "anonymous";
                                this.image.height = this.height;
                                this.image.onload = () => {
                                        this.ctx.drawImage(
                                                this.image,
                                                0,
                                                0,
                                                this.width,
                                                this.height
                                        );
                                };
                        }
                });
        }

        #getImagePath() {
                return fetch("../images.json")
                        .then((response) => response.json())
                        .then((res) => {
                                return res.data;
                        });
        }

        image() {
                this.image = new Image();
        }
}

const slider = document.querySelector(".slide__conatiner");
// const pixelSlider = new PixelSlider(slider);
