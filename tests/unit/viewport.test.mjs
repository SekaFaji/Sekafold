import test from 'node:test';
import assert from 'node:assert/strict';
import {screenToWorld} from '../../dist/src/core/viewport.js';
test('portrait mapping matches canvas corners and center',()=>{
  const rect={left:10,top:50,width:360,height:640};
  assert.deepEqual(screenToWorld(10,50,rect),{x:0,y:0});
  assert.deepEqual(screenToWorld(190,370,rect),{x:270,y:480});
  assert.deepEqual(screenToWorld(370,690,rect),{x:540,y:960});
});
test('letterboxed portrait mapping and hidden canvas',()=>{
  const rect={left:10,top:50,width:600,height:640};
  assert.deepEqual(screenToWorld(130,50,rect),{x:0,y:0});
  assert.deepEqual(screenToWorld(310,370,rect),{x:270,y:480});
  assert.equal(screenToWorld(10,50,{...rect,width:0}),null);
});
