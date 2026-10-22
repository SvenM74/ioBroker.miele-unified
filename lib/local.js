'use strict';
// Local MieleH256/DOP2 transport must be implemented from validated protocol traces.
// No undocumented command is guessed and no unauthenticated HTTP fallback is attempted.
class MieleLocal {
 constructor(config){this.config=config;}
 get configured(){return Boolean(this.config.groupId && this.config.groupKey && this.config.deviceIp);}
 async connect(){if(!this.configured)throw Error('Local needs device IP, GroupID and GroupKey');throw Error('Native MieleH256/DOP2 transport not yet implemented');}
 async devices(){return this.connect();}
 async command(){throw Error('Local writes disabled until authenticated DOP2 is implemented and tested');}
}
module.exports={MieleLocal};