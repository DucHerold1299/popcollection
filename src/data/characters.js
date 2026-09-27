// Pop Mart characters and their series, used for suggestions and the browse list.
// This is a starter list, not official or complete. Add a series by adding it to the
// character's list, or add a new character as { name: "...", series: [ ... ] }.
export const CHARACTERS = [
  { name: "Labubu", series: ["The Monsters – Tasty Macarons", "The Monsters – Exciting Macaron", "The Monsters – Have a Seat", "The Monsters – Big into Energy", "The Monsters – Let's Checkmate", "The Monsters – Fall in Wild", "The Monsters – Almost Hidden"] },
  { name: "Zimomo", series: ["The Monsters – Zimomo"] },
  { name: "Nyota", series: ["Nyota's Fluffy Life", "Nyota Growing up by Your Way", "Nyota I Am the Seasons", "Nyota We are All Stars", "Nyota Where Moments Meet (Plush Pendant)", "Nyota × Chibi Maruko"] },
  { name: "Skullpanda", series: ["Skullpanda – The Sound", "Skullpanda – Everyday Wonderland", "Skullpanda – Tell Me What You Want", "Skullpanda – Winter Symphony", "Skullpanda – The Ink Plum Blossom", "Skullpanda – Image of Reality", "Skullpanda – Warmth"] },
  { name: "Hirono", series: ["Hirono – Mime", "Hirono – Reshape", "Hirono – Little Mischief", "Hirono – Echo", "Hirono – The Other One", "Hirono – City of Mercy", "Hirono × Le Petit Prince", "Hirono – Living Wild (Plush)"] },
  { name: "Crybaby", series: ["Crybaby – Sad Club", "Crybaby – Crying Again", "Crybaby – Crying for Love", "Crybaby – Crying in the Woods", "Crybaby × Powerpuff Girls"] },
  { name: "Molly", series: ["Molly – Career", "Molly – Anniversary Statues", "Baby Molly – When I Was Three", "Baby Molly & Baby Tabby (Pinch Pendant)"] },
  { name: "Dimoo", series: ["Dimoo – World", "Dimoo – Weaving Wonders", "Dimoo – Aquarium", "Dimoo – Dating", "Dimoo – No One's Gonna Sleep Tonight"] },
  { name: "Hacipupu", series: ["Hacipupu – Snuggle with You", "Hacipupu × Crayon Shin-chan – One Day in Kasukabe", "Hacipupu – The Constellation"] },
  { name: "Pucky", series: ["Pucky – Sleeping Babies", "Pucky – The Feast"] },
  { name: "Azura", series: ["Azura – Natural Elements", "Azura – Fantasy"] },
  { name: "Kubo", series: ["Kubo – Glimmering Glee"] },
  { name: "Twinkle Twinkle", series: ["Twinkle Twinkle – Be a Little Star"] },
  { name: "Sweet Bean", series: ["Sweet Bean – Supermarket"] },
  { name: "Duckoo", series: ["Duckoo – Weekend"] },
  { name: "Satyr Rory", series: ["Satyr Rory – Fairy Tale"] },
  { name: "Inosoul", series: ["Inosoul – Lonely Planet"] },
  { name: "Zsiga", series: ["Zsiga – We're So Cute"] },
  { name: "Yuki", series: ["Yuki – Sweet Dreams"] },
  { name: "Bobo & Coco", series: ["Bobo & Coco – Little Things"] },
  { name: "Peach Riot", series: ["Peach Riot – Rise Up"] },
];
export const SERIES_LIST = CHARACTERS.flatMap((c) => c.series.map((series) => ({ character: c.name, series })));
