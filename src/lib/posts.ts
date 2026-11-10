// Blog posts, verbatim from gorskichiro.com. Posts keep their original root-level URLs (/<slug>).

export type Block =
  | { type: "p"; text: string }
  | { type: "lines"; lines: string[] }
  | { type: "strong"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "img"; src: string; alt: string; size?: "full" | "medium" | "small" };

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  date: string; // ISO
  dateLabel: string;
  author: string;
  category: string;
  cover: string;
  excerpt: string;
  blocks: Block[];
};

const p = (text: string): Block => ({ type: "p", text });
const h2 = (text: string): Block => ({ type: "h2", text });
const h3 = (text: string): Block => ({ type: "h3", text });
const h4 = (text: string): Block => ({ type: "h4", text });
const ul = (items: string[]): Block => ({ type: "ul", items });
const strong = (text: string): Block => ({ type: "strong", text });
const img = (src: string, alt: string, size?: "full" | "medium" | "small"): Block => ({ type: "img", src, alt, size });

export const POSTS: Post[] = [
  {
    slug: "the-foundation-of-health-why-your-nervous-system-matters-more-than-you-think",
    title: "The Foundation of Health: Why Your Nervous System Matters More Than You Think",
    seoTitle: "Why Your Nervous System Matters More Than You Think",
    date: "2026-04-20",
    dateLabel: "April 20, 2026",
    author: "Gorski Chiropractic Center",
    category: "Uncategorized",
    cover: "/images/blog-foundation-banner.jpg",
    excerpt:
      "When people think about health, they often focus on symptoms. Headaches. Back pain. Fatigue. Digestive problems. Many people in and around Warrenville, Naperville, Wheaton, and West Chicago find themselves asking the same question: “How do I get rid of this?” But there are more important questions to ask.",
    blocks: [
      p("When people think about health, they often focus on symptoms."),
      { type: "lines", lines: ["Headaches.", "Back pain.", "Fatigue.", "Digestive problems."] },
      p("Many people in and around Warrenville, Naperville, Wheaton, and West Chicago find themselves asking the same question:"),
      strong("“How do I get rid of this?”"),
      p("But there are more important questions to ask:"),
      strong("“What allows my body to be healthy in the first place? And what causes it to stop being healthy?”"),
      p("These questions sit at the heart of chiropractic philosophy and form the foundation of how we approach care at Gorski Chiropractic Center."),
      p("Understanding the answer can change the way you think about health, healing, and even chronic conditions like migraines."),
      h2("The Body Is Designed for Health"),
      p("One of the most important ideas in chiropractic philosophy is simple:"),
      strong("The body is not designed to be sick. It is designed to be healthy."),
      img("/images/blog-foundation-body.jpg", "The body is designed for health", "medium"),
      p("Your body is constantly working to express healthy function. Every second of every day, countless processes occur without your awareness:"),
      ul([
        "Cells repair and regenerate",
        "Hormones regulate metabolism",
        "Muscles coordinate movement",
        "The immune system identifies threats",
        "The brain processes information—both consciously and automatically",
      ]),
      p("You do not consciously control most of these processes."),
      p("Yet they happen with incredible precision."),
      p("This self-regulating ability is sometimes described in chiropractic as *Innate Intelligence*—the body’s natural capacity to organize, adapt, and heal."),
      p("This same idea is often described as biological regulation or homeostasis."),
      p("Regardless of the language, the idea is the same:"),
      strong("Your body is better able to function well when the system that coordinates and regulates it – your nervous system – is functioning properly."),
      h2("The Nervous System: Your Body’s Master Control System"),
      img("/images/blog-foundation-nervous.jpg", "The nervous system: your body’s master control system", "full"),
      p("If the body has this built-in ability to regulate and heal, what system coordinates it?"),
      strong("The answer is your nervous system."),
      p("Your brain, spinal cord, and nerves form a communication network that connects every part of your body."),
      p("Through this network, your body coordinates and regulates:"),
      ul(["Heart rate", "Blood pressure", "Digestion", "Hormone release", "Immune responses", "Muscle coordination", "Sensory perception", "Pain processing"]),
      p("Every organ, tissue, and cell depends on this communication."),
      p("When communication is clear, **the body functions in a healthier and more coordinated way.**"),
      p("When communication is not functioning fully and normally, normal function suffers, and your health is affected."),
      h3("Dysfunction and Its Impact on Health"),
      p("Various forms of stress can have a damaging effect on otherwise healthy nerve pathways, changing the way your brain and body are meant to communicate."),
      p("When this happens, signals between the brain and body can become altered."),
      p("That can influence how your body regulates and heals."),
      img("/images/blog-foundation-dysfunction.jpg", "Dysfunction and its impact on health", "full"),
      p("Chiropractic care focuses on identifying and reducing dysfunction within your nervous system that can interfere with your body’s ability to function and stay healthy."),
      p("At Gorski Chiropractic Center, we focus on improving nervous system function by introducing precise, gentle inputs into your nervous system, often through the spine, which can help restore more normal patterns of communication and coordination."),
      h3("Understanding the Body’s Healing Capacity"),
      img("/images/blog-foundation-healing.jpg", "Understanding the body’s healing capacity", "small"),
      p("Some describe this perspective as *vitalistic*."),
      p("At its core, this simply recognizes that the body is not just a collection of parts—it is a coordinated, self-regulating system."),
      p("Your body is constantly adapting, repairing, and reorganizing itself without conscious effort."),
      p("The nervous system plays a central role in coordinating these processes, allowing the body to respond, heal, and regulate properly."),
      p("Chiropractic care is built on this understanding—not by forcing the body to heal, but by helping restore the conditions that allow it to heal, coordinate, and self-regulate, just as it was designed."),
      h3("Health Is More Than the Absence of Symptoms"),
      p("One of the most important shifts in perspective is this:"),
      strong("Health is not simply the absence of pain."),
      p("Pain is often the last signal to appear after dysfunction has already developed."),
      p("For example:"),
      ul([
        "Neurological patterns can shift long before symptoms appear",
        "Nervous system stress can build gradually over time",
        "Migraines and other symptoms often develop after long-standing patterns of strain",
      ]),
      p("By the time symptoms appear, the underlying issue may have been present for quite some time."),
      img("/images/blog-foundation-symptoms.png", "Health is more than the absence of symptoms", "medium"),
      h3("A New Direction for Your Health"),
      p("At Gorski Chiropractic Center, we invite you to begin asking different questions:"),
      p("**Instead of asking,** “What can I take to suppress this symptom?”"),
      p("**we encourage you to ask,** “How can I help my body function at its best?”"),
      p("This perspective is especially important for people dealing with chronic conditions such as migraines."),
      p("Many people are told their only option is to manage symptoms."),
      p("But in many cases, underlying factors—such as altered neurological patterns, various stresses on the body, and long-standing habits—may be contributing to the problem."),
      p("At Gorski Chiropractic Center, these principles form the foundation of care and have led to the development of *The R.E.B.I.R.T.H. Migraine Method*, a [structured approach](/our-approach) designed to improve neurological function and address many of the [factors that can contribute to migraines](/migraine-relief)."),
      p("When the nervous system functions well, the entire body benefits."),
      p("And for many people, that becomes the beginning of real, lasting change."),
    ],
  },
  {
    slug: "is-stress-killing-you",
    title: "Is Stress Killing You?",
    seoTitle: "Is Stress Killing You?",
    date: "2024-10-04",
    dateLabel: "October 4, 2024",
    author: "Dr. Andrew Gorski",
    category: "Uncategorized",
    cover: "/images/blog-stress-1.jpg",
    excerpt:
      "The purpose of West Chicago High School’s Wellness Committee is to promote wellness among their staff. On September 11, 2024, they invited me to give multiple presentations designed to identify and reduce stresses that we have, and to share strategies to lessen the negative impact of stress.",
    blocks: [
      p("The purpose of West Chicago High School’s Wellness Committee is to promote wellness among their staff. On September 11, 2024, they invited me to give multiple presentations designed to identify and reduce stresses that we have, and to share strategies to lessen the negative impact of stress."),
      img("/images/blog-stress-2.jpg", "Dr. Gorski presenting at West Chicago High School", "full"),
      p("Below is a summary of that event."),
      h2("Is Stress Killing You?"),
      p("In today’s fast-paced world, stress has become a constant companion for many of us. We face a range of pressures, from physical demands to emotional challenges, and even chemical exposure from the foods we eat and the environment around us. Dr. Andrew Gorski’s presentation sheds light on how stress is impacting our health, and this document supports the key points discussed."),
      h2("The Growing Impact of Chronic Disease"),
      p("In less than one generation, chronic diseases have skyrocketed, now accounting for 89% of deaths. This staggering figure means that 9 out of 10 people will die from a chronic disease, and stress plays a pivotal role in this epidemic. The connection between chronic stress and long-term health problems cannot be ignored."),
      h3("Three Main Types of Stress"),
      p("To understand the far-reaching consequences of stress, it’s important to break it down into three main categories:"),
      h4("1. Physical Stress"),
      p("Our modern lifestyle often leaves us physically stressed without realizing it. Consider these daily habits:"),
      ul([
        "**Sitting for long periods:** Whether it’s at a desk or on the couch, many of us spend most of our day sitting, which contributes to various health problems such as back pain, poor posture, and even heart disease.",
        "**Cell phone use:** The time we spend looking down at our phones can cause strain on our neck and spine, sometimes referred to as “tech neck.”",
        "**Job-related tasks:** For teachers and professionals, grading papers, attending meetings, or managing tasks all day can lead to significant physical strain.",
      ]),
      h4("2. Emotional Stress"),
      p("Emotional stress is another major contributor to declining health. Some of the most common sources include:"),
      ul([
        "**Student challenges:** For educators, managing different student needs can be a huge source of stress.",
        "**Parent and administration demands:** Juggling expectations from both parents and administration can lead to feelings of overwhelm and frustration.",
        "**Personal relationships:** Beyond the workplace, personal relationships, including family or friends, can contribute to emotional strain.",
        "**Mental health struggles:** Conditions like anxiety and depression often go together with chronic stress, leading to even more complex health issues.",
      ]),
      h4("3. Chemical Stress"),
      p("Chemical stress is often the least discussed but can be just as damaging. This type of stress results from exposure to harmful substances in our daily lives:"),
      ul([
        "**Nutrition:** Poor diet choices, including processed foods, high sugar intake, and fast food, can lead to inflammation, weight gain, and other health problems.",
        "**Alcohol and nicotine:** These substances are often used as coping mechanisms but contribute to chemical imbalances in the body.",
        "**Artificial additives:** The food we eat is often filled with artificial sweeteners, dyes, and preservatives, all of which can affect our health in the long term.",
      ]),
      h2("How Do We Cope?"),
      p("In our culture, the way we handle stress often involves unhealthy coping mechanisms. Whether it’s relying on convenience foods, alcohol, or avoidance, these methods don’t address the root of the problem. Instead, they often exacerbate stress levels, pushing us closer to chronic disease."),
      h2("The Importance of Mechanical and Electrical Health"),
      p("Beyond managing stress, the presentation highlights two key areas of health that are often affected by stress: mechanical (musculoskeletal) health and electrical (nervous system) health."),
      h3("Mechanical Health (Musculoskeletal System)"),
      p("The musculoskeletal system, which includes our muscles, bones, and joints, is deeply impacted by physical stress. Poor posture, lack of movement, and repetitive strain from tasks like sitting all day can lead to chronic pain and stiffness. Proper alignment, regular movement, and posture awareness are critical for maintaining mechanical health."),
      h3("Electrical Health (Nervous System)"),
      p("The nervous system, which controls all functions in the body, is another area affected by stress. Stress triggers the “fight or flight” response, releasing hormones like cortisol and adrenaline that, over time, can cause damage to the nervous system. This can lead to headaches, fatigue, and even serious conditions like heart disease."),
      p("Maintaining electrical health involves managing stress effectively, ensuring that the nervous system can function optimally without being overburdened by constant tension."),
      h2("Which is Better: Sooner or Later?"),
      p("When it comes to managing stress and its effects on the body, there’s one clear takeaway: It’s better to address stress sooner rather than later. Waiting until stress manifests as a chronic condition can make it much harder to reverse the damage. Proactively managing stress, seeking support, and developing healthy coping mechanisms can go a long way in preventing long-term health consequences."),
      h2("A Gift to Yourself: Stress Management"),
      p("The gift we can give ourselves is learning to manage stress in healthy ways. Here are some simple yet effective strategies for reducing stress and improving overall health:"),
      ul([
        "**Exercise regularly:** Physical activity can relieve tension, improve mood, and strengthen both your body and mind.",
        "**Mindfulness and meditation:** Practicing mindfulness or meditation helps calm the mind and reduce emotional stress.",
        "**Proper nutrition:** Eating a balanced, nutrient-dense diet can help reduce chemical stress and provide the body with the fuel it needs to function at its best.",
        "**Sleep:** Prioritizing quality sleep allows the body to recover and reduces physical and emotional stress.",
      ]),
      img("/images/blog-stress-3.jpg", "Dr. Gorski with the West Chicago High School Wellness Committee", "full"),
      h2("Conclusion: Take Control of Stress Before It Controls You"),
      p("Stress may be an unavoidable part of life, but how we deal with it makes all the difference. By identifying the types of stress affecting us—whether physical, emotional, or chemical—and taking proactive steps to manage them, we can improve our health and reduce the risk of chronic disease. The sooner we address stress, the better chance we have of living longer, healthier lives."),
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug) ?? null;
