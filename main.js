window.onload = main;
const $ = name => document.querySelector(name);
const wait = time => new Promise(res => setTimeout(res, time));
const random = (min, max) => Math.random() * (max - min) + min;

async function getJoke() {
    const res = await fetch("https://icanhazdadjoke.com/", {
        headers: {
            accept: "application/json"
        }
    });
    return await res.json();
}

function toggleMode() {
  const el = $(".character img");
  if(el.src.includes("talking")) {
    el.src = "./assets/waiting.png";
    $(".character").style.left = "10vh";
  } else {
    el.src = "./assets/talking.png";
    $(".character").style.left = "0";
  }
}

function toggleText() {
  const el = $(".bubble");
  if(el.style.display === "flex") {
    el.style.display = "none";
  } else {
    el.style.display = "flex";
  }
}

function createCloud() {
  const cloud = document.createElement("div");
  cloud.className = "cloud";
  const img = document.createElement("img");
  cloud.append(img);
  const index = (Math.random() < 0.5) + 1;
  img.src = `./assets/cloud${index}.png`;
  img.style.height = "100%";
  
  const randomize = () => {
    // restart animation
    cloud.style.animation = 'none';
    cloud.offsetHeight; /* trigger reflow */
    cloud.style.animation = null;
    
    // randomize
    cloud.style.height = `${Math.random() * 100}%`;
    cloud.style.top = `${Math.random() * 100}%`;
    const duration = random(4, 10);
    cloud.style.animationDuration = `${duration}s`;
  };
  
  randomize();
  cloud.addEventListener("animationend", randomize);
  
  $(".clouds-container").append(cloud);
}

function ellipsesPresent(joke, i) {
  return (joke[i] === '.' && (i + 1 < joke.length) && (joke[i + 1] === '.')); // puncte de suspensie
}

async function processJoke(joke) {
  toggleMode();
  toggleText();
  const display = $(".display");
  for(let i = 0; i < joke.length; ++i) {
    display.innerHTML += joke[i];
    if(!ellipsesPresent(joke, i) && ".!?".includes(joke[i]) && i < joke.length - 1) {
      toggleMode();
      await wait(1000);
      toggleMode();
    }
    await wait(50);
  }
  toggleMode();
  await wait(2000);
  toggleText();
  display.innerHTML = "";
}

async function main() {
  for(let i = 0; i < 4; ++i) {
    createCloud();
  }
  
  while(true) {
    const res = await getJoke();
    if(res.status === 200) {
      await processJoke(res.joke);
      await wait(1000);
    }
  }
}