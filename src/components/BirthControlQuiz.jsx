import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const questions = [
  { id: "lowMaintenance", text: "I want something low-maintenance" },
  { id: "noDaily", text: "I don’t want to take something daily" },
  { id: "noEstrogen", text: "I prefer no estrogen" },
  { id: "breastfeeding", text: "I’m breastfeeding" },
  { id: "wantPregnant", text: "I want to get pregnant in the next year" },
  { id: "moodChanges", text: "I have a history of mood changes with hormones" },
  { id: "over190lbs", text: "I weigh over 190 lbs" },
  { id: "selfInsertion", text: "I’m okay with self-insertion" },
  { id: "emergency", text: "I need something ASAP (emergency)" },
];

// Methods info (same as before)
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

  if (answers.emergency) {
    recs.push("Emergency Contraceptive Pill", "Copper IUD (e.g., Paragard)");
  }

  if (answers.wantPregnant) {
    // For those wanting pregnancy soon, suggest only methods that can be stopped easily or no method
    recs.push("External Condoms");
    // Copper IUD can be removed any time, so okay
    recs.push("Copper IUD (e.g., Paragard)");
    return [...new Set(recs)];
  }

  if (answers.noEstrogen) {
    if (answers.noDaily) {
      // Long-acting no-estrogen options
      recs.push("Copper IUD (e.g., Paragard)", "Hormonal IUD (e.g., Mirena)", "Injectable (e.g., Depo-Provera)");
    } else {
      // Daily no-estrogen option
      recs.push("Progestin-Only Pills (POPs)");
    }
  } else {
    if (answers.noDaily) {
      // Long-acting estrogen-containing or patch/ring
      recs.push("Hormonal IUD (e.g., Mirena)", "Injectable (e.g., Depo-Provera)", "Contraceptive Patch", "Vaginal Ring (e.g., NuvaRing)");
    } else {
      // Daily estrogen-containing pills
      recs.push("Combined Oral Contraceptives (COCs)");
    }
  }

  if (answers.breastfeeding) {
    recs.push("Progestin-Only Pills (POPs)", "Hormonal IUD (e.g., Mirena)", "Injectable (e.g., Depo-Provera)");
  }

  if (answers.moodChanges) {
    recs.push("Copper IUD (e.g., Paragard)", "Progestin-Only Pills (POPs)");
  }

  if (answers.over190lbs) {
    // Patch and ring might be less effective at higher weight
    recs.push("Combined Oral Contraceptives (COCs)", "Progestin-Only Pills (POPs)", "Hormonal IUD (e.g., Mirena)", "Copper IUD (e.g., Paragard)", "Injectable (e.g., Depo-Provera)");
  }

  if (answers.selfInsertion) {
    recs.push("Vaginal Ring (e.g., NuvaRing)");
  }

  // Always add external condoms for barrier method option
  recs.push("External Condoms");

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

  const femaleSuggested = finished && answers.sex === "Female" ? femaleResultsMap(answers) : [];
  const allFemaleMethods = Object.keys(methodsInfo).filter(
    (m) =>
      !["External Condoms", "Vasectomy"].includes(m) // exclude male-only methods
  );
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
