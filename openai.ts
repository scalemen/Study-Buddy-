import OpenAI from "openai";
import { GenerateStudyMaterialRequest, GenerateQuizRequest } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Sample topics with study materials for fallback
const sampleMaterials: Record<string, string> = {
  default: `
# Study Notes

## Introduction
These are sample study notes that are provided when the OpenAI API is not available. These notes help demonstrate the functionality of the application without requiring an active API connection.

## Key Concepts
- Learning is a lifelong process
- Effective study techniques improve knowledge retention
- Regular review of material helps consolidate learning

## Best Study Practices
1. **Create a consistent schedule** - Study at the same time each day
2. **Take regular breaks** - The Pomodoro technique suggests 25 minutes of focus followed by a 5-minute break
3. **Teach concepts to others** - Explaining material helps solidify your understanding
4. **Review regularly** - Spaced repetition improves long-term memory

## Sample Formulas and Examples
For mathematics:
- Area of a circle: A = πr²
- Example: The area of a circle with radius 3 cm is A = π × 3² = 28.27 cm²

## Summary
Effective study involves active engagement with material, regular review, and application of knowledge to new contexts.
`,
  mathematics: `
# Mathematics Study Guide

## Number Theory
Number theory is the branch of mathematics that deals with the properties and relationships of numbers, especially integers.

### Prime Numbers
A prime number is a natural number greater than 1 that cannot be formed by multiplying two smaller natural numbers.

**Examples:**
- 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, ...

### The Fundamental Theorem of Arithmetic
Every integer greater than 1 can be represented uniquely as a product of prime numbers, up to the order of the factors.

**Example:**
- 60 = 2² × 3 × 5

## Algebra
Algebra is the study of mathematical symbols and the rules for manipulating these symbols.

### Quadratic Equations
The standard form is ax² + bx + c = 0, where a ≠ 0.

The quadratic formula: x = (-b ± √(b² - 4ac)) / 2a

**Example:**
Solving x² - 5x + 6 = 0:
a = 1, b = -5, c = 6
x = (5 ± √(25 - 24)) / 2
x = (5 ± √1) / 2
x = (5 ± 1) / 2
x = 3 or x = 2

## Geometry
Geometry is concerned with the properties and relations of points, lines, surfaces, solids, and higher dimensional analogs.

### Pythagorean Theorem
In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides.

a² + b² = c²

**Example:**
If a = 3 and b = 4, then c² = 3² + 4² = 9 + 16 = 25, so c = 5.

## Calculus
Calculus is the mathematical study of continuous change.

### Derivatives
The derivative of a function represents its rate of change.

**Example:**
The derivative of f(x) = x² is f'(x) = 2x.

### Integrals
Integration is the process of finding the integral of a function.

**Example:**
The integral of f(x) = 2x is F(x) = x² + C, where C is the constant of integration.
`,
  history: `
# World History Study Guide

## Ancient Civilizations

### Mesopotamia (c. 3500-500 BCE)
Located between the Tigris and Euphrates rivers in modern-day Iraq, Mesopotamia is often called the "cradle of civilization."

**Key Developments:**
- First known writing system (cuneiform)
- Urban centers and city-states
- Code of Hammurabi (one of the earliest legal codes)
- Innovations in agriculture including irrigation systems

### Ancient Egypt (c. 3100-30 BCE)
Egyptian civilization flourished along the Nile River for over 3,000 years.

**Key Developments:**
- Hieroglyphic writing
- Monumental architecture (pyramids, temples)
- Advanced understanding of mathematics and astronomy
- Complex religious beliefs centered around pharaohs and afterlife

## Classical Period

### Ancient Greece (c. 800-146 BCE)
Greek civilization laid the foundations for Western culture.

**Key Developments:**
- Development of democracy in Athens
- Philosophical traditions (Socrates, Plato, Aristotle)
- Advancements in art, architecture, and literature
- Olympic Games

### Roman Empire (27 BCE-476 CE)
Rome grew from a city-state to control the entire Mediterranean region.

**Key Developments:**
- Republican government before transition to empire
- Legal system that influenced modern law
- Engineering feats (roads, aqueducts, architecture)
- Spread of Christianity throughout Europe

## Middle Ages (476-1453 CE)

### Feudal System
After the fall of Rome, Europe developed a hierarchical social structure.

**Components:**
- Monarchy at the top
- Nobles who provided military service
- Knights who served nobles
- Peasants who worked the land

### Islamic Golden Age (c. 750-1258 CE)
While Europe experienced the Dark Ages, Islamic civilization flourished.

**Key Developments:**
- Preservation and expansion of Greek and Roman knowledge
- Advancements in mathematics, astronomy, medicine
- Development of universities and libraries
- Cultural and commercial exchange along trade routes

## Renaissance and Early Modern Period (c. 1400-1750)

### Renaissance
A cultural rebirth that began in Italy and spread throughout Europe.

**Key Developments:**
- Renewed interest in classical learning
- Artistic innovations (perspective, realism)
- Humanist philosophy
- Scientific advancements

### Age of Exploration
European powers sought new trade routes and territories.

**Key Events:**
- Columbus's voyage to the Americas (1492)
- Magellan's circumnavigation of the globe (1519-1522)
- Establishment of colonial empires
- Columbian Exchange of plants, animals, and diseases
`,
  science: `
# Biology Study Guide

## Cell Structure and Function

### Eukaryotic Cells
Complex cells with a nucleus and membrane-bound organelles.

**Key Organelles:**
- **Nucleus**: Contains genetic material (DNA)
- **Mitochondria**: Powerhouse of the cell; produces ATP through cellular respiration
- **Endoplasmic Reticulum**: Protein synthesis and transport
- **Golgi Apparatus**: Modifies, packages, and distributes proteins
- **Lysosomes**: Contain digestive enzymes to break down waste

### Prokaryotic Cells
Simpler cells lacking a nucleus and membrane-bound organelles.

**Features:**
- Circular DNA in the nucleoid region
- Cell wall (in most)
- Ribosomes for protein synthesis
- Some have flagella for movement

## Genetics

### DNA Structure
DNA (deoxyribonucleic acid) is composed of nucleotides containing:
- Deoxyribose sugar
- Phosphate group
- Nitrogenous base (Adenine, Thymine, Guanine, or Cytosine)

The structure is a double helix with complementary base pairing (A-T, G-C).

### Protein Synthesis
**Transcription**: DNA → RNA
1. DNA unwinds at the gene location
2. RNA polymerase creates mRNA using the DNA template
3. mRNA leaves the nucleus

**Translation**: RNA → Protein
1. mRNA attaches to a ribosome
2. tRNA brings amino acids to the ribosome
3. Amino acids are linked together based on the mRNA codons
4. The growing amino acid chain folds into a functional protein

## Evolution

### Natural Selection
Darwin's theory explains how species adapt to their environment:
1. Variation exists within populations
2. More offspring are produced than can survive
3. Individuals with advantageous traits survive and reproduce more successfully
4. These traits become more common in the population over time

**Examples of Natural Selection:**
- Antibiotic resistance in bacteria
- Peppered moths during the Industrial Revolution
- Darwin's finches on the Galápagos Islands

### Mechanisms of Evolution
- **Mutation**: Changes in DNA sequence; the ultimate source of genetic variation
- **Gene Flow**: Transfer of alleles between populations
- **Genetic Drift**: Random change in allele frequency, especially in small populations
- **Sexual Selection**: Traits that improve mating success

## Ecology

### Energy Flow in Ecosystems
Energy enters ecosystems through photosynthesis and flows through trophic levels:
1. Producers (plants, algae)
2. Primary consumers (herbivores)
3. Secondary consumers (carnivores that eat herbivores)
4. Tertiary consumers (carnivores that eat other carnivores)
5. Decomposers (break down dead organisms)

Only about 10% of energy transfers between each trophic level.

### Biogeochemical Cycles
- **Carbon Cycle**: Photosynthesis, respiration, decomposition, fossil fuel combustion
- **Nitrogen Cycle**: Nitrogen fixation, nitrification, denitrification
- **Water Cycle**: Evaporation, condensation, precipitation, runoff, groundwater
- **Phosphorus Cycle**: Weathering of rocks, plant uptake, decomposition, sedimentation
`
};

// Function to determine subject area for fallback content
function determineFallbackSubject(topic: string, subject?: string): string {
  // First check for exact subject match if provided
  if (subject) {
    const normalizedSubject = subject.toLowerCase();
    if (normalizedSubject.includes('math')) return 'mathematics';
    if (normalizedSubject.includes('history')) return 'history';
    if (normalizedSubject.includes('biology') || 
        normalizedSubject.includes('chemistry') || 
        normalizedSubject.includes('physics')) return 'science';
  }
  
  // Then check for topic keywords
  const normalizedTopic = topic.toLowerCase();
  
  // Mathematics related topics
  if (normalizedTopic.includes('math') || 
      normalizedTopic.includes('algebra') || 
      normalizedTopic.includes('calculus') || 
      normalizedTopic.includes('geometry') ||
      normalizedTopic.includes('equation') ||
      normalizedTopic.includes('theorem') ||
      normalizedTopic.includes('arithmetic') ||
      normalizedTopic.includes('trigonometry') ||
      normalizedTopic.includes('statistics') ||
      normalizedTopic.includes('probability')) return 'mathematics';
      
  // History related topics
  if (normalizedTopic.includes('history') || 
      normalizedTopic.includes('world war') || 
      normalizedTopic.includes('ancient') || 
      normalizedTopic.includes('civilization') ||
      normalizedTopic.includes('medieval') ||
      normalizedTopic.includes('renaissance') ||
      normalizedTopic.includes('revolution') ||
      normalizedTopic.includes('empire') ||
      normalizedTopic.includes('dynasty') ||
      normalizedTopic.includes('century') ||
      normalizedTopic.includes('historical')) return 'history';
      
  // Science related topics
  if (normalizedTopic.includes('biology') || 
      normalizedTopic.includes('cell') || 
      normalizedTopic.includes('dna') || 
      normalizedTopic.includes('evolution') ||
      normalizedTopic.includes('science') ||
      normalizedTopic.includes('physics') ||
      normalizedTopic.includes('chemistry') ||
      normalizedTopic.includes('atom') ||
      normalizedTopic.includes('molecule') ||
      normalizedTopic.includes('genetics') ||
      normalizedTopic.includes('organism') ||
      normalizedTopic.includes('quantum') ||
      normalizedTopic.includes('biology') ||
      normalizedTopic.includes('theory')) return 'science';
      
  // If no specific subject is detected, return default
  return 'default';
}

export async function generateStudyMaterial(request: GenerateStudyMaterialRequest): Promise<string> {
  const { topic, format, difficulty, learningStyle, includeExamples, includeVisuals, subject } = request;

  try {
    let prompt = `Create comprehensive ${format} about "${topic}"`;
    
    if (subject) {
      prompt += ` in the subject area of ${subject}`;
    }
    
    prompt += `. The content should be at a ${difficulty} level and use a ${learningStyle} learning style.`;
    
    if (includeExamples) {
      prompt += " Include practical examples to illustrate key concepts.";
    }
    
    if (includeVisuals) {
      prompt += " Describe any visual aids or diagrams that would be helpful (note: actual images won't be generated).";
    }
    
    prompt += " Format the output in markdown with appropriate headings, lists, and emphasis.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator who specializes in creating clear, accurate, and engaging study materials."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content || "Unable to generate study material.";
  } catch (error) {
    console.error("Error generating study material:", error);
    
    // Use fallback content when OpenAI API is unavailable
    const fallbackSubject = determineFallbackSubject(topic, subject);
    const fallbackContent = sampleMaterials[fallbackSubject] || sampleMaterials.default;
    
    // Create a custom introduction for the specific topic
    let customIntro = `# ${topic} - Study Material\n\n`;
    customIntro += `_Note: This is sample content for "${topic}" (API limit reached). The following material covers key concepts in ${fallbackSubject}._\n\n`;
    
    if (fallbackSubject === 'mathematics') {
      customIntro += `## ${topic} Overview\n\nThe study of ${topic} is an important area in mathematics that helps us understand numerical relationships and solve problems efficiently. Below is general information about mathematical concepts that can be applied to this topic.\n\n`;
    } else if (fallbackSubject === 'history') {
      customIntro += `## ${topic} Context\n\nUnderstanding ${topic} requires knowledge of historical events and their significance. The following material provides context for historical analysis that can be applied to this specific topic.\n\n`;
    } else if (fallbackSubject === 'science') {
      customIntro += `## ${topic} in Science\n\n${topic} is an important concept in science. The following material covers fundamental scientific principles that relate to this topic.\n\n`;
    } else {
      customIntro += `## Understanding ${topic}\n\nThe following general study principles can be applied to learning about ${topic}. This material covers effective learning strategies.\n\n`;
    }
    
    // Return the customized content
    return customIntro + fallbackContent;
  }
}

// Sample quiz questions for fallback
const sampleQuizzes: Record<string, any> = {
  default: {
    questions: [
      {
        questionText: "What is the primary purpose of effective study techniques?",
        options: [
          "To reduce study time",
          "To improve knowledge retention",
          "To make learning more difficult",
          "To increase stress levels"
        ],
        correctOptionIndex: 1,
        explanation: "Effective study techniques are primarily designed to improve knowledge retention by engaging with material in ways that enhance memory and understanding."
      },
      {
        questionText: "Which of the following is a recommended study practice?",
        options: [
          "Studying for many hours without breaks",
          "Only reviewing material right before exams",
          "Taking regular breaks during study sessions",
          "Studying in noisy environments"
        ],
        correctOptionIndex: 2,
        explanation: "Taking regular breaks during study sessions, such as using the Pomodoro technique (25 minutes of focus followed by a 5-minute break), helps maintain concentration and improve overall productivity."
      },
      {
        questionText: "What does the Pomodoro technique suggest?",
        options: [
          "Studying with music",
          "25 minutes of focus followed by a 5-minute break",
          "Studying late at night",
          "Memorizing rather than understanding"
        ],
        correctOptionIndex: 1,
        explanation: "The Pomodoro technique suggests breaking work into intervals, traditionally 25 minutes of focused work followed by a 5-minute break, to improve mental agility and focus."
      },
      {
        questionText: "Why is teaching concepts to others an effective study method?",
        options: [
          "It takes less time than other methods",
          "It helps solidify your understanding of the material",
          "It requires no preparation",
          "It only works for mathematical subjects"
        ],
        correctOptionIndex: 1,
        explanation: "Teaching concepts to others is effective because it requires you to organize your thoughts, explain ideas clearly, and identify gaps in your understanding, which helps solidify your knowledge of the material."
      },
      {
        questionText: "What is spaced repetition?",
        options: [
          "Studying the same material repeatedly in one session",
          "Taking long breaks between study sessions",
          "Reviewing material at increasing intervals over time",
          "Studying different subjects at the same time"
        ],
        correctOptionIndex: 2,
        explanation: "Spaced repetition is a learning technique that involves reviewing material at increasing intervals over time. This approach improves long-term retention by reinforcing memory just before you're likely to forget the information."
      }
    ]
  },
  mathematics: {
    questions: [
      {
        questionText: "What is the value of x in the equation 2x + 5 = 13?",
        options: [
          "3",
          "4",
          "5",
          "6"
        ],
        correctOptionIndex: 1,
        explanation: "To solve for x: 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide both sides by 2: x = 4."
      },
      {
        questionText: "Which of the following is a prime number?",
        options: [
          "1",
          "15",
          "17",
          "21"
        ],
        correctOptionIndex: 2,
        explanation: "17 is a prime number because it is only divisible by 1 and itself. 1 is not considered a prime number. 15 is divisible by 1, 3, 5, and 15. 21 is divisible by 1, 3, 7, and 21."
      },
      {
        questionText: "What is the area of a circle with radius 4 units?",
        options: [
          "8π square units",
          "16π square units",
          "4π square units",
          "64π square units"
        ],
        correctOptionIndex: 1,
        explanation: "The area of a circle is given by A = πr². With r = 4, we get A = π × 4² = 16π square units."
      },
      {
        questionText: "What is the Pythagorean theorem?",
        options: [
          "a + b = c",
          "a² - b² = c²",
          "a² + b² = c²",
          "(a + b)² = c²"
        ],
        correctOptionIndex: 2,
        explanation: "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse (c) equals the sum of the squares of the lengths of the other two sides (a and b), expressed as a² + b² = c²."
      },
      {
        questionText: "If f(x) = 3x² + 2x - 4, what is f(2)?",
        options: [
          "8",
          "10",
          "12",
          "16"
        ],
        correctOptionIndex: 3,
        explanation: "Substitute x = 2 into the function: f(2) = 3(2)² + 2(2) - 4 = 3(4) + 4 - 4 = 12 + 4 - 4 = 16."
      }
    ]
  }
};

export async function generateQuiz(request: GenerateQuizRequest): Promise<{
  questions: Array<{
    questionText: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }>
}> {
  const { topic, difficulty, totalQuestions, subject } = request;

  try {
    let prompt = `Create a quiz about "${topic}"`;
    
    if (subject) {
      prompt += ` in the subject area of ${subject}`;
    }
    
    prompt += `. The quiz should have exactly ${totalQuestions} multiple-choice questions at a ${difficulty} level.`;
    prompt += " For each question, provide four possible answers, clearly indicate which answer is correct (using a zero-based index, from 0 to 3), and provide a brief explanation for why the correct answer is right.";
    prompt += " Return the response in JSON format with the following structure: { \"questions\": [{ \"questionText\": \"...\", \"options\": [\"option1\", \"option2\", \"option3\", \"option4\"], \"correctOptionIndex\": 0, \"explanation\": \"...\" }, ...] }";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator who specializes in creating clear, accurate, and challenging quiz questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
      throw new Error("Failed to generate quiz questions");
    }

    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    // Use fallback quiz when OpenAI API is unavailable
    const fallbackSubject = determineFallbackSubject(topic, subject);
    let fallbackQuiz = JSON.parse(JSON.stringify(sampleQuizzes[fallbackSubject] || sampleQuizzes.default));
    
    // Limit the number of questions to match request
    fallbackQuiz.questions = fallbackQuiz.questions.slice(0, totalQuestions);
    
    // Customize quiz questions to make them more relevant to the requested topic
    if (fallbackQuiz.questions && fallbackQuiz.questions.length > 0) {
      fallbackQuiz.questions.forEach((question: any, index: number) => {
        // Add a reference to the topic in the first question to make it more relevant
        if (index === 0) {
          question.questionText = `In the context of ${topic}, ${question.questionText.toLowerCase()}`;
        }
        
        // Add a note about the fallback content to the explanation of the first question
        if (index === 0) {
          question.explanation += ` (Note: This is a sample question related to ${topic} provided due to API limitations)`;
        }
      });
    }
    
    return fallbackQuiz;
  }
}
