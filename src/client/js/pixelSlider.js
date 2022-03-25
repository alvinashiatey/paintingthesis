class PixelSlider {
        /* 
                @param string id - id of the canvas element
        */
        constructor(canvas) {
                this.canvas = document.getElementById(canvas);
                this.ctx = canvas.getContext('2d');
        }

        init() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
        }

        image() {
                this.image = new Image();

        }
}