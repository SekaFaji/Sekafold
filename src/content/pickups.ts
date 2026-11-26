import type {TimedEffect} from '../game/abilities/attributes.js';
export type PickupKind='rapid'|'repair'|'power';
export const PICKUPS={everyShotKills:3,lifetime:12,radius:27,maxActive:6,healFraction:.2,noticeDuration:1.5};
export const PICKUP_ORDER:readonly PickupKind[]=['rapid','repair','power'];
export const PICKUP_LABELS:Readonly<Record<PickupKind,string>>={rapid:'Rapid Fire',repair:'Paper Repair',power:'Power Boost'};
export const RAPID_EFFECT:TimedEffect={id:'pickup.rapid',duration:6,modifiers:{fireDelay:{multiply:.65}},tags:['buff.rapid']};
export const POWER_EFFECT:TimedEffect={id:'pickup.power',duration:6,modifiers:{damage:{multiply:1.5}},tags:['buff.power']};
