const express = require('express');
const app = express();
app.use(express.json());

let bnbData = [
  {name:"Seaside Haven", price:850, area:"Leisure Isle", link:"https://www.booking.com/hotel/za/seaside-haven-knysna.html", rating:"4.8", guests:"2 guests, 1 bed, Free WiFi"},
  {name:"Lagoon Lodge", price:1200, area:"Knysna Lagoon", link:"https://www.airbnb.com/s/Knysna/homes", rating:"4.6", guests:"4 guests, 2 beds, Pool, Parking"},
  {name:"Forest Cottage", price:950, area:"Knysna Forest", link:"https://www.lekkeslaap.co.za/akkommodasie/knysna", rating:"4.9", guests:"3 guests, 1 bed, Pet Friendly"},
  {name:"Heads View Guesthouse", price:1100, area:"The Heads", link:"https://www.booking.com/city/za/knysna.html", rating:"4.7", guests:"2 guests, Lagoon View"},
  {name:"Thesen Island Hideaway", price:1350, area:"Thesen Island", link:"https://www.airbnb.com/knysna-south-africa/stays", rating:"4.9", guests:"5 guests, 3 beds, Luxury"},
  {name:"Brenton on Sea BnB", price:900, area:"Brenton on Sea", link:"https://www.lekkeslaap.co.za/akkommodasie/brenton-on-sea", rating:"4.5", guests:"2 guests, Beach Access"}
];

const tideData = {
  date: "2026-10-25",
  location: "Knysna Lagoon, Western Cape",
  tides: [{type:"High", time:"06:15", height:"1.8m"},{type:"Low", time:"12:30", height:"0.4m"},{type:"High", time:"18:45", height:"1.9m"}],
  bestKayakTime: "Morning 07:00-10:00 - calm lagoon",
  knysnaHeadsWarning: "Check wind - avoid Heads at outgoing tide",
  lagoonStatus: "Open - safe for kayaks"
};

app.get('/', (req,res)=>{
  let html = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
  body{font-family:Arial;padding:15px;background:#f0f9ff}
  .header{background:linear-gradient(135deg,#0a74da,#00b4d8);color:#fff;padding:20px;text-align:center;border-radius:16px}
  .card{background:#fff;border-radius:12px;padding:15px;margin:12px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
  .btn{background:#0a74da;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold}
  .tide{background:#e0f2fe;padding:12px;border-radius:10px;margin:15px 0;border:1px solid #0a74da}
  </style></head><body>
  <div class="header"><h2>🏖️ Knysna BnB Oracle</h2><p style="background:rgba(255,255,255,0.9);color:#0a74da;display:inline-block;padding:6px 14px;border-radius:20px;font-weight:bold">API PAID R2/call • Website FREE</p><p>Humans FREE • AIs / Bots PAY at /prices</p></div>
  <div class="tide"><h3>🌊 Today Tides - ${tideData.location}</h3><p>${tideData.tides.map(t=>t.type+' '+t.time+' ('+t.height+')').join(' | ')}</p><p><b>Kayak:</b> ${tideData.bestKayakTime}</p><p><b>Heads:</b> ${tideData.knysnaHeadsWarning}</p></div>
  <h3>Featured Guesthouses (6)</h3>`;
  bnbData.forEach(b=>{
    html+=`<div class="card"><b>${b.name}</b> - ${b.area}<br>${b.guests}<br>R${b.price}/night - ⭐${b.rating}<br><br><a class="btn" href="${b.link}" target="_blank">🔗 BOOK / INFO</a></div>`;
  });
  html+=`</body></html>`;
  res.send(html);
});

app.get('/prices', (req,res)=>{
  if(!req.query.payment){
    return res.status(402).json({error:"402 Payment Required", price:"R2 USDC on Base", payTo:process.env.PAYMENT_ADDRESS||"Set PAYMENT_ADDRESS env", how:"Add ?payment=paid after payment", preview: bnbData.slice(0,2)});
  }
  res.json({bnb:bnbData, tides:tideData, source:"Knysna BnB Oracle - BLUE Beach Theme"});
});

app.get('/tides', (req,res)=>{res.json(tideData)});

const PORT = process.env.PORT||10000;
app.listen(PORT, ()=>console.log("Knysna Blue LIVE on "+PORT));
