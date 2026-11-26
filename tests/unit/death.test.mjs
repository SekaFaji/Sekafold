import test from 'node:test';
import assert from 'node:assert/strict';
import {deathPose,DEATH_DURATION,REDUCED_DEATH_DURATION} from '../../dist/src/render/death-sequence.js';
test('death pose folds before report and stops at terminal pose',()=>{
  assert.equal(deathPose(0).fold,0);
  assert.equal(deathPose(.09).fold,0);
  assert.ok(deathPose(.25).fold>0&&deathPose(.25).fold<1);
  assert.equal(deathPose(.45).fold,1);
  assert.equal(deathPose(.45).finished,false);
  assert.equal(deathPose(DEATH_DURATION).finished,true);
  assert.equal(deathPose(10).progress,1);
});
test('reduced motion uses short static crumple without burst',()=>{
  assert.equal(deathPose(0,true).fold,1);
  assert.equal(deathPose(.1,true).burst,0);
  assert.equal(deathPose(REDUCED_DEATH_DURATION,true).finished,true);
});
