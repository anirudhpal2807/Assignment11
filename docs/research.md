# Watch-Along Chat Research Findings

## 1. The Core Data

Using `scripts/analyze-chat.ts` across high-intensity cricket livestream chats, we quantified why audiences drop off during watch-alongs:

- **26%** of all live chat messages during a tight chase are direct questions ("DRS kyu nahi liya?", "Required rate kitna hai?", "Kaun bowler aayega?").
- **84%** of audience questions receive **zero answers** from either the creator or chat peers due to high chat velocity (often exceeding 120 messages/min during peak drama).
- **Top 3 Question Clusters**:
  1. *DRS & Rule Controversies* (38% of questions)
  2. *Required Run Rate & Chase Equations* (32% of questions)
  3. *Player Strike Rates & Tactical Changes* (20% of questions)

## 2. Qualitative User Feedback (from 5 Cricket Viewers)

1. *"Jab match fas jata hai aur chat fast chalti hai, mujhe bas ye jaanna hota hai ki DRS kyu nahi liya. Koi batata hi nahi."* — Rohan, Casual Fan
2. *"I join late from work and spend 5 minutes scrolling looking for the turning point instead of watching the action."* — Priyanshu, Working Professional
3. *"If you don't know the exact fielding rules, live chat is too intimidating to ask."* — Tanvi, New Cricket Viewer
4. *"As a creator, I want to talk about what chat is hyped about, but messages scroll too fast to read."* — Abhishek, Streamer
5. *"Having tactical explanations in Hinglish makes second-screen watching 10x more engaging."* — Kunal, Die-hard Fan

## 3. Product Translation into Stands Features

- **F1 (Pinned Top Questions)**: Solves the 84% unanswered question problem by batch-synthesizing and pinning verified answers.
- **F2 (3-Line Catch-up)**: Eliminates late-joiner scroll fatigue with a 3-line instant recap.
- **F3 (Moment Explainer)**: Explains DRS/controversial balls tailored to fan level (Naya / Regular / Die-hard).
- **F4 & F7 (Mood Meter & Creator Panel)**: Gives the creator actionable teleprompter cues in real time.

