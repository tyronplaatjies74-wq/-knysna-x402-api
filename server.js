const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true}));

const ADMIN_PASSWORD = "Knysna2026!"; // CHANGE THIS TO YOUR SECRET

let houses = [
  {id:1, name:"Seaside Haven - Leisure Isle", location:"Leisure Isle", basePrice:850},
  {id:2, name:"Lagoon Lodge", location:"Lagoon", basePrice:1200},
  {id:3, name:"Forest Cottage", location:"Forest", basePrice:950},
  {id:4, name:"Heads View", location:"The Heads", basePrice:1100},
  {id:5, name:"Thesen Island", location:"Thesen Island", basePrice:1350},
  {id:6, name:"Brenton on Sea", location:"Brenton", basePrice:900}
];

function getPrice(h){
  let p=h.basePrice; let d=new Date(); let m=d.getMonth()+1; let day=d.getDay();
  if(m==12||m==1) p*=1.4; else if(m>=5&&m<=8) p*=0.85;
  if(day==5||day==6) p*=1.25;
  return Math.round(p);
}

// PUBLIC - NO ADMIN BUTTON
app.get('/', (req,res)=>{
  let html=`<h2>🏡 Knysna BnB Oracle</h2>`;
  houses.forEach(h=>{html+=`<div style="border:1px solid #ccc;padding:10px;margin:10px">${h.name} - R${getPrice(h)}/night <small>(base R${h.basePrice})</small></div>`;});
  res.send(html);
});

// SECRET ADMIN - ONLY YOU KNOW /admin
app.get('/admin',(req,res)=>{
  res.send(`<form method="POST" action="/admin"><input type="password" name="password" placeholder="Password"><button>Login</button></form>`);
});

app.post('/admin',(req,res)=>{
  if(req.body.password!==ADMIN_PASSWORD) return res.send("Wrong password");
  let html=`<h2>💰 Update Prices Only</h2><p>Only you can see this</p>`;
  houses.forEach(h=>{
    html+=`<form method="POST" action="/update" style="margin:10px;padding:10px;border:1px solid #ddd">${h.name}<br>Base Price: R<input type="number" name="basePrice" value="${h.basePrice}" style="width:80px"> → Customer sees R${getPrice(h)}<br><input type="hidden" name="id" value="${h.id}"><input type="hidden" name="password" value="${ADMIN_PASSWORD}"><button>💾 Save Price</button></form>`;
  });
  res.send(html);
});

app.post('/update',(req,res)=>{
  if(req.body.password!==ADMIN_PASSWORD) return res.send("Nope");
  const h=houses.find(x=>x.id==req.body.id);
  if(h) h.basePrice=parseInt(req.body.basePrice);
  res.redirect('/admin');
});

app.listen(process.env.PORT||10000);
