'use strict';
const assert=require('node:assert/strict');
const {NotificationService}=require('../lib/notifications');
(async()=>{
 const sent=[];
 const adapter={sendTo:(instance,command,data,callback)=>{sent.push({instance,command,data});callback({});}};
 const notifier=new NotificationService(adapter,{pushoverEnabled:true,pushoverInstance:'pushover.0',notifyFinished:true,notifyTwinDos:true,notificationCooldownSeconds:300});
 assert.equal(await notifier.emit('finished','washer1','Waschmaschine fertig','Miele',1000),true);
 assert.equal(await notifier.emit('finished','washer1','Waschmaschine fertig','Miele',2000),false);
 assert.equal(await notifier.emit('finished','washer1','Waschmaschine fertig','Miele',302000),true);
 assert.equal(sent.length,2);
 assert.equal(await notifier.emit('offline','washer1','Offline','Miele',400000),false);
 console.log('notification tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});