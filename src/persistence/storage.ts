import {decode,fresh,type Profile} from '../progression/profile.js';
const KEY='sekafold.profile.v1';
export function load():{profile:Profile;warning:string;writable:boolean}{
 try{const raw=localStorage.getItem(KEY);if(raw===null)return {profile:fresh(),warning:'',writable:true};
 try{return {profile:decode(raw),warning:'',writable:true}}catch{
 const backup=localStorage.getItem(KEY+'.backup');
 if(backup!==null){try{return {profile:decode(backup),warning:'Recovered backup. Original save retained until explicit repair.',writable:false}}catch{/* preserve both */}}
 return {profile:fresh(),warning:'Save unreadable. Playing without saving; original data is preserved.',writable:false};
 }}catch{return {profile:fresh(),warning:'Storage unavailable. Progress lasts this session only.',writable:false}}
}
export function save(p:Profile):boolean{
 try{const old=localStorage.getItem(KEY);if(old!==null){decode(old);localStorage.setItem(KEY+'.backup',old)}localStorage.setItem(KEY,JSON.stringify(p));return true}catch{return false}
}
