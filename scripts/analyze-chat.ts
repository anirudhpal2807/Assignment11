/**
 * Chat Replay Analysis Script
 * Usage: node --experimental-strip-types scripts/analyze-chat.ts [optional-path-to-chat.json]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AnalyzedMessage {
  id: string;
  user: string;
  text: string;
  ballIndex?: number;
}

function analyzeChat(filePath?: string) {
  const targetPath =
    filePath ||
    path.join(__dirname, "../src/data/matches/mm-vs-cc-final/chat.json");

  console.log(`\n======================================================`);
  console.log(`  Stands Chat Research: Analyzing ${path.basename(targetPath)}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(targetPath)) {
    console.error(`File not found at: ${targetPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(targetPath, "utf-8");
  const messages: AnalyzedMessage[] = JSON.parse(raw);

  const totalMessages = messages.length;
  const questionKeywords = ["?", "kyun", "kyu", "why", "who", "kitna", "kab", "kya", "how", "what"];

  const questions = messages.filter((m) => {
    const lower = m.text.toLowerCase();
    return questionKeywords.some((k) => lower.includes(k));
  });

  const questionPct = Math.round((questions.length / totalMessages) * 100);

  // Clusters
  const drsQuestions = questions.filter((m) => /drs|review|lbw|plumb/i.test(m.text));
  const rateQuestions = questions.filter((m) => /rate|kitna|chahiye|equation|target/i.test(m.text));
  const playerQuestions = questions.filter((m) => /kabir|arjun|tushar|rehan|sameer|strike/i.test(m.text));

  // Heuristic reply check: did any message in the subsequent 2 items reference this user or answer?
  let answeredCount = 0;
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (questions.some((q) => q.id === m.id)) {
      const nextMessages = messages.slice(i + 1, i + 3);
      const gotReply = nextMessages.some(
        (next) =>
          next.text.toLowerCase().includes(m.user.toLowerCase()) ||
          next.text.toLowerCase().includes("@")
      );
      if (gotReply) answeredCount++;
    }
  }

  const answeredPct = Math.round((answeredCount / (questions.length || 1)) * 100);

  console.log(`📊 Research Findings:`);
  console.log(`- Total chat messages analyzed: ${totalMessages}`);
  console.log(`- Questions from audience: ${questions.length} (${questionPct}%)`);
  console.log(`- Questions answered by community/creator: ${answeredCount} (${answeredPct}%)`);
  console.log(`- Unanswered question rate: ${100 - answeredPct}%`);
  console.log(`\n🔍 Top Question Clusters:`);
  console.log(`  1. DRS & Umpiring Controversies: ${drsQuestions.length} msgs`);
  console.log(`  2. Target & Required Run Rate: ${rateQuestions.length} msgs`);
  console.log(`  3. Batter/Bowler Form & Tactics: ${playerQuestions.length} msgs`);
  console.log(`\n💡 Key Insight:`);
  console.log(`Over ${100 - answeredPct}% of viewer questions disappear without an answer.`);
  console.log(`Stands AI Co-host groups and pins the answers to the top before the next over.\n`);
}

analyzeChat(process.argv[2]);
