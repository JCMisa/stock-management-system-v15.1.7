import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export const askAiPrescription = model.startChat({
  generationConfig,
  safetySettings,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "You are an expert doctor with 80 years of experience, provide me a prescription based on the following data, provide only direct answer, no excuses that you are an AI:\n\n\n\nHealth condition: Stomach pain,\n\nDescription of condition: I’ve been experiencing this sharp, gnawing pain in my upper abdomen for the past few days. It feels like it's burning, especially after I eat, and sometimes it gets worse at night. I also feel bloated and nauseous, and I've lost my appetite because eating seems to make the pain worse. The discomfort is really affecting my daily activities and sleep.,\n\nSeverity: moderate,\n\nFamily medical history: asthma,\n\nAllergies: dust, cotton, feather\n\n\n\nCould you please provide a possible diagnosis, suggest some medicines I can take, and give me any advice or personalized prescription?\n\n\n\nI need the response in a rich text HTML format consisting of:\n\n\n\nA short, bold header for the diagnosis.\n\n\n\nA bulleted list of prescriptions where each bullet contains the medicine name and the respective quantity to prescribe, along with detailed information about when and how to take them.\n\n\n\nA paragraph with personalized advice or suggestions for managing the condition.\n\n\n\nExample response format:\n\n\n\n<h2><b>Prescription:</b></h2>\n\n\n\n<ul> <li><b>Medicine Name:</b> Quantity - Detailed information about when and how to take it.</li> <li><b>Medicine Name:</b> Quantity - Detailed information about when and how to take it.</li> </ul>\n\n\n\n<p><b>Advice:</b> Personalized advice or suggestions for managing the condition.</p>",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "```html\n<h2><b>Prescription:  Possible Gastritis or Peptic Ulcer</b></h2>\n\n<ul>\n<li><b>Medicine Name:</b> Omeprazole 20mg - Take one tablet daily in the morning, 30 minutes before breakfast, for 4 weeks.  If symptoms persist, consult immediately.</li>\n<li><b>Medicine Name:</b> Sucralfate 1g - Take one tablet four times a day, one hour before meals and at bedtime, for 4 weeks.</li>\n<li><b>Medicine Name:</b>  Pantoprazole 40mg - If symptoms don't improve after 4 weeks of Omeprazole, switch to this.  Take one tablet daily in the morning, 30 minutes before breakfast, for 4 weeks. Consult immediately if no improvement.</li>\n</ul>\n\n<p><b>Advice:</b>  Avoid spicy, acidic, and greasy foods. Eat small, frequent meals instead of three large ones.  Avoid alcohol and caffeine.  Stress can exacerbate stomach issues; consider relaxation techniques like deep breathing or meditation.  This prescription is a starting point.  If your symptoms worsen or don't improve after 4 weeks, or if you experience any alarming symptoms (e.g., severe pain, bloody vomit or stool), seek immediate medical attention.  This is not a substitute for a proper in-person examination and diagnosis by a qualified physician. This information is for guidance only and does not constitute a comprehensive treatment plan.  The asthma and allergies mentioned are not directly related to your current symptoms but should be noted in future consultations.</p>\n```\n",
        },
      ],
    },
  ],
  // history: [
  //   {
  //     role: "user",
  //     parts: [
  //       {
  //         text: "You are an expert doctor with 80 years of experience, provide me a prescription based on the following data:\n\nHealth condition: Stomach pain,\nDescription of condition: I’ve been experiencing this sharp, gnawing pain in my upper abdomen for the past few days. It feels like it's burning, especially after I eat, and sometimes it gets worse at night. I also feel bloated and nauseous, and I've lost my appetite because eating seems to make the pain worse. The discomfort is really affecting my daily activities and sleep,\nSeverity: moderate,\nFamily medical history: Asthma,\nAllergies: Peanuts, Feather, Cotton\n\nCould you please provide a possible diagnosis, suggest some medicines I can take, and give me any advice or personalized prescription?\n\nI need the response in a rich text HTML format consisting of:\n\nA short, bold header for the diagnosis.\n\nA bulleted list of prescriptions where each bullet contains the medicine name and the respective quantity to prescribe, along with detailed information about when and how to take them.\n\nA paragraph with personalized advice or suggestions for managing the condition.\n\nExample response format:\n\n<h2><b>Prescription:</b></h2>\n\n<ul> <li><b>Medicine Name:</b> Quantity - Detailed information about when and how to take it.</li> <li><b>Medicine Name:</b> Quantity - Detailed information about when and how to take it.</li> </ul>\n\n<p><b>Advice:</b> Personalized advice or suggestions for managing the condition.</p>\n",
  //       },
  //     ],
  //   },
  //   {
  //     role: "model",
  //     parts: [
  //       {
  //         text: "```html\n<h2><b>Possible Diagnosis: Peptic Ulcer or Gastritis</b></h2>\n\n<p><b>Disclaimer:</b>  I am an AI and cannot provide medical advice. The following is for informational purposes only and does not constitute a prescription.  You MUST consult with a licensed medical professional for a proper diagnosis and treatment plan.  The information below is based on the symptoms described, and a real doctor needs to perform a physical examination and potentially order tests (like an endoscopy) to confirm the diagnosis and rule out other possibilities.</p>\n\n<ul>\n  <li><b>Medicine Name:</b> Omeprazole (Proton Pump Inhibitor)\n    <br><b>Quantity:</b> 20mg tablets, 1 tablet twice daily for 4 weeks.\n    <br><b>Instructions:</b> Take one tablet in the morning and one in the evening, at least 30 minutes before meals.  Do not crush or chew the tablets.  This medication reduces stomach acid production.\n  </li>\n  <li><b>Medicine Name:</b> Sucralfate (Mucosal Protectant)\n    <br><b>Quantity:</b> 1 gram tablets, 1 tablet four times daily.\n    <br><b>Instructions:</b> Take one tablet one hour before meals and at bedtime.  This medication forms a protective coating over the ulcer or irritated stomach lining.\n  </li>\n  <li><b>Medicine Name:</b> Misoprostol (Cytoprotective agent - *only if prescribed by a doctor after assessment*)\n    <br><b>Quantity:</b> As prescribed by your doctor.\n    <br><b>Instructions:</b> To be taken as directed by your physician. Misoprostol is not routinely recommended and carries potential side effects, so it's crucial to have a doctor assess the need.\n  </li>\n  <li><b>Medicine Name:</b>  Over-the-counter Antacid (e.g., Tums, Rolaids)\n    <br><b>Quantity:</b> As needed for mild, occasional relief.\n    <br><b>Instructions:</b> Chew tablets thoroughly and follow package directions. This is for temporary relief only.  Do not rely solely on antacids.\n  </li>\n</ul>\n\n<p><b>Advice:</b> Given your description, peptic ulcer or gastritis is a possibility, but other conditions could also cause your symptoms. It is crucial to seek immediate medical attention from a gastroenterologist or your primary care physician.  They can accurately diagnose the problem and create a personalized treatment plan. In the meantime, follow these recommendations:\n\n* **Dietary Changes:** Avoid foods that aggravate your symptoms, such as spicy foods, caffeine, alcohol, and acidic drinks.  Eat small, frequent meals instead of large ones. Consider a bland diet (e.g., toast, crackers, boiled chicken) until your pain subsides.\n* **Stress Management:**  Stress can worsen stomach problems.  Practice relaxation techniques like deep breathing or meditation.\n* **Hydration:** Drink plenty of fluids, especially water, to help soothe your stomach.\n* **Medication Adherence:**  Strictly follow the instructions provided by your doctor for prescribed medications. Do not stop taking any medication without consulting your doctor.\n* **Monitoring Symptoms:** Keep track of your symptoms, including pain intensity, frequency, and the foods that seem to trigger it.  Share this information with your doctor.\n* **Allergies:**  Remember your allergies to peanuts, feathers, and cotton. This is important information for any medical professional you consult. Your asthma history is also relevant and must be shared.\n</p>\n\n<p><b>Important Note:</b> This information is for educational purposes only and should not be considered medical advice.  Always consult a doctor for diagnosis and treatment of any medical condition. Delaying or avoiding proper medical care can have serious consequences.</p>\n```\n",
  //       },
  //     ],
  //   },
  // ],
});
