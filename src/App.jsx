import { useState, useMemo, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const C = {
  accent:"#B8F500", bg:"#080808", surface:"#0F0F0F", card:"#141414",
  border:"#1C1C1C", borderHi:"#252525", text1:"#F0F0F0", text2:"#666", text3:"#333", danger:"#FF4444",
};

const STATUSES = [
  {id:"backlog",    label:"Backlog",           color:"#444",    bg:"#161616", icon:"○"},
  {id:"briefing",   label:"Briefing",          color:"#818CF8", bg:"#16163A", icon:"📋"},
  {id:"planejando", label:"Planejando",        color:"#60A5FA", bg:"#0D1A2E", icon:"🗂"},
  {id:"andamento",  label:"Em andamento",      color:"#B8F500", bg:"#1A2200", icon:"⚡"},
  {id:"producao",   label:"Em produção",       color:"#F59E0B", bg:"#1F1400", icon:"🎨"},
  {id:"revisao",    label:"Em revisão",        color:"#F97316", bg:"#1F0E00", icon:"👁"},
  {id:"aprovacao",  label:"Aguard. aprovação", color:"#C084FC", bg:"#1A0A2E", icon:"⏳"},
  {id:"ajustes",    label:"Ajustes",           color:"#FB7185", bg:"#2A0A12", icon:"✏️"},
  {id:"concluido",  label:"Concluído",         color:"#4ADE80", bg:"#0A1F0A", icon:"✓"},
  {id:"pausado",    label:"Pausado",           color:"#94A3B8", bg:"#141414", icon:"⏸"},
  {id:"cancelado",  label:"Cancelado",         color:"#FF4444", bg:"#1A0505", icon:"✕"},
];

const PRIORITY = [
  {id:"urgente", label:"Urgente", color:"#FF4444", bg:"#2A0505", icon:"🔴"},
  {id:"normal",  label:"Normal",  color:"#B8F500", bg:"#1A2200", icon:"🟡"},
  {id:"baixa",   label:"Baixa",   color:"#555",    bg:"#161616", icon:"⚪"},
];

const CONTENT_STATUS = [
  {id:"ideia",     label:"Ideia",     color:"#666",    bg:"#161616"},
  {id:"rascunho",  label:"Rascunho",  color:"#60A5FA", bg:"#0D1A2E"},
  {id:"agendado",  label:"Agendado",  color:"#B8F500", bg:"#1A2200"},
  {id:"publicado", label:"Publicado", color:"#4ADE80", bg:"#0A1F0A"},
];

const PLATFORMS = [
  {id:"instagram", label:"Instagram", color:"#E1306C"},
  {id:"youtube",   label:"YouTube",   color:"#FF0000"},
  {id:"tiktok",    label:"TikTok",    color:"#69C9D0"},
  {id:"linkedin",  label:"LinkedIn",  color:"#0A66C2"},
];

const revenueData = [
  {m:"Out",v:18},{m:"Nov",v:24},{m:"Dez",v:19},{m:"Jan",v:31},{m:"Fev",v:28},{m:"Mar",v:38},
];
const taskData = [
  {m:"Out",concluidas:12,abertas:5},{m:"Nov",concluidas:18,abertas:8},
  {m:"Dez",concluidas:14,abertas:3},{m:"Jan",concluidas:22,abertas:9},
  {m:"Fev",concluidas:19,abertas:6},{m:"Mar",concluidas:27,abertas:4},
];
const pieData = [
  {name:"Branding",value:35,color:"#B8F500"},
  {name:"Social",value:25,color:"#60A5FA"},
  {name:"Motion",value:20,color:"#C084FC"},
  {name:"Web",value:20,color:"#F59E0B"},
];

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

/* ── PIP DROPDOWN ── */
function Pip({value, onChange, options}){
  const [open,setOpen] = useState(false);
  const ref = useRef();
  const cur = options.find(o=>o.id===value)||options[0];
  useEffect(()=>{
    if(!open) return;
    const fn = e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",fn);
    return ()=>document.removeEventListener("mousedown",fn);
  },[open]);
  return(
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={e=>{e.stopPropagation();setOpen(o=>!o)}}
        style={{background:cur.bg,color:cur.color,border:`1px solid ${cur.color}30`,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:600}}>
        {cur.icon&&<span style={{fontSize:9}}>{cur.icon}</span>}
        <span>{cur.label}</span>
        <span style={{opacity:0.4,fontSize:8}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",left:0,top:"calc(100% + 4px)",background:"#0C0C0C",border:`1px solid ${C.borderHi}`,boxShadow:"0 16px 48px rgba(0,0,0,0.9)",zIndex:300,minWidth:175,borderRadius:12,padding:"6px 0",overflow:"hidden"}}>
          {options.map(o=>{
            const active=o.id===value;
            return(
              <button key={o.id} onClick={e=>{e.stopPropagation();onChange(o.id);setOpen(false);}}
                style={{color:active?o.color:C.text2,background:active?`${o.color}12`:"transparent",width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 12px",fontSize:12,textAlign:"left",border:"none",cursor:"pointer"}}>
                {o.icon&&<span>{o.icon}</span>}
                <span>{o.label}</span>
                {active&&<span style={{color:o.color,marginLeft:"auto"}}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({label,value,accent,chart}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,position:"relative",overflow:"hidden",minHeight:110}}>
      <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:6,textTransform:"uppercase"}}>{label}</div>
      <div style={{color:accent||C.text1,fontFamily:"Space Grotesk,sans-serif",fontSize:30,fontWeight:900,lineHeight:1}}>{value}</div>
      {chart&&(
        <div style={{position:"absolute",bottom:0,right:0,left:0,height:50,opacity:0.35}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{top:0,right:0,bottom:0,left:0}}>
              <defs><linearGradient id={`g${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent||C.accent} stopOpacity={0.5}/>
                <stop offset="100%" stopColor={accent||C.accent} stopOpacity={0}/>
              </linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke={accent||C.accent} strokeWidth={1.5} fill={`url(#g${label})`} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,background:`radial-gradient(circle,${accent||C.accent}10 0%,transparent 70%)`}}/>
    </div>
  );
}

const CustomTooltip = ({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:"#0C0C0C",border:`1px solid ${C.borderHi}`,borderRadius:10,padding:"8px 12px",fontSize:12}}>
      <div style={{color:C.text2,marginBottom:4}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,fontFamily:"Space Grotesk,sans-serif",fontWeight:700}}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

/* ── MODAL ── */
function Modal({title,onClose,children}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:20,padding:28,width:"100%",maxWidth:460,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div style={{fontFamily:"Space Grotesk,sans-serif",color:C.text1,fontSize:16,fontWeight:800}}>{title}</div>
          <button onClick={onClose} style={{color:C.text3,background:"none",border:"none",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputSt = {
  width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,
  padding:"10px 12px",color:C.text1,fontSize:13,outline:"none",
  boxSizing:"border-box",fontFamily:"Inter,sans-serif",
};

function Field({label,children}){
  return(
    <div style={{marginBottom:16}}>
      <div style={{color:C.text2,fontSize:11,letterSpacing:"0.08em",marginBottom:6,textTransform:"uppercase"}}>{label}</div>
      {children}
    </div>
  );
}

/* ── KANBAN BOARD (all statuses + drag & drop) ── */
function KanbanBoard({items,onStatusChange,onPriorityChange,renderCard,onAdd,addLabel}){
  const [draggingId,setDraggingId] = useState(null);
  const [overColId, setOverColId]  = useState(null);

  return(
    <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:20,minHeight:400}}>
      {STATUSES.map(col=>{
        const colItems = items.filter(i=>i.status===col.id);
        const isOver   = overColId===col.id;
        return(
          <div key={col.id}
            style={{minWidth:260,maxWidth:280,flexShrink:0,borderRadius:16,border:isOver?`1px dashed ${col.color}55`:"1px solid transparent",background:isOver?`${col.color}06`:"transparent",transition:"all 0.15s",padding:4}}
            onDragOver={e=>{e.preventDefault();setOverColId(col.id);}}
            onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOverColId(null);}}
            onDrop={()=>{
              if(draggingId!=null) onStatusChange(draggingId,col.id);
              setOverColId(null); setDraggingId(null);
            }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"0 4px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:col.color,boxShadow:`0 0 6px ${col.color}`}}/>
              <span style={{color:col.color,fontFamily:"Space Grotesk,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{col.label}</span>
              <span style={{background:C.border,color:C.text2,fontSize:11,fontFamily:"Space Grotesk,sans-serif",marginLeft:"auto",padding:"1px 8px",borderRadius:99,fontWeight:700}}>{colItems.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {colItems.map(item=>(
                <div key={item.id}
                  draggable
                  onDragStart={()=>setDraggingId(item.id)}
                  onDragEnd={()=>{setDraggingId(null);setOverColId(null);}}
                  style={{opacity:draggingId===item.id?0.4:1,cursor:"grab",transition:"opacity 0.15s"}}>
                  {renderCard(item,onStatusChange,onPriorityChange)}
                </div>
              ))}
              <button
                onClick={()=>onAdd&&onAdd(col.id)}
                style={{border:`1px dashed ${C.border}`,borderRadius:12,padding:10,textAlign:"center",color:C.text3,fontSize:12,cursor:"pointer",background:"transparent",width:"100%",transition:"all 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=col.color;e.currentTarget.style.color=col.color;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text3;}}>
                + {addLabel||"Adicionar"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── CONTENT MANAGER ── */
function ContentManager({content,onStatusChange,onAdd}){
  const [filter,setFilter]     = useState("all");
  const [draggingId,setDraggingId] = useState(null);
  const [overColId, setOverColId]  = useState(null);

  const filtered = filter==="all" ? content : content.filter(c=>c.platform===filter);

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        {["all",...PLATFORMS.map(p=>p.id)].map(pid=>{
          const pl   = pid==="all" ? null : getPl(pid);
          const active = filter===pid;
          const color  = pl ? pl.color : C.accent;
          return(
            <button key={pid} onClick={()=>setFilter(pid)}
              style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,border:`1px solid ${active?color:C.border}`,background:active?`${color}18`:"transparent",color:active?color:C.text2,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif",transition:"all 0.15s"}}>
              {pid==="all" ? "Todos" : pl.label}
            </button>
          );
        })}
        <button onClick={()=>onAdd("ideia")}
          style={{marginLeft:"auto",padding:"6px 18px",borderRadius:8,fontSize:12,fontWeight:800,border:"none",background:C.accent,color:"#080808",cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>
          + Novo Conteúdo
        </button>
      </div>
      <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:16}}>
        {CONTENT_STATUS.map(col=>{
          const colItems = filtered.filter(c=>c.status===col.id);
          const isOver   = overColId===col.id;
          return(
            <div key={col.id}
              style={{minWidth:260,maxWidth:280,flexShrink:0,borderRadius:16,border:isOver?`1px dashed ${col.color}55`:"1px solid transparent",background:isOver?`${col.color}06`:"transparent",transition:"all 0.15s",padding:4}}
              onDragOver={e=>{e.preventDefault();setOverColId(col.id);}}
              onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOverColId(null);}}
              onDrop={()=>{
                if(draggingId!=null) onStatusChange(draggingId,col.id);
                setOverColId(null); setDraggingId(null);
              }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:col.color,boxShadow:`0 0 6px ${col.color}`}}/>
                <span style={{color:col.color,fontFamily:"Space Grotesk,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{col.label}</span>
                <span style={{background:C.border,color:C.text2,fontSize:11,fontFamily:"Space Grotesk,sans-serif",marginLeft:"auto",padding:"1px 8px",borderRadius:99,fontWeight:700}}>{colItems.length}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {colItems.map(item=>{
                  const pl=getPl(item.platform);
                  return(
                    <div key={item.id}
                      draggable
                      onDragStart={()=>setDraggingId(item.id)}
                      onDragEnd={()=>{setDraggingId(null);setOverColId(null);}}
                      style={{opacity:draggingId===item.id?0.4:1,cursor:"grab",background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14,transition:"opacity 0.15s,box-shadow 0.2s,border-color 0.2s"}}
                      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 0 1px ${C.borderHi},0 8px 24px rgba(0,0,0,0.5)`;e.currentTarget.style.borderColor=C.borderHi;}}
                      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.border;}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                        <span style={{background:`${pl.color}22`,color:pl.color,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,fontFamily:"Space Grotesk,sans-serif"}}>{pl.label}</span>
                        <span style={{color:C.text3,fontSize:10}}>{item.type}</span>
                        {item.date&&<span style={{marginLeft:"auto",color:C.text3,fontSize:10}}>{item.date}</span>}
                      </div>
                      <div style={{color:C.text1,fontFamily:"Space Grotesk,sans-serif",fontSize:13,fontWeight:700,marginBottom:6,lineHeight:1.3}}>{item.title}</div>
                      {item.caption&&<div style={{color:C.text3,fontSize:11,marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.caption}</div>}
                      <Pip value={item.status} onChange={v=>onStatusChange(item.id,v)} options={CONTENT_STATUS}/>
                    </div>
                  );
                })}
                <button
                  onClick={()=>onAdd(col.id)}
                  style={{border:`1px dashed ${C.border}`,borderRadius:12,padding:10,textAlign:"center",color:C.text3,fontSize:12,cursor:"pointer",background:"transparent",width:"100%",transition:"all 0.15s"}}
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

/* ── CALENDAR ── */
function CalendarView({content}){
  const [cur,setCur] = useState({year:2026,month:3});
  const daysInMonth = new Date(cur.year,cur.month+1,0).getDate();
  const firstDay    = new Date(cur.year,cur.month,1).getDay();
  const monthName   = new Date(cur.year,cur.month,1).toLocaleString("pt-BR",{month:"long",year:"numeric"});
  const prev = ()=>setCur(c=>c.month===0?{year:c.year-1,month:11}:{year:c.year,month:c.month-1});
  const next = ()=>setCur(c=>c.month===11?{year:c.year+1,month:0}:{year:c.year,month:c.month+1});
  const getDay = day=>{
    const d=`${cur.year}-${String(cur.month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return content.filter(c=>c.date===d);
  };
  const weekDays=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontFamily:"Space Grotesk,sans-serif",color:C.text1,fontSize:16,fontWeight:800,textTransform:"capitalize"}}>{monthName}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={prev} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text2,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:14}}>‹</button>
          <button onClick={next} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text2,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:14}}>›</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
        {weekDays.map(d=>(
          <div key={d} style={{textAlign:"center",color:C.text3,fontSize:11,fontFamily:"Space Grotesk,sans-serif",fontWeight:700,padding:"8px 0"}}>{d}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {Array.from({length:firstDay}).map((_,i)=>(
          <div key={`e${i}`} style={{minHeight:80,borderRadius:10,background:C.surface,opacity:0.2}}/>
        ))}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1;
          const items=getDay(day);
          const isToday=cur.year===2026&&cur.month===2&&day===27;
          return(
            <div key={day} style={{minHeight:80,borderRadius:10,background:C.card,border:`1px solid ${isToday?C.accent:C.border}`,padding:8}}>
              <div style={{fontFamily:"Space Grotesk,sans-serif",fontSize:12,fontWeight:700,color:isToday?C.accent:C.text3,marginBottom:4}}>{day}</div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                {items.slice(0,2).map(item=>{
                  const pl=getPl(item.platform);
                  return(
                    <div key={item.id} style={{background:`${pl.color}22`,borderLeft:`2px solid ${pl.color}`,borderRadius:"0 4px 4px 0",padding:"2px 5px",fontSize:10,color:pl.color,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {item.title}
                    </div>
                  );
                })}
                {items.length>2&&<div style={{color:C.text3,fontSize:10}}>+{items.length-2}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── APP ── */
export default function App(){
  const [view,     setView]     = useState("overview");
  const [projects, setProjects] = useState(iProjects);
  const [tasks,    setTasks]    = useState(iTasks);
  const [content,  setContent]  = useState(iContent);
  const [col,      setCol]      = useState(false);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState({});

  const setPSt=(id,s)=>setProjects(ps=>ps.map(p=>p.id===id?{...p,status:s}:p));
  const setPPr=(id,p)=>setProjects(ps=>ps.map(pr=>pr.id===id?{...pr,priority:p}:pr));
  const setTSt=(id,s)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:s}:t));
  const setTPr=(id,p)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,priority:p}:t));
  const setCSt=(id,s)=>setContent(cs=>cs.map(c=>c.id===id?{...c,status:s}:c));

  const openModal=(type,defaultStatus)=>{
    setModal(type);
    if(type==="project") setForm({name:"",client:"",status:defaultStatus||"backlog",priority:"normal",deadline:"",desc:""});
    else if(type==="task") setForm({title:"",projectId:projects[0]?.id||1,assignee:"",status:defaultStatus||"backlog",priority:"normal",deadline:""});
    else setForm({title:"",platform:"instagram",type:"feed",status:defaultStatus||"ideia",date:"",caption:""});
  };

  const submitModal=()=>{
    if(modal==="project") setProjects(ps=>[...ps,{...form,id:nPid++,name:form.name||"Novo Projeto"}]);
    else if(modal==="task") setTasks(ts=>[...ts,{...form,id:nTid++,title:form.title||"Nova Tarefa",projectId:Number(form.projectId)}]);
    else setContent(cs=>[...cs,{...form,id:nCid++,title:form.title||"Novo Conteúdo"}]);
    setModal(null);
  };

  const stats = useMemo(()=>({
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
    {id:"tasks",     icon:"◎", label:"Tarefas"},
    {id:"content",   icon:"✦", label:"Conteúdo"},
    {id:"calendar",  icon:"▦", label:"Calendário"},
    {id:"analytics", icon:"▲", label:"Analytics"},
  ];

  const renderProjCard=(p,onSt,onPr)=>(
    <div key={p.id}
      style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14,transition:"box-shadow 0.2s,border-color 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 0 1px ${C.borderHi},0 8px 24px rgba(0,0,0,0.5)`;e.currentTarget.style.borderColor=C.borderHi;}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.border;}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
        <div style={{color:C.text1,fontFamily:"Space Grotesk,sans-serif",fontSize:13,fontWeight:700,lineHeight:1.3}}>{p.name}</div>
        <Pip value={p.priority} onChange={v=>onPr(p.id,v)} options={PRIORITY}/>
      </div>
      <div style={{color:C.text3,fontSize:11,marginBottom:10}}>{p.client} · {p.deadline}</div>
      <Pip value={p.status} onChange={v=>onSt(p.id,v)} options={STATUSES}/>
    </div>
  );

  const renderTaskCard=(t,onSt,onPr)=>{
    const proj=projects.find(p=>p.id===t.projectId);
    return(
      <div key={t.id}
        style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14,transition:"box-shadow 0.2s,border-color 0.2s"}}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 0 1px ${C.borderHi},0 8px 24px rgba(0,0,0,0.5)`;e.currentTarget.style.borderColor=C.borderHi;}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.border;}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
          <div style={{color:C.text1,fontFamily:"Space Grotesk,sans-serif",fontSize:13,fontWeight:600}}>{t.title}</div>
          <Pip value={t.priority} onChange={v=>onPr(t.id,v)} options={PRIORITY}/>
        </div>
        <div style={{color:C.text3,fontSize:11,marginBottom:8}}>{proj?.name||"—"} · {t.assignee}</div>
        <Pip value={t.status} onChange={v=>onSt(t.id,v)} options={STATUSES}/>
      </div>
    );
  };

  const headerTitle = nav.find(n=>n.id===view)?.label;

  return(
    <div style={{background:C.bg,color:C.text1,fontFamily:"Inter,sans-serif",display:"flex",height:"100vh",overflow:"hidden"}}>

      {/* SIDEBAR */}
      <aside style={{background:C.surface,borderRight:`1px solid ${C.border}`,width:col?56:220,flexShrink:0,display:"flex",flexDirection:"column",transition:"width 0.25s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{borderBottom:`1px solid ${C.border}`,padding:"18px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {!col&&<div>
            <div style={{fontFamily:"Space Grotesk,sans-serif",color:C.accent,letterSpacing:"0.2em",fontSize:13,fontWeight:900}}>CONEX</div>
            <div style={{color:C.text3,fontSize:10,marginTop:1}}>Studio</div>
          </div>}
          <button onClick={()=>setCol(s=>!s)} style={{color:C.text3,marginLeft:col?"auto":0,fontSize:11,background:"none",border:"none",cursor:"pointer"}}>{col?"▶":"◀"}</button>
        </div>
        <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {nav.map(item=>(
            <button key={item.id} onClick={()=>setView(item.id)}
              style={{background:view===item.id?`${C.accent}12`:"transparent",color:view===item.id?C.accent:C.text2,fontFamily:"Space Grotesk,sans-serif",width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:"0 10px 10px 0",fontSize:13,fontWeight:500,cursor:"pointer",border:"none",borderLeft:view===item.id?`2px solid ${C.accent}`:"2px solid transparent"}}>
              <span style={{fontSize:13}}>{item.icon}</span>
              {!col&&item.label}
            </button>
          ))}
        </nav>
        {!col&&<div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
          <div style={{color:C.text3,fontSize:10}}>conexstudio.com.br</div>
        </div>}
      </aside>

      {/* MAIN */}
      <main style={{flex:1,overflowY:"auto"}}>
        <div style={{background:`${C.bg}F5`,borderBottom:`1px solid ${C.border}`,backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:10,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h1 style={{fontFamily:"Space Grotesk,sans-serif",color:C.text1,fontSize:17,fontWeight:800,margin:0}}>{headerTitle}</h1>
            <p style={{color:C.text3,fontSize:11,margin:0,marginTop:2}}>Conex Studio · Gestão interna</p>
          </div>
          {view==="projects"&&<button onClick={()=>openModal("project")} style={{background:C.accent,color:"#080808",fontFamily:"Space Grotesk,sans-serif",fontWeight:900,fontSize:12,padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer"}}>+ Novo Projeto</button>}
          {view==="tasks"&&<button onClick={()=>openModal("task")} style={{background:C.accent,color:"#080808",fontFamily:"Space Grotesk,sans-serif",fontWeight:900,fontSize:12,padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer"}}>+ Nova Tarefa</button>}
        </div>

        <div style={{padding:24}}>

          {/* OVERVIEW */}
          {view==="overview"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
              <StatCard label="Em execução"    value={stats.active}    accent={C.accent} chart/>
              <StatCard label="Concluídos"     value={stats.done}      accent="#4ADE80"  chart/>
              <StatCard label="Urgentes"       value={stats.urgent}    accent="#FF4444"  chart/>
              <StatCard label="Total Projetos" value={stats.total}     accent="#60A5FA"  chart/>
              <StatCard label="Tasks abertas"  value={stats.topen}     accent="#C084FC"  chart/>
              <StatCard label="Tasks feitas"   value={stats.tdone}     accent="#4ADE80"  chart/>
              <StatCard label="Conteúdos"      value={stats.ctotal}    accent="#E1306C"  chart/>
              <StatCard label="Agendados"      value={stats.scheduled} accent="#B8F500"  chart/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:20}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:16,textTransform:"uppercase"}}>Projetos / mês</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={revenueData}>
                    <defs><linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.accent} stopOpacity={0.25}/>
                      <stop offset="100%" stopColor={C.accent} stopOpacity={0}/>
                    </linearGradient></defs>
                    <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Area type="monotone" dataKey="v" name="Projetos" stroke={C.accent} strokeWidth={2} fill="url(#aG)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:12,textTransform:"uppercase"}}>Por Categoria</div>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                      {pieData.map((e,i)=><Cell key={i} fill={e.color} stroke="transparent"/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:8}}>
                  {pieData.map(d=>(
                    <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:d.color}}/>
                        <span style={{color:C.text2,fontSize:11}}>{d.name}</span>
                      </div>
                      <span style={{color:d.color,fontSize:11,fontFamily:"Space Grotesk,sans-serif",fontWeight:700}}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
              <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:16,textTransform:"uppercase"}}>Tarefas — Concluídas vs Abertas</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={taskData} barGap={4}>
                  <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="concluidas" name="Concluídas" fill={C.accent} radius={[4,4,0,0]}/>
                  <Bar dataKey="abertas"    name="Abertas"    fill="#333"     radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>}

          {view==="projects"&&<KanbanBoard items={projects} onStatusChange={setPSt} onPriorityChange={setPPr} renderCard={renderProjCard} onAdd={s=>openModal("project",s)} addLabel="Projeto"/>}
          {view==="tasks"&&<KanbanBoard items={tasks} onStatusChange={setTSt} onPriorityChange={setTPr} renderCard={renderTaskCard} onAdd={s=>openModal("task",s)} addLabel="Tarefa"/>}
          {view==="content"&&<ContentManager content={content} onStatusChange={setCSt} onAdd={s=>openModal("content",s)}/>}
          {view==="calendar"&&<CalendarView content={content}/>}

          {/* ANALYTICS */}
          {view==="analytics"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
              <StatCard label="Proj. este mês" value="6"   accent={C.accent} chart/>
              <StatCard label="Taxa conclusão" value="84%" accent="#4ADE80"  chart/>
              <StatCard label="Em atraso"      value="2"   accent="#FF4444"  chart/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:16,textTransform:"uppercase"}}>Crescimento Mensal</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Line type="monotone" dataKey="v" name="Projetos" stroke={C.accent} strokeWidth={2} dot={{fill:C.accent,r:3}} activeDot={{r:5}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:16,textTransform:"uppercase"}}>Distribuição de Tasks</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={taskData}>
                    <XAxis dataKey="m" tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:C.text3,fontSize:11}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="concluidas" name="Concluídas" fill={C.accent}  radius={[4,4,0,0]}/>
                    <Bar dataKey="abertas"    name="Abertas"    fill="#C084FC"   radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,gridColumn:"1/-1"}}>
                <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:16,textTransform:"uppercase"}}>Projetos por Status</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {STATUSES.map(s=>{
                    const count=projects.filter(p=>p.status===s.id).length;
                    return(
                      <div key={s.id} style={{background:s.bg,border:`1px solid ${s.color}22`,borderRadius:10,padding:"10px 16px",minWidth:100}}>
                        <div style={{color:s.color,fontFamily:"Space Grotesk,sans-serif",fontSize:22,fontWeight:900}}>{count}</div>
                        <div style={{color:s.color,opacity:0.7,fontSize:10,marginTop:2}}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>}

        </div>
      </main>

      {/* MODAL */}
      {modal&&(
        <Modal title={modal==="project"?"Novo Projeto":modal==="task"?"Nova Tarefa":"Novo Conteúdo"} onClose={()=>setModal(null)}>
          {modal==="project"&&<>
            <Field label="Nome do projeto"><input style={inputSt} value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Campanha Verão 2026"/></Field>
            <Field label="Cliente"><input style={inputSt} value={form.client||""} onChange={e=>setForm(f=>({...f,client:e.target.value}))} placeholder="Nome do cliente"/></Field>
            <Field label="Descrição"><input style={inputSt} value={form.desc||""} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Breve descrição"/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Status">
                <select style={{...inputSt,cursor:"pointer"}} value={form.status||"backlog"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="Prioridade">
                <select style={{...inputSt,cursor:"pointer"}} value={form.priority||"normal"} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                  {PRIORITY.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Prazo"><input style={inputSt} type="date" value={form.deadline||""} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></Field>
          </>}

          {modal==="task"&&<>
            <Field label="Título da tarefa"><input style={inputSt} value={form.title||""} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Ex: Criar artes para stories"/></Field>
            <Field label="Projeto">
              <select style={{...inputSt,cursor:"pointer"}} value={form.projectId||""} onChange={e=>setForm(f=>({...f,projectId:e.target.value}))}>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Responsável"><input style={inputSt} value={form.assignee||""} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))} placeholder="Nome do responsável"/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Status">
                <select style={{...inputSt,cursor:"pointer"}} value={form.status||"backlog"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="Prioridade">
                <select style={{...inputSt,cursor:"pointer"}} value={form.priority||"normal"} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                  {PRIORITY.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Prazo"><input style={inputSt} type="date" value={form.deadline||""} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></Field>
          </>}

          {modal==="content"&&<>
            <Field label="Título"><input style={inputSt} value={form.title||""} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Ex: Post lançamento produto"/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Plataforma">
                <select style={{...inputSt,cursor:"pointer"}} value={form.platform||"instagram"} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>
                  {PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Field>
              <Field label="Tipo">
                <select style={{...inputSt,cursor:"pointer"}} value={form.type||"feed"} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option value="feed">Feed</option>
                  <option value="stories">Stories</option>
                  <option value="reels">Reels</option>
                  <option value="video">Vídeo</option>
                  <option value="post">Post</option>
                  <option value="shorts">Shorts</option>
                </select>
              </Field>
            </div>
            <Field label="Status">
              <select style={{...inputSt,cursor:"pointer"}} value={form.status||"ideia"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {CONTENT_STATUS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Data de publicação"><input style={inputSt} type="date" value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
            <Field label="Legenda">
              <textarea style={{...inputSt,resize:"vertical",minHeight:80}} value={form.caption||""} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Escreva a legenda aqui..."/>
            </Field>
          </>}

          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>setModal(null)} style={{padding:"9px 18px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.text2,fontSize:13,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>Cancelar</button>
            <button onClick={submitModal} style={{padding:"9px 18px",borderRadius:10,border:"none",background:C.accent,color:"#080808",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>Criar</button>
          </div>
        </Modal>
      )}

    </div>
  );
}
