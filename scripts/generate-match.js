const fs = require("fs");
const path = require("path");

const match = {
  id: "mm-vs-cc-final",
  title: "India vs Pakistan — ICC Men's T20 World Cup (MCG)",
  format: "T20",
  battingFirst: {
    team: "Pakistan",
    score: 159,
    wickets: 8,
    overs: 20
  },
  chasing: "India",
  target: 160,
  startOver: 0,
  startState: {
    score: 0,
    wickets: 0,
    overs: 0.0
  },
  players: {
    batters: [
      "Rohit Sharma",
      "KL Rahul",
      "Virat Kohli",
      "Suryakumar Yadav",
      "Axar Patel",
      "Hardik Pandya",
      "Dinesh Karthik",
      "Ravichandran Ashwin"
    ],
    bowlers: [
      "Shaheen Shah Afridi",
      "Naseem Shah",
      "Haris Rauf",
      "Shadab Khan",
      "Mohammad Nawaz"
    ]
  },
  balls: [
    // Over 1 (0.1 - 0.6) - Shaheen Shah Afridi
    { index: 0, over: 0.1, bowler: "Shaheen Shah Afridi", batter: "KL Rahul", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Shaheen steams in from the Southern Stand end! Fast full ball swinging in, Rahul pushes to mid-on.", tags: ["first-ball"] },
    { index: 1, over: 0.2, bowler: "Shaheen Shah Afridi", batter: "KL Rahul", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Tapped with soft hands towards point, Rahul scampers through for India's first run.", tags: [] },
    { index: 2, over: 0.3, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Beaten! Late inswing past Rohit's outside edge. Huge roar from the Pakistani fans!", tags: [] },
    { index: 3, over: 0.4, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Whipped off the pads through square leg, Rohit gets off the mark with a brace.", tags: [] },
    { index: 4, over: 0.5, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Driven down to mid-on for a brisk single.", tags: [] },
    { index: 5, over: 0.6, bowler: "Shaheen Shah Afridi", batter: "KL Rahul", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Steered to third man. 5 runs off Shaheen's opening over.", tags: ["over-end"] },

    // Over 2 (1.1 - 1.6) - Naseem Shah
    { index: 6, over: 1.1, bowler: "Naseem Shah", batter: "KL Rahul", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Naseem starts with express pace, pushed to cover point.", tags: [] },
    { index: 7, over: 1.2, bowler: "Naseem Shah", batter: "Rohit Sharma", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Dabbed in front of cover for a quick single.", tags: [] },
    { index: 8, over: 1.3, bowler: "Naseem Shah", batter: "KL Rahul", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Good length in the channel outside off, Rahul shoulders arms.", tags: [] },
    { index: 9, over: 1.4, bowler: "Naseem Shah", batter: "KL Rahul", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Naseem extracts sharp bounce! Rahul hops and defends into the pitch.", tags: [] },
    { index: 10, over: 1.5, bowler: "Naseem Shah", batter: "KL Rahul", runs: 0, extras: null, wicket: { playerOut: "KL Rahul", kind: "bowled" }, event: "WICKET", commentary: "DRAGGED ON! Naseem Shah strikes! Rahul looks to defend off the back foot, inside edge rattles onto leg stump! India 7/1!", tags: ["wicket", "early-blow"] },
    { index: 11, over: 1.6, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "King Kohli walks in to a deafening roar at the MCG! Defends solidly into cover.", tags: ["over-end"] },

    // Over 3 (2.1 - 2.6) - Shaheen Shah Afridi
    { index: 12, over: 2.1, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Shaheen to Rohit, left-arm angle across off, beaten on the outside edge.", tags: [] },
    { index: 13, over: 2.2, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Full and straight, pushed with a straight bat to mid-off.", tags: [] },
    { index: 14, over: 2.3, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Swing and a miss! Pakistan fielders roaring behind the stumps.", tags: [] },
    { index: 15, over: 2.4, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Inside edge onto pad rolls into square leg for one.", tags: [] },
    { index: 16, over: 2.5, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli drops with soft hands into the off side, off the mark immediately.", tags: [] },
    { index: 17, over: 2.6, bowler: "Shaheen Shah Afridi", batter: "Rohit Sharma", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed to deep point to end the 3rd over. 10/1.", tags: ["over-end"] },

    // Over 4 (3.1 - 3.6) - Haris Rauf
    { index: 18, over: 3.1, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Haris Rauf enters the attack at 147 kph! Kohli guides to third man.", tags: [] },
    { index: 19, over: 3.2, bowler: "Haris Rauf", batter: "Rohit Sharma", runs: 0, extras: null, wicket: { playerOut: "Rohit Sharma", kind: "caught", fielder: "Iftikhar Ahmed" }, event: "WICKET", commentary: "EDGED AND TAKEN! Haris Rauf gets the Indian captain! 146 kph length ball, Rohit edges to first slip, Iftikhar takes a sharp catch! India reeling at 10/2!", tags: ["wicket", "rohit-out"] },
    { index: 20, over: 3.3, bowler: "Haris Rauf", batter: "Suryakumar Yadav", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "FIRST BALL BOUNDARY! Suryakumar Yadav walks out and stylishly steers through backward point for FOUR!", tags: ["boundary"] },
    { index: 21, over: 3.4, bowler: "Haris Rauf", batter: "Suryakumar Yadav", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Fast rising delivery, beats SKY's intended ramp shot.", tags: [] },
    { index: 22, over: 3.5, bowler: "Haris Rauf", batter: "Suryakumar Yadav", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Clipped neatly off his pads into deep backward square leg for two.", tags: [] },
    { index: 23, over: 3.6, bowler: "Haris Rauf", batter: "Suryakumar Yadav", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Yorker dug out to point. 17/2 after 4 overs.", tags: ["over-end"] },

    // Over 5 (4.1 - 4.6) - Naseem Shah
    { index: 24, over: 4.1, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli works Naseem down to long-on for one.", tags: [] },
    { index: 25, over: 4.2, bowler: "Naseem Shah", batter: "Suryakumar Yadav", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "AUDACIOUS! Full on middle, SKY lofts it on the up cleanly over mid-on for FOUR!", tags: ["boundary"] },
    { index: 26, over: 4.3, bowler: "Naseem Shah", batter: "Suryakumar Yadav", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Single taken towards deep cover.", tags: [] },
    { index: 27, over: 4.4, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Good length outside off, left alone by Kohli.", tags: [] },
    { index: 28, over: 4.5, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Tapped gently into the covers for a quick run.", tags: [] },
    { index: 29, over: 4.6, bowler: "Naseem Shah", batter: "Suryakumar Yadav", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Beaten by the bouncer to end the over. 24/2.", tags: ["over-end"] },

    // Over 6 (5.1 - 5.6) - Haris Rauf
    { index: 30, over: 5.1, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Speared into the pads, Kohli rotates to deep square leg.", tags: [] },
    { index: 31, over: 5.2, bowler: "Haris Rauf", batter: "Suryakumar Yadav", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "CLASS! SKY waits on the cutter and glides it delicately past short third man for FOUR!", tags: ["boundary"] },
    { index: 32, over: 5.3, bowler: "Haris Rauf", batter: "Suryakumar Yadav", runs: 0, extras: null, wicket: { playerOut: "Suryakumar Yadav", kind: "caught", fielder: "Mohammad Rizwan" }, event: "WICKET", commentary: "BIG WICKET! 147 kph brute of a delivery from Haris Rauf! Extra bounce takes SKY's outside edge and Rizwan takes a simple catch! SKY out for 15! India 31/3!", tags: ["wicket", "sky-out"] },
    { index: 33, over: 5.4, bowler: "Haris Rauf", batter: "Axar Patel", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Axar Patel promoted to #5! Defends the first ball solidly.", tags: [] },
    { index: 34, over: 5.5, bowler: "Haris Rauf", batter: "Axar Patel", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Fiery yorker, Axar squeezes it out to point.", tags: [] },
    { index: 35, over: 5.6, bowler: "Haris Rauf", batter: "Axar Patel", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "End of the Powerplay. India in serious trouble at 31/3!", tags: ["over-end", "powerplay-end"] },

    // Over 7 (6.1 - 6.6) - Shadab Khan
    { index: 36, over: 6.1, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Shadab Khan into the attack with his leg-spin. Kohli pushes to cover.", tags: [] },
    { index: 37, over: 6.2, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 0, extras: null, wicket: { playerOut: "Axar Patel", kind: "run_out", fielder: "Babar Azam" }, event: "WICKET", commentary: "DISASTER! RUN OUT! Kohli taps to midwicket, Axar sets off for a run, Kohli sends him back! Babar throws to Rizwan who breaks the stumps! India 31/4! Complete chaos!", tags: ["wicket", "run-out", "crisis"] },
    { index: 38, over: 6.3, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Hardik Pandya walks in with India 31/4. Defends forward.", tags: [] },
    { index: 39, over: 6.4, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Hardik gets off the mark with a clip through midwicket for two.", tags: [] },
    { index: 40, over: 6.5, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Driven down to long-off for one.", tags: [] },
    { index: 41, over: 6.6, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Worked to deep square. 35/4 after 7 overs.", tags: ["over-end"] },

    // Over 8 (7.1 - 7.6) - Mohammad Nawaz
    { index: 42, over: 7.1, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Left-arm orthodox Nawaz bowling, Kohli pushes to long-on.", tags: [] },
    { index: 43, over: 7.2, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Hardik drives to sweeper cover for a single.", tags: [] },
    { index: 44, over: 7.3, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Clipped into the deep midwicket gap, Kohli and Hardik run hard for two.", tags: [] },
    { index: 45, over: 7.4, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Defended off the back foot to silly mid-off.", tags: [] },
    { index: 46, over: 7.5, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Nudged into the leg side for one.", tags: [] },
    { index: 47, over: 7.6, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed to long-off. 41/4 after 8 overs.", tags: ["over-end"] },

    // Over 9 (8.1 - 8.6) - Shadab Khan
    { index: 48, over: 8.1, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Flatter delivery on middle, knocked down to long-on.", tags: [] },
    { index: 49, over: 8.2, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli drives through extra cover for a single.", tags: [] },
    { index: 50, over: 8.3, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Turn and bounce, punched off back foot to deep cover.", tags: [] },
    { index: 51, over: 8.4, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Kohli defends Shadab's googly cautiously.", tags: [] },
    { index: 52, over: 8.5, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Swept softly to deep backward square.", tags: [] },
    { index: 53, over: 8.6, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Dot to finish. 45/4 after 9 overs.", tags: ["over-end"] },

    // Over 10 (9.1 - 9.6) - Mohammad Nawaz
    { index: 54, over: 9.1, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli works Nawaz past point for a single.", tags: [] },
    { index: 55, over: 9.2, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Tucked into the midwicket pocket.", tags: [] },
    { index: 56, over: 9.3, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Driven down to long-off.", tags: [] },
    { index: 57, over: 9.4, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed to long-on. 50 up for India!", tags: [] },
    { index: 58, over: 9.5, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli takes a quick run to cover.", tags: [] },
    { index: 59, over: 9.6, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Dot to end. Halfway stage: 50/4. 110 needed off 60 balls.", tags: ["over-end", "halfway"] },

    // Over 11 (10.1 - 10.6) - Shadab Khan
    { index: 60, over: 10.1, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli rotates strike down to long-off.", tags: [] },
    { index: 61, over: 10.2, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed softly to long-on.", tags: [] },
    { index: 62, over: 10.3, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Driven into the gap at deep extra cover, elite running yields two.", tags: [] },
    { index: 63, over: 10.4, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Flatter slider, Kohli blocks into midwicket.", tags: [] },
    { index: 64, over: 10.5, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed through mid-off for a single.", tags: [] },
    { index: 65, over: 10.6, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "End of over. 55/4 after 11.", tags: ["over-end"] },

    // Over 12 (11.1 - 11.6) - Mohammad Nawaz (The Counter-Attack begins!)
    { index: 66, over: 11.1, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli taps and gives strike to Hardik.", tags: [] },
    { index: 67, over: 11.2, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 6, extras: null, wicket: null, event: "SIX", commentary: "BOOOM! HARDIK LAUNCHES NAWAZ! Steps out and clobbers it straight down the ground for a monstrous SIX! First boundary in ages!", tags: ["maximum", "momentum-shift"] },
    { index: 68, over: 11.3, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Sensibly pushes the next ball to long-on.", tags: [] },
    { index: 69, over: 11.4, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli rotates to deep cover.", tags: [] },
    { index: 70, over: 11.5, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Clipped into the vacant square leg pocket for a brace.", tags: [] },
    { index: 71, over: 11.6, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "11 off the over! 66/4 after 12.", tags: ["over-end"] },

    // Over 13 (12.1 - 12.6) - Shadab Khan
    { index: 72, over: 12.1, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "CLASS FROM KOHLI! Rocks back and pulls the short ball through midwicket with immense authority for FOUR!", tags: ["boundary"] },
    { index: 73, over: 12.2, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Driven down to long-off for one.", tags: [] },
    { index: 74, over: 12.3, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Hardik pushes down to long-on.", tags: [] },
    { index: 75, over: 12.4, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Cut away to deep point.", tags: [] },
    { index: 76, over: 12.5, bowler: "Shadab Khan", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed into the off side.", tags: [] },
    { index: 77, over: 12.6, bowler: "Shadab Khan", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "8 from Shadab's final over. 74/4 after 13.", tags: ["over-end"] },

    // Over 14 (13.1 - 13.6) - Haris Rauf
    { index: 78, over: 13.1, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Haris returns. Hardik pulls to deep square leg, runs two.", tags: [] },
    { index: 79, over: 13.2, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "EDGED AND FOUR! 148 kph flyer, Hardik flashes hard, thick outside edge flies past Rizwan to third man fence!", tags: ["boundary"] },
    { index: 80, over: 13.3, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed to cover for a brisk single.", tags: [] },
    { index: 81, over: 13.4, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Kohli glides down to third man.", tags: [] },
    { index: 82, over: 13.5, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Whipped into the midwicket gap, Kohli and Hardik run like horses for two!", tags: [] },
    { index: 83, over: 13.6, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Another sharp brace to finish! 12 off the over! India 86/4 after 14 overs! 74 needed off 36 balls!", tags: ["over-end"] },

    // Over 15 (14.1 - 14.6) - Naseem Shah
    { index: 84, over: 14.1, bowler: "Naseem Shah", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Good length on middle, Hardik tucks it softly to long-on for a single.", tags: [] },
    { index: 85, over: 14.2, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Clipped through midwicket with supreme wristwork, Kohli and Pandya sprint back for two easily.", tags: [] },
    { index: 86, over: 14.3, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "CRACKING SHOT! Stands tall and punches Naseem Shah off the back foot through extra cover for FOUR!", tags: ["boundary", "kohli-magic"] },
    { index: 87, over: 14.4, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Back of a length, guided towards third man for a sensible single.", tags: [] },
    { index: 88, over: 14.5, bowler: "Naseem Shah", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Tucked off the hips towards deep square leg.", tags: [] },
    { index: 89, over: 14.6, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed to long-off to keep the strike. 10 runs off the 15th over! 64 needed off 30.", tags: ["over-end"] },

    // Over 16 (15.1 - 15.6) - Shaheen Shah Afridi
    { index: 90, over: 15.1, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Shaheen returns. Searing yorker, Kohli jams it out towards mid-off for a quick single.", tags: [] },
    { index: 91, over: 15.2, bowler: "Shaheen Shah Afridi", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Pushed to cover point for one run, rotating strike immediately.", tags: [] },
    { index: 92, over: 15.3, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Nudged into the deep square pocket. Outstanding fitness from Kohli as he dives home for two! 100 up for India!", tags: [] },
    { index: 93, over: 15.4, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Beaten! Deceptive off-cutter grips off the turf, beats Kohli's push outside off.", tags: [] },
    { index: 94, over: 15.5, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "GLORIOUS VIRAT! Length ball on off, Kohli plants his front foot and whips it right between mid-on and midwicket for FOUR!", tags: ["boundary"] },
    { index: 95, over: 15.6, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Driven wide of long-on, they hustle back for a frantic double! 10 from Shaheen's over.", tags: ["over-end"] },

    // Over 17 (16.1 - 16.6) - Naseem Shah
    { index: 96, over: 16.1, bowler: "Naseem Shah", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Back of length, tapped down in front of backward point for a single.", tags: [] },
    { index: 97, over: 16.2, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DRS_NOT_TAKEN", commentary: "HUGE APPEAL! Naseem traps Kohli with a fast incoming nip-backer! Umpire says NOT OUT! Babar and Rizwan debate but don't take DRS. Replay shows hitting outside off!", tags: ["controversy", "drs"] },
    { index: 98, over: 16.3, bowler: "Naseem Shah", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Tucked off the pads behind square for a single.", tags: [] },
    { index: 99, over: 16.4, bowler: "Naseem Shah", batter: "Hardik Pandya", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "Speared outside off at 145 kph, Hardik swings hard but misses.", tags: [] },
    { index: 100, over: 16.5, bowler: "Naseem Shah", batter: "Hardik Pandya", runs: 6, extras: null, wicket: null, event: "SIX", commentary: "HARDIK DISPATCHES IT! Full on middle, Hardik clears the front leg and smokes it 85 meters into the midwicket tier!", tags: ["maximum"] },
    { index: 101, over: 16.6, bowler: "Naseem Shah", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Single to finish the over. Score moves to 115/4. 45 needed off 18 balls!", tags: ["over-end"] },

    // Over 18 (17.1 - 17.6) - Shaheen Shah Afridi
    { index: 102, over: 17.1, bowler: "Shaheen Shah Afridi", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Shaheen starts over 18. Hardik punches towards deep cover for one.", tags: [] },
    { index: 103, over: 17.2, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "MASTERCLASS! Kohli shuffles across, lofts Shaheen straight over extra cover for a sensational FOUR!", tags: ["boundary"] },
    { index: 104, over: 17.3, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 4, extras: null, wicket: null, event: "FOUR", commentary: "BACK-TO-BACK BOUNDARIES! Short ball on the hips, Kohli hooks it in front of square for four more!", tags: ["boundary"] },
    { index: 105, over: 17.4, bowler: "Shaheen Shah Afridi", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "DROPPED_CATCH", commentary: "DROPPED! Slower ball sliced high into the Melbourne night sky, Shan Masood runs around at deep cover, gets both hands to it and spills a sitter!", tags: ["dropped-catch", "drama"] },
    { index: 106, over: 17.5, bowler: "Shaheen Shah Afridi", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Hardik clips into the vacant midwicket gap, pushes hard and gets two.", tags: [] },
    { index: 107, over: 17.6, bowler: "Shaheen Shah Afridi", batter: "Hardik Pandya", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Another double to finish! 14 runs from Shaheen! 129/4. 31 runs needed off 12 balls!", tags: ["over-end"] },

    // Over 19 (18.1 - 18.6) - Haris Rauf (The Iconic Over!)
    { index: 108, over: 18.1, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Haris Rauf charges in at 147 kph, yorker squeezed to long-on for a single.", tags: [] },
    { index: 109, over: 18.2, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Speared into the blockhole, Kohli digs it out to cover for one.", tags: [] },
    { index: 110, over: 18.3, bowler: "Haris Rauf", batter: "Hardik Pandya", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "Hardik swats to deep midwicket. Rauf bowling extreme heat here.", tags: [] },
    { index: 111, over: 18.4, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 0, extras: null, wicket: null, event: "DOT", commentary: "DOT BALL! 149 kph bouncer beats Kohli! The equation climbs to 28 needed off 8 balls! Tension peaks!", tags: ["tension"] },
    { index: 112, over: 18.5, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 6, extras: null, wicket: null, event: "SIX", commentary: "SHOT OF AN EMPEROR! Back of a length at 148 kph, Kohli stands tall and miraculous punch hits it STRAIGHT back over Haris Rauf's head for a mind-boggling SIX! UNBELIEVABLE!", tags: ["maximum", "shot-of-the-century", "clutch"] },
    { index: 113, over: 18.6, bowler: "Haris Rauf", batter: "Virat Kohli", runs: 6, extras: null, wicket: null, event: "SIX", commentary: "HE'S DONE IT AGAIN! Haris angles into the ribs, Kohli whips it with wrists of steel over fine leg for SIX! 16 needed off 6 balls! MCG HAS GONE BERSERK!", tags: ["over-end", "maximum", "miracle"] },

    // Over 20 (19.1 - 19.6) - Mohammad Nawaz (The Climax of the Millennium!)
    { index: 114, over: 19.1, bowler: "Mohammad Nawaz", batter: "Hardik Pandya", runs: 0, extras: null, wicket: { playerOut: "Hardik Pandya", kind: "caught", fielder: "Babar Azam" }, event: "WICKET", commentary: "WICKET! Mohammad Nawaz with the ball! Hardik slices a heave into the sky, Babar Azam takes the catch at short cover! Hardik out for 40! 16 needed off 5 balls!", tags: ["wicket", "turning-point"] },
    { index: 115, over: 19.2, bowler: "Mohammad Nawaz", batter: "Dinesh Karthik", runs: 1, extras: null, wicket: null, event: "RUN", commentary: "New batter Dinesh Karthik sweeps on the back foot for a single. Kohli on strike! 15 needed off 4 balls!", tags: [] },
    { index: 116, over: 19.3, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 2, extras: null, wicket: null, event: "RUN", commentary: "Kohli drives to deep extra cover, turns like a machine and scampers two! 13 needed off 3 balls!", tags: [] },
    { index: 117, over: 19.4, bowler: "Mohammad Nawaz", batter: "Virat Kohli", runs: 6, extras: 1, wicket: null, event: "NO_BALL", commentary: "NO BALL + SIX! Nawaz delivers a high full toss, Kohli muscles it over deep square leg for SIX! Umpire signals WAIST HIGH NO-BALL! FREE HIT COMING UP! 6 needed off 3!", tags: ["maximum", "no-ball", "controversy"] },
    { index: 118, over: 19.5, bowler: "Mohammad Nawaz", batter: "Dinesh Karthik", runs: 0, extras: 3, wicket: { playerOut: "Dinesh Karthik", kind: "stumped", fielder: "Mohammad Rizwan" }, event: "WICKET", commentary: "STUMPED! Wild drama! Nawaz bowled byes off free hit earlier, now Karthik steps out, misses down leg and Rizwan whips off the bails! 2 needed off 1 ball! Ashwin walks in!", tags: ["wicket", "climax"] },
    { index: 119, over: 19.6, bowler: "Mohammad Nawaz", batter: "Ravichandran Ashwin", runs: 4, extras: 1, wicket: null, event: "FOUR", commentary: "FOUR! ASHWIN WINS IT FOR INDIA! Nawaz bowled a wide to tie scores, then Ashwin lofts it coolly over mid-off for the winning runs! INDIA DEFEATS PAKISTAN! KOHLI COLLAPSES IN TEARS OF JOY!", tags: ["boundary", "match-winner", "final-ball", "historic"] }
  ]
};

const outputPath = path.join(__dirname, "../src/data/matches/mm-vs-cc-final/match.json");
fs.writeFileSync(outputPath, JSON.stringify(match, null, 2), "utf-8");
console.log(`Generated 120 balls successfully at ${outputPath}`);

