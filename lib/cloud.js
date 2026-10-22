'use strict';
const API = 'https://api.mcs3.miele.com/v1';
const TOKEN = 'https://api.mcs3.miele.com/thirdparty/token';
class MieleCloud {
  constructor(config, log) { this.config=config; this.log=log; this.accessToken=''; this.expiry=0; }
  async authenticate() {
    if (this.accessToken && Date.now() < this.expiry-60000) return;
    if (this.config.accessToken) { this.accessToken=this.config.accessToken; this.expiry=Date.now()+3600000; return; }
    if (!this.config.clientId || !this.config.clientSecret || !this.config.refreshToken) throw Error('Cloud requires client ID, client secret and refresh token, or a temporary access token');
    const body=new URLSearchParams({grant_type:'refresh_token',refresh_token:this.config.refreshToken,client_id:this.config.clientId,client_secret:this.config.clientSecret});
    const response=await fetch(TOKEN,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,signal:AbortSignal.timeout(12000)});
    if(!response.ok) throw Error(`OAuth refresh HTTP ${response.status}`);
    const json=await response.json();
    if(!json.access_token) throw Error('OAuth response missing access_token');
    this.accessToken=json.access_token; this.expiry=Date.now()+(json.expires_in||3600)*1000;
    if(json.refresh_token) this.config.refreshToken=json.refresh_token;
  }
  async request(path, method='GET', payload) {
    await this.authenticate();
    const headers={Authorization:`Bearer ${this.accessToken}`,Accept:'application/json'};
    if(payload!==undefined) headers['Content-Type']='application/json';
    const res=await fetch(`${API}${path}`,{method,headers,body:payload===undefined?undefined:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
    if(res.status===401){this.expiry=0;throw Error('Cloud authentication expired');}
    if(!res.ok)throw Error(`Cloud ${method} ${path}: HTTP ${res.status}`);
    const raw=await res.text();return raw?JSON.parse(raw):{};
  }
  devices(){return this.request('/devices');}
  actions(id){return this.request(`/devices/${encodeURIComponent(id)}/actions`);}
  programs(id){return this.request(`/devices/${encodeURIComponent(id)}/programs`);}
  async command(id, action){return this.request(`/devices/${encodeURIComponent(id)}/actions`,'PUT',action);}
}
module.exports={MieleCloud};