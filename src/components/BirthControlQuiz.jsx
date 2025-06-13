import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const questions = [
  { id: "longTerm", text: "Do you want long-term birth control (3+ years)?" },
  { id: "noEstrogen", text: "Do you want a method without estrogen?" },
  { id: "noHormones", text: "Do you want a hormone-free method?" },
  { id: "okWithProcedure", text: "Are you okay with a minor in-office procedure?" },
  { id: "breastfeeding", text: "Are you currently breastfeeding?" },
  { id: "emergency", text: "Do you need emergency contraception?" },
  { id: "moodConcerns", text: "Have you experienced mood issues with hormonal birth control?" },
];

// Full method details table (keys must match naming used in recs)
const methodsInfo = {
  "Combined Oral Contraceptives (COCs)": {
    prescription: "Yes",
    efficacy: "~91-99% (typical vs. ideal use)",
    notes: "Daily pill, requires adherence",
  },
  "Progestin-Only Pills (POPs)": {
    prescription: "Yes",
    efficacy: "~91-99% (typical vs. ideal use)",
    notes: "Daily pill, ideal for estrogen-contraindicated patients, requires strict adherence",
  },
  "Contraceptive Patch": {
    prescription: "Yes",
    efficacy: "~91-99% (typical vs. ideal use)",
    notes: "Use for 3 weeks, remove for one week, skin adhesion required",
  },
  "Vaginal Ring (e.g., NuvaRing)": {
    prescription: "Yes",
    efficacy: "~91-99% (decrease with misuse)",
    notes: "Use for 3 weeks, remove for one week, worn on inside of vagina",
  },
  "Injectable (e.g., Depo-Provera)": {
    prescription: "Yes",
    efficacy: "~96-99% (typical vs. ideal use)",
    notes: "Every 3 months, injected into arm or butt, adherence tracking required",
  },
  "Emergency Contraceptive Pill": {
    prescription: "No",
    efficacy: "54-98% (depends on time after intercourse)",
    notes: "Very time-sensitive, not for regular use, side effects can include nausea, fatigue, headaches, bleeding, pain, and more",
  },
  "Hormonal IUD (e.g., Mirena)": {
    prescription: "Yes",
    efficacy: ">99%",
    notes: "3–8 years, inserted at clinic, can cause irregular or heavy periods",
  },
  "Copper IUD (e.g., Paragard)": {
    prescription: "Yes",
    efficacy: ">99%",
    notes: "10+ years, can be used as emergency contraception, can cause heavy, irregular, painful periods",
  },
  "External Condoms": {
    type: "Barrier",
    duration: "Single Use",
    efficacy: "87-98% (typical vs. ideal use)",
    notes: "Can protect against STIs",
  },
  "Vasectomy": {
    type: "Surgical",
    duration: "Until Surgical Reversal",
    efficacy: ">99%",
    notes: "Requires in-person procedure",
  },
};

const femaleResultsMap = (answers) => {
  const recs = [];

  if (answers.noHormones) {
    if (answers.longTerm && answers.okWithProcedure) recs.push("Copper IUD (e.g., Paragard)");
    // No External Condoms for females
  } else {
    if (answers.longTerm && answers.okWithProcedure) recs.push("Hormonal IUD (e.g., Mirena)");
    if (!answers.longTerm && answers.noEstrogen) recs.push("Progestin-Only Pills (POPs)", "Injectable (e.g., Depo-Provera)");
    if (!answers.longTerm && !answers.noEstrogen) recs.push("Combined Oral Contraceptives (COCs)", "Contraceptive Patch", "Vaginal Ring (e.g., NuvaRing)");
  }

  if (answers.breastfeeding && !answers.noHormones) recs.push("Progestin-Only Pills (POPs)", "Hormonal IUD (e.g., Mirena)", "Injectable (e.g., Depo-Provera)");
  if (answers.emergency) recs.push("Emergency Contraceptive Pill", "Copper IUD (e.g., Paragard)");
  if (answers.moodConcerns) recs.push("Copper IUD (e.g., Paragard)", "Progestin-Only Pills (POPs)");

  return [...new Set(recs)];
};

export default function BirthControlQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const sexQuestion = {
    id: "sex",
    text: "What is your sex?",
    options: ["Female", "Male"],
  };

  const maleOptions = ["External Condoms", "Vasectomy"];

  const handleAnswer = (value) => {
    if (step === 0) {
      setAnswers({ sex: value });
      if (value === "Male") {
        setFinished(true);
      } else {
        setStep(1);
      }
    } else {
      const currentQuestion = questions[step - 1];
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      if (step < questions.length) {
        setStep(step + 1);
      } else {
        setFinished(true);
      }
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
  };

  // For females: suggested vs other options
  const femaleSuggested = finished && answers.sex === "Female" ? femaleResultsMap(answers) : [];
  const allFemaleMethods = [
    "Combined Oral Contraceptives (COCs)",
    "Progestin-Only Pills (POPs)",
    "Contraceptive Patch",
    "Vaginal Ring (e.g., NuvaRing)",
    "Injectable (e.g., Depo-Provera)",
    "Emergency Contraceptive Pill",
    "Hormonal IUD (e.g., Mirena)",
    "Copper IUD (e.g., Paragard)",
  ];
  const femaleOthers = allFemaleMethods.filter((m) => !femaleSuggested.includes(m));

  return (
    <div className="max-w-md mx-auto p-6">
      {!finished ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            {step === 0 ? (
              <>
                <p className="text-lg font-semibold">{sexQuestion.text}</p>
                <div className="space-x-4">
                  {sexQuestion.options.map((opt) => (
                    <Button key={opt} onClick={() => handleAnswer(opt)}>
                      {opt}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">{questions[step - 1].text}</p>
                <div className="space-x-4">
                  <Button onClick={() => handleAnswer(true)}>Yes</Button>
                  <Button onClick={() => handleAnswer(false)}>No</Button>
                </div>
                <p className="text-sm text-gray-500">{`Question ${step} of ${questions.length}`}</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-6">
            <h2 className="text-xl font-bold">Suggested Options</h2>
            <ul className="list-disc list-inside space-y-2">
              {answers.sex === "Male"
                ? maleOptions.map((opt, i) => {
                    const info = methodsInfo[opt];
                    return (
                      <li key={i}>
                        <strong>{opt}</strong>
                        <div>Type: {info.type}</div>
                        <div>Duration: {info.duration}</div>
                        <div>Efficacy: {info.efficacy}</div>
                        <div>Notes: {info.notes}</div>
                      </li>
                    );
                  })
                : femaleSuggested.map((method, i) => {
                    const info = methodsInfo[method];
                    return (
                      <li key={i}>
                        <strong>{method}</strong>
                        <div>Prescription Required: {info.prescription}</div>
                        <div>Estimated Efficacy: {info.efficacy}</div>
                        <div>Notes: {info.notes}</div>
                      </li>
                    );
                  })}
            </ul>

            {answers.sex === "Female" && (
              <>
                <h2 className="text-xl font-bold mt-6">Other Options</h2>
                <ul className="list-disc list-inside space-y-2">
                  {femaleOthers.map((method, i) => {
                    const info = methodsInfo[method];
                    return (
                      <li key={i}>
                        <strong>{method}</strong>
                        <div>Prescription Required: {info.prescription}</div>
                        <div>Estimated Efficacy: {info.efficacy}</div>
                        <div>Notes: {info.notes}</div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            <Button className="mt-6" onClick={restart}>
              Restart Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
