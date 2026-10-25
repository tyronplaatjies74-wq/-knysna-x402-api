const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = "Knysna2026!";

// === PERSISTENT LOAD ===
let houses = [];
try {
  if (fs.existsSync('houses.json')) {
    houses = JSON.parse(fs.readFileSync('houses.json','utf8'));
    console.log("✅ Loaded", houses.length, "houses from houses.json");
  }
} catch(e){ console.log("No file yet"); }

if (houses.length === 0) {
  houses = [
    {id:1, name:"Villa Afrikana Guest Suites", location:"Knysna Heads - Lagoon View", guests:2, beds:1, basePrice:1850, rating:5.0, image:"🏖️", link:"https://www.booking.com/searchresults.html?ss=Villa+Afrikana+Knysna", desc:"Top rated 10.0 - Lagoon & Heads views, luxury suites, staff 10/10"},
    {id:2, name:"Amanzi Island Boutique Hotel", location:"Thesen Island", guests:2, beds:1, basePrice:2100, rating:4.9, image:"🏝️", link:"https://www.booking.com/searchresults.html?ss=Amanzi+Island+Knysna", desc:"Boutique luxury on Thesen Island, private jetties & lagoon access"},
    {id:3, name:"Knysna Manor House", location:"Knysna Central", guests:4, beds:2, basePrice:950, rating:4.8, image:"🏛️", link:"https://www.booking.com/searchresults.html?ss=Knysna+Manor+House", desc:"100-year old Victorian mansion, lagoon views, garden"},
    {id:4, name:"Overmeer Guest House", location:"Leisure Isle", guests:2, beds:1, basePrice:1100, rating:4.7, image:"🌊", link:"https://www.booking.com/searchresults.html?ss=Overmeer+Guest+House+Knysna", desc:"Panoramic lagoon views, balcony rooms, forest walks"},
    {id:5, name:"Pezula Nature Retreat", location:"Pezula Estate", guests:6, beds:4, basePrice:3200, rating:4.9, image:"🌲", link:"https://www.booking.com/searchresults.html?ss=Pezula+Nature+Retreat", desc:"5-star forest & golf estate retreat, spa & pool"},
    {id:6, name:"Headlands House Guest Lodge", location:"The Heads", guests:2, beds:1, basePrice:1350, rating:4.8, image:"🏔️", link:"https://www.booking.com/searchresults.html?ss=Headlands+House+Knysna", desc:"Extraordinary Heads views, host Debbie - Extraordinary!"}
  ];
}

function saveHouses(){
  try { 
    fs.writeFileSync('houses.json', JSON.stringify(houses, null, 2));
    console.log("💾 Saved houses.json");
  } catch(e){ console.error("Save failed", e.message); }
}

function getPrice(h){
