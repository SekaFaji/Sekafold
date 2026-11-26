export const WORLD = { width: 960, height: 540, step: 1/60 };
export const STAGES = [
 {id:1,name:'First Flight',waves:3,count:4,hp:2,reward:4},
 {id:2,name:'Crosswinds',waves:4,count:5,hp:3,reward:6},
 {id:3,name:'Paper Squadron',waves:5,count:6,hp:4,reward:8}
] as const;
export type Upgrade = 'damage'|'durability'|'reinforcement'|'rate';
export const UPGRADES: readonly Upgrade[] = ['damage','durability','reinforcement','rate'];
export const LABELS: Record<Upgrade,string> = {damage:'Sharper nose',durability:'Thicker paper',reinforcement:'Reinforced tape',rate:'Rapid folds'};
export const LIMITS: Record<Upgrade,number> = {damage:100,durability:100,reinforcement:100,rate:20};
export const cost = (level:number) => Math.ceil(20 * 1.25 ** level);
export const FLIGHT = {speed:245, response:10, radius:13, bulletSpeed:620, fireDelay:.23, repairDelay:3, repairRate:8, enemyBulletSpeed:145, enemySpeed:43, enemyFireDelay:2.5, maxBullets:400};
