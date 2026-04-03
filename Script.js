if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW failed", err));
}
let index = 0;
let coins = 0;
let unlocked = false;

/* SOUNDS */
const correct = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const wrong = new Audio("https://actions.google.com/sounds/v1/cartoon/boing.ogg");
const cheer = new Audio("https://actions.google.com/sounds/v1/human_voices/cheer.ogg");

/* unlock audio */
document.addEventListener("click", () => {
  if (!unlocked) {
    correct.play().then(()=>correct.pause());
    wrong.play().then(()=>wrong.pause());
    cheer.play().then(()=>cheer.pause());
    unlocked = true;
  }
}, { once:true });

function play(s){
  try{
    s.currentTime=0;
    s.play();
  }catch(e){}
}

/* SPEECH */
function speak(text){
  let msg = new SpeechSynthesisUtterance(text);
  msg.rate=0.9;
  msg.pitch=1.2;
  speechSynthesis.speak(msg);
}

/* CONFETTI */
function confetti(){
  const c=document.getElementById("confetti");
  const ctx=c.getContext("2d");

  c.width=innerWidth;
  c.height=innerHeight;

  let p=[];
  for(let i=0;i<80;i++){
    p.push({x:Math.random()*c.width,y:Math.random()*c.height,r:3+Math.random()*5,d:2+Math.random()*4});
  }

  let f=0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle="gold";

    p.forEach(b=>{
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
      b.y+=b.d;
      if(b.y>c.height)b.y=0;
    });

    if(f++<80) requestAnimationFrame(draw);
  }
  draw();
}

/* GAME DATA */
const game=[
 {icon:"🐶",q:"Dog eats?",opt:["Chocolate","Dog Food","Plastic"],ans:1,fact:"Dogs eat healthy dog food."},
 {icon:"🐄",q:"Cow eats?",opt:["Grass","Meat","Candy"],ans:0,fact:"Cows eat grass."},
 {icon:"🦁",q:"Lion eats?",opt:["Meat","Grass","Fruit"],ans:0,fact:"Lion is carnivore."},
 {icon:"🐰",q:"Rabbit eats?",opt:["Carrot","Chicken","Fish"],ans:0,fact:"Rabbits love carrots."},
 {icon:"🐘",q:"Elephant eats?",opt:["Grass","Meat","Candy"],ans:0,fact:"Elephants eat plants."},
 {icon:"🐒",q:"Monkey eats?",opt:["Banana","Stone","Plastic"],ans:0,fact:"Monkeys eat fruits."},
 {icon:"🐟",q:"Fish eats?",opt:["Worms","Bread","Chocolate"],ans:0,fact:"Fish eat worms."},
 {icon:"🐔",q:"Hen eats?",opt:["Grains","Meat","Ice cream"],ans:0,fact:"Hens eat grains."},
 {icon:"🐸",q:"Frog eats?",opt:["Insects","Rice","Milk"],ans:0,fact:"Frogs eat insects."},
 {icon:"🐢",q:"Turtle eats?",opt:["Plants","Burger","Candy"],ans:0,fact:"Turtles eat plants."},
 {icon:"🦒",q:"Giraffe eats?",opt:["Leaves","Meat","Fish"],ans:0,fact:"Giraffes eat leaves."},
 {icon:"🐼",q:"Panda eats?",opt:["Bamboo","Chicken","Fish"],ans:0,fact:"Pandas eat bamboo."},
 {icon:"🦊",q:"Fox eats?",opt:["Meat","Grass","Milk"],ans:0,fact:"Foxes hunt animals."},
 {icon:"🐍",q:"Snake eats?",opt:["Rats","Grass","Fruit"],ans:0,fact:"Snakes eat rats."},
 {icon:"🐧",q:"Penguin eats?",opt:["Fish","Leaves","Bread"],ans:0,fact:"Penguins eat fish."}
];

/* SCREEN CONTROL */
function show(id){
  ["splash","home","game","shop"].forEach(x=>{
    document.getElementById(x).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

/* FIXED START (IMPORTANT) */
window.onload=function(){
  setTimeout(()=>show("home"),1500);
}

function startGame(){
  index=0;
  coins=0;
  show("game");
  render();
}

function openShop(){ show("shop"); }
function backHome(){ show("home"); }

/* RENDER */
function render(){
  let q=game[index];

  document.getElementById("game").innerHTML=`
  <div class="card">

    <div class="topbar">
      <div>Level ${index+1}/${game.length}</div>
      <div>🪙 ${coins}</div>
    </div>

    <h1>${q.icon}</h1>
    <h3>${q.q}</h3>

    ${q.opt.map((o,i)=>`
      <button onclick="check(${i})">${o}</button>
    `).join("")}

    <div class="fact">🌟 ${q.fact}</div>

  </div>`;
}

/* CHECK */
function check(i){
  let q = game[index];

  if(i === q.answer){
    
    playSound("correct");

    setTimeout(() => {
      nextQuestion();
    }, 1000);

  } else {

    playSound("wrong");

  }
}
/* NEXT */
function next(){
  index++;
  if(index<game.length) render();
  else{
    document.getElementById("game").innerHTML=`
    <div class="card">
      <h1>🏆</h1>
      <h2>Completed!</h2>
      <h3>Coins: ${coins}</h3>
      <button onclick="location.reload()">Play Again</button>
    </div>`;
  }
}
