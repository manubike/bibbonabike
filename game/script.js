(function setup(window) {
  var document = window.document;
  Object.prototype.on = function(a, b) {
    this.addEventListener(a, b);
    return this;
  };
  window.can = document.querySelector("canvas");
  window.ctx = window.can.getContext("2d");
  window.can.width = window.innerWidth;
  window.can.height = window.innerHeight;
  window.randInt = function(a, b) {
    if (a === void 0) return Math.round(Math.random());
    else if (b === void 0) return Math.floor(Math.random() * a);
    else return Math.floor(Math.random() * (b - a + 1) + a);
  };
  window.randFloat = function(a, b) {
    if (a === void 0) return Math.random();
    else if (b === void 0) return Math.random() * a;
    else return Math.random() * (b - a) + a;
  };
  window.rand = function(a, b) {
    return Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : window.randInt(a, b);
  };
}(window));

(function() {
  var player = {
    x: can.width / 2,
    y: can.height,
    s: 20,
    mx: 0,
    p: 1,
    a: 0,
    speed: 3,
    lives: 3,
    enemiesKilled: 0,
    holstered: false,
    applyWeaponProperties: function() {
      switch(this.weapon) {
        case "Pistol":
          this.barrelLength = 1;
          this.caliber = 3;
          this.velocity = 1;
          this.magSize = 10;
          this.spray = 1;
          this.penetration = 1;
          this.reloadTime = 2500;
          this.isGun = true;
          break;
        case "Shotgun":
          this.barrelLength = 2;
          this.caliber = 2;
          this.velocity = 1;
          this.magSize = 9;
          this.spray = 3;
          this.penetration = 1;
          this.reloadTime = 1500;
          this.isGun = true;
          break;
        case "Sniper Rifle":
          this.barrelLength = 2;
          this.caliber = 4;
          this.velocity = 2;
          this.magSize = 1;
          this.spray = 1;
          this.penetration = Infinity;
          this.reloadTime = 2000;
          this.isGun = true;
          break;
        case "Shield":
          this.isGun = false;
      }
    },
    bullets: [],
    fireRound: function(y) {
      this.bullets.push({
        x: this.x + this.s * (1.5 + this.barrelLength) * this.p,
        y: this.y - 3.5 * this.s,
        mx: this.p,
        py: y === void 0 ? 0 : y,
        hits: 0,
        hit: false
      });
    },
    options: [
      ["Pistol", "Shotgun", "Sniper Rifle", "Shield"],
      ["None", "Cap", "Top Hat", "Bowler Hat", "Helmet", "The Eye"],
      ["maroon", "black", "white", "yellow", "lime", "blue", "deeppink"]
    ],
    cycle: [0, 2, 0],
    weapon: "Pistol",
    headGear: "Top Hat",
    bikeColor: "maroon"
  };
  player.applyWeaponProperties();
  var Tree = function() {
    let s = rand(20, 30);
    return {
      x: rand(can.width),
      y: rand(3 * can.height / 4, can.height),
      h: rand(can.height / 4, 3 * can.height / 4),
      s: s,
      trunkColor: [rand(150, 200), rand(100, 150), rand(100)],
      leafColor: [rand(50), rand(100, 200), rand(50)]
    };
  };
  var trees = [];
  for (let i = 0; i < 10; i++)
    trees.push(new Tree());
  var Enemy = function() {
    var s = rand(30, 40);
    var a = rand() === 0;
    return {
      x: a ? -s * rand(1, 10) : can.width + s * rand(1, 10),
      y: can.height - s,
      s: s,
      a: 0,
      c: [rand(50, 150), rand(50, 100), rand(50, 100)],
      p: a ? 1 : -1,
      speed: randFloat(2, 6)
    };
  };
  var enemies = [];
  for (let i = 0; i < 10; i++)
    enemies.push(new Enemy());
  var drawHeart = function(x, y, s) {
    ctx.beginPath();
    ctx.lineWidth = s / 10;
    ctx.fillStyle = "red";
    ctx.moveTo(x, y + s);
    ctx.bezierCurveTo(x + 1.5 * s, y, x + s / 3, y - s, x, y);
    ctx.bezierCurveTo(x - s / 3, y - s, x - 1.5 * s, y, x, y + s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  (function update() {
    ctx.beginPath();
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.lineCap = "round";
    let sky = ctx.createLinearGradient(can.width, can.height, 0, 0);
    sky.addColorStop(0, "rgb(200, 200, 255)");
    sky.addColorStop(1, "rgb(100, 100, 200)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, can.width, can.height);
    let sun = ctx.createRadialGradient(can.width, 0, 0, can.width, 0, 200);
    sun.addColorStop(0, "rgb(255, 255, 0)");
    sun.addColorStop(1, "rgba(255, 255, 255, 0.1)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, can.width, can.height);
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fillRect(0, 3 * can.height / 4, can.width, can.height / 4);
    for (let i in trees) {
      let p = trees[i];
      ctx.fillStyle = "rgb(" + p.trunkColor + ")";
      ctx.fillRect(p.x, p.y - p.h, p.s, p.h);
      ctx.beginPath();
      ctx.fillStyle = "rgb(" + p.leafColor + ")";
      ctx.arc(p.x + p.s / 2, p.y - p.h, 2 * p.s, 0, 2 * Math.PI);
      ctx.fill();
      p.x -= player.mx * player.speed;
      if (p.x + p.s / 2 + 2 * p.s < 0) {
        trees[i] = new Tree();
        trees[i].x = can.width + 2 * trees[i].s;
      } else if (p.x - 2 * p.s > can.width) {
        trees[i] = new Tree();
        trees[i].x = -2 * trees[i].s - trees[i].s / 2;
      }
    }
    /*let n = 0;*/
    for (let i in player.bullets) {
      p = player.bullets[i];
      if (!p.hit) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(p.x, p.y, player.caliber, 0, 2 * Math.PI);
        ctx.fill();
      }
      p.x += p.mx * 10 * player.velocity;
      p.y += p.py;
      /*if (p.x - player.caliber > can.width ||
          p.x + player.caliber < 0) n++;*/
    }
    /*if (player.bullets.length > 0 &&
        n == player.bullets.length)
      setTimeout(function() {
        player.bullets = [];
      });*/
    for (let i in enemies) {
      p = enemies[i];
      ctx.beginPath();
    ctx.lineWidth = p.s / 10;
    ctx.fillStyle = "rgb(" + p.c + ")";
    ctx.arc(p.x + Math.cos(p.a) * p.s / 2, p.y + Math.sin(p.a) * p.s / 2, p.s / 2, 0, 2 * Math.PI);
    ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x - Math.cos(p.a) * p.s / 2, p.y - Math.sin(p.a) * p.s / 2, p.s / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.s, p.s, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      if (p.dead) {
        ctx.moveTo(p.x + p.s * p.p - p.s / 6 * p.p, p.y - p.s - p.s / 6);
        ctx.lineTo(p.x + p.s * p.p - p.s / 6 * p.p - p.s / 3 * p.p, p.y - p.s + p.s / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x + p.s * p.p - p.s / 6 * p.p, p.y - p.s + p.s / 6);
        ctx.lineTo(p.x + p.s * p.p - p.s / 6 * p.p - p.s / 3 * p.p, p.y - p.s - p.s / 6);
        ctx.stroke();
      } else {
        let a = Math.atan2(player.y - (p.y - p.s), player.x - (p.x + p.s * p.p - p.s / 3 * p.p));
        ctx.fillStyle = "white";
        ctx.arc(p.x + p.s * p.p - p.s / 3 * p.p, p.y - p.s, p.s / 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(p.x + p.p * p.s - p.p * p.s / 3 + Math.cos(a) * p.s / 10, p.y - p.s + Math.sin(a) * p.s / 10, p.s / 5, 0, 2 * Math.PI);
        ctx.fill();
      }
      p.x += p.speed * p.p - player.speed * player.mx;
      if (p.dead) p.y++;
      p.a = p.a < 360 ? p.a + (p.speed / 3) * p.p * (p.dead ? 0 : 0.1) : 0;
      if (((p.x + p.s < 0 && p.p == -1 || p.x - p.s > can.width && p.p == 1) || p.y - 3 * p.s > can.height) && rand(player.enemiesKilled < 100 ? 1000 - 10 * player.enemiesKilled : 1) === 0) enemies[i] = new Enemy();
        if (player.isGun)
          for (let x in player.bullets) {
            let b = player.bullets[x];
            if (b.x - player.caliber > p.x - p.s &&
                b.x + player.caliber < p.x + p.s &&
                b.y - player.caliber > p.y - 3 * p.s &&
                b.y + player.caliber < can.height &&
                !(p.x + p.s < 0 || p.x - p.s > can.width) &&
                !b.hit && !p.dead) {
              b.hits++;
              p.dead = true;
              player.enemiesKilled++;
              if (b.hits == player.penetration) b.hit = true;
            }
          } else switch (player.weapon) {
            case "Shield":
              if (!player.holstered &&
                     (p.x - p.s < player.x + 4 * player.s * player.p - player.s / 10 * player.p &&
                     p.x + p.s > player.x + 4 * player.s * player.p + player.s / 10 * player.p) && !p.dead)
            p.x = player.x + 4 * player.s * player.p + p.s * player.p;
          }
    }
    p = player;
    for (let i = 0; i <= 360; i += 10) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = p.s / 40;
      ctx.moveTo(p.x - 2 * p.s * p.p + Math.cos(i + p.a * p.mx) * p.s, p.y - p.s + Math.sin(i + p.a * p.mx) * p.s);
      ctx.lineTo(p.x - 2 * p.s * p.p - Math.cos(i + p.a * p.mx) * p.s, p.y - p.s - Math.sin(i + p.a * p.mx) * p.s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p.x + 2 * p.s * p.p + Math.cos(i + p.a * p.mx) * p.s, p.y - p.s + Math.sin(i + p.a * p.mx) * p.s);
      ctx.lineTo(p.x + 2 * p.s * p.p - Math.cos(i + p.a * p.mx) * p.s, p.y - p.s - Math.sin(i + p.a * p.mx) * p.s);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.lineWidth = p.s / 4;
    ctx.strokeStyle = "black";
    ctx.arc(p.x - 2 * p.s * p.p, p.y - p.s, p.s, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x + 2 * p.s * p.p, p.y - p.s, p.s, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = p.s / 2;
    ctx.moveTo(p.x - p.s / 2 * p.p, p.y - 3 * p.s);
    ctx.lineTo(p.x + p.s / 2 * p.p + Math.sin(p.a * p.p) * p.s / 10, p.y - 2 * p.s + Math.sin(p.a * -p.p) * p.s / 5);
    ctx.lineTo(p.x - Math.cos(p.a * p.p) * p.s / 3, p.y - p.s - Math.sin(p.a * p.p) * p.s / 3);
    ctx.lineTo(p.x - Math.cos(p.a * p.p) * p.s / 3 + p.s / 3 * p.p, p.y - p.s - Math.sin(p.a * p.p) * p.s / 3 + p.s / 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = p.s / 4;
    ctx.strokeStyle = p.bikeColor;
    ctx.moveTo(p.x - 2 * p.s * p.p, p.y - p.s);
    ctx.lineTo(p.x - p.s / 2 * p.p, p.y - 2 * p.s);
    ctx.lineTo(p.x - p.s / 2 * p.p, p.y - 2.5 * p.s);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillRect(p.x - p.s / 2 * p.p - p.s / 3 * p.p, p.y - 2.5 * p.s - p.s / 2, p.s / 1.5 * p.p, p.s / 2);
    ctx.beginPath();
    ctx.moveTo(p.x - p.s / 2 * p.p, p.y - 2 * p.s);
    ctx.lineTo(p.x + p.s / 2 * p.p, p.y - 2 * p.s);
    ctx.lineTo(p.x + p.s * 1.5 * p.p, p.y - 3 * p.s);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x + p.s * 1.5 * p.p, p.y - 3 * p.s, p.s / 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x + p.s / 2 * p.p, p.y - 2 * p.s);
    ctx.lineTo(p.x + 2 * p.s * p.p, p.y - p.s);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = p.s / 2;
    ctx.moveTo(p.x + p.s / 2 * p.p, p.y - 5 * p.s);
    ctx.lineTo(p.x - p.s / 2 * p.p, p.y - 3 * p.s);
    ctx.lineTo(p.x + p.s / 2 * p.p - Math.sin(p.a * p.p) * p.s / 10, p.y - 2 * p.s - Math.sin(p.a * -p.p) * p.s / 5);
    ctx.lineTo(p.x + Math.cos(p.a * p.p) * p.s / 3, p.y - p.s + Math.sin(p.a * p.p) * p.s / 3);
    ctx.lineTo(p.x + Math.cos(p.a * p.p) * p.s / 3 + p.s / 3 * p.p, p.y - p.s + Math.sin(p.a * p.p) * p.s / 3 + p.s / 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineCap = "square";
    if (!p.holstered) {
      if (p.isGun) {
        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.moveTo(p.x + 1.5 * p.s * p.p, p.y - 3 * p.s);
        ctx.lineTo(p.x + 1.5 * p.s * p.p, p.y - 3.5 * p.s);
        ctx.lineTo(p.x + (1.5 + p.barrelLength) * p.s * p.p, p.y - 3.5 * p.s);
        ctx.stroke();
      }
      switch(p.weapon) {
        case "Sniper Rifle":
          ctx.lineWidth = p.s / 4;
          ctx.moveTo(p.x + (1.5 + p.barrelLength) * p.s * p.p, p.y - 3.5 * p.s - p.s / 8);
          ctx.lineTo(p.x + (1.5 + 2 * p.barrelLength) * p.s * p.p, p.y - 3.5 * p.s - p.s / 8);
          ctx.stroke();
          break;
        case "Shield":
          ctx.strokeStyle = "gray";
          ctx.moveTo(p.x + 1.5 * p.s * p.p, p.y - 3 * p.s);
          ctx.lineTo(p.x + 4 * p.s * p.p, p.y - 3 * p.s);
          ctx.stroke();
          ctx.moveTo(p.x + 4 * p.s * p.p, p.y - 5 * p.s);
          ctx.lineTo(p.x + 4 * p.s * p.p, p.y - p.s);
          ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.lineWidth = p.s / 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.moveTo(p.x, p.y - p.s * 4, p.y - 2.5 * p.s);
    ctx.lineTo(p.x + p.s * p.p, p.y - 3 * p.s);
    ctx.lineTo(p.x + 1.5 * p.s * p.p, p.y - 3 * p.s);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = p.s / 4;
    ctx.fillStyle = "white";
    ctx.arc(p.x + p.s / 2 * p.p, p.y - 5 * p.s, p.s / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "black";
    switch(player.headGear) {
      case "Cap":
        ctx.moveTo(p.x, p.y - 5 * p.s);
        ctx.lineTo(p.x + 1.5 * p.s * p.p, p.y - 5 * p.s);
        ctx.stroke();
        break;
      case "Top Hat":
        ctx.fillRect(p.x, p.y - 6.25 * p.s, p.s * p.p, p.s);
        ctx.moveTo(p.x - 0.25 * p.s * p.p, p.y - 5.25 * p.s);
        ctx.lineTo(p.x + 1.25 * p.s * p.p, p.y - 5.25 * p.s);
        ctx.stroke();
        break;
      case "Bowler Hat":
        ctx.arc(p.x + p.s / 2 * p.p, p.y - 5.25 * p.s, p.s / 1.5, Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p.x - 0.25 * p.s * p.p, p.y - 5.25 * p.s);
        ctx.lineTo(p.x + 1.25 * p.s * p.p, p.y - 5.25 * p.s);
        ctx.stroke();
        break;
      case "Helmet":
        ctx.lineWidth = p.s / 10;
        ctx.fillStyle = p.bikeColor;
        ctx.arc(p.x + p.s / 2 * p.p, p.y - 5.1 * p.s, p.s / 2 + p.s * 0.25, Math.PI, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case "The Eye":
        ctx.fillStyle = "white";
        ctx.arc(p.x + p.s / 2 * p.p, p.y - 5 * p.s, p.s, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        let target = function() {
          let closest = enemies[0];
          for (let i in enemies)
            if (!enemies[i].dead &&
                Math.abs(enemies[i].x - p.x) < Math.abs(closest.x - p.x))
              closest = enemies[i];
          return closest;
        }();
        let a = Math.atan2((target.y - target.s) - (p.y - 5 * p.s), target.x - p.x);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(p.x + p.s / 2 * p.p + Math.cos(a) * p.s / 2, p.y - 5 * p.s + Math.sin(a) * p.s / 2, p.s / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    if (player.bullets.length >= player.magSize && !p.holstered) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = p.s + "px impact";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("RELOAD", p.x + p.s / 2 * p.p, p.y - 7 * p.s);
    }
    p.a = p.a < 360 ? p.a + Math.abs(p.mx) * 0.1 : 0;
    if (p.x - 3 * p.s > can.width) p.x = -3 * p.s;
    else if (p.x + 3 * p.s < 0) p.x = can.width + 3 * p.s;
    for (let i = 1; i <= p.lives; i++)
      drawHeart(i * 30 - 15, 10, 20);
    ctx.beginPath();
    ctx.font = "30px impact";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillText(player.weapon, 0, 30);
    if (p.isGun) ctx.fillText((p.magSize - p.bullets.length) / p.spray + "/" + p.magSize / p.spray, 0, 60);
    ctx.fillText((p.enemiesKilled > 0 ? p.enemiesKilled : "No") + " kill" + (p.enemiesKilled == 1 ? "" : "s"), 0, p.isGun ? 90 : 60);
    requestAnimationFrame(update);
  }());
  let cycle = function(n) {
    player.cycle[n] = player.cycle[n] < player.options[n].length - 1 ? player.cycle[n] + 1 : 0;
    return player.options[n][player.cycle[n]];
  };
  window.on("resize", function() {
    can.width = this.innerWidth;
    can.height = this.innerHeight;
    player.y = can.height;
    for (let i in trees)
      trees[i].y = rand(3 * can.height / 4, can.height);
    for (let i in enemies)
      if (!enemies[i].dead)
        enemies[i].y = can.height - enemies[i].s;
  }).on("keydown", function(e) {
    switch(e.which || e.keyCode) {
      case 37:
      case 65:
        player.mx = player.p = -1;
        break;
      case 39:
      case 68:
        player.mx = player.p = 1;
        break;
      case 40:
      case 83:
        player.mx = 0;
        break;
      case 70:
        player.holstered = !player.holstered;
        break;
      case 81:
        player.weapon = cycle(0);
        player.applyWeaponProperties();
        setTimeout(function() {
          player.bullets = [];
        });
        break;
      case 72:
        player.headGear = cycle(1);
        break;
      case 67:
        player.bikeColor = cycle(2);
    }
  }).on("keyup", function(e) {
    switch(e.which || e.keyCode) {
      case 37:
      case 65:
      case 39:
      case 68:  
        player.mx = 0.5 * player.p;
        break;
      case 32:
      case 88:
        if (!player.holstered) {
          if (player.isGun) {
            if (player.bullets.length < player.magSize)
              switch(player.weapon) {
                case "Pistol":
                case "Sniper Rifle":
                  player.fireRound();
                  break;
                case "Shotgun":
                  for (let i = -1; i <= 1; i++)
                    player.fireRound(i);
              }
          } else switch(player.weapon) {
            case "Shield":
              let p = player;
              for (let i = enemies.length - 1; i > 0; i--) {
                let e = enemies[i];
                if ((e.x - e.s < p.x + 4 * p.s + p.s / 10 && e.x - e.s > p.x + 4 * p.s - p.s / 10) ||
                   (e.x + e.s > p.x - 4 * p.s - p.s / 10 && e.x + e.s < p.x - 4 * p.s + p.s / 10)) {
                  e.p = p.p;
                  e.turnedAway = true;
                  break;
                }
              }
          }
        }
        break;
      case 82:
        if (player.bullets.length > 0) {
          player.holstered = true;
          setTimeout(function() {
            player.bullets = [];
            player.holstered = false;
          }, player.reloadTime);
        }
    }
  });
}());