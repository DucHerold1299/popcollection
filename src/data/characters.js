// Pop Mart characters, their series and the figures in each series.
// Used for the "Browse Pop Mart" list and the suggestions while typing a figure name.
//
// How to edit:
// - Add a series:   { name: "Nyota – New Series", figures: ["Figure A", "Figure B"], secrets: ["Secret figure"] }
// - No figure list? Leave figures/secrets out: picking the series then lets you type the figure's name.
// - A figure is saved as "Character – Figure" (e.g. "Nyota – Wishing Star").
//
// Figure names were collected in September 2026 from popmart.com, collector sites (hironoworld, crybabyworld,
// skullpandaworld, The Toy Pool) and retailers (Toysez, Art Toy Familia, Artoyz). Not official or complete.

export const CHARACTERS = [
  { name: "Labubu", series: [
    { name: "The Monsters – Exciting Macaron", figures: ["Soymilk", "Lychee Berry", "Green Grape", "Sea Salt Coconut", "Toffee", "Sesame Bean"], secrets: ["Chestnut Cocoa"] },
    { name: "The Monsters – Have a Seat", figures: ["Sisi", "Hehe", "Baba", "Zizi", "Ququ", "Dada"], secrets: ["Duoduo"] },
    { name: "The Monsters – Big into Energy", figures: ["Hope", "Happiness", "Love", "Serenity", "Luck", "Loyalty"], secrets: ["ID"] },
    { name: "The Monsters – Let's Checkmate", figures: ["King", "Queen", "Knight", "Bishop", "Rook", "Pawn"], secrets: ["Bond"] },
    { name: "The Monsters – Almost Hidden", figures: ["Canned Pineapple", "Lamp", "Sculpture", "Fire Hydrant", "Tree House", "Flask", "Traffic Light", "Flower Pot", "Spray Can", "Bread Bag", "Mailbox", "Cactus"], secrets: ["Kiddie Ride"] },
    { name: "The Monsters – Fall in Wild (Plush)" },
  ] },
  { name: "Zimomo", series: [
    { name: "Zimomo – I Found You (Plush)" },
    { name: "Zimomo – Angel in Clouds (Plush)" },
    { name: "Zimomo – 10th Anniversary (Plush)" },
  ] },
  { name: "Nyota", series: [
    { name: "Nyota's Fluffy Life", figures: ["Home", "Calling", "Brave Together", "Warm Sunlight", "Unknown Road", "Our Secret", "Little Mountain", "See Love", "Kitten Hug", "A Brief Escape", "Lost Star", "Daze"], secrets: ["Cotton Candy Daydream"] },
    { name: "Nyota Growing up by Your Way", figures: ["Road", "Thinking", "Feeling", "Friends", "Into My Heart", "Dream", "Hi", "Poem", "Growing Up", "Childhood", "Time", "Hidden Love"], secrets: ["Fly to Your Own Mountain"] },
    { name: "Nyota I Am the Seasons", figures: ["Genesis", "Spring Wisteria", "Bamboo After Rain", "Summer Murmurs", "Blue Skies Ahead", "Sun Seeker", "Autumn Glow", "Hidden in Autumn", "Forest Tapestry", "Snowfall Bliss", "Life of Leisure", "Cloud Watcher"], secrets: ["Walking into Spring"] },
    { name: "Nyota We are All Stars", figures: ["Melody Star", "Halo Star", "Life-bearing Star", "Bounty Star", "Wayfinder Star", "Wishing Star", "Nightlight Star", "Mirrorlight Star", "Meteor Shower", "Reminiscence Star", "Sanctuary Star", "Fable Star"], secrets: ["Dreamcatcher Star"] },
    { name: "Nyota Where Moments Meet (Plush Pendant)", figures: ["Hopscotch", "Hi Lumi", "Happy Harvest", "Star Catcher", "Goodnight Kitty", "3PM", "Let's Draw", "Sunny Nap"], secrets: ["Spring Outing"] },
    { name: "Nyota × Chibi Maruko Chan", figures: ["My Name is Maruko", "Rest Day", "My No.1 Friend", "Eat Well", "The Best Grandpa", "Daydreaming", "I'm Rich", "Focus on Sleep", "Sooo Lucky", "Grow Taller", "That's My Sister", "Marathons Are the Worst"], secrets: ["Here Comes the Wind"] },
  ] },
  { name: "Skullpanda", series: [
    { name: "Skullpanda – The Sound", figures: ["The Joy", "The Anger", "The Serenity", "The Pensiveness", "The Trust", "The Disgust", "The Ecstasy", "The Grief", "The Admiration", "The Terror", "The Vigilance", "The Awe"], secrets: ["The Equilibrium"] },
    { name: "Skullpanda – Everyday Wonderland", figures: ["The Preachy", "The Obedient", "The Cold-Hearted", "The Bold", "The Anxious", "The Fatuous", "The Sleepless", "The Fidgety", "The Timid", "The Lethargic", "The Petulant", "The Sophisticated"], secrets: ["Thing in Itself"] },
    { name: "Skullpanda – Tell Me What You Want", figures: ["Still on the Job", "Fun Ride", "Baking Best Wishes", "Getting Dressed", "Sweetest Rebel", "Let It Snow", "On Schedule", "Home Alone", "Jingle All the Way (Green)"], secrets: ["Jingle All the Way (Red)", "As I Wish"] },
    { name: "Skullpanda – Winter Symphony (Plush)", figures: ["Rock On", "Rhapsody", "Partita", "Wanderer's Tune", "Ode to Cocoa", "Song of Snow"], secrets: ["Symphony of Wishes"] },
    { name: "Skullpanda – The Ink Plum Blossom", figures: ["The Forest", "The Moss", "The Bamboo", "The Snow", "The Wind", "The Bridge", "The Moon", "The Root", "The Valley", "The Spring", "The Scene", "The Courtyard"], secrets: ["The Plum Blossom"] },
    { name: "Skullpanda – Image of Reality", figures: ["The Philosophy", "The Paradox", "The Pivot", "The Disguise", "The Imagination", "The Constraint", "The Soar", "The Timelapse", "The Duality (White)", "The Duality (Black)", "The Merchant", "The Antigravity"], secrets: ["The Onlooker"] },
    { name: "Skullpanda – The Warmth", figures: ["The Raining Day", "The Encounter", "The Day Off", "Enjoy Oneself", "Mind With the Wind", "Doodling", "Wandering", "Recall the Past", "Chirping", "Loosening", "Taste From the Memory", "The Scent"], secrets: ["The Warmth"] },
  ] },
  { name: "Hirono", series: [
    { name: "Hirono – Mime", figures: ["Guardian", "Blind", "Seeker", "Devilry", "Drifter", "Fool", "Unspoken", "Patience", "Prison", "Destroy", "Poem", "Secrecy"], secrets: ["Silent"] },
    { name: "Hirono – Reshape", figures: ["Burst", "Woodcarving", "Fading", "Healing", "Paradise Lost", "Drowning", "Costume", "Parasite", "Voyage"], secrets: ["Puppet"] },
    { name: "Hirono – Little Mischief", figures: ["Ragpicker", "Destroyer", "Robot", "Boiling Frog", "Float", "The Aviator", "Birdman", "Loose Fish", "Pretender", "Persona", "Manacle", "Protector"], secrets: ["Unknown Journey"] },
    { name: "Hirono – Echo", figures: ["Hiding Behind You", "Daydreaming", "Journey in the Rain", "Get Lucky", "Back Off", "Breakout Plan", "Pieces of Memory", "Soul Connection", "Staying Up", "Knight", "Eaten", "Caught You"], secrets: ["Never Growing Up"] },
    { name: "Hirono – The Other One", figures: ["Vagrancy", "Cuckoo", "The Ghost", "Nowhere Safe", "Raving", "Being Alive", "The Monster", "Amnesia", "The Crow", "The Fox", "Staring", "Marionette"], secrets: ["Dreaming"] },
    { name: "Hirono – City of Mercy", figures: ["The Other", "Insight", "Comfortably Numb", "Healer", "Fallen Angel", "Echo", "Wandering (Gift Box)"], secrets: ["Belonging"] },
    { name: "Hirono × Le Petit Prince", figures: ["The Little Prince", "The Rose", "The King", "The Conceited Man", "The Tippler", "The Businessman", "The Lamplighter", "The Geographer", "The Snake", "The Fox", "The Switchman", "The Merchant"], secrets: ["The Pilot", "The Little Prince (Special Edition)"] },
    { name: "Hirono – Living Wild: Fight for Joy (Plush)" },
  ] },
  { name: "Crybaby", series: [
    { name: "Crybaby – Sad Club", figures: ["The Hottest Day of Summer", "Big Cleaning Day", "Withering Flower", "Teardrops on the Pillow", "Sleepless", "Left Behind", "Teardrop Bowl", "Devastated"], secrets: ["A Sad Show"] },
    { name: "Crybaby – Crying Again", figures: ["Baby Brown", "Baby Blonde", "Heartless Girl", "Star Boy", "Love Is Love", "Love Makes Us Cry", "The Robber", "She's Alice", "I'll Give You All My Love", "I'll Bring You a Flower", "What a Frog", "Duck You"], secrets: ["The Robber Red Ver.", "She's Alice Halloween Ver.", "The Queen of Broken Heart"] },
    { name: "Crybaby – Crying for Love", figures: ["Classic Rose", "Unlock Me", "Heart Broken", "Stolen Heart", "Love You Cherry Much", "You're Purr-fect", "Puppy Love", "Stupid Cupid", "Sweet Baby", "Jar of Hearts", "Kiss Kiss Devil Ver.", "Kiss Kiss Angel Ver."], secrets: ["Sparkling Love", "Be Mine"] },
    { name: "Crybaby – Crying in the Woods", figures: ["Boy Scout", "Girl Scout", "Big Bear", "Big Fox", "Tree", "Little Eagle", "Logger", "Raccoon & Friends", "Bush Boy", "Explorer", "Fisherman", "Climber"], secrets: ["The Sacrificial Blonde Ver.", "The Sacrificial Sunflower Ver."] },
    { name: "Crybaby × Powerpuff Girls", figures: ["Blossom", "Bubbles", "Buttercup", "Bunny Blossom", "Bunny Bubbles", "Bunny Buttercup", "Professor Utonium", "Mayor", "Mojo Jojo", "Brushing Teeth Blossom", "Bedtime Bubbles", "Sleep Buttercup"], secrets: ["Princess Morbucks"] },
  ] },
  { name: "Molly", series: [
    { name: "Molly – Career Series 1", figures: ["Firewoman Silvery", "Firewoman Orange", "Racer Orange", "Racer Red", "Sailor Blue", "Sailor White", "Soldier Pink", "Soldier Brown", "Stewardess Blue", "Stewardess Red", "Sashimi Chef Blue", "Sashimi Chef Lake"], secrets: ["Captain"] },
    { name: "Molly – Career Series 2", figures: ["Painter Red", "Painter Green", "Astronaut White", "Astronaut Orange", "Detective Gray", "Detective Brown", "Clown Rainbow", "Clown Classic", "Worker Pink", "Worker Blue", "Cook Red", "Cook Black"], secrets: ["Judge"] },
    { name: "Molly – Anniversary Statues Classical Retro", figures: ["Dino Molly (Red Ver.)", "Dino Molly (Green Ver.)", "Molly & Unicorn (Golden Childhood Ver.)", "Molly & Unicorn (Original Ver.)", "Twinkle Twinkle Little Earth", "Twinkle Twinkle Little Moon", "With You for 12 Years (Original Ver.)", "With You for 12 Years (Special Ver.)", "Love You 2020", "Miss You 2020"], secrets: ["Burglar Molly", "Molly & Unicorn (Wooden Ver.)", "With You for 12 Years (Wooden Ver.)", "Adore You (Wooden Ver.)", "Twinkle Twinkle Little Star (Wooden Ver.)", "Dino Molly (Wooden Ver.)"] },
    { name: "Molly – Anniversary Statues Classical Retro 2", figures: ["You Are Not Alone Rebirth 2006 (Original Ver.)", "You Are Not Alone Rebirth 2006 (Special Ver.)", "Molly M Salute to the Childhood Classic", "Molly D Salute to the Childhood Classic", "My Another Half", "Molly V Salute to the Great Artists", "It's a Beautiful Day (Original Ver.)", "It's a Beautiful Day (Special Ver.)", "Tong Niu Fei Tian (Golden Ver.)", "Tong Niu Fei Tian (Silver Ver.)"], secrets: ["MC Molly", "MC Molly (Black Stone)", "MC Molly (White Stone)"] },
    { name: "Baby Molly – When I Was Three", figures: ["Baby Astronaut", "XXL Crown", "Sing My Song", "Future Pianist", "Big Big World", "Room Exchange", "Share with Me", "Cry Me a River", "Morning Call", "How Old Are You", "Being a Lady", "I Can Handle It"], secrets: ["King of Molly World"] },
    { name: "Baby Molly & Baby Tabby (Pinch Pendant)", figures: ["Milk Lover", "Face the Storm", "Furry Brush", "Sneak a Bite", "Come Under the Umbrella", "Together to the Kindergarten"], secrets: ["The New King"] },
  ] },
  { name: "Dimoo", series: [
    { name: "Dimoo World × Disney", figures: ["Minnie's Balloon", "Mickey TV Show", "Three Nephews", "Daisy's Gift", "Donald Duck's Singing", "Donald Duck Popcorn", "Scrooge's Bathtub", "Chip and Dale", "Goofy's Prank", "Chip and Dale's Dream", "Classic Mickey", "Pluto's House"], secrets: ["The Captain of Steamboat Willie"] },
    { name: "Dimoo World × Pixar", figures: ["Dimoo as Woody", "Dimoo as Buzz Lightyear", "Dimoo as Alien", "Dimoo as Remy", "Dimoo as Red Panda Mei", "Dimoo as Miguel Rivera", "Dimoo as Dash Parr", "Dimoo as WALL·E", "Dimoo as Sulley", "Dimoo as Russell", "Dimoo as Lotso", "Dimoo as Hamm"], secrets: ["Dimoo in Space Crane"] },
    { name: "Dimoo – Weaving Wonders", figures: ["Dreams of Courage", "Bear Guardian", "Dreams of Sailing", "Moonlight Explorer", "Wishful Dreaming", "Dreams of Painting", "Drawing Spring", "Dreams of a Garden", "Floating Gardener", "Star Catcher", "Dream with a Butterfly", "Butterfly Wizard"], secrets: ["Dreams of Good Fortune", "Fortune Cat"] },
    { name: "Dimoo – Aquarium", figures: ["Flying Fish", "Turtle", "Seahorse", "Octopus", "Starfish", "Anglerfish", "Penguin", "Axolotl", "Coral", "Sea Butterfly", "Polar Bear", "Killer Whale"], secrets: ["Aquanaut"] },
    { name: "Dimoo – Dating", figures: ["Love Theatre", "Joyriding Bumper Car", "Rotating Cup", "Ice Cream", "Wait", "Rowboat", "Love Fountain", "Record Anniversary", "Summer Fireworks", "Marshmallow", "Romantic Balloons", "Small Handcart"], secrets: ["Photo Prop Wall"] },
    { name: "Dimoo – No One's Gonna Sleep Tonight", figures: ["Yeti", "Cerberus", "Fox Spirit", "Scare Box", "Deer Monster", "Ghost", "Little Devil", "Mummy", "Shadow Sailor", "Scarecrow", "Unicorn", "Ghost Catcher"], secrets: ["Maneater Flower on a Statue"] },
  ] },
  { name: "Hacipupu", series: [
    { name: "Hacipupu – Snuggle with You", figures: ["Baa Baa Sheep", "Comfy Bunny", "Charming Fox", "Lovely Piggy", "Cute Tiger Cub", "Ding Dong Reindeer", "Grumpy Crocodile", "Quirky Penguin", "Adorkable Koala", "Cuddly Squirrel", "Lucky Puppy", "Growling Polar Bear"], secrets: ["Kiss Penguin", "Sweetie Pie"] },
    { name: "Hacipupu × Crayon Shinchan – One Day in Kasukabe", figures: ["To Save the World", "My Favorite Cookie", "It's Buriburizaemon Costume", "Time for a Break", "Wake Up Refreshed", "The Kindergarten Newcomer", "Good Boy", "In Shiro's House", "Where It All Begins", "The Best Decision", "My Mood Is Rainproof", "An Extraordinary Day"], secrets: ["ACTION! Kiddie Ride"] },
    { name: "Hacipupu – The Constellation", figures: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"], secrets: ["Wishing"] },
  ] },
  { name: "Pucky", series: [
    { name: "Pucky – Sleeping Babies", figures: ["Owl Baby", "Bunny Baby", "Sloth Baby", "Teddy Bear Baby", "Night Sky Baby", "Coco Baby", "Dino Baby", "Alien Baby", "Dolly", "Dream Fairy Baby", "Little Lamb Baby", "Poko Baby"], secrets: ["Little Moon Baby"] },
    { name: "Pucky – The Feast", figures: ["Rice Dumpling", "Roast Duck", "Longevity Peach", "Hand-pulled Noodles", "Hot Pot", "Sweet Dew", "Steamed Bun", "Crayfish", "Chinese Hamburger", "Hairy Crab", "Stinky Tofu", "Tea"], secrets: ["Clay Pot Rice"] },
  ] },
  { name: "Azura", series: [
    { name: "Azura – Natural Elements", figures: ["Sunshine", "Thunder", "Snow", "Sound", "Ocean", "Fire", "Gemstone", "Night", "Cloud", "Desert", "Wind", "Plant"], secrets: ["Time"] },
    { name: "Azura – Fantasy Nature", figures: ["Autumn", "Cool", "Flame", "Lightning", "Melody", "Powder Snow", "Sandstone", "Starry Sky", "Sun", "Tide", "Treasure", "Twilight"], secrets: ["Endless Time"] },
    { name: "Azura – Spring Fantasy", figures: ["Catkin Fairy", "Coming to Earth", "Dew Fairy", "Flower Fairy", "Germinating", "Melting River", "Moss Fairy", "Spring Rain", "Strawberry Fairy", "Swallow Fairy", "Thawing Snow", "White Tiger Guardian"], secrets: ["Spring"] },
  ] },
  { name: "Kubo", series: [
    { name: "Kubo – Walks of Life" }, { name: "Kubo – Select Your Character" }, { name: "Kubo – Breathing In" }, { name: "Kubo – 24/7 You" },
    { name: "Kubo – City of Sunset" }, { name: "Kubo – Angel's Poem" }, { name: "Kubo – Love Still" },
  ] },
  { name: "Twinkle Twinkle", series: [
    { name: "Twinkle Twinkle – Be a Little Star", figures: ["Baby Ice Pop", "Banana Split", "Little Balloon", "The Magical Chef", "Bad Temper", "Haircut", "Teeter-totter", "Globetrotting", "Blowing Bubblegum", "Lose a Tooth", "Wake up! Sleepyhead!", "Little King"], secrets: ["Reach for the Stars"] },
  ] },
  { name: "Sweet Bean", series: [
    { name: "Sweet Bean – Supermarket", figures: ["Coke", "Popcorn", "Tissue", "Cup Noodles", "Koala Cookies", "Pots", "Strawberry Milk", "Potato Chips", "Frozen Dumplings", "Jelly Bean", "Grape Juice", "Jelly Ice Cream"], secrets: ["Shopping Cart Baby", "Cashier"] },
    { name: "Sweet Bean – Supermarket 2", figures: ["Washing Liquid", "Peach Biscuit Stick", "Sandwich Biscuit", "Frozen Pizza", "Meat Bun", "Fried Chicken", "Chocolate", "Rain Gear", "Crisp Pea", "Lemon Sparkling Water", "Yakisoba Bread", "Canned Coffee"], secrets: ["Blind Box", "Mascot Clerk"] },
  ] },
  { name: "Duckoo", series: [
    { name: "Duckoo – In the Forest" }, { name: "Duckoo – In the Winter Land" }, { name: "Duckoo – Home Training" }, { name: "Duckoo – Tropical Island" },
    { name: "Duckoo – Flying" }, { name: "Duckoo – My Pet" }, { name: "Duckoo – Ball Club" }, { name: "Duckoo – In the Kitchen" },
    { name: "Duckoo – Music Festival" }, { name: "Duckoo – The Grand Duckoo Hotel" }, { name: "Duckoo – Farm" }, { name: "mini Duckoo – Citywalk" },
  ] },
  { name: "Satyr Rory", series: [
    { name: "Satyr Rory – Sweet As Sweets" }, { name: "Satyr Rory – Mythical Babies" }, { name: "Satyr Rory – Orchestra" }, { name: "Satyr Rory – Cuddly Cuddlesome" },
    { name: "Satyr Rory – Twelve Constellations" }, { name: "Satyr Rory – Summer Fun" }, { name: "Satyr Rory – Cozy Winter Time" }, { name: "Satyr Rory – Adventures in Wonderland" },
  ] },
  { name: "Inosoul", series: [
    { name: "Inosoul – Lucid Dreams" }, { name: "Inosoul – In the Still Room" }, { name: "Inosoul – The Forgotten Land" }, { name: "Inosoul – Rainy Reveries" },
  ] },
  { name: "Zsiga", series: [
    { name: "Zsiga – We're So Cute", figures: ["Wealthy Bear", "Bored Puppy", "Trapped Frog", "Alert Elephant", "Ugly Duckling", "Dream Made of Paper", "Free Bird", "Misidentified Panda", "Furious Bear", "Sleepy Cat", "Rabbit on the Range", "Escaped Wolf Cub"], secrets: ["Bear in the Window"] },
  ] },
  { name: "Yuki", series: [
    { name: "Yuki – The Seasons" }, { name: "Yuki – Levolutionism" }, { name: "Yuki – Interfusion" }, { name: "Yuki – Japanese Taste" },
  ] },
  { name: "Bobo & Coco", series: [
    { name: "Bobo & Coco – A Little Store", figures: ["Aquarium", "Arcade Game", "Bakery", "Bar", "Boutique", "Convenience Store", "Flower Shop", "Gallery", "Ice Cream Cart", "Newsstand", "Pet Clinic", "Record Store"], secrets: ["The Teddy Bear Museum", "Doll Machine"] },
    { name: "Bobo & Coco – Vintage Zakka" }, { name: "Bobo & Coco – Go Camping" }, { name: "Bobo & Coco – Wanderlust" },
  ] },
  { name: "Peach Riot", series: [
    { name: "Peach Riot – Rise Up", figures: ["Poppy Baddie on Bass", "Poppy Cutie", "Poppy Business", "Poppy Electric Funk", "Frankie Sick Beats", "Frankie Diva", "Frankie The Boss", "Frankie The Rhythm", "Gigi Lil' Lead", "Gigi Pop Star", "Gigi Brain Stormer", "Gigi The Singer"], secrets: ["Gigi The Gleeman"] },
  ] },
];

// The name a figure is saved under: "Nyota – Wishing Star". Names that already start
// with the character (like "Dimoo as Woody") are kept as they are.
export const figureName = (character, figure) =>
    figure.toLowerCase().startsWith(character.toLowerCase()) ? figure : `${character} – ${figure}`;

// Every series, flattened: { character, series, figures: [{ figure, secret }] }
export const SERIES_LIST = CHARACTERS.flatMap((c) => c.series.map((s) => ({
  character: c.name,
  series: s.name,
  figures: [
    ...(s.figures || []).map((figure) => ({ figure, secret: false })),
    ...(s.secrets || []).map((figure) => ({ figure, secret: true })),
  ],
})));

// Every figure, flattened: { character, series, figure, secret, name }
export const FIGURE_LIST = SERIES_LIST.flatMap((s) => s.figures.map((x) => ({
  character: s.character, series: s.series, ...x, name: figureName(s.character, x.figure),
})));
