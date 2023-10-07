(function () {

  const FPS = 300;
  const HEIGHT = 300;
  const WIDTH = 1024;
  const PROB_CLOUD = 100;
  const PROB_OBSTACLE = 100;

  const DINO_STATUS_STOPPED = 0;
  const DINO_STATUS_RUNNING = 1;
  const DINO_STATUS_JUMPING = 2;
  const DINO_STATUS_SQUATTING = 3;
  const DINO_STATUS_DIED = 4;

  let gameLoop;
  let generateCloudsLoop;
  let generateObstaclesLoop;
  let dayNightLoop;
  let day = true;
  let desert;
  let dino;
  let frame = 0;

  function init() {
    gameLoop = setInterval(run, 1000 / FPS);
    generateCloudsLoop = setInterval(generateClouds, 1500);
    generateObstaclesLoop = setInterval(generateObstacles, 4000);
    dayNightLoop = setInterval(dayNight, 5000);
    desert = new Desert();
    dino = new Dino();
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      dino.up = true;

      dino.jump();
    }

    if (e.code === "ArrowDown") {
      dino.down = true;

      if (dino.status == DINO_STATUS_RUNNING) {
        dino.status = DINO_STATUS_SQUATTING;
        dino.element.style.backgroundPositionX = dino.backgroundPositionsX.squartting1
        dino.element.className = "dino_squart";
      }
    }
  })

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      dino.up = false;
    }

    if (e.code === "ArrowDown") {
      dino.down = false;

      if (dino.status == DINO_STATUS_SQUATTING) {
        dino.status = DINO_STATUS_RUNNING;
        dino.element.style.backgroundPositionX = dino.backgroundPositionsX.running1;
        dino.element.className = "dino";
      }
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
        squartting1: "-1655px",
        squartting2: "-1740px",
        jumping: "-1259px"
      }
      this.#status = DINO_STATUS_RUNNING;
      this.minHeight = 2;
      this.maxHeight = 150;
      this.up = false;
      this.down = false;
      this.element = document.createElement("div")
      this.element.className = "dino";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.running1;
      this.element.style.backgroundPositionY = "-2px";
      this.element.style.bottom = `${this.minHeight}px`
      this.element.style.left = `20px`
      this.element.style.width = `66px`
      this.element.style.height = `70px`
      desert.element.appendChild(this.element)
    }
    /**
     * @param {number} value
     */
    set status(value) {
      if (value >= 0 && value <= 4) this.#status = value;
    }
    get status() {
      return this.#status;
    }

    run() {
      if (this.#status == DINO_STATUS_RUNNING || this.#status == DINO_STATUS_JUMPING) {
        if (this.element.style.backgroundPositionX == this.backgroundPositionsX.squartting1
          || this.element.style.backgroundPositionX == this.backgroundPositionsX.squartting2) {
          this.element.style.backgroundPositionX = this.backgroundPositionsX.running1
        }

        this.element.className = "dino";
      }
      if (this.#status == DINO_STATUS_SQUATTING) {
        if (this.element.style.backgroundPositionX == this.backgroundPositionsX.running1
          || this.element.style.backgroundPositionX == this.backgroundPositionsX.running2) {
          this.element.style.backgroundPositionX = this.backgroundPositionsX.squartting1
        }

        this.element.className = "dino_squart";
      }

      if (this.#status == DINO_STATUS_RUNNING && frame % 20 === 0) {
        this.element.style.backgroundPositionX = this.element.style.backgroundPositionX === this.backgroundPositionsX.running1 ? this.backgroundPositionsX.running2 : this.backgroundPositionsX.running1;
      }
      if (this.#status == DINO_STATUS_SQUATTING && frame % 20 === 0) {
        this.element.style.backgroundPositionX = this.element.style.backgroundPositionX === this.backgroundPositionsX.squartting1 ? this.backgroundPositionsX.squartting2 : this.backgroundPositionsX.squartting1;
      }
    }

    async jump() {
      if (dino.status == DINO_STATUS_RUNNING) {
        dino.status = DINO_STATUS_JUMPING;

        this.element.style.bottom = `${this.minHeight + 1}px`;

        this.element.style.backgroundPositionX = this.backgroundPositionsX.jumping;

        let percentShortJump = 0.65;

        let percentMidleJump = 0.85;

        let targetHeight = this.maxHeight * percentShortJump;

        let speedpx = 3;

        //up
        while (parseInt(this.element.style.bottom) <= targetHeight && this.down == false) {
          if (parseInt(this.element.style.bottom) >= this.maxHeight * percentMidleJump) {
            speedpx = 1;
          }
          else if (parseInt(this.element.style.bottom) >= this.maxHeight * percentShortJump) {
            speedpx = 2;
          }
          else {
            speedpx = 3;
          }

          this.element.style.bottom = `${parseInt(this.element.style.bottom) + speedpx}px`;

          if (targetHeight != this.maxHeight
            && (targetHeight - 5 <= parseInt(this.element.style.bottom))
            && this.up == true) {
            targetHeight = this.maxHeight;
          }

          await new Promise(resolve => setTimeout(resolve));
        }

        //down
        while (parseInt(this.element.style.bottom) > this.minHeight) {
          await new Promise(resolve => setTimeout(resolve));

          if (parseInt(this.element.style.bottom) >= this.maxHeight * percentMidleJump) {
            speedpx = 1;
          }
          else if (parseInt(this.element.style.bottom) >= this.maxHeight * percentShortJump) {
            speedpx = 2;
          }
          else {
            speedpx = 3;
          }

          this.element.style.bottom = `${parseInt(this.element.style.bottom) - (this.down ? 5 : speedpx)}px`;
        }

        this.element.style.bottom = "2px";

        if (this.down) {
          this.status = DINO_STATUS_SQUATTING;
          this.element.style.backgroundPositionX = this.backgroundPositionsX.squartting1
          this.element.className = "dino_squart";
        }
        else {
          this.status = DINO_STATUS_RUNNING;
        }
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
        if (parseInt(cloud.element.style.right) < WIDTH) {
          cloud.element.style.right = `${parseInt(cloud.element.style.right) + 1}px`;
        }
        else {
          cloud.element.remove();
          cloud = null;
          
        }
      }
    }
  }

  class Obstacle {
    constructor() {
      this.minHeight = 2;

      this.element = document.createElement("div");

      this.element.className =  /*"obstacle" + parseInt(Math.random() * 7);*/ "obstacle1";

      this.element.style.right = "-70px";
      this.element.style.bottom = `${this.minHeight}px`
      this.element.style.width = "26px";
      this.element.style.height = "54px";

      desert.element.appendChild(this.element);
    }
    move(obstacle) {
      if (parseInt(obstacle.element.style.right) < WIDTH) {
        obstacle.element.style.right = `${parseInt(obstacle.element.style.right) + 1}px`;

        if (collided(
          WIDTH - parseInt(obstacle.element.style.right) - parseInt(obstacle.element.style.width),
          parseInt(obstacle.element.style.bottom), 
          parseInt(obstacle.element.style.width),
          parseInt(obstacle.element.style.height),
          parseInt(dino.element.style.left),
          parseInt(dino.element.style.bottom), 
          parseInt(dino.element.style.width),
          parseInt(dino.element.style.height)
          )) {
          console.log("colision detected");
        }
      }
      else {
        clearInterval(obstacle.id);
        obstacle.element.remove();
        obstacle = null;
      }
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
      let newCloud = new Cloud();
      setInterval(newCloud.move, 1000 / FPS, newCloud);
    }
  }

  function generateObstacles() {
    if (Math.random() * 100 <= PROB_OBSTACLE) {
      let newObstacle = new Obstacle();
      newObstacle.id = setInterval(newObstacle.move, 1000 / FPS, newObstacle);
    }
  }

  class Point {
    constructor(x , y) {
      this.x = x;
      this.y = y;
    }
  }

  class Rectangle {
    constructor(x, y, w, l) {
      this.p1 = new Point(x, y + l);
      this.p2 = new Point(x + w, y + l);
      this.p3 = new Point(x, y);
      this.p4 = new Point(x + w, y);
    }

    /**
     * @param {Point} p
     */
    isPointInside(p) {
      if (p.x >= this.p3.x && p.x <= this.p4.x && p.y <= this.p1.y && p.y >= this.p4.y) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  function collided(x1, y1, w1, l1, x2, y2, w2, l2) {
    let ob1 = new Rectangle(x1, y1, w1, l1);
    let ob2 = new Rectangle(x2, y2, w2, l2);

    // console.log(ob1.p1);
    // console.log(ob1.p2);
    // console.log(ob1.p3);
    // console.log(ob1.p4);
    // console.log("////");

    if (ob1.isPointInside(ob2.p1) || ob1.isPointInside(ob2.p2) || ob1.isPointInside(ob2.p3) || ob1.isPointInside(ob2.p4)) {
      return true;
    }
    else if (ob2.isPointInside(ob1.p1) || ob2.isPointInside(ob1.p2) || ob2.isPointInside(ob1.p3) || ob2.isPointInside(ob1.p4)) {
      return true;
    }
    else {
      return false;
    }

  }

  function dayNight() {
    if (day) {
      day = false;
      document.getElementsByClassName("desert")[0].style.backgroundColor = "black";
    }
    else {
      day = true;
      document.getElementsByClassName("desert")[0].style.backgroundColor = "white";
    }
  }

  init()

})()