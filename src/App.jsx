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

/* ─── INITIAL DATA ─── */
let nPid=6, nTid=8, nCid=6;

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
          const done=task.status==="concluido";
          return(
            <div key={task.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 6px",borderRadius:8,transition:"background 0.1s",cursor:"default"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.card}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <button onClick={()=>onTaskToggle(task.id)}
                style={{width:16,height:16,borderRadius:5,border:`1.5px solid ${done?C.success:C.border}`,background:done?C.success:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
                {done&&<span style={{color:"#080808",fontSize:9,fontWeight:900,lineHeight:1}}>✓</span>}
              </button>
              <span style={{color:done?C.text3:C.text2,fontSize:12,fontFamily:C.fontBody,flex:1,textDecoration:done?"line-through":"none",transition:"color 0.15s"}}>{task.title}</span>
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

/* ─── APP ─── */
export default function App(){
  const [view,     setView]     =useState("overview");
  const [projects, setProjects] =useState(iProjects);
  const [tasks,    setTasks]    =useState(iTasks);
  const [content,  setContent]  =useState(iContent);
  const [col,      setCol]      =useState(false);
  const [modal,    setModal]    =useState(null);
  const [form,     setForm]     =useState({});

  const setPSt =(id,s)=>setProjects(ps=>ps.map(p=>p.id===id?{...p,status:s}:p));
  const setPPr =(id,p)=>setProjects(ps=>ps.map(pr=>pr.id===id?{...pr,priority:p}:pr));
  const setCSt =(id,s)=>setContent(cs=>cs.map(c=>c.id===id?{...c,status:s}:c));

  const toggleTask=id=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:t.status==="concluido"?"andamento":"concluido"}:t));

  const openModal=(type,defaultStatus)=>{
    setModal(type);
    if(type==="project") setForm({name:"",client:"",status:defaultStatus||"backlog",priority:"normal",deadline:"",desc:""});
    else if(type==="task") setForm({title:"",projectId:defaultStatus||projects[0]?.id||1,assignee:"",status:"backlog",priority:"normal",deadline:""});
    else setForm({title:"",platform:"instagram",type:"feed",status:defaultStatus||"ideia",date:"",caption:""});
  };

  const submitModal=()=>{
    if(modal==="project") setProjects(ps=>[...ps,{...form,id:nPid++,name:form.name||"Novo Projeto"}]);
    else if(modal==="task") setTasks(ts=>[...ts,{...form,id:nTid++,title:form.title||"Nova Tarefa",projectId:Number(form.projectId)}]);
    else setContent(cs=>[...cs,{...form,id:nCid++,title:form.title||"Novo Conteúdo"}]);
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
    {id:"overview",  icon:"◈", label:"Visão Geral"},
    {id:"projects",  icon:"⬡", label:"Projetos"},
    {id:"content",   icon:"✦", label:"Conteúdo"},
    {id:"calendar",  icon:"▦", label:"Calendário"},
    {id:"analytics", icon:"▲", label:"Analytics"},
  ];

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
            return(
              <button key={item.id} onClick={()=>setView(item.id)}
                style={{background:active?C.accentDim:"transparent",color:active?C.accent:C.text2,fontFamily:C.font,width:"100%",display:"flex",alignItems:"center",gap:10,padding:col?"10px 0":"9px 14px",justifyContent:col?"center":"flex-start",borderRadius:12,fontSize:13,fontWeight:active?800:600,cursor:"pointer",border:"none",borderLeft:active&&!col?`2px solid ${C.accent}`:"2px solid transparent",transition:"all 0.15s"}}>
                <span style={{fontSize:14}}>{item.icon}</span>
                {!col&&<span>{item.label}</span>}
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
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16}}>
              <div className="glass" style={{borderRadius:18,padding:22}}>
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
              <div className="glass" style={{borderRadius:18,padding:22}}>
                <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:14,textTransform:"uppercase"}}>Por Categoria</div>
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
              <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>Tarefas — Concluídas vs Abertas</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={taskData} barGap={4}>
                  <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="c" name="Concluídas" fill={C.accent} radius={[5,5,0,0]}/>
                  <Bar dataKey="a" name="Abertas"    fill="#222"    radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>}

          {/* ── PROJECTS (com tarefas integradas) ── */}
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
          {view==="analytics"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
              <StatCard label="Proj. este mês" value="6"   accent={C.accent}  chart/>
              <StatCard label="Taxa conclusão" value="84%" accent={C.success} chart/>
              <StatCard label="Em atraso"      value="2"   accent={C.danger}  chart/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="glass" style={{borderRadius:18,padding:22}}>
                <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>Crescimento Mensal</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Line type="monotone" dataKey="v" name="Projetos" stroke={C.accent} strokeWidth={2} dot={{fill:C.accent,r:3}} activeDot={{r:5}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="glass" style={{borderRadius:18,padding:22}}>
                <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>Distribuição de Tasks</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={taskData}>
                    <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:C.text3,fontSize:11,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="c" name="Concluídas" fill={C.accent}  radius={[5,5,0,0]}/>
                    <Bar dataKey="a" name="Abertas"    fill="#C084FC"   radius={[5,5,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:22,gridColumn:"1/-1"}}>
                <div style={{color:C.text2,fontSize:10,letterSpacing:"0.12em",fontFamily:C.font,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>Projetos por Status</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {STATUSES.map(s=>{
                    const count=projects.filter(p=>p.status===s.id).length;
                    return(
                      <div key={s.id} style={{background:s.bg,border:`1px solid ${s.color}20`,borderRadius:12,padding:"12px 18px",minWidth:100}}>
                        <div style={{color:s.color,fontFamily:C.font,fontSize:24,fontWeight:900,letterSpacing:"-0.02em"}}>{count}</div>
                        <div style={{color:s.color,opacity:0.65,fontSize:10,marginTop:3,fontFamily:C.font,fontWeight:700}}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>}

        </div>
      </main>

      {/* ── MODAL ── */}
      {modal&&(
        <Modal title={modal==="project"?"Novo Projeto":modal==="task"?"Nova Tarefa":"Novo Conteúdo"} onClose={()=>setModal(null)}>

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

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}>
            <button onClick={()=>setModal(null)} style={{padding:"10px 20px",borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:13,fontFamily:C.font,fontWeight:700,cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>Cancelar</button>
            <button className="glow-btn" onClick={submitModal} style={{padding:"10px 22px",borderRadius:12,border:"none",fontSize:13,fontFamily:C.font,fontWeight:900,cursor:"pointer",letterSpacing:"0.01em"}}>Criar</button>
          </div>
        </Modal>
      )}

    </div>
  );
}
