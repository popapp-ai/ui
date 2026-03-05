import React from "react";
import { OnboardingScreen } from "@popapp/components/onboarding";
import { OptionGroup } from "@popapp/components/option-group";
import { useData, useField } from "./_layout";

const GOALS = [
  { value: "fitness", label: "Fitness", description: "Track workouts and nutrition" },
  { value: "learning", label: "Learning", description: "Build study habits" },
  { value: "productivity", label: "Productivity", description: "Manage tasks and time" },
  { value: "mindfulness", label: "Mindfulness", description: "Meditation and journaling" },
];

export default function GoalStep() {
  const goal = useData((d) => d.goal);
  const setField = useField();

  return (
    <OnboardingScreen
      options={{
        title: "Choose your Goal",
        subtitle: "What would you like to focus on?",
        disabled: goal === null,
      }}
    >
      <OptionGroup
        mode="single"
        options={GOALS}
        value={goal}
        onChange={(value) => setField('goal', value)}
      />
    </OnboardingScreen>
  );
}
