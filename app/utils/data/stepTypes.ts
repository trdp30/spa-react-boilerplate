import { get, upperCase } from 'lodash';

export const stepTypes = {
  INTERVIEW: 'INTERVIEW',
  LIVE: 'LIVE',
  ASSESSMENT: 'ASSESSMENT',
  SCREENING: 'SCREENING',
} as const;

export const supportedStepTypes = [stepTypes.ASSESSMENT, stepTypes.SCREENING, stepTypes.INTERVIEW] as const;

export const newSupportedStepTypes = [stepTypes.INTERVIEW, stepTypes.ASSESSMENT, stepTypes.SCREENING] as const;

type Step =
  | {
      step_type?: string;
    }
  | string
  | undefined;

export const getFormattedStepType = (step: Step): string | undefined => {
  const stepType = typeof step === 'object' && step ? step.step_type : step;
  const type = stepType ? upperCase(stepType.trim()) : '';
  if (type === 'ALL') {
    return stepType;
  }
  return type && get(stepTypes, type);
};

export const isStepTypeAssessment = (step: Step): boolean => getFormattedStepType(step) === stepTypes.ASSESSMENT;

export const isStepTypeInterview = (step: Step): boolean => getFormattedStepType(step) === stepTypes.INTERVIEW;

export const isStepTypeScreening = (step: Step): boolean => getFormattedStepType(step) === stepTypes.SCREENING;
