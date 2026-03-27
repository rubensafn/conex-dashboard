import { useState, useMemo, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const C = {
  accent:"#B8F500", accentDim:"#8FBE0022",
  bg:"#080808", surface:"#0F0F0F", card:"#141414",
  border:"#1C1C1C", borderHi:"#252525",
  text1:"#F0F0F0", text2:"#666", text3:"#333",
  danger:"#FF4444",
};

const STATUSES = [
  { id:"backlog",    label:"Backlog",          color:"#444",    bg:"#161616", icon:"○"  },
  { id:"briefing",   label:"Briefing",         color:"#818CF8", bg:"#16163A", icon:"📋" },
  { id:"planejando", label:"Planejando",       color:"#60A5FA", bg:"#0D1A2E", icon:"🗂" },
  { id:"andamento",  label:"Em andamento",     color:"#B8F500", bg:"#1A2200", icon:"⚡" },
  { id:"producao",   label:"Em produção",      color:"#F59E0B", bg:"#1F1400", icon:"🎨" },
  { id:"revisao",    label:"Em revisão",       color:"#F97316", bg:"#1F0E00", icon:"👁" },
  { id:"aprovacao",  label:"Aguard. aprovação",color:"#C084FC", bg:"#1A0A2E", icon:"⏳" },
  { id:"ajustes",    label:"Ajustes",          color:"#FB7185", bg:"#2A0A12", icon:"✏️" },
  { id:"concluido",  label:"Concluído",        color:"#4ADE80", bg:"#0A1F0A", icon:"✓"  },
  { id:"pausado",    label:"Pausado",          color:"#94A3B8", bg:"#141414", icon:"⏸"  },
  { id:"cancelado",  label:"Cancelado",        color:"#FF4444", bg:"#1A0505", icon:"✕"  },
];

const PRIORITY = [
  { id:"urgente", label:"Urgente", color:"#FF4444", bg:"#2A0505", icon:"🔴" },
  { id:"normal",  label:"Normal",  color:"#B8F500", bg:"#1A2200", icon:"🟡" },
  { id:"baixa",   label:"Baixa",   color:"#555",    bg:"#161616", icon:"⚪" },
];

const getSt = id => STATUSES.find(s=>s.id===id)||STATUSES[0];
const getPr = id => PRIORITY.find(p=>p.id===id)||PRIORITY[1];

const revenueData = [
  {m:"Out",v:18},{m:"Nov",v:24},{m:"Dez",v:19},{m:"Jan",v:31},
  {m:"Fev",v:28},{m:"Mar",v:38},
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

let nPid=5, nTid=7;
const iProjects = [
  {id:1,name:"Campanha Verão 2026",  client:"Cliente A",status:"andamento",priority:"urgente",deadline:"2026-04-15",desc:"Campanha redes sociais"},
  {id:2,name:"Identidade Visual",    client:"Cliente B",status:"briefing",  priority:"normal", deadline:"2026-05-01",desc:"Rebrand completo"},
  {id:3,name:"Site Institucional",   client:"Cliente C",status:"concluido", priority:"baixa",  deadline:"2026-03-10",desc:"Landing page e blog"},
  {id:4,name:"Vídeo Institucional",  client:"Cliente D",status:"revisao",   priority:"urgente",deadline:"2026-03-20",desc:"Produção audiovisual"},
  {id:5,name:"Motion Institucional", client:"Cliente E",status:"producao",  priority:"normal", deadline:"2026-04-30",desc:"Animação logo"},
];
const iTasks = [
  {id:1,projectId:1,title:"Briefing criativo",      assignee:"Ana",   status:"concluido",  priority:"urgente",deadline:"2026-03-28"},
  {id:2,projectId:1,title:"Arte stories",           assignee:"Bruno", status:"andamento",  priority:"urgente",deadline:"2026-04-02"},
  {id:3,projectId:1,title:"Copy posts",             assignee:"Carol", status:"backlog",    priority:"normal", deadline:"2026-04-05"},
  {id:4,projectId:2,title:"Pesquisa referências",   assignee:"Ana",   status:"planejando", priority:"normal", deadline:"2026-04-20"},
  {id:5,projectId:3,title:"Deploy final",           assignee:"Bruno", status:"concluido",  priority:"baixa",  deadline:"2026-03-10"},
  {id:6,projectId:4,title:"Roteiro",                assignee:"Carol", status:"ajustes",    priority:"urgente",deadline:"2026-03-15"},
  {id:7,projectId:5,title:"Storyboard",             assignee:"Ana",   status:"andamento",  priority:"normal", deadline:"2026-04-10"},
];

const KANBAN_COLS = [
  {id:"backlog",   label:"Backlog",   color:"#444"},
  {id:"andamento", label:"Andamento", color:"#B8F500"},
  {id:"revisao",   label:"Revisão",   color:"#F97316"},
  {id:"concluido", label:"Concluído", color:"#4ADE80"},
];

function Pip({ value, onChange, options }) {
  const [open,setOpen] = useState(false);
  const ref = useRef();
  const cur = options.find(o=>o.id===value)||options[0];
  useEffect(()=>{
    if(!open) return;
    const fn = e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",fn);
    return ()=>document.removeEventListener("mousedown",fn);
  },[open]);
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{background:cur.bg,color:cur.color,border:`1px solid ${cur.color}30`,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:600,transition:"opacity 0.15s"}}>
        {cur.icon&&<span style={{fontSize:9}}>{cur.icon}</span>}
        <span>{cur.label}</span>
        <span style={{opacity:0.4,fontSize:8}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",left:0,top:"calc(100% + 4px)",background:"#0C0C0C",border:`1px solid ${C.borderHi}`,boxShadow:"0 16px 48px rgba(0,0,0,0.9)",zIndex:300,minWidth:170,borderRadius:12,padding:"6px 0",overflow:"hidden"}}>
          {options.map(o=>{
            const active=o.id===value;
            return(
              <button key={o.id} onClick={()=>{onChange(o.id);setOpen(false);}}
                style={{color:active?o.color:C.text2,background:active?`${o.color}12`:"transparent",width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 12px",fontSize:12,textAlign:"left",border:"none",cursor:"pointer",transition:"opacity 0.1s"}}>
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

function KanbanBoard({items,onStatusChange,onPriorityChange,renderCard}){
  return(
    <div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:16,minHeight:400}}>
      {KANBAN_COLS.map(col=>{
        const colItems = items.filter(i=>i.status===col.id);
        return(
          <div key={col.id} style={{minWidth:260,maxWidth:280,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"0 4px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:col.color,boxShadow:`0 0 6px ${col.color}`}}/>
              <span style={{color:col.color,fontFamily:"Space Grotesk,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{col.label}</span>
              <span style={{background:C.border,color:C.text2,fontSize:11,fontFamily:"Space Grotesk,sans-serif",marginLeft:"auto",padding:"1px 8px",borderRadius:99,fontWeight:700}}>{colItems.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {colItems.map(item=>renderCard(item,onStatusChange,onPriorityChange))}
              <div style={{border:`1px dashed ${C.border}`,borderRadius:12,padding:10,textAlign:"center",color:C.text3,fontSize:12,cursor:"pointer"}}>
                + Adicionar
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App(){
  const [view,setView]         = useState("overview");
  const [projects,setProjects] = useState(iProjects);
  const [tasks,setTasks]       = useState(iTasks);
  const [col,setCol]           = useState(false);

  const setPSt=(id,s)=>setProjects(ps=>ps.map(p=>p.id===id?{...p,status:s}:p));
  const setPPr=(id,p)=>setProjects(ps=>ps.map(pr=>pr.id===id?{...pr,priority:p}:pr));
  const setTSt=(id,s)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:s}:t));
  const setTPr=(id,p)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,priority:p}:t));

  const stats = useMemo(()=>({
    active:  projects.filter(p=>["andamento","producao","revisao","aprovacao"].includes(p.status)).length,
    done:    projects.filter(p=>p.status==="concluido").length,
    urgent:  [...projects,...tasks].filter(x=>x.priority==="urgente").length,
    total:   projects.length,
    tdone:   tasks.filter(t=>t.status==="concluido").length,
    topen:   tasks.filter(t=>t.status!=="concluido"&&t.status!=="cancelado").length,
  }),[projects,tasks]);

  const nav=[
    {id:"overview",  icon:"◈", label:"Visão Geral"},
    {id:"projects",  icon:"⬡", label:"Projetos"},
    {id:"tasks",     icon:"◎", label:"Tarefas"},
    {id:"analytics", icon:"▲", label:"Analytics"},
  ];

  const renderProjCard=(p,onSt,onPr)=>(
    <div key={p.id}
      style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14,transition:"box-shadow 0.2s,border-color 0.2s",cursor:"default"}}
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
              style={{background:view===item.id?`${C.accent}12`:"transparent",color:view===item.id?C.accent:C.text2,borderLeft:view===item.id?`2px solid ${C.accent}`:"2px solid transparent",fontFamily:"Space Grotesk,sans-serif",width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:"0 10px 10px 0",fontSize:13,fontWeight:500,transition:"all 0.15s",cursor:"pointer",border:"none",borderLeft:view===item.id?`2px solid ${C.accent}`:"2px solid transparent"}}>
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
            <h1 style={{fontFamily:"Space Grotesk,sans-serif",color:C.text1,fontSize:17,fontWeight:800,margin:0}}>
              {view==="overview"?"Visão Geral":view==="projects"?"Projetos":view==="tasks"?"Tarefas":"Analytics"}
            </h1>
            <p style={{color:C.text3,fontSize:11,margin:0,marginTop:2}}>Conex Studio · Gestão interna</p>
          </div>
          {(view==="projects"||view==="tasks")&&(
            <button style={{background:C.accent,color:"#080808",fontFamily:"Space Grotesk,sans-serif",fontWeight:900,fontSize:12,padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer"}}>
              {view==="projects"?"+ Novo Projeto":"+ Nova Tarefa"}
            </button>
          )}
        </div>

        <div style={{padding:24}}>

          {/* OVERVIEW */}
          {view==="overview"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
              <StatCard label="Em execução"    value={stats.active} accent={C.accent}  chart/>
              <StatCard label="Concluídos"     value={stats.done}   accent="#4ADE80"   chart/>
              <StatCard label="Urgentes"       value={stats.urgent} accent="#FF4444"   chart/>
              <StatCard label="Total Projetos" value={stats.total}  accent="#60A5FA"   chart/>
              <StatCard label="Tasks abertas"  value={stats.topen}  accent="#C084FC"   chart/>
              <StatCard label="Tasks feitas"   value={stats.tdone}  accent="#4ADE80"   chart/>
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

          {/* PROJECTS */}
          {view==="projects"&&<KanbanBoard items={projects} onStatusChange={setPSt} onPriorityChange={setPPr} renderCard={renderProjCard}/>}

          {/* TASKS */}
          {view==="tasks"&&<KanbanBoard items={tasks} onStatusChange={setTSt} onPriorityChange={setTPr} renderCard={renderTaskCard}/>}

          {/* ANALYTICS */}
          {view==="analytics"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
              <StatCard label="Proj. este mês"  value="6"   accent={C.accent}  chart/>
              <StatCard label="Taxa conclusão"  value="84%" accent="#4ADE80"   chart/>
              <StatCard label="Em atraso"       value="2"   accent="#FF4444"   chart/>
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
                    <Bar dataKey="abertas"    name="Abertas"    fill="#C084FC"    radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,gridColumn:"1/-1"}}>
                <div style={{color:C.text2,fontSize:11,letterSpacing:"0.1em",fontFamily:"Space Grotesk,sans-serif",marginBottom:16,textTransform:"uppercase"}}>Projetos por Status</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {STATUSES.slice(0,8).map(s=>{
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
    </div>
  );
}