import { useState, useMemo, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

/* ─── TOKENS ─── */
const C = {
  accent:"#B8F500", accentDim:"#B8F50018",
  bg:"#060606", surface:"#0D0D0D", card:"#111111", cardHi:"#161616",
  border:"#1A1A1A", borderHi:"#242424",
  text1:"#F2F2F2", text2:"#5A5A5A", text3:"#2E2E2E",
  danger:"#FF4444", warn:"#F59E0B", info:"#60A5FA", success:"#4ADE80",
  font: "'Nunito', sans-serif",
  fontBody: "'Nunito Sans', sans-serif",
};

/* ─── STATUSES ─── */
const STATUSES = [
  {id:"backlog",    label:"Backlog",           color:"#3A3A3A", bg:"#111",    icon:"○"},
  {id:"briefing",   label:"Briefing",          color:"#818CF8", bg:"#13133A", icon:"📋"},
  {id:"planejando", label:"Planejando",        color:"#60A5FA", bg:"#0A1628", icon:"🗂"},
  {id:"andamento",  label:"Em andamento",      color:"#B8F500", bg:"#141A00", icon:"⚡"},
  {id:"producao",   label:"Em produção",       color:"#F59E0B", bg:"#1A1000", icon:"🎨"},
  {id:"revisao",    label:"Em revisão",        color:"#F97316", bg:"#1A0C00", icon:"👁"},
  {id:"aprovacao",  label:"Ag. aprovação",     color:"#C084FC", bg:"#160828", icon:"⏳"},
  {id:"ajustes",    label:"Ajustes",           color:"#FB7185", bg:"#220810", icon:"✏️"},
  {id:"concluido",  label:"Concluído",         color:"#4ADE80", bg:"#081A08", icon:"✓"},
  {id:"pausado",    label:"Pausado",           color:"#666",    bg:"#111",    icon:"⏸"},
  {id:"cancelado",  label:"Cancelado",         color:"#FF4444", bg:"#1A0404", icon:"✕"},
];

const PRIORITY = [
  {id:"urgente", label:"Urgente", color:"#FF4444", bg:"#220404", icon:"🔴"},
  {id:"normal",  label:"Normal",  color:"#B8F500", bg:"#141A00", icon:"🟡"},
  {id:"baixa",   label:"Baixa",   color:"#444",    bg:"#111",    icon:"⚪"},
];

const CONTENT_STATUS = [
  {id:"ideia",     label:"Ideia",     color:"#555",    bg:"#111"},
  {id:"rascunho",  label:"Rascunho",  color:"#60A5FA", bg:"#0A1628"},
  {id:"agendado",  label:"Agendado",  color:"#B8F500", bg:"#141A00"},
  {id:"publicado", label:"Publicado", color:"#4ADE80", bg:"#081A08"},
];

const PLATFORMS = [
  {id:"instagram", label:"Instagram", color:"#E1306C"},
  {id:"youtube",   label:"YouTube",   color:"#FF0000"},
  {id:"tiktok",    label:"TikTok",    color:"#69C9D0"},
  {id:"linkedin",  label:"LinkedIn",  color:"#0A66C2"},
];

/* ─── ANALYTICS DATA ─── */
const followerGrowth = [
  {m:"Out",v:41200},{m:"Nov",v:43100},{m:"Dez",v:44800},
  {m:"Jan",v:46200},{m:"Fev",v:48100},{m:"Mar",v:49800},
];
const engagementRate = [
  {m:"Out",v:5.2},{m:"Nov",v:5.8},{m:"Dez",v:6.1},
  {m:"Jan",v:5.9},{m:"Fev",v:6.4},{m:"Mar",v:6.73},
];
const impressionsDaily = [
  {d:"21/3",v:68400,ig:38000,yt:18400,li:12000},
  {d:"22/3",v:72100,ig:42000,yt:17100,li:13000},
  {d:"23/3",v:58900,ig:31000,yt:16900,li:11000},
  {d:"24/3",v:81200,ig:48000,yt:19200,li:14000},
  {d:"25/3",v:94500,ig:55000,yt:24500,li:15000},
  {d:"26/3",v:87300,ig:51000,yt:22300,li:14000},
  {d:"27/3",v:112400,ig:68000,yt:27400,li:17000},
];
const topPosts = [
  {id:1,title:"Reel verão ☀️",platform:"instagram",type:"reels",impressions:"48.2K",engagement:"8.4%",color:"#E1306C"},
  {id:2,title:"Case de sucesso",platform:"linkedin",type:"post",impressions:"32.1K",engagement:"6.2%",color:"#0A66C2"},
  {id:3,title:"Making of projeto",platform:"instagram",type:"carousel",impressions:"28.9K",engagement:"7.1%",color:"#E1306C"},
  {id:4,title:"Dica de branding",platform:"instagram",type:"feed",impressions:"22.4K",engagement:"5.8%",color:"#E1306C"},
];

/* ─── CHART DATA ─── */
const revenueData = [
  {m:"Out",v:18},{m:"Nov",v:24},{m:"Dez",v:19},{m:"Jan",v:31},{m:"Fev",v:28},{m:"Mar",v:38},
];
const taskData = [
  {m:"Out",c:12,a:5},{m:"Nov",c:18,a:8},{m:"Dez",c:14,a:3},
  {m:"Jan",c:22,a:9},{m:"Fev",c:19,a:6},{m:"Mar",c:27,a:4},
];
const pieData = [
  {name:"Branding",value:35,color:"#B8F500"},
  {name:"Social",  value:25,color:"#60A5FA"},
  {name:"Motion",  value:20,color:"#C084FC"},
  {name:"Web",     value:20,color:"#F59E0B"},
];

/* ─── NEWS DATA ─── */
const NEWS_CATS = [
  {id:"all",      label:"Todos",       color:"#B8F500"},
  {id:"marketing",label:"Marketing",   color:"#F59E0B"},
  {id:"social",   label:"Social Media",color:"#E1306C"},
  {id:"design",   label:"Design",      color:"#C084FC"},
  {id:"tech",     label:"Tecnologia",  color:"#60A5FA"},
];
const iNews = [
  {id:1,title:"Marketing digital bate recorde de investimento no Brasil em 2026",source:"Meio & Mensagem",date:"27 mar",category:"marketing",read:false},
  {id:2,title:"Instagram lança novas ferramentas para criadores de conteúdo",source:"TechCrunch",date:"27 mar",category:"social",read:false},
  {id:3,title:"Tendências de branding para o segundo semestre de 2026",source:"Behance Blog",date:"26 mar",category:"design",read:false},
  {id:4,title:"TikTok supera YouTube em tempo de visualização no Brasil",source:"Folha de S.Paulo",date:"26 mar",category:"social",read:true},
  {id:5,title:"IA no design gráfico: ameaça ou ferramenta?",source:"Aberta Magazine",date:"25 mar",category:"design",read:true},
  {id:6,title:"LinkedIn atinge 80 milhões de usuários no Brasil",source:"Bloomberg",date:"25 mar",category:"social",read:true},
  {id:7,title:"Novos algoritmos do Google impactam estratégias de SEO local",source:"Search Engine Journal",date:"24 mar",category:"tech",read:true},
  {id:8,title:"Marcas investem mais em vídeo curto para engajar geração Z",source:"Exame",date:"24 mar",category:"marketing",read:true},
];

/* ─── COMPETITORS DATA ─── */
const iCompetitors = [
  {id:1,name:"@agencia.x",       platform:"instagram",followers:"45.2K",engagement:"3.8%",postsPerWeek:5, growth:"+2.1%",growthPositive:true},
  {id:2,name:"@studio.criativo", platform:"instagram",followers:"28.9K",engagement:"5.2%",postsPerWeek:7, growth:"+0.8%",growthPositive:true},
  {id:3,name:"AgenciaY",         platform:"youtube",  followers:"12.4K",engagement:"4.1%",postsPerWeek:2, growth:"-0.3%",growthPositive:false},
  {id:4,name:"Design House BR",  platform:"linkedin", followers:"8.7K", engagement:"3.2%",postsPerWeek:3, growth:"+1.5%",growthPositive:true},
];

/* ─── INITIAL DATA ─── */
let nPid=6, nTid=8, nCid=6, nCompId=5;

const iProjects = [
  {id:1,name:"Campanha Verão 2026",  client:"Cliente A",status:"andamento", priority:"urgente",deadline:"2026-04-15",desc:"Campanha redes sociais"},
  {id:2,name:"Identidade Visual",    client:"Cliente B",status:"briefing",  priority:"normal", deadline:"2026-05-01",desc:"Rebrand completo"},
  {id:3,name:"Site Institucional",   client:"Cliente C",status:"concluido", priority:"baixa",  deadline:"2026-03-10",desc:"Landing page e blog"},
  {id:4,name:"Vídeo Institucional",  client:"Cliente D",status:"revisao",   priority:"urgente",deadline:"2026-03-20",desc:"Produção audiovisual"},
  {id:5,name:"Motion Institucional", client:"Cliente E",status:"producao",  priority:"normal", deadline:"2026-04-30",desc:"Animação logo"},
];

const iTasks = [
  {id:1,projectId:1,title:"Briefing criativo",   assignee:"Ana",   status:"concluido", priority:"urgente",deadline:"2026-03-28"},
  {id:2,projectId:1,title:"Arte stories",         assignee:"Bruno", status:"andamento", priority:"urgente",deadline:"2026-04-02"},
  {id:3,projectId:1,title:"Copy posts",           assignee:"Carol", status:"backlog",   priority:"normal", deadline:"2026-04-05"},
  {id:4,projectId:2,title:"Pesquisa referências", assignee:"Ana",   status:"planejando",priority:"normal", deadline:"2026-04-20"},
  {id:5,projectId:3,title:"Deploy final",         assignee:"Bruno", status:"concluido", priority:"baixa",  deadline:"2026-03-10"},
  {id:6,projectId:4,title:"Roteiro",              assignee:"Carol", status:"ajustes",   priority:"urgente",deadline:"2026-03-15"},
  {id:7,projectId:5,title:"Storyboard",           assignee:"Ana",   status:"andamento", priority:"normal", deadline:"2026-04-10"},
];

const iContent = [
  {id:1,title:"Post lançamento verão",  platform:"instagram",type:"feed",    status:"agendado", date:"2026-04-01",caption:"Verão chegou! ☀️"},
  {id:2,title:"Stories bastidores",     platform:"instagram",type:"stories", status:"rascunho", date:"2026-04-03",caption:"Nos bastidores..."},
  {id:3,title:"Reel making of",         platform:"instagram",type:"reels",   status:"ideia",    date:"",          caption:""},
  {id:4,title:"Vídeo case de sucesso",  platform:"youtube",  type:"video",   status:"agendado", date:"2026-04-08",caption:"Case completo"},
  {id:5,title:"Post resultado projeto", platform:"linkedin", type:"post",    status:"publicado",date:"2026-03-20",caption:"Orgulhosos do resultado"},
];

const getSt = id => STATUSES.find(s=>s.id===id)||STATUSES[0];
const getPl = id => PLATFORMS.find(p=>p.id===id)||PLATFORMS[0];

/* ─── BACKGROUND BLOBS ─── */
function BackgroundBlobs(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      <div style={{position:"absolute",width:700,height:700,top:"-15%",left:"-8%",background:"radial-gradient(circle,rgba(184,245,0,0.07) 0%,transparent 65%)",animation:"blob1 20s ease-in-out infinite",filter:"blur(50px)"}}/>
      <div style={{position:"absolute",width:550,height:550,bottom:"5%",right:"0%",background:"radial-gradient(circle,rgba(96,165,250,0.06) 0%,transparent 65%)",animation:"blob2 26s ease-in-out infinite",filter:"blur(60px)"}}/>
      <div style={{position:"absolute",width:480,height:480,top:"45%",left:"38%",background:"radial-gradient(circle,rgba(192,132,252,0.05) 0%,transparent 65%)",animation:"blob3 30s ease-in-out infinite",filter:"blur(70px)"}}/>
      <div style={{position:"absolute",width:300,height:300,top:"20%",right:"25%",background:"radial-gradient(circle,rgba(184,245,0,0.04) 0%,transparent 70%)",animation:"blob1 38s ease-in-out infinite reverse",filter:"blur(40px)"}}/>
    </div>
  );
}

/* ─── MOUSE GLOW ─── */
function MouseGlow(){
  const [pos,setPos]=useState({x:-300,y:-300});
  useEffect(()=>{
    const fn=e=>setPos({x:e.clientX,y:e.clientY});
    window.addEventListener("mousemove",fn);
    return()=>window.removeEventListener("mousemove",fn);
  },[]);
  return(
    <div style={{position:"fixed",pointerEvents:"none",zIndex:1,left:pos.x-250,top:pos.y-250,width:500,height:500,background:"radial-gradient(circle,rgba(184,245,0,0.035) 0%,transparent 70%)",borderRadius:"50%",transition:"left 0.12s ease-out,top 0.12s ease-out",filter:"blur(8px)"}}/>
  );
}

/* ─── PIP DROPDOWN ─── */
function Pip({value,onChange,options}){
  const [open,setOpen]=useState(false);
  const ref=useRef();
  const cur=options.find(o=>o.id===value)||options[0];
  useEffect(()=>{
    if(!open)return;
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[open]);
  return(
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={e=>{e.stopPropagation();setOpen(o=>!o)}}
        style={{background:cur.bg,color:cur.color,border:`1px solid ${cur.color}28`,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:700,fontFamily:C.font,letterSpacing:"0.01em",transition:"opacity 0.1s"}}>
        {cur.icon&&<span style={{fontSize:10}}>{cur.icon}</span>}
        <span>{cur.label}</span>
        <span style={{opacity:0.35,fontSize:8,marginLeft:2}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",left:0,top:"calc(100% + 6px)",background:"#0A0A0A",border:`1px solid ${C.borderHi}`,boxShadow:"0 20px 60px rgba(0,0,0,0.95)",zIndex:400,minWidth:180,borderRadius:14,padding:"6px 0",overflow:"hidden"}}>
          {options.map(o=>{
            const active=o.id===value;
            return(
              <button key={o.id} onClick={e=>{e.stopPropagation();onChange(o.id);setOpen(false);}}
                style={{color:active?o.color:C.text2,background:active?`${o.color}10`:"transparent",width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 14px",fontSize:12,fontFamily:C.font,fontWeight:active?700:500,textAlign:"left",border:"none",cursor:"pointer",transition:"background 0.1s"}}>
                {o.icon&&<span style={{fontSize:12}}>{o.icon}</span>}
                <span>{o.label}</span>
                {active&&<span style={{color:o.color,marginLeft:"auto",fontSize:10}}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({label,value,accent,chart}){
  return(
    <div className="glass card-animate" style={{borderRadius:18,padding:22,position:"relative",overflow:"hidden",minHeight:115,transition:"all 0.25s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 0 30px ${accent||C.accent}18,0 20px 50px rgba(0,0,0,0.5)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="";}}>
      <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,marginBottom:8,textTransform:"uppercase",fontWeight:700}}>{label}</div>
      <div style={{color:accent||C.text1,fontFamily:C.font,fontSize:32,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em"}}>{value}</div>
      {chart&&(
        <div style={{position:"absolute",bottom:0,right:0,left:0,height:52,opacity:0.3}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{top:0,right:0,bottom:0,left:0}}>
              <defs><linearGradient id={`g${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent||C.accent} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={accent||C.accent} stopOpacity={0}/>
              </linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke={accent||C.accent} strokeWidth={1.5} fill={`url(#g${label})`} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{position:"absolute",top:-24,right:-24,width:90,height:90,background:`radial-gradient(circle,${accent||C.accent}12 0%,transparent 70%)`}}/>
    </div>
  );
}

/* ─── METRIC CARD (Analytics) ─── */
function MetricCard({label,value,delta,positive,color}){
  return(
    <div className="glass card-animate" style={{borderRadius:18,padding:24,position:"relative",overflow:"hidden",transition:"all 0.25s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 0 30px ${color||C.accent}18,0 20px 50px rgba(0,0,0,0.5)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="";}}>
      <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,marginBottom:10,textTransform:"uppercase",fontWeight:700}}>{label}</div>
      <div style={{color:color||C.text1,fontFamily:C.font,fontSize:36,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:10}}>{value}</div>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{color:positive?C.success:C.danger,fontSize:13,fontWeight:800}}>{positive?"↑":"↓"}</span>
        <span style={{color:positive?C.success:C.danger,fontSize:12,fontFamily:C.font,fontWeight:700}}>{delta}</span>
        <span style={{color:C.text3,fontSize:11,fontFamily:C.fontBody}}>vs mês anterior</span>
      </div>
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,background:`radial-gradient(circle,${color||C.accent}15 0%,transparent 70%)`}}/>
    </div>
  );
}

const CustomTooltip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:"#0A0A0A",border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"10px 14px",fontSize:12,fontFamily:C.font}}>
      <div style={{color:C.text2,marginBottom:6,fontWeight:600}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,fontWeight:800}}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

/* ─── MODAL ─── */
function Modal({title,onClose,children}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)"}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:22,padding:30,width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 40px 120px rgba(0,0,0,0.8)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:26}}>
          <div style={{fontFamily:C.font,color:C.text1,fontSize:17,fontWeight:900,letterSpacing:"-0.02em"}}>{title}</div>
          <button onClick={onClose} style={{color:C.text3,background:C.card,border:`1px solid ${C.border}`,cursor:"pointer",fontSize:13,width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputSt={
  width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,
  padding:"11px 14px",color:C.text1,fontSize:13,outline:"none",
  boxSizing:"border-box",fontFamily:C.fontBody,transition:"border-color 0.15s",
};

function Field({label,children}){
  return(
    <div style={{marginBottom:18}}>
      <div style={{color:C.text2,fontSize:10,letterSpacing:"0.1em",marginBottom:7,textTransform:"uppercase",fontFamily:C.font,fontWeight:700}}>{label}</div>
      {children}
    </div>
  );
}

/* ─── PROJECT CARD (com tarefas inline) ─── */
function ProjectCard({project,tasks,onProjStatus,onProjPriority,onTaskToggle,onAddTask}){
  const projTasks=tasks.filter(t=>t.projectId===project.id);
  const done=projTasks.filter(t=>t.status==="concluido").length;
  const pct=projTasks.length?Math.round(done/projTasks.length*100):0;
  const st=getSt(project.status);

  return(
    <div className="glass card-animate" style={{borderRadius:18,padding:16,transition:"all 0.25s",cursor:"default"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 0 24px rgba(184,245,0,0.06),0 16px 40px rgba(0,0,0,0.6)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="";}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:C.text1,fontFamily:C.font,fontSize:14,fontWeight:800,lineHeight:1.3,marginBottom:4}}>{project.name}</div>
          <div style={{color:C.text2,fontSize:11,fontFamily:C.fontBody}}>{project.client} · {project.deadline}</div>
        </div>
        <Pip value={project.priority} onChange={v=>onProjPriority(project.id,v)} options={PRIORITY}/>
      </div>

      {/* Status */}
      <div style={{marginTop:10,marginBottom:14}}>
        <Pip value={project.status} onChange={v=>onProjStatus(project.id,v)} options={STATUSES}/>
      </div>

      {/* Progress bar */}
      {projTasks.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
            <span style={{color:C.text3,fontSize:10,fontFamily:C.font,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>Tarefas</span>
            <span style={{color:pct===100?C.success:C.text3,fontSize:10,fontFamily:C.font,fontWeight:700}}>{done}/{projTasks.length}</span>
          </div>
          <div style={{height:3,background:C.border,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct===100?C.success:C.accent,borderRadius:99,transition:"width 0.3s"}}/>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {projTasks.map(task=>{
          const isDone=task.status==="concluido";
          return(
            <div key={task.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 6px",borderRadius:8,transition:"background 0.1s",cursor:"default"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.card}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <button onClick={()=>onTaskToggle(task.id)}
                style={{width:16,height:16,borderRadius:5,border:`1.5px solid ${isDone?C.success:C.border}`,background:isDone?C.success:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
                {isDone&&<span style={{color:"#080808",fontSize:9,fontWeight:900,lineHeight:1}}>✓</span>}
              </button>
              <span style={{color:isDone?C.text3:C.text2,fontSize:12,fontFamily:C.fontBody,flex:1,textDecoration:isDone?"line-through":"none",transition:"color 0.15s"}}>{task.title}</span>
              {task.assignee&&<span style={{color:C.text3,fontSize:10,fontFamily:C.font,fontWeight:600,flexShrink:0}}>{task.assignee}</span>}
            </div>
          );
        })}
        <button onClick={()=>onAddTask(project.id)}
          style={{display:"flex",alignItems:"center",gap:6,padding:"4px 6px",borderRadius:8,background:"transparent",border:"none",color:C.text3,fontSize:11,fontFamily:C.font,fontWeight:700,cursor:"pointer",textAlign:"left",transition:"color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.color=C.accent}
          onMouseLeave={e=>e.currentTarget.style.color=C.text3}>
          <span style={{fontSize:14,lineHeight:1}}>+</span> nova tarefa
        </button>
      </div>
    </div>
  );
}

/* ─── PROJECT KANBAN ─── */
function ProjectKanban({projects,tasks,onProjStatus,onProjPriority,onTaskToggle,onAddTask,onAddProject}){
  const [draggingId,setDraggingId]=useState(null);
  const [overColId, setOverColId] =useState(null);

  return(
    <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:20,minHeight:400}}>
      {STATUSES.map(col=>{
        const colItems=projects.filter(p=>p.status===col.id);
        const isOver=overColId===col.id;
        return(
          <div key={col.id}
            style={{minWidth:272,maxWidth:290,flexShrink:0,borderRadius:18,border:isOver?`1px dashed ${col.color}55`:"1px solid transparent",background:isOver?`${col.color}05`:"transparent",transition:"all 0.15s",padding:4}}
            onDragOver={e=>{e.preventDefault();setOverColId(col.id);}}
            onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOverColId(null);}}
            onDrop={()=>{if(draggingId!=null)onProjStatus(draggingId,col.id);setOverColId(null);setDraggingId(null);}}>
            {/* Column header */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"4px 4px 0"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:col.color,boxShadow:`0 0 7px ${col.color}99`}}/>
              <span style={{color:col.color,fontFamily:C.font,fontSize:10,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase"}}>{col.label}</span>
              <span style={{background:C.border,color:C.text2,fontSize:10,fontFamily:C.font,fontWeight:800,marginLeft:"auto",padding:"2px 8px",borderRadius:99}}>{colItems.length}</span>
            </div>
            {/* Cards */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {colItems.map(p=>(
                <div key={p.id}
                  draggable
                  onDragStart={()=>setDraggingId(p.id)}
                  onDragEnd={()=>{setDraggingId(null);setOverColId(null);}}
                  style={{opacity:draggingId===p.id?0.4:1,cursor:"grab",transition:"opacity 0.15s"}}>
                  <ProjectCard
                    project={p} tasks={tasks}
                    onProjStatus={onProjStatus} onProjPriority={onProjPriority}
                    onTaskToggle={onTaskToggle} onAddTask={onAddTask}/>
                </div>
              ))}
              <button
                onClick={()=>onAddProject(col.id)}
                style={{border:`1px dashed ${C.border}`,borderRadius:14,padding:"10px 0",textAlign:"center",color:C.text3,fontSize:12,fontFamily:C.font,fontWeight:700,cursor:"pointer",background:"transparent",width:"100%",transition:"all 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=col.color;e.currentTarget.style.color=col.color;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text3;}}>
                + Projeto
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── CONTENT MANAGER ─── */
function ContentManager({content,onStatusChange,onAdd}){
  const [filter,setFilter]    =useState("all");
  const [dragId,setDragId]    =useState(null);
  const [overCol,setOverCol]  =useState(null);
  const filtered=filter==="all"?content:content.filter(c=>c.platform===filter);

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap",alignItems:"center"}}>
        {["all",...PLATFORMS.map(p=>p.id)].map(pid=>{
          const pl=pid==="all"?null:getPl(pid);
          const active=filter===pid;
          const color=pl?pl.color:C.accent;
          return(
            <button key={pid} onClick={()=>setFilter(pid)}
              style={{padding:"6px 16px",borderRadius:10,fontSize:12,fontWeight:700,fontFamily:C.font,border:`1px solid ${active?color:C.border}`,background:active?`${color}18`:"transparent",color:active?color:C.text2,cursor:"pointer",transition:"all 0.15s"}}>
              {pid==="all"?"Todos":pl.label}
            </button>
          );
        })}
        <button onClick={()=>onAdd("ideia")}
          style={{marginLeft:"auto",padding:"7px 20px",borderRadius:10,fontSize:12,fontWeight:800,fontFamily:C.font,border:"none",background:C.accent,color:"#060606",cursor:"pointer"}}>
          + Novo Conteúdo
        </button>
      </div>
      <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:16}}>
        {CONTENT_STATUS.map(col=>{
          const colItems=filtered.filter(c=>c.status===col.id);
          const isOver=overCol===col.id;
          return(
            <div key={col.id}
              style={{minWidth:268,maxWidth:286,flexShrink:0,borderRadius:18,border:isOver?`1px dashed ${col.color}55`:"1px solid transparent",background:isOver?`${col.color}05`:"transparent",transition:"all 0.15s",padding:4}}
              onDragOver={e=>{e.preventDefault();setOverCol(col.id);}}
              onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOverCol(null);}}
              onDrop={()=>{if(dragId!=null)onStatusChange(dragId,col.id);setOverCol(null);setDragId(null);}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:col.color,boxShadow:`0 0 7px ${col.color}99`}}/>
                <span style={{color:col.color,fontFamily:C.font,fontSize:10,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase"}}>{col.label}</span>
                <span style={{background:C.border,color:C.text2,fontSize:10,fontFamily:C.font,fontWeight:800,marginLeft:"auto",padding:"2px 8px",borderRadius:99}}>{colItems.length}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {colItems.map(item=>{
                  const pl=getPl(item.platform);
                  return(
                    <div key={item.id}
                      draggable
                      onDragStart={()=>setDragId(item.id)}
                      onDragEnd={()=>{setDragId(null);setOverCol(null);}}
                      className="glass card-animate"
                      style={{opacity:dragId===item.id?0.4:1,cursor:"grab",borderRadius:16,padding:14,transition:"all 0.25s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 0 20px rgba(184,245,0,0.05),0 12px 32px rgba(0,0,0,0.5)`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="";}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                        <span style={{background:`${pl.color}20`,color:pl.color,fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:7,fontFamily:C.font}}>{pl.label}</span>
                        <span style={{color:C.text3,fontSize:10,fontFamily:C.fontBody}}>{item.type}</span>
                        {item.date&&<span style={{marginLeft:"auto",color:C.text3,fontSize:10,fontFamily:C.fontBody}}>{item.date}</span>}
                      </div>
                      <div style={{color:C.text1,fontFamily:C.font,fontSize:13,fontWeight:800,marginBottom:item.caption?6:10,lineHeight:1.3}}>{item.title}</div>
                      {item.caption&&<div style={{color:C.text2,fontSize:11,fontFamily:C.fontBody,marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.caption}</div>}
                      <Pip value={item.status} onChange={v=>onStatusChange(item.id,v)} options={CONTENT_STATUS}/>
                    </div>
                  );
                })}
                <button onClick={()=>onAdd(col.id)}
                  style={{border:`1px dashed ${C.border}`,borderRadius:14,padding:"10px 0",textAlign:"center",color:C.text3,fontSize:12,fontFamily:C.font,fontWeight:700,cursor:"pointer",background:"transparent",width:"100%",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=col.color;e.currentTarget.style.color=col.color;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text3;}}>
                  + Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── CALENDAR ─── */
function CalendarView({content}){
  const [cur,setCur]=useState({year:2026,month:3});
  const daysInMonth=new Date(cur.year,cur.month+1,0).getDate();
  const firstDay=new Date(cur.year,cur.month,1).getDay();
  const monthName=new Date(cur.year,cur.month,1).toLocaleString("pt-BR",{month:"long",year:"numeric"});
  const prev=()=>setCur(c=>c.month===0?{year:c.year-1,month:11}:{year:c.year,month:c.month-1});
  const next=()=>setCur(c=>c.month===11?{year:c.year+1,month:0}:{year:c.year,month:c.month+1});
  const getDay=day=>{
    const d=`${cur.year}-${String(cur.month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return content.filter(c=>c.date===d);
  };
  const wd=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <div style={{fontFamily:C.font,color:C.text1,fontSize:18,fontWeight:900,textTransform:"capitalize",letterSpacing:"-0.02em"}}>{monthName}</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={prev} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text2,borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:14,fontFamily:C.font,transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>‹</button>
          <button onClick={next} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text2,borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:14,fontFamily:C.font,transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>›</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
        {wd.map(d=>(
          <div key={d} style={{textAlign:"center",color:C.text3,fontSize:10,fontFamily:C.font,fontWeight:800,padding:"6px 0",letterSpacing:"0.08em"}}>{d}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {Array.from({length:firstDay}).map((_,i)=>(
          <div key={`e${i}`} style={{minHeight:84,borderRadius:12,background:C.surface,opacity:0.15}}/>
        ))}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1;
          const items=getDay(day);
          const isToday=cur.year===2026&&cur.month===2&&day===27;
          return(
            <div key={day} style={{minHeight:84,borderRadius:12,background:C.card,border:`1px solid ${isToday?C.accent:C.border}`,padding:8,transition:"border-color 0.15s"}}
              onMouseEnter={e=>{if(!isToday)e.currentTarget.style.borderColor=C.borderHi;}}
              onMouseLeave={e=>{if(!isToday)e.currentTarget.style.borderColor=C.border;}}>
              <div style={{fontFamily:C.font,fontSize:12,fontWeight:800,color:isToday?C.accent:C.text3,marginBottom:4}}>{day}</div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                {items.slice(0,2).map(item=>{
                  const pl=getPl(item.platform);
                  return(
                    <div key={item.id} style={{background:`${pl.color}20`,borderLeft:`2px solid ${pl.color}`,borderRadius:"0 5px 5px 0",padding:"2px 6px",fontSize:10,color:pl.color,fontWeight:700,fontFamily:C.font,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {item.title}
                    </div>
                  );
                })}
                {items.length>2&&<div style={{color:C.text3,fontSize:10,fontFamily:C.font,fontWeight:700}}>+{items.length-2}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ANALYTICS VIEW ─── */
function AnalyticsView(){
  return(
    <div>
      {/* 4 Metric Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
        <MetricCard label="Impressões"   value="2.1M"    delta="12.4%"  positive={true}  color={C.accent}/>
        <MetricCard label="Engajamento"  value="6.73%"   delta="0.33pp" positive={true}  color="#C084FC"/>
        <MetricCard label="Seguidores"   value="+847"    delta="8.7%"   positive={true}  color={C.info}/>
        <MetricCard label="Alcance"      value="1.4M"    delta="5.2%"   positive={true}  color="#F59E0B"/>
      </div>

      {/* Charts grid 2x2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Crescimento de seguidores */}
        <div className="glass" style={{borderRadius:18,padding:22}}>
          <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:6,textTransform:"uppercase"}}>Crescimento de Seguidores</div>
          <div style={{color:C.text1,fontFamily:C.font,fontSize:20,fontWeight:900,marginBottom:16}}>49.8K</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={followerGrowth}>
              <defs>
                <linearGradient id="fgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity={0.35}/>
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<CustomTooltip/>} formatter={v=>[`${(v/1000).toFixed(1)}K`,"Seguidores"]}/>
              <Area type="monotone" dataKey="v" name="Seguidores" stroke={C.accent} strokeWidth={2} fill="url(#fgGrad)" dot={false} activeDot={{r:4,fill:C.accent}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Taxa de Engajamento */}
        <div className="glass" style={{borderRadius:18,padding:22}}>
          <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:6,textTransform:"uppercase"}}>Taxa de Engajamento</div>
          <div style={{color:"#C084FC",fontFamily:C.font,fontSize:20,fontWeight:900,marginBottom:16}}>6.73%</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={engagementRate}>
              <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<CustomTooltip/>} formatter={v=>[`${v}%`,"Engajamento"]}/>
              <Line type="monotone" dataKey="v" name="Engajamento" stroke="#C084FC" strokeWidth={2.5} dot={{fill:"#C084FC",r:3}} activeDot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Impressões por Dia */}
        <div className="glass" style={{borderRadius:18,padding:22,gridColumn:"1/-1"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <div>
              <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,textTransform:"uppercase"}}>Impressões por Dia</div>
              <div style={{color:C.text1,fontFamily:C.font,fontSize:20,fontWeight:900,marginTop:4}}>Últimos 7 dias</div>
            </div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              {[{label:"Instagram",color:"#E1306C"},{label:"YouTube",color:"#FF0000"},{label:"LinkedIn",color:"#0A66C2"}].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:2,background:l.color}}/>
                  <span style={{color:C.text2,fontSize:11,fontFamily:C.font}}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={impressionsDaily} barGap={3}>
              <XAxis dataKey="d" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<CustomTooltip/>} formatter={(v,n)=>[`${(v/1000).toFixed(1)}K`,n]}/>
              <Bar dataKey="ig" name="Instagram" fill="#E1306C" radius={[4,4,0,0]}/>
              <Bar dataKey="yt" name="YouTube"   fill="#FF0000" radius={[4,4,0,0]}/>
              <Bar dataKey="li" name="LinkedIn"  fill="#0A66C2" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Posts */}
      <div className="glass" style={{borderRadius:18,padding:22}}>
        <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:18,textTransform:"uppercase"}}>Posts com Melhor Desempenho</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {topPosts.map((post,i)=>(
            <div key={post.id} className="card-animate" style={{display:"flex",alignItems:"center",gap:16,background:C.card,borderRadius:14,padding:"14px 18px",border:`1px solid ${C.border}`,transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=post.color+"44";e.currentTarget.style.background=C.cardHi;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>
              <div style={{width:28,height:28,borderRadius:8,background:`${post.color}20`,border:`1px solid ${post.color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:post.color,fontFamily:C.font,fontSize:11,fontWeight:900}}>#{i+1}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:C.text1,fontFamily:C.font,fontSize:13,fontWeight:800,marginBottom:3}}>{post.title}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{background:`${post.color}20`,color:post.color,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:6,fontFamily:C.font}}>{post.platform}</span>
                  <span style={{color:C.text3,fontSize:11,fontFamily:C.fontBody}}>{post.type}</span>
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:C.text1,fontFamily:C.font,fontSize:13,fontWeight:800}}>{post.impressions}</div>
                <div style={{color:C.text3,fontSize:10,fontFamily:C.fontBody}}>impressões</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0,minWidth:60}}>
                <div style={{color:C.accent,fontFamily:C.font,fontSize:13,fontWeight:800}}>{post.engagement}</div>
                <div style={{color:C.text3,fontSize:10,fontFamily:C.fontBody}}>engajamento</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── COMPETITORS VIEW ─── */
function CompetitorsView({competitors,onAdd}){
  const getPlatformColor=(p)=>{
    if(p==="instagram")return"#E1306C";
    if(p==="youtube")return"#FF0000";
    if(p==="tiktok")return"#69C9D0";
    if(p==="linkedin")return"#0A66C2";
    return C.accent;
  };
  const getPlatformLabel=(p)=>{
    if(p==="instagram")return"Instagram";
    if(p==="youtube")return"YouTube";
    if(p==="tiktok")return"TikTok";
    if(p==="linkedin")return"LinkedIn";
    return p;
  };

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {competitors.map(comp=>{
          const plColor=getPlatformColor(comp.platform);
          return(
            <div key={comp.id} className="glass card-animate" style={{borderRadius:18,padding:20,transition:"all 0.25s",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 0 28px ${plColor}14,0 16px 40px rgba(0,0,0,0.5)`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="";}}>
              {/* Glow accent */}
              <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,background:`radial-gradient(circle,${plColor}15 0%,transparent 70%)`}}/>

              {/* Header */}
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{color:C.text1,fontFamily:C.font,fontSize:15,fontWeight:900,marginBottom:4}}>{comp.name}</div>
                  <span style={{background:`${plColor}20`,color:plColor,fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:7,fontFamily:C.font}}>{getPlatformLabel(comp.platform)}</span>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:comp.growthPositive?C.success:C.danger,fontFamily:C.font,fontSize:14,fontWeight:900,display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                    <span>{comp.growthPositive?"↑":"↓"}</span>
                    <span>{comp.growth}</span>
                  </div>
                  <div style={{color:C.text3,fontSize:10,fontFamily:C.fontBody}}>crescimento</div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:C.card,borderRadius:12,padding:"10px 14px"}}>
                  <div style={{color:C.text1,fontFamily:C.font,fontSize:16,fontWeight:900}}>{comp.followers}</div>
                  <div style={{color:C.text3,fontSize:10,fontFamily:C.fontBody,marginTop:2}}>seguidores</div>
                </div>
                <div style={{background:C.card,borderRadius:12,padding:"10px 14px"}}>
                  <div style={{color:C.accent,fontFamily:C.font,fontSize:16,fontWeight:900}}>{comp.engagement}</div>
                  <div style={{color:C.text3,fontSize:10,fontFamily:C.fontBody,marginTop:2}}>engajamento</div>
                </div>
                <div style={{background:C.card,borderRadius:12,padding:"10px 14px",gridColumn:"1/-1",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{color:C.text2,fontSize:11,fontFamily:C.fontBody}}>Posts por semana</div>
                  <div style={{color:C.text1,fontFamily:C.font,fontSize:14,fontWeight:900}}>{comp.postsPerWeek}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add new card */}
        <button onClick={onAdd}
          style={{borderRadius:18,border:`1px dashed ${C.border}`,background:"transparent",padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer",minHeight:180,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=`${C.accent}08`;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}>
          <div style={{width:40,height:40,borderRadius:12,border:`1px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.text3,fontSize:20}}>+</div>
          <span style={{color:C.text3,fontFamily:C.font,fontSize:12,fontWeight:700}}>Adicionar Concorrente</span>
        </button>
      </div>
    </div>
  );
}

/* ─── NEWS VIEW ─── */
function NewsView({news,onToggleRead}){
  const [catFilter,setCatFilter]=useState("all");

  const filtered=catFilter==="all"?news:news.filter(n=>n.category===catFilter);
  const unreadCount=news.filter(n=>!n.read).length;

  return(
    <div>
      {/* Filter bar */}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        {NEWS_CATS.map(cat=>{
          const active=catFilter===cat.id;
          return(
            <button key={cat.id} onClick={()=>setCatFilter(cat.id)}
              style={{padding:"6px 16px",borderRadius:10,fontSize:12,fontWeight:700,fontFamily:C.font,border:`1px solid ${active?cat.color:C.border}`,background:active?`${cat.color}18`:"transparent",color:active?cat.color:C.text2,cursor:"pointer",transition:"all 0.15s"}}>
              {cat.label}
            </button>
          );
        })}
        {unreadCount>0&&(
          <div style={{marginLeft:"auto",background:`${C.accent}18`,border:`1px solid ${C.accent}30`,borderRadius:10,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.accent}}/>
            <span style={{color:C.accent,fontFamily:C.font,fontSize:12,fontWeight:700}}>{unreadCount} não lidas</span>
          </div>
        )}
      </div>

      {/* News grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
        {filtered.map(item=>{
          const cat=NEWS_CATS.find(c=>c.id===item.category)||NEWS_CATS[0];
          return(
            <div key={item.id} className="glass card-animate"
              style={{borderRadius:16,padding:18,transition:"all 0.25s",position:"relative",opacity:item.read?0.7:1,borderLeft:!item.read?`3px solid ${C.accent}`:"3px solid transparent"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.opacity="1";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.opacity=item.read?"0.7":"1";e.currentTarget.style.boxShadow="";}}>

              {/* Unread dot */}
              {!item.read&&(
                <div style={{position:"absolute",top:14,right:14,width:7,height:7,borderRadius:"50%",background:C.accent,boxShadow:`0 0 6px ${C.accent}`}}/>
              )}

              {/* Category + date */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{background:`${cat.color}20`,color:cat.color,fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:7,fontFamily:C.font}}>{cat.label}</span>
                <span style={{color:C.text3,fontSize:11,fontFamily:C.fontBody,marginLeft:"auto"}}>{item.date}</span>
              </div>

              {/* Title */}
              <div style={{color:C.text1,fontFamily:C.font,fontSize:13,fontWeight:800,lineHeight:1.4,marginBottom:10}}>{item.title}</div>

              {/* Source + action */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{color:C.text3,fontSize:11,fontFamily:C.fontBody}}>{item.source}</span>
                <button onClick={()=>onToggleRead(item.id)}
                  style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"4px 12px",color:item.read?C.text3:C.accent,fontSize:11,fontFamily:C.font,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHi;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
                  {item.read?"Lida":"Marcar lida"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function App(){
  const [view,        setView]        =useState("overview");
  const [projects,    setProjects]    =useState(iProjects);
  const [tasks,       setTasks]       =useState(iTasks);
  const [content,     setContent]     =useState(iContent);
  const [competitors, setCompetitors] =useState(iCompetitors);
  const [news,        setNews]        =useState(iNews);
  const [col,         setCol]         =useState(false);
  const [modal,       setModal]       =useState(null);
  const [form,        setForm]        =useState({});

  const setPSt =(id,s)=>setProjects(ps=>ps.map(p=>p.id===id?{...p,status:s}:p));
  const setPPr =(id,p)=>setProjects(ps=>ps.map(pr=>pr.id===id?{...pr,priority:p}:pr));
  const setCSt =(id,s)=>setContent(cs=>cs.map(c=>c.id===id?{...c,status:s}:c));

  const toggleTask=id=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:t.status==="concluido"?"andamento":"concluido"}:t));
  const toggleRead=id=>setNews(ns=>ns.map(n=>n.id===id?{...n,read:!n.read}:n));

  const openModal=(type,defaultStatus)=>{
    setModal(type);
    if(type==="project")      setForm({name:"",client:"",status:defaultStatus||"backlog",priority:"normal",deadline:"",desc:""});
    else if(type==="task")    setForm({title:"",projectId:defaultStatus||projects[0]?.id||1,assignee:"",status:"backlog",priority:"normal",deadline:""});
    else if(type==="content") setForm({title:"",platform:"instagram",type:"feed",status:defaultStatus||"ideia",date:"",caption:""});
    else if(type==="competitor") setForm({name:"",platform:"instagram",handle:""});
  };

  const submitModal=()=>{
    if(modal==="project")          setProjects(ps=>[...ps,{...form,id:nPid++,name:form.name||"Novo Projeto"}]);
    else if(modal==="task")        setTasks(ts=>[...ts,{...form,id:nTid++,title:form.title||"Nova Tarefa",projectId:Number(form.projectId)}]);
    else if(modal==="content")     setContent(cs=>[...cs,{...form,id:nCid++,title:form.title||"Novo Conteúdo"}]);
    else if(modal==="competitor")  setCompetitors(cs=>[...cs,{
      id:nCompId++,
      name:form.handle?`@${form.handle.replace(/^@/,"")}`:form.name||"Novo Concorrente",
      platform:form.platform||"instagram",
      followers:"0",
      engagement:"0%",
      postsPerWeek:0,
      growth:"+0%",
      growthPositive:true,
    }]);
    setModal(null);
  };

  const stats=useMemo(()=>({
    active:    projects.filter(p=>["andamento","producao","revisao","aprovacao"].includes(p.status)).length,
    done:      projects.filter(p=>p.status==="concluido").length,
    urgent:    [...projects,...tasks].filter(x=>x.priority==="urgente").length,
    total:     projects.length,
    tdone:     tasks.filter(t=>t.status==="concluido").length,
    topen:     tasks.filter(t=>!["concluido","cancelado"].includes(t.status)).length,
    scheduled: content.filter(c=>c.status==="agendado").length,
    ctotal:    content.length,
  }),[projects,tasks,content]);

  const nav=[
    {id:"overview",     icon:"◈", label:"Visão Geral"},
    {id:"projects",     icon:"⬡", label:"Projetos"},
    {id:"content",      icon:"✦", label:"Conteúdo"},
    {id:"calendar",     icon:"▦", label:"Calendário"},
    {id:"analytics",    icon:"▲", label:"Analytics"},
    {id:"competitors",  icon:"◉", label:"Concorrentes"},
    {id:"news",         icon:"◫", label:"Notícias"},
  ];

  const unreadNews=news.filter(n=>!n.read).length;

  return(
    <div style={{background:C.bg,color:C.text1,fontFamily:C.fontBody,display:"flex",height:"100vh",overflow:"hidden",position:"relative"}}>
      <BackgroundBlobs/>
      <MouseGlow/>

      {/* ── SIDEBAR ── */}
      <aside className="glass" style={{borderRight:`1px solid rgba(255,255,255,0.05)`,width:col?60:224,flexShrink:0,display:"flex",flexDirection:"column",transition:"width 0.25s cubic-bezier(.4,0,.2,1)",overflow:"hidden",position:"relative",zIndex:10}}>
        {/* Logo */}
        <div style={{borderBottom:`1px solid ${C.border}`,padding:col?"14px 10px":"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:64}}>
          {col
            ? <div className="metal-text" style={{fontFamily:C.font,fontSize:15,fontWeight:900,letterSpacing:"0.08em",margin:"0 auto"}}>cnx</div>
            : <img src="/logo-conex-branca.png" alt="Conex Studio" style={{height:22,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
          }
          {!col&&<button onClick={()=>setCol(s=>!s)} style={{color:C.text3,fontSize:10,background:C.card,border:`1px solid ${C.border}`,cursor:"pointer",borderRadius:6,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>◀</button>}
        </div>

        {col&&<button onClick={()=>setCol(false)} style={{color:C.text3,fontSize:10,background:C.card,border:`1px solid ${C.border}`,cursor:"pointer",margin:"8px auto",borderRadius:6,width:32,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>▶</button>}

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {nav.map(item=>{
            const active=view===item.id;
            const showBadge=item.id==="news"&&unreadNews>0;
            return(
              <button key={item.id} onClick={()=>setView(item.id)}
                style={{background:active?C.accentDim:"transparent",color:active?C.accent:C.text2,fontFamily:C.font,width:"100%",display:"flex",alignItems:"center",gap:10,padding:col?"10px 0":"9px 14px",justifyContent:col?"center":"flex-start",borderRadius:12,fontSize:13,fontWeight:active?800:600,cursor:"pointer",border:"none",borderLeft:active&&!col?`2px solid ${C.accent}`:"2px solid transparent",transition:"all 0.15s",position:"relative"}}>
                <span style={{fontSize:14}}>{item.icon}</span>
                {!col&&<span>{item.label}</span>}
                {showBadge&&(
                  <span style={{marginLeft:"auto",background:C.accent,color:"#060606",fontFamily:C.font,fontSize:9,fontWeight:900,padding:"2px 6px",borderRadius:99,minWidth:18,textAlign:"center"}}>
                    {unreadNews}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!col&&<div style={{borderTop:`1px solid ${C.border}`,padding:"12px 18px"}}>
          <div style={{color:C.text3,fontSize:10,fontFamily:C.font,fontWeight:600}}>conexstudio.com.br</div>
        </div>}
      </aside>

      {/* ── MAIN ── */}
      <main style={{flex:1,overflowY:"auto",position:"relative",zIndex:5}}>
        {/* Topbar */}
        <div className="glass" style={{borderBottom:`1px solid rgba(255,255,255,0.05)`,position:"sticky",top:0,zIndex:10,padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h1 style={{fontFamily:C.font,color:C.text1,fontSize:18,fontWeight:900,margin:0,letterSpacing:"-0.02em"}}>
              {nav.find(n=>n.id===view)?.label}
            </h1>
            <p style={{color:C.text3,fontSize:11,margin:0,marginTop:2,fontFamily:C.fontBody}}>Conex Studio · Gestão interna</p>
          </div>
          {view==="projects"&&(
            <button className="glow-btn" onClick={()=>openModal("project")}
              style={{fontFamily:C.font,fontWeight:900,fontSize:12,padding:"9px 20px",borderRadius:12,border:"none",cursor:"pointer",letterSpacing:"0.02em"}}>
              + Novo Projeto
            </button>
          )}
          {view==="competitors"&&(
            <button className="glow-btn" onClick={()=>openModal("competitor")}
              style={{fontFamily:C.font,fontWeight:900,fontSize:12,padding:"9px 20px",borderRadius:12,border:"none",cursor:"pointer",letterSpacing:"0.02em"}}>
              + Adicionar Concorrente
            </button>
          )}
        </div>

        <div style={{padding:28}}>

          {/* ── OVERVIEW ── */}
          {view==="overview"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
              <StatCard label="Em execução"    value={stats.active}    accent={C.accent}  chart/>
              <StatCard label="Concluídos"     value={stats.done}      accent={C.success} chart/>
              <StatCard label="Urgentes"       value={stats.urgent}    accent={C.danger}  chart/>
              <StatCard label="Total Projetos" value={stats.total}     accent={C.info}    chart/>
              <StatCard label="Tasks abertas"  value={stats.topen}     accent="#C084FC"   chart/>
              <StatCard label="Tasks feitas"   value={stats.tdone}     accent={C.success} chart/>
              <StatCard label="Conteúdos"      value={stats.ctotal}    accent="#E1306C"   chart/>
              <StatCard label="Agendados"      value={stats.scheduled} accent={C.accent}  chart/>
            </div>

            {/* Analytics highlight */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div className="glass" style={{borderRadius:18,padding:22,display:"flex",alignItems:"center",gap:20}}>
                <div style={{flex:1}}>
                  <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:6,textTransform:"uppercase"}}>Impressões (mês)</div>
                  <div style={{color:C.accent,fontFamily:C.font,fontSize:38,fontWeight:900,letterSpacing:"-0.03em",lineHeight:1}}>2.1M</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:8}}>
                    <span style={{color:C.success,fontSize:12,fontWeight:800}}>↑ 12.4%</span>
                    <span style={{color:C.text3,fontSize:11,fontFamily:C.fontBody}}>vs mês anterior</span>
                  </div>
                </div>
                <div style={{width:1,height:60,background:C.border}}/>
                <div style={{flex:1}}>
                  <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:6,textTransform:"uppercase"}}>Engajamento</div>
                  <div style={{color:"#C084FC",fontFamily:C.font,fontSize:38,fontWeight:900,letterSpacing:"-0.03em",lineHeight:1}}>6.73%</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:8}}>
                    <span style={{color:C.success,fontSize:12,fontWeight:800}}>↑ 0.33pp</span>
                    <span style={{color:C.text3,fontSize:11,fontFamily:C.fontBody}}>vs mês anterior</span>
                  </div>
                </div>
              </div>

              <div className="glass" style={{borderRadius:18,padding:22}}>
                <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>Por Categoria</div>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={4} dataKey="value">
                      {pieData.map((e,i)=><Cell key={i} fill={e.color} stroke="transparent"/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:10}}>
                  {pieData.map(d=>(
                    <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:d.color}}/>
                        <span style={{color:C.text2,fontSize:11,fontFamily:C.fontBody}}>{d.name}</span>
                      </div>
                      <span style={{color:d.color,fontSize:11,fontFamily:C.font,fontWeight:800}}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:22}}>
              <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>Projetos / mês</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={revenueData}>
                  <defs><linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.accent} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={C.accent} stopOpacity={0}/>
                  </linearGradient></defs>
                  <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="v" name="Projetos" stroke={C.accent} strokeWidth={2} fill="url(#aG)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>}

          {/* ── PROJECTS ── */}
          {view==="projects"&&(
            <ProjectKanban
              projects={projects} tasks={tasks}
              onProjStatus={setPSt} onProjPriority={setPPr}
              onTaskToggle={toggleTask}
              onAddTask={pid=>openModal("task",pid)}
              onAddProject={s=>openModal("project",s)}/>
          )}

          {/* ── CONTENT ── */}
          {view==="content"&&<ContentManager content={content} onStatusChange={setCSt} onAdd={s=>openModal("content",s)}/>}

          {/* ── CALENDAR ── */}
          {view==="calendar"&&<CalendarView content={content}/>}

          {/* ── ANALYTICS ── */}
          {view==="analytics"&&<AnalyticsView/>}

          {/* ── COMPETITORS ── */}
          {view==="competitors"&&<CompetitorsView competitors={competitors} onAdd={()=>openModal("competitor")}/>}

          {/* ── NEWS ── */}
          {view==="news"&&<NewsView news={news} onToggleRead={toggleRead}/>}

        </div>
      </main>

      {/* ── MODAL ── */}
      {modal&&(
        <Modal
          title={
            modal==="project"    ?"Novo Projeto"       :
            modal==="task"       ?"Nova Tarefa"        :
            modal==="content"    ?"Novo Conteúdo"      :
            modal==="competitor" ?"Adicionar Concorrente":""}
          onClose={()=>setModal(null)}>

          {modal==="project"&&<>
            <Field label="Nome do projeto"><input style={inputSt} value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Campanha Verão 2026" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <Field label="Cliente"><input style={inputSt} value={form.client||""} onChange={e=>setForm(f=>({...f,client:e.target.value}))} placeholder="Nome do cliente" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <Field label="Descrição"><input style={inputSt} value={form.desc||""} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Breve descrição" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Status"><select style={{...inputSt,cursor:"pointer"}} value={form.status||"backlog"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></Field>
              <Field label="Prioridade"><select style={{...inputSt,cursor:"pointer"}} value={form.priority||"normal"} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>{PRIORITY.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></Field>
            </div>
            <Field label="Prazo"><input style={inputSt} type="date" value={form.deadline||""} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></Field>
          </>}

          {modal==="task"&&<>
            <Field label="Título da tarefa"><input style={inputSt} value={form.title||""} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Ex: Criar artes para stories" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <Field label="Projeto"><select style={{...inputSt,cursor:"pointer"}} value={form.projectId||""} onChange={e=>setForm(f=>({...f,projectId:e.target.value}))}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Responsável"><input style={inputSt} value={form.assignee||""} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))} placeholder="Nome do responsável" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Prioridade"><select style={{...inputSt,cursor:"pointer"}} value={form.priority||"normal"} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>{PRIORITY.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></Field>
              <Field label="Prazo"><input style={inputSt} type="date" value={form.deadline||""} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></Field>
            </div>
          </>}

          {modal==="content"&&<>
            <Field label="Título"><input style={inputSt} value={form.title||""} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Ex: Post lançamento produto" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Plataforma"><select style={{...inputSt,cursor:"pointer"}} value={form.platform||"instagram"} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>{PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></Field>
              <Field label="Tipo"><select style={{...inputSt,cursor:"pointer"}} value={form.type||"feed"} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                <option value="feed">Feed</option><option value="stories">Stories</option><option value="reels">Reels</option>
                <option value="video">Vídeo</option><option value="post">Post</option><option value="shorts">Shorts</option>
              </select></Field>
            </div>
            <Field label="Status"><select style={{...inputSt,cursor:"pointer"}} value={form.status||"ideia"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{CONTENT_STATUS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></Field>
            <Field label="Data de publicação"><input style={inputSt} type="date" value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
            <Field label="Legenda"><textarea style={{...inputSt,resize:"vertical",minHeight:80}} value={form.caption||""} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Escreva a legenda aqui..." onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
          </>}

          {modal==="competitor"&&<>
            <Field label="Nome / Marca"><input style={inputSt} value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Agência X" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
            <Field label="Plataforma"><select style={{...inputSt,cursor:"pointer"}} value={form.platform||"instagram"} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>{PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></Field>
            <Field label="Handle / @username"><input style={inputSt} value={form.handle||""} onChange={e=>setForm(f=>({...f,handle:e.target.value}))} placeholder="Ex: agenciax (sem @)" onFocus={e=>e.target.style.borderColor=C.borderHi} onBlur={e=>e.target.style.borderColor=C.border}/></Field>
          </>}

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}>
            <button onClick={()=>setModal(null)} style={{padding:"10px 20px",borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:13,fontFamily:C.font,fontWeight:700,cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>Cancelar</button>
            <button className="glow-btn" onClick={submitModal} style={{padding:"10px 22px",borderRadius:12,border:"none",fontSize:13,fontFamily:C.font,fontWeight:900,cursor:"pointer",letterSpacing:"0.01em"}}>
              {modal==="competitor"?"Adicionar":"Criar"}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
