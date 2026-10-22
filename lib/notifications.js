'use strict';
/**
 * Sends Miele notifications through an installed ioBroker Pushover adapter.
 * Integrate this service into the adapter lifecycle after device-state normalization.
 */
class NotificationService {
 constructor(adapter, config={}) {this.adapter=adapter;this.config=config;this.last=new Map();}
 async emit(event, deviceId, message, title='Miele', now=Date.now()) {
  const c=this.config;
  if(!c.pushoverEnabled)return false;
  const switches={finished:'notifyFinished',twindos:'notifyTwinDos',error:'notifyErrors',offline:'notifyOffline'};
  if(!switches[event]||!c[switches[event]])return false;
  const key=`${deviceId}:${event}`;
  const cooldown=Math.max(0,Number(c.notificationCooldownSeconds??300))*1000;
  if(this.last.has(key)&&now-this.last.get(key)<cooldown)return false;
  const instance=/^pushover\.\d+$/.test(c.pushoverInstance||'')?c.pushoverInstance:null;
  if(!instance)throw Error('Invalid Pushover instance (expected pushover.0)');
  // ioBroker pushover adapter accepts {message,title,priority} via sendTo.
  await new Promise((resolve,reject)=>this.adapter.sendTo(instance,'send',{
   message:String(message),title:String(title),priority:Number(c.pushoverPriority??0)
  },response=>response?.error?reject(new Error(String(response.error))):resolve()));
  this.last.set(key,now);
  return true;
 }
}
module.exports={NotificationService};