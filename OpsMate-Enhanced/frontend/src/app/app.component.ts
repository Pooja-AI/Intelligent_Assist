import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService } from './mock-api.service';
import { Message, PluginResult } from './models';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent {
  agent='AEM Agent'; lob='CORP'; mode='Assistant'; darkMode=false; historySearch=''; showPromptLibrary=false; lastQuestion=''; query=''; sidebarOpen=true; busy=false; activeTab='Home'; selectedLevel='ALL'; showRecommendations=true;
  agents=['AEM Agent','Archer','MarTech Operations','HR Operations','ETC Agent','HR Tableau']; modes=['Assistant','Developer']; lobs=['CORP','PiTech','INS','FAS','INTL']; showAemOptions=false;
  prompts=[{icon:'◎',title:'Check page health',description:'Status and cache insights',question:'Check the cache status for /content/vanguard/en/home'},{icon:'⌕',title:'Analyze logs',description:'Investigate recent errors',question:'Search the logs for errors in the last hour'},{icon:'▤',title:'Query S3 data',description:'Look up structured records',question:'Query sample S3 CSV data'},{icon:'◇',title:'Track workflows',description:'Review tasks and approvals',question:'What is the current workflow status for my page?'}];
  messages=signal<Message[]>([]); history=signal<{name:string; agent:string; count:number; messages:Message[]}[]>([]); showSearch=false; showUserMenu=false;
  hasMessages=computed(()=>this.messages().length>0);
  constructor(private api:MockApiService){}
  async send(question?:string) { const text=(question??this.query).trim(); this.lastQuestion=text; if(!text||this.busy)return; this.query=''; document.querySelectorAll('textarea').forEach(t=>(t as HTMLTextAreaElement).style.height=''); this.activeTab='Home'; this.messages.update(a=>[...a,{id:Date.now(),role:'user',text,time:this.time()}]);this.busy=true;
    try { const result=await this.api.ask(text,this.agent,this.lob);this.messages.update(a=>[...a,{id:Date.now()+1,role:'assistant',text:result.summary,result,time:this.time()}]); }
    catch {this.messages.update(a=>[...a,{id:Date.now()+1,role:'assistant',text:'Something went wrong. Please try again.',time:this.time()}]);}
    finally {this.busy=false;setTimeout(()=>document.getElementById('chat-bottom')?.scrollIntoView({behavior:'smooth'}),30);}
  }
  onComposerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      void this.send();
    }
  }
  regenerate(){if(this.busy||!this.lastQuestion)return;this.messages.update(a=>a.length && a[a.length-1].role==='assistant'?a.slice(0,-1):a);void this.send(this.lastQuestion);}
  exportChat(){const content=this.messages().map(m=>`## ${m.role==='user'?'You':'OpsMate'} — ${m.time}\n\n${m.text}`).join('\n\n');const blob=new Blob(['# OpsMate conversation (demo)\n\n'+content],{type:'text/markdown'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='opsmate-conversation.md';link.click();URL.revokeObjectURL(url);}
  usePrompt(value:string){this.query=value;this.showPromptLibrary=false;document.querySelector('textarea')?.focus();}
  selectAgent(a:string){if(a==='AEM Agent'){this.showAemOptions=true;return;}this.showAemOptions=false;this.archiveChat();this.agent=a;this.activeTab='Home';this.lastQuestion='';this.messages.set([{id:Date.now(),role:'assistant',greeting:true,time:this.time(),text:this.agentGreeting(a)}]);setTimeout(()=>document.querySelector('textarea')?.focus(),30);}
  selectAemLob(value:string){this.lob=value;this.showAemOptions=false;this.archiveChat();this.agent='AEM Agent';this.activeTab='Home';this.lastQuestion='';this.messages.set([{id:Date.now(),role:'assistant',greeting:true,time:this.time(),text:`Hi, I am the AEM Agent for ${value}. I can help with page health, cache status, and publish state.`}]);setTimeout(()=>document.querySelector('textarea')?.focus(),30);}
  agentGreeting(a:string){return ({'AEM Agent':'Hi, I am the AEM Agent. I can check page health, cache status and publish state.','Archer':'Hi, I am the Archer agent. How can I help?','MarTech Operations':'Hi, I am the MarTech Operations agent. How can I help?','HR Operations':'Hi, I am the HR Operations agent. How can I help?','ETC Agent':'Hi, I am the ETC Agent. How can I help?','HR Tableau':'Hi, I am the HR Tableau agent. How can I help?'} as Record<string,string>)[a]||'How can I help?';}
  agentPrompts(a:string){return this.suggestions.map(s=>s.question);}
  returnToAgents(){this.archiveChat();this.messages.set([]);this.showAemOptions=false;this.activeTab='Agents';this.lastQuestion='';this.query='';}
  get suggestions(): {label:string;question:string}[] {
    const map:Record<string,{label:string;question:string}[]>={
      'AEM Agent':[
        {label:'Page health',question:'Show AEM page health status for CORP'},
        {label:'CloudWatch logs',question:'Analyze application errors in CloudWatch logs'},
        {label:'Lookup table',question:'Show sample S3 lookup table records'},
        {label:'Architecture diagram',question:'Show the AEM agent architecture diagram'},
        {label:'Publish workflow',question:'Show the AEM publish workflow status'},
        {label:'Explain cache',question:'Explain how AEM cache invalidation works'}],
      'Archer':[{label:'Risk register',question:'Show Archer risk register lookup table'},{label:'Risk summary',question:'Summarize operational risk controls'},{label:'Architecture',question:'Show Archer integration architecture diagram'}],
      'MarTech Operations':[{label:'Campaign lookup',question:'Show MarTech campaign lookup table'},{label:'Pipeline status',question:'Show marketing pipeline workflow status'},{label:'Architecture',question:'Show MarTech architecture diagram'}],
      'HR Operations':[{label:'Employee lookup',question:'Show sample HR employee lookup table'},{label:'Onboarding',question:'Show HR onboarding workflow status'},{label:'Architecture',question:'Show HR operations architecture diagram'}],
      'ETC Agent':[{label:'Service lookup',question:'Show ETC service lookup table'},{label:'Recent errors',question:'Analyze ETC errors in logs'},{label:'Architecture',question:'Show ETC architecture diagram'}],
      'HR Tableau':[{label:'Workforce dashboard',question:'Show HR Tableau workforce analytics dashboard with charts'},{label:'Headcount trend',question:'Show headcount trend chart'},{label:'Attrition analysis',question:'Show attrition dashboard'},{label:'Hiring pipeline',question:'Show hiring funnel chart'},{label:'Department breakdown',question:'Show department workforce chart'},{label:'Dashboard lookup',question:'Show HR Tableau dashboard lookup table'},{label:'Metrics summary',question:'Summarize HR Tableau metrics'},{label:'Architecture',question:'Show HR Tableau reporting architecture diagram'}]
    };
    return map[this.agent]||map['AEM Agent'];
  }
  get followUps():{label:string;question:string}[]{
    const r=[...this.messages()].reverse().find(m=>m.role==='assistant'&&m.result)?.result;
    if(!r)return [];
    const map:Record<string,{label:string;question:string}[]>={
      dashboard:[{label:'Headcount trends',question:'Show headcount trend chart'},{label:'Hiring funnel',question:'Show hiring funnel chart'},{label:'Department data',question:'Show HR Tableau dashboard lookup table'},{label:'Reporting architecture',question:'Show HR Tableau reporting architecture diagram'}],
      table:[{label:'Explain these records',question:'Explain the sample lookup table data and key insights'},{label:'Show architecture',question:'Show the lookup table architecture diagram'},{label:'Check logs',question:'Analyze related application logs'}],
      logs:[{label:'Explain root cause',question:'Explain the likely cause of the sample application errors'},{label:'Show architecture',question:'Show log analyzer architecture diagram'},{label:'Check workflow',question:'Show incident workflow status'}],
      architecture:[{label:'Explain components',question:'Explain the architecture components and data flow'},{label:'View sample lookup',question:'Show sample S3 lookup table records'},{label:'Inspect logs',question:'Analyze application logs'}],
      status:[{label:'Investigate logs',question:'Analyze application errors in logs'},{label:'Explain cache',question:'Explain AEM cache invalidation'},{label:'Architecture',question:'Show AEM architecture diagram'}],
      workflow:[{label:'Review risks',question:'Summarize workflow risks and next steps'},{label:'Inspect logs',question:'Analyze application logs'},{label:'Show architecture',question:'Show workflow architecture diagram'}],
      text:[{label:'Show architecture',question:'Show the agent architecture diagram'},{label:'Lookup records',question:'Show sample lookup table records'},{label:'View workflow',question:'Show workflow status'}]
    };return map[r.responseType]||[];
  }
  get recents(){return this.history().map((h,i)=>({...h,index:i})).slice(0,8);}
  autoGrow(e:Event){const t=e.target as HTMLTextAreaElement;t.style.height='auto';t.style.height=Math.min(t.scrollHeight,200)+'px';}
  openSearch(){this.historySearch='';this.showSearch=true;setTimeout(()=>document.getElementById('history-search-input')?.focus(),30);}
  closeSearch(){this.showSearch=false;}
  archiveChat(){const msgs=this.messages();const first=msgs.find(m=>m.role==='user');if(first)this.history.update(h=>[{name:first.text.slice(0,38),agent:this.agent,count:msgs.length,messages:[...msgs]},...h]);}
  agentIcon(a:string){return ({'AEM Agent':'◎','Archer':'◈','MarTech Operations':'◇','HR Operations':'♧','ETC Agent':'⌘','HR Tableau':'▤'} as Record<string,string>)[a]||'◇';}
  agentDesc(a:string){return ({'AEM Agent':'Page health & cache','Archer':'Archer operations','MarTech Operations':'Marketing technology operations','HR Operations':'HR operations','ETC Agent':'ETC operations','HR Tableau':'HR dashboards & reporting'} as Record<string,string>)[a]||'';}
  get filteredHistory(){return this.history().map((h,i)=>({...h,index:i})).filter(h=>h.name.toLowerCase().includes(this.historySearch.toLowerCase()));}
  time(){return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
  newChat(){
    // Start from the same clean landing state as the first visit.
    this.archiveChat();
    this.messages.set([]);
    this.agent='AEM Agent';
    this.lob='CORP';
    this.query='';
    this.lastQuestion='';
    this.showAemOptions=false;
    this.showPromptLibrary=false;
    this.showRecommendations=true;
    this.selectedLevel='ALL';
    this.showSearch=false;
    this.activeTab='Home';
  }
  openHistory(i:number){const h=this.history()[i];this.messages.set([...h.messages]);this.agent=h.agent;this.activeTab='Home';this.showSearch=false;}
  setTab(tab:string){this.activeTab=tab;this.showAemOptions=false;}
  maxValue(values:{value:number}[] | undefined){return Math.max(1,...(values||[]).map(v=>v.value));}
  percent(value:number,max:number){return Math.round(value/Math.max(1,max)*100);}
  getLogs(result:PluginResult){return result.data?.logs?.filter(l=>this.selectedLevel==='ALL'||l.level===this.selectedLevel)||[];}
  copy(text:string){navigator.clipboard?.writeText(text).catch(()=>{});}
  trackById(_i:number,m:Message){return m.id;}
}
