const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = "Knysna2026!";

let houses = [];
try {
  if (fs.existsSync('houses.json')) {
    houses = JSON.parse(fs.readFileSync('houses.json','utf8'));
    console.log("✅ Loaded", houses.length, "houses");
  }
} catch(e){ console.log("No file yet"); }

if (houses.length === 0) {
  houses = [
    {id:1, name:"Villa Afrikana Guest Suites", location:"Knysna Heads - Lagoon View", guests:2, beds:1, basePrice:1850, rating:5.0, image:"🏖️", link:"https://www.booking.com/searchresults.html?ss=Villa+Afrikana+Knysna", desc:"Top rated 10.0 - Lagoon & Heads views"},
    {id:2, name:"Amanzi Island Boutique Hotel", location:"Thesen Island", guests:2, beds:1, basePrice:2100, rating:4.9, image:"🏝️", link:"https://www.booking.com/searchresults.html?ss=Amanzi+Island+Knysna", desc:"Boutique luxury on Thesen Island"},
    {id:3, name:"Knysna Manor House", location:"Knysna Central", guests:4, beds:2, basePrice:950, rating:4.8, image:"🏛️", link:"https://www.booking.com/searchresults.html?ss=Knysna+Manor+House", desc:"100-year old Victorian mansion"},
    {id:4, name:"Overmeer Guest House", location:"Leisure Isle", guests:2, beds:1, basePrice:1100, rating:4.7, image:"🌊", link:"https://www.booking.com/searchresults.html?ss=Overmeer+Guest+House+Knysna", desc:"Panoramic lagoon views"},
    {id:5, name:"Pezula Nature Retreat", location:"Pezula Estate", guests:6, beds:4, basePrice:3200, rating:4.9, image:"🌲", link:"https://www.booking.com/searchresults.html?ss=Pezula+Nature+Retreat", desc:"5-star forest & golf estate"},
    {id:6, name:"Headlands House Guest Lodge", location:"The Heads", guests:2, beds:1, basePrice:1350, rating:4.8, image:"🏔️", link:"https://www.booking.com/searchresults.html?ss=Headlands+House+Knysna", desc:"Extraordinary Heads views"}
  ];
}

function saveHouses(){
  try { fs.writeFileSync('houses.json', JSON.stringify(houses, null, 2)); console.log("💾 Saved"); } catch(e){ console.error("Save failed"); }
}

function getPrice(h){
  let p=h.basePrice; let m=new Date().getMonth()+1; let d=new Date().getDay();
  if(m==12||m==1) p*=1.4; else if(m>=5&&m<=8) p*=0.85;
  if(d==5||d==6) p*=1.25;
  return Math.round(p);
}

app.get('/', (req,res)=>{
  let cards = houses.map(h=>`<div style="background:white;border-radius:16px;padding:16px;margin:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);width:300px;display:inline-block;vertical-align:top"><div style="font-size:40px;text-align:center">${h.image}</div><h3>${h.name}</h3><p style="color:#666;font-size:14px">📍 ${h.location} • ⭐ ${h.rating}</p><p style="font-size:13px">${h.desc}</p><p>👥 ${h.guests} • 🛏️ ${h.beds}</p><p style="font-weight:bold;font-size:18px">R${getPrice(h)}/night</p><a href="${h.link}" target="_blank" style="display:block;background:#003580;color:white;text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:bold">BOOK ON BOOKING.COM</a></div>`).join('');
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Knysna BnB Oracle</title></head><body style="font-family:sans-serif;background:#f0f8ff;margin:0;padding:16px;text-align:center"><h1>🏡 Knysna BnB Oracle</h1><p>🌊 Real Booking.com links • AI-Powered</p><div>${cards}</div><p><a href="/admin">Admin</a> | <a href="/api/houses">API</a></p></body></html>`);
});

app.get('/api/houses', (req,res)=>{ res.json(houses.map(h=>({...h, dynamicPrice:getPrice(h)}))); });

app.get('/admin', (req,res)=>{
  res.send(`<html><body style="font-family:sans-serif;padding:16px;max-width:600px;margin:auto"><h2>Admin</h2><form method="POST" action="/admin/add"><input name="name" placeholder="Name" required style="width:100%;padding:8px;margin:4px 0"><input name="location" placeholder="Location" required style="width:100%;padding:8px;margin:4px 0"><input name="guests" type="number" placeholder="Guests" required style="width:48%;padding:8px"><input name="beds" type="number" placeholder="Beds" required style="width:48%;padding:8px"><input name="basePrice" type="number" placeholder="Base Price" required style="width:48%;padding:8px"><input name="rating" type="number" step="0.1" placeholder="Rating" required style="width:48%;padding:8px"><input name="image" placeholder="Emoji" style="width:48%;padding:8px"><input name="link" placeholder="Booking.com link" required style="width:100%;padding:8px;margin:4px 0"><textarea name="desc" placeholder="Description" style="width:100%;padding:8px"></textarea><input name="password" type="password" placeholder="Password Knysna2026!" required style="width:100%;padding:8px;margin:4px 0"><button style="width:100%;padding:10px;background:green;color:white">Add BnB</button></form><hr><a href="/export"><button>EXPORT houses.json</button></a><p>Houses: ${houses.length}</p><p><a href="/">Back to site</a></p></body></html>`);
});

app.post('/admin/add', (req,res)=>{
  if(req.body.password !== ADMIN_PASSWORD) return res.send("Wrong password");
  houses.push({id:Date.now(), name:req.body.name, location:req.body.location, guests:parseInt(req.body.guests), beds:parseInt(req.body.beds), basePrice:parseInt(req.body.basePrice), rating:parseFloat(req.body.rating), image:req.body.image||"🏡", link:req.body.link, desc:req.body.desc});
  saveHouses();
  res.redirect('/');
});

app.get('/export', (req,res)=>{
  res.setHeader('Content-disposition','attachment; filename=houses.json');
  res.setHeader('Content-type','application/json');
  res.send(JSON.stringify(houses,null,2));
});

app.listen(PORT, ()=>console.log("Knysna Oracle live on", PORT));
