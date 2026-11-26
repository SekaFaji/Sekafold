/** Presentation-only timing. Combat and reward settlement never depend on this clock. */
export const DEATH_DURATION = .88;
export const REDUCED_DEATH_DURATION = .18;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export function deathPose(elapsed:number,reduced=false){
  const duration=reduced?REDUCED_DEATH_DURATION:DEATH_DURATION;
  const progress=clamp(elapsed/duration);
  const fold=reduced?1:clamp((elapsed-.10)/.32);
  const settle=reduced?1:clamp((elapsed-.42)/.26);
  return {progress,fold,settle,burst:reduced?0:clamp((elapsed-.08)/.55),finished:elapsed>=duration};
}
