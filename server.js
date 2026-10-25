const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const ADMIN_PASSWORD = "Knysna2026!";

// AUTO-LOAD from file if exists
let houses = [
  {id:1, name:"Seaside Haven", location:"Leisure Isle", guests:4, beds:2, basePrice:850, rating:4.8, image:"🏖️", link:"#", desc:"Stunning lagoon views, 2 min walk to beach"},
  {id:2, name:"Lagoon Lodge", location:"Knysna Lagoon", guests:6, beds:3, basePrice:1200, rating:4.6, image:"🏞️", link:"#", desc:"Perfect for families, braai area & lagoon access"},
  {id:3, name:"Forest Cottage", location:"Knysna Forest", guests:2, beds:1, basePrice:950, rating:4.9, image:"🌲", link:"#", desc:"Romantic forest escape, birds & quiet"},
  {id:4, name:"Heads View", location:"The Heads", guests:4, beds:2, basePrice:1100, rating:4.7, image:"🏔️", link:"#", desc:"Breathtaking Heads view"},
  {id:5, name:"Thesen Island", location:"Thesen Island", guests:3, beds:2, basePrice:1350, rating:4.9, image:"🏝️", link:"#", desc:"Luxury island living"},
  {id:6, name:"Brenton on Sea", location:"Brenton on Sea", guests:2, beds:1, basePrice:900, rating:4.5, image:"🌊", link:"#", desc:"Beachfront bliss"}
];

if (fs.existsSync('houses.json')) {
  try { houses = JSON.parse(fs.readFileSync('houses.json','utf8')); console.log("✅ Auto-loaded", houses.length, "houses"); } catch(e){}
}

function saveHouses(){
  try { fs.writeFileSync('houses.json', JSON.stringify(houses, null, 2)); console.log("💾 Auto-saved"); } catch(e){ console.log("Save failed", e); }
}

function getPrice(h){let p=h.basePrice;let m=new Date().getMonth()+1;let d=new Date().getDay();if(m==12||m==1)p*=1.4;else if(m>=5&&m<=8)p*=0.85;if(d==5||d==6)p*=1.25;return Math.round(p);}

app.get('/', (req,res)=>{
  let html=`<html><head><meta name="viewport" content="width=device-width"><style>
  body{font-family:sans-serif;padding:15px;background:#f0f8ff;margin:0}
  .header{background:white;padding:15px;border-radius:12px;margin-bottom:15px}
  .card{background:white;border-radius:12px;padding:15px;margin-bottom:15px}
  .price{font-weight:bold;color:#0a7;font-size:20px}
  .base{color:#888;font-size:14px}
  button{background:#007bff;color:white;padding:12px;border:none;border-radius:8px;width:100%;margin-top:10px;font-weight:bold}
  .badge{background:#e3f2fd;padding:6px 10px;border-radius:12px;font-size:13px;margin-right:5px}
  .tide{background:#fff3cd;padding:10px;border-radius:8px;margin:10px 0}
  .desc{color:#555;margin:8px 0;font-size:14px}
  </style></head><body>
  <div class="header"><h2>🏡 Knysna BnB Oracle</h2><div class="tide">🌊 Tides: High 06:15 | Low 12:30 - Knysna Lagoon</div></div>`;
  houses.forEach(h=>{
    html+=`<div class="card"><div style="font-size:40px">${h.image}</div><b style="font-size:18px">${h.name} - ${h.location}</b><br>
    <div style="margin:8px 0"><span class="badge">📍 ${h.location}</span> <span class="badge">👥 ${h.guests} Guests</span> <span class="badge">🛏️ ${h.beds} beds</span> <span class="badge">⭐ ${h.rating}</span></div>
    <div class="desc">${h.desc}</div>
    <div><span class="price">R${getPrice(h)}/night</span> <span class="base">(Base R${h.basePrice})</span></div>
    <a href="${h.link}" target="_blank"><button>🔗 BOOK / INFO ON BOOKING.COM</button></a></div>`;
  });
  html+=`</body></html>`; res.send(html);
});

app.get('/export', (req,res)=>{
  res.setHeader('Content-disposition','attachment; filename=knysna-backup.json');
  res.setHeader('Content-type','application/json');
  res.send(JSON.stringify(houses, null, 2));
});

app.get('/admin',(req,res)=>{
  res.send(`<html><body style="font-family:sans-serif;padding:20px"><h2>🔐 Admin Login</h2><form method="POST" action="/admin"><input type="password" name="password" placeholder="Password"><button>Login</button></form></body></html>`);
});

app.post('/admin',(req,res)=>{
  if(req.body.password!==ADMIN_PASSWORD) return res.send("Wrong - <a href='/admin'>Try again</a>");
  let html=`<html><head><meta name="viewport" content="width=device-width"></head><body style="font-family:sans-serif;padding:15px">
  <h2>🏡 Manage BnBs - AUTO-SAVE ON</h2><a href="/">View Public Site</a> | <a href="/export" style="background:#0a7;color:white;padding:8px 12px;border-radius:6px;text-decoration:none">📥 EXPORT Backup</a><br><br>
  <div style="background:#d4edda;padding:10px;border-radius:8px">✅ Auto-save active - houses saved to file automatically!</div><br>
  <div style="background:#fff3cd;padding:12px;border-radius:8px;border:2px solid orange"><b>RESTORE Backup (only if deploy wipes):</b><br><input type="file" id="fileInput" accept=".json"><button onclick="doImport()" style="background:orange;padding:8px 12px;border:none;border-radius:6px;margin-top:5px;font-weight:bold">IMPORT RESTORE</button></div>
  <script>
  async function doImport(){
    const file=document.getElementById('fileInput').files[0];
    if(!file){alert('Choose file first');return;}
    const text=await file.text();
    const data=JSON.parse(text);
    const res=await fetch('/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'${ADMIN_PASSWORD}', houses:data})});
    if(res.ok){alert('RESTORED! '+data.length+' BnBs'); location.reload();} else alert('Failed');
  }
  </script>
  <br><h3>➕ Add New BnB</h3><form method="POST" action="/add" style="background:#e8f5e9;padding:15px;border-radius:8px">
  <input type="hidden" name="password" value="${ADMIN_PASSWORD}">
  Name: <input name="name" required style="width:100%;margin:5px 0"><br>
  Location: <input name="location" required style="width:100%;margin:5px 0"><br>
  Guests: <input type="number" name="guests" value="4" style="width:60px"> Beds: <input type="number" name="beds" value="2" style="width:60px"><br>
  Base Price: R<input type="number" name="basePrice" value="1000" style="width:80px"><br>
  Emoji: <input name="image" value="🏡" style="width:60px"> Link: <input name="link" value="#" style="width:200px"><br>
  Desc: <input name="desc" value="Lovely place" style="width:100%;margin:5px 0"><br>
  <button style="background:blue;color:white;padding:8px 15px;border:none;border-radius:6px;margin-top:10px">➕ ADD BNB</button></form><br><hr><h3>💰 Update / Delete - ${houses.length} BnBs</h3>`;
  houses.forEach(h=>{
    html+=`<div style="border:1px solid #ddd;padding:12px;margin:8px 0;border-radius:8px;background:#f9f9f9"><b>${h.id}. ${h.name}</b> - ${h.location}<br>Base: R<input type="number" id="bp${h.id}" value="${h.basePrice}" style="width:80px"> → Customer sees R${getPrice(h)}/night<br>
    <form method="POST" action="/update" style="display:inline"><input type="hidden" name="id" value="${h.id}"><input type="hidden" name="password" value="${ADMIN_PASSWORD}"><input type="hidden" name="basePrice" id="hidden${h.id}" value="${h.basePrice}"><button onclick="document.getElementById('hidden${h.id}').value=document.getElementById('bp${h.id}').value" style="background:green;color:white;padding:6px 12px;border:none;border-radius:6px;margin-top:5px">💾 Save Price</button></form>
    <form method="POST" action="/delete" style="display:inline;margin-left:10px"><input type="hidden" name="id" value="${h.id}"><input type="hidden" name="password" value="${ADMIN_PASSWORD}"><button style="background:red;color:white;padding:6px 12px;border:none;border-radius:6px">🗑️ Delete</button></form></div>`;
  });
  html+=`</body></html>`; res.send(html);
});

app.post('/import',(req,res)=>{
  if(req.body.password!==ADMIN_PASSWORD) return res.status(403).send("Nope");
  if(Array.isArray(req.body.houses)){ houses=req.body.houses; saveHouses(); return res.send("OK");}
  res.status(400).send("Bad data");
});

app.post('/update',(req,res)=>{if(req.body.password!==ADMIN_PASSWORD)return res.send("Nope");const h=houses.find(x=>x.id==req.body.id);if(h){h.basePrice=parseInt(req.body.basePrice); saveHouses();} res.redirect('/admin');});
app.post('/add',(req,res)=>{if(req.body.password!==ADMIN_PASSWORD)return res.send("Nope");let newId=houses.length>0?Math.max(...houses.map(x=>x.id))+1:1;houses.push({id:newId,name:req.body.name,location:req.body.location,guests:parseInt(req.body.guests),beds:parseInt(req.body.beds),basePrice:parseInt(req.body.basePrice),rating:4.8,image:req.body.image||"🏡",link:req.body.link||"#",desc:req.body.desc||""}); saveHouses(); res.redirect('/admin');});
app.post('/delete',(req,res)=>{if(req.body.password!==ADMIN_PASSWORD)return res.send("Nope");houses=houses.filter(x=>x.id!=req.body.id); saveHouses(); res.redirect('/admin');});
app.listen(process.env.PORT||10000);
