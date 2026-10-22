'use strict';
function normalizeCloud(devices){return Object.entries(devices||{}).map(([id,data])=>({id,source:'cloud',ident:data.ident||{},state:data.state||{},raw:data}));}
function normalizeLocal(devices){return (devices||[]).map(d=>({...d,source:'local'}));}
function mergeDevices(cloud,local){const merged=new Map();for(const d of [...normalizeCloud(cloud),...normalizeLocal(local)]){const key=String(d.ident?.deviceIdentLabel?.fabNumber||d.ident?.fabNumber||d.id);if(!merged.has(key))merged.set(key,{id:key,sources:{}});merged.get(key).sources[d.source]=d;}return [...merged.values()];}
module.exports={normalizeCloud,normalizeLocal,mergeDevices};