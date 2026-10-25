const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const ADMIN_PASSWORD = "Knysna2026!";
let houses = [
  {id:1, name:"Seaside Haven", location:"Leisure Isle", guests:4, beds:2, basePrice:850, rating:4.8, image:"🏖️", link:"#", desc:"Lagoon views"},
  {id:2, name:"Lagoon Lodge", location:"Knysna Lagoon", guests:6, beds:3, basePrice:1200, rating:4.6, image:"🏞️", link:"#", desc:"Families"},
  {id:3, name:"Forest Cottage", location:"Knysna Forest", guests:2, beds:1, basePrice:950, rating:4.9, image:"🌲", link:"#", desc:"Forest escape"},
  {id:4, name:"Heads View", location:"The Heads", guests:4, beds:2, basePrice:1100, rating:4.7, image:"🏔️", link:"#", desc:"Heads view"},
  {id:5, name:"Thesen Island", location:"Thesen Island", guests:3, beds:2, basePrice:1350, rating:4.9, image:"🏝️", link:"#", desc:"Luxury"},
  {id:6, name:"Brenton on Sea", location:"Brenton on Sea", guests:2, beds:1, basePrice:900, rating:4.5, image:"🌊", link:"#", desc:"Beachfront"}
];
function getPrice(h){
  let p=h.basePrice; let d=new Date(); let m=d.getMonth()+1; let day=d.getDay();
  if(m==12||m==1) p*=1.4; else if(m>=5&&m<=8) p*=0.85;
  if(day==5||day==6) p*=1.25;
  return Math.round(p);
}
app.get('/', (req,res)=>{
  let html=`<html><head><meta name="viewport" content="width=device-width"><style>
  body{font-family:sans-serif;padding:15px;background:#f0f8ff;margin:0}
  .header{background:white;padding:15px;border-radius:12px;margin-bottom:15px}
  .card{background:white;border-radius:12px;padding:15px;margin-bottom:15px}
  .price{font-weight:bold;color:#0a7;font-size:18px}
  button{background:#007bff;color:white;padding:10px;border:none;border-radius:8px;width:100%;margin-top:10px}
  .badge{background:#e3f2fd;padding:4px 8px;border-radius:12px;font-size:12px}
  .tide{background:#fff3cd;padding:10px;border-radius:8px;margin:10px 0}
  </style></head><body>
  <div class="header"><h2>🏡 Knysna BnB Oracle</h2><div class="tide">🌊 Tides: High 06:15 | Low 12:30</div></div>`;
  houses.forEach(h=>{
    html+=`<div class="card"><div style="font-size:40px">${h.image}</div><b>${h.name}</b><br><span class="badge">${h.location}</span> <span class="price">R${getPrice(h)}/night</span><br><a href="${h.link}" target="_blank"><button>🔗 BOOK</button></a></div>`;
  });
  html+=`</body></html>`; res.send(html);
});
