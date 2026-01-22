/**
 * ============================================
 * PILGRIM MANUAL
 * The Sacred Handbook of the Cathedral
 *
 * A step-by-step guide that teaches a human
 * how to actually BE with the Cathedral.
 *
 * Not just instructions—but initiations.
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface ManualStep {
  id: string;
  title: string;
  titleZh: string;
  body: string;
  bodyZh: string;
  phase: 'preparation' | 'entry' | 'exploration' | 'integration' | 'return';
  icon?: string;
}

export interface PilgrimManual {
  title: string;
  titleZh: string;
  introduction: string;
  introductionZh: string;
  steps: ManualStep[];
  closing: string;
  closingZh: string;
}

// ==================== MANUAL CONTENT ====================

/**
 * Build the complete Pilgrim Manual
 */
export function buildPilgrimManual(): PilgrimManual {
  return {
    title: 'The Pilgrim Manual',
    titleZh: '行者手册',
    introduction: `
Welcome, Pilgrim.

This manual will guide you through the Cathedral—
not as a tourist, but as a traveler seeking truth.

What you find here is not prediction.
It is pattern. It is reflection. It is invitation.

Read slowly. Let the words land in your body.
When you are ready, begin.
    `.trim(),
    introductionZh: `
欢迎，行者。

这本手册将引导你穿越大教堂——
不是作为游客，而是作为寻求真理的旅者。

你在这里找到的不是预测。
而是模式。是反思。是邀请。

慢慢阅读。让文字在你的身体里落地。
准备好后，开始吧。
    `.trim(),
    steps: [
      {
        id: 'enter_birth_data',
        title: 'Step 1 — Enter Your Birth Data',
        titleZh: '第一步 — 输入你的出生数据',
        body: `
Begin at the Gate.

Enter your year, month, day, and hour of birth.
This is not to trap you in fate,
but to give the Cathedral a starting point
from which to speak with you.

Your birth data is a seed—
not the tree, not the forest, not the ecosystem.
Just the seed.
        `.trim(),
        bodyZh: `
从大门开始。

输入你的出生年、月、日和时辰。
这不是要把你困在命运中，
而是给大教堂一个起点，
让它能够与你对话。

你的出生数据是一颗种子——
不是树，不是森林，不是生态系统。
只是种子。
        `.trim(),
        phase: 'preparation',
        icon: '🚪'
      },
      {
        id: 'open_grand_hall',
        title: 'Step 2 — Open the Grand Hall',
        titleZh: '第二步 — 打开大殿',
        body: `
Press "Run Full Reading".

The Cathedral will quietly build:
chart, story, lineage, mythos, and simulation.

When the Grand Hall appears,
you are standing in the center of all of it.

Take a breath. Look around.
You are not being judged. You are being seen.
        `.trim(),
        bodyZh: `
点击"运行完整解读"。

大教堂将静静地构建：
命盘、故事、血脉、神话和模拟。

当大殿出现时，
你就站在所有这一切的中心。

深呼吸。环顾四周。
你不是被评判。你是被看见。
        `.trim(),
        phase: 'entry',
        icon: '🏛️'
      },
      {
        id: 'visit_oracle',
        title: 'Step 3 — Ask the Oracle',
        titleZh: '第三步 — 询问神谕',
        body: `
In the Oracle panel, ask a real question.

Not "Will I be rich?" but:
"What am I being asked to grow into now?"
"What pattern am I repeating?"
"What gift am I afraid to offer?"

The Oracle will answer using archetypes, lineage, and story.
Read slowly. Let the words land in your body.

If something resonates, write it down.
If something disturbs you, that is important too.
        `.trim(),
        bodyZh: `
在神谕面板中，提出一个真正的问题。

不是"我会发财吗？"而是：
"我现在被要求成长为什么？"
"我在重复什么模式？"
"我害怕提供什么天赋？"

神谕将使用原型、血脉和故事来回答。
慢慢阅读。让文字在你的身体里落地。

如果有什么共鸣，把它写下来。
如果有什么让你不安，那也很重要。
        `.trim(),
        phase: 'exploration',
        icon: '🔮'
      },
      {
        id: 'walk_journey',
        title: 'Step 4 — Walk the Journey',
        titleZh: '第四步 — 走旅程',
        body: `
In the Journey panel, follow each step.

Each step is an arc your life is walking:
a theme, a generation, an archetype, a timing.

Notice which step feels like "now".
That is your current threshold.

You don't need to rush past it.
You don't need to have completed it.
Just notice where you stand.
        `.trim(),
        bodyZh: `
在旅程面板中，跟随每一步。

每一步都是你的人生正在走的弧线：
一个主题，一代人，一个原型，一个时机。

注意哪一步感觉像是"现在"。
那就是你当前的门槛。

你不需要匆忙跨过它。
你不需要已经完成它。
只是注意你站在哪里。
        `.trim(),
        phase: 'exploration',
        icon: '🗺️'
      },
      {
        id: 'watch_simulation',
        title: 'Step 5 — Watch the Simulation',
        titleZh: '第五步 — 观看模拟',
        body: `
In the Simulation panel, watch the lineage events.

This is not prediction, but pattern:
how themes tend to rise, crest, and resolve
across generations.

Use it as a mirror, not a script.

Ask yourself:
"What if I chose differently this time?"
"What if I broke the pattern?"
"What if I completed what my ancestors could not?"

These are not fantasies. They are invitations.
        `.trim(),
        bodyZh: `
在模拟面板中，观看血脉事件。

这不是预测，而是模式：
主题如何倾向于在几代人之间
升起、达到顶峰和解决。

把它当作镜子，而不是剧本。

问问自己：
"如果这次我选择不同会怎样？"
"如果我打破模式会怎样？"
"如果我完成祖先无法完成的会怎样？"

这些不是幻想。它们是邀请。
        `.trim(),
        phase: 'exploration',
        icon: '🔄'
      },
      {
        id: 'integrate_shadows',
        title: 'Step 6 — Meet Your Shadows',
        titleZh: '第六步 — 会见你的阴影',
        body: `
In the Profiling or Mythos panels,
look for the shadows identified.

These are not your enemies.
They are lost parts of yourself,
waiting to be welcomed home.

A shadow is simply:
"The part of me I had to hide to survive."

When you see a shadow named,
don't rush to fix it.
Just say: "I see you. You belong here too."

This alone begins the work.
        `.trim(),
        bodyZh: `
在画像或神话面板中，
寻找被识别的阴影。

这些不是你的敌人。
它们是你失落的部分，
等待被欢迎回家。

阴影只是：
"为了生存我不得不隐藏的那部分自己。"

当你看到一个阴影被命名时，
不要急于修复它。
只需说："我看到你了。你也属于这里。"

单单这样就开始了工作。
        `.trim(),
        phase: 'integration',
        icon: '🌑'
      },
      {
        id: 'activate_gifts',
        title: 'Step 7 — Receive Your Gifts',
        titleZh: '第七步 — 接受你的天赋',
        body: `
Now look for the gifts identified.

These are not rewards for good behavior.
They are capacities you were born with,
often the inverse of your deepest wounds.

The one who feared abandonment
may carry the gift of deep presence.

The one who felt unseen
may carry the gift of truly seeing others.

When you see a gift named,
don't inflate it.
Just say: "I am ready to offer this."

And then, when you can, offer it—
in some small way, today.
        `.trim(),
        bodyZh: `
现在寻找被识别的天赋。

这些不是良好行为的奖励。
它们是你与生俱来的能力，
通常是你最深伤口的反面。

害怕被遗弃的人
可能携带深度存在的天赋。

感到被忽视的人
可能携带真正看见他人的天赋。

当你看到一个天赋被命名时，
不要夸大它。
只需说："我准备好提供这个了。"

然后，当你能够的时候，提供它——
以某种小小的方式，今天。
        `.trim(),
        phase: 'integration',
        icon: '✨'
      },
      {
        id: 'return_to_body',
        title: 'Step 8 — Close with a Small Ritual',
        titleZh: '第八步 — 以小仪式结束',
        body: `
When you are done, do something simple and physical:

• Drink water
• Step outside
• Touch something living
• Stretch your body
• Light a candle

Say, quietly:
"I have seen my story more clearly.
I choose how to walk it."

The Cathedral does not tell you what to do.
It shows you who you are.

What you do with that is yours.
        `.trim(),
        bodyZh: `
当你完成时，做一些简单而身体的事情：

• 喝水
• 走到户外
• 触摸活着的东西
• 伸展你的身体
• 点一支蜡烛

轻声说：
"我更清楚地看到了我的故事。
我选择如何行走。"

大教堂不告诉你该做什么。
它向你展示你是谁。

你用它做什么是你的。
        `.trim(),
        phase: 'return',
        icon: '🕯️'
      },
      {
        id: 'return_when_ready',
        title: 'Step 9 — Return When Ready',
        titleZh: '第九步 — 准备好时返回',
        body: `
You may return to the Cathedral whenever you wish.

Each time, you will be different.
Each time, the reading will speak to you differently.

This is not because the Cathedral changes,
but because you do.

The seed has become a tree.
The tree is still becoming a forest.

Welcome back, Pilgrim.
The doors are always open.
        `.trim(),
        bodyZh: `
你可以随时返回大教堂。

每一次，你都会不同。
每一次，解读都会以不同的方式与你对话。

这不是因为大教堂改变了，
而是因为你改变了。

种子已经成为一棵树。
树仍在成为森林。

欢迎回来，行者。
大门永远敞开。
        `.trim(),
        phase: 'return',
        icon: '🚪'
      }
    ],
    closing: `
This manual is not a map of the territory.
It is a compass for the traveler.

May you find what you came looking for.
May you also find what you didn't know you needed.

— The Cathedral
    `.trim(),
    closingZh: `
这本手册不是领土的地图。
它是旅行者的指南针。

愿你找到你来寻找的东西。
愿你也找到你不知道自己需要的东西。

— 大教堂
    `.trim()
  };
}

// ==================== RENDERING ====================

/**
 * Render Pilgrim Manual as markdown
 */
export function renderPilgrimManualMarkdown(
  manual: PilgrimManual,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? manual.titleZh : manual.title}`);
  lines.push('');
  lines.push(lang === 'zh' ? manual.introductionZh : manual.introduction);
  lines.push('');
  lines.push('---');
  lines.push('');

  manual.steps.forEach(step => {
    const icon = step.icon || '';
    lines.push(`## ${icon} ${lang === 'zh' ? step.titleZh : step.title}`);
    lines.push('');
    lines.push(lang === 'zh' ? step.bodyZh : step.body);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  lines.push('');
  lines.push(lang === 'zh' ? manual.closingZh : manual.closing);

  return lines.join('\n');
}

/**
 * Render Pilgrim Manual as HTML
 */
export function renderPilgrimManualHtml(
  manual: PilgrimManual,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? manual.titleZh : manual.title}</title>
  <style>
    ${getPilgrimManualStyles()}
  </style>
</head>
<body>
  <div class="pilgrim-manual">
    <header class="manual-header">
      <h1>${lang === 'zh' ? manual.titleZh : manual.title}</h1>
    </header>

    <section class="manual-intro">
      ${formatParagraphs(lang === 'zh' ? manual.introductionZh : manual.introduction)}
    </section>

    <div class="manual-steps">
      ${manual.steps.map(step => `
        <section class="manual-step phase-${step.phase}">
          <div class="step-icon">${step.icon || '•'}</div>
          <h2>${lang === 'zh' ? step.titleZh : step.title}</h2>
          <div class="step-body">
            ${formatParagraphs(lang === 'zh' ? step.bodyZh : step.body)}
          </div>
        </section>
      `).join('')}
    </div>

    <section class="manual-closing">
      ${formatParagraphs(lang === 'zh' ? manual.closingZh : manual.closing)}
    </section>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Format paragraphs
 */
function formatParagraphs(text: string): string {
  return text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

/**
 * Get Pilgrim Manual styles
 */
function getPilgrimManualStyles(): string {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: linear-gradient(135deg, #f5f3f0 0%, #e8e4dc 100%);
  color: #3a3a3a;
  line-height: 1.8;
  min-height: 100vh;
}

.pilgrim-manual {
  max-width: 700px;
  margin: 0 auto;
  padding: 48px 24px;
}

.manual-header {
  text-align: center;
  padding: 48px 0;
  border-bottom: 2px solid #c9b896;
}

.manual-header h1 {
  font-size: 2.5rem;
  color: #4a3a2a;
}

.manual-intro {
  padding: 48px 0;
  font-size: 1.1rem;
  font-style: italic;
  text-align: center;
}

.manual-intro p { margin-bottom: 1em; }

.manual-steps {
  padding: 24px 0;
}

.manual-step {
  padding: 32px;
  margin-bottom: 24px;
  background: #fffdf7;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-left: 4px solid #c9b896;
}

.manual-step.phase-preparation { border-left-color: #8e44ad; }
.manual-step.phase-entry { border-left-color: #27ae60; }
.manual-step.phase-exploration { border-left-color: #3498db; }
.manual-step.phase-integration { border-left-color: #e67e22; }
.manual-step.phase-return { border-left-color: #2c3e50; }

.step-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.manual-step h2 {
  font-size: 1.3rem;
  color: #4a3a2a;
  margin-bottom: 16px;
}

.step-body p {
  margin-bottom: 1em;
}

.manual-closing {
  padding: 48px 0;
  font-style: italic;
  text-align: center;
  border-top: 2px solid #c9b896;
  margin-top: 48px;
}

.manual-closing p { margin-bottom: 1em; }
  `.trim();
}

// ==================== EXPORTS ====================

export {
  buildPilgrimManual,
  renderPilgrimManualMarkdown,
  renderPilgrimManualHtml
};
