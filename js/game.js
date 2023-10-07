(function () {

  const FPS = 300;
  const HEIGHT = 300;
  const WIDTH = 1024;
  const PROB_CLOUD = 100;

  let gameLoop;
  let generateCloudsLoop;
  let desert;
  let dino;
  let frame = 0;

  function init() {
    gameLoop = setInterval(run, 1000 / FPS);
    generateCloudsLoop = setInterval(generateClouds, 1500);
    desert = new Desert();
    dino = new Dino();
    utils = new Utils();
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (dino.status === 0) dino.status = 1;
    }
  })

  class Desert {
    constructor() {
      this.element = document.createElement("div")
      this.element.className = "desert";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      document.getElementById("game").appendChild(this.element)

      this.ground = document.createElement("div")
      this.ground.className = "ground"
      this.ground.style.backgroundPositionX = 0;
      this.element.appendChild(this.ground)
    }
    move() {
      this.ground.style.backgroundPositionX = `${parseInt(this.ground.style.backgroundPositionX) - 1}px`
    }
  }

  class Dino {
    #status
    constructor() {
      this.backgroundPositionsX = {
        running1: "-1391px",
        running2: "-1457px",
        jumping: "-1259px"
      }
      this.#status = 0; // 0-correndo, 1-subindo, 2-descendo
      this.minHeight = 2;
      this.maxHeight = 100;
      this.element = document.createElement("div")
      this.element.className = "dino";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.running1;
      this.element.style.backgroundPositionY = "-2px";
      this.element.style.bottom = `${this.minHeight}px`
      desert.element.appendChild(this.element)
    }
    /**
     * @param {number} value
     */
    set status(value) {
      if (value >= 0 && value <= 2) this.#status = value;
    }
    get status() {
      return this.#status;
    }
    run() {
      if (this.#status === 0 && frame % 20 === 0) this.element.style.backgroundPositionX = this.element.style.backgroundPositionX === this.backgroundPositionsX.running1 ? this.backgroundPositionsX.running2 : this.backgroundPositionsX.running1;
      else if (this.#status === 1) {
        this.element.style.backgroundPositionX = this.backgroundPositionsX.jumping;
        this.element.style.bottom = `${parseInt(this.element.style.bottom) + 1}px`;
        if (parseInt(this.element.style.bottom) >= this.maxHeight) this.status = 2;
      }
      else if (this.#status === 2) {
        this.element.style.bottom = `${parseInt(this.element.style.bottom) - 1}px`;
        if (parseInt(this.element.style.bottom) <= this.minHeight) this.status = 0;
      }
    }
  }

  class Cloud {
    constructor() {
      this.element = document.createElement("div");
      this.element.className = "cloud";
      this.element.style.right = "-70px";
      this.element.style.top = `${parseInt(Math.random() * 200)}px`
      desert.element.appendChild(this.element);
    }
    move(cloud) {
      if (frame % 2 === 0) {
        if (utils.pxToInt(cloud.element.style.right) < WIDTH) {
          cloud.element.style.right = `${parseInt(cloud.element.style.right) + 1}px`;
        }
        else {
          cloud.element.remove();
        }
      }
    }
  }

  class Utils {
    constructor() {}

    pxToInt(px) {
      return parseInt(px.substring(-2));
    }
  }

  function run() {
    frame = frame + 1
    if (frame === FPS) frame = 0;
    desert.move()
    dino.run();
  }

  function generateClouds() {
    if (Math.random() * 100 <= PROB_CLOUD) {
      newCloud = new Cloud();
      setInterval(newCloud.move, 1000 / FPS, newCloud);
    }
  }

  init()

})()