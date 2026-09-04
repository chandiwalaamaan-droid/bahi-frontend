export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
:root{
  --ink:#1C2541; --paper:#FAF6EF; --card:#FFFFFF; --primary:#3454D1; --primary-dk:#2A42AC;
  --seal:#B3323F; --brass:#C08A2E; --green:#256D45; --slate:#64707D; --rule:#E7E0D2;
  --shadow-sm: 0 1px 2px rgba(28,37,65,0.05);
  --shadow-md: 0 6px 20px rgba(28,37,65,0.08);
}
*{box-sizing:border-box;}
.bahi{font-family:'IBM Plex Sans',sans-serif;color:var(--ink);background:var(--paper);
  min-height:100vh;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;}
.bahi h1,.bahi h2,.bahi h3{font-family:'Source Serif 4',serif;font-weight:600;margin:0;}
.bahi .shell{display:flex;min-height:100vh;}

/* ---------- Sidebar ---------- */
.bahi .side{width:224px;flex-shrink:0;background:var(--card);border-right:1px solid var(--rule);padding:24px 0;
  display:flex;flex-direction:column;}
.bahi .brand{padding:0 22px 20px 22px;border-bottom:1px solid var(--rule);margin-bottom:14px;}
.bahi .brand .mark{font-family:'Source Serif 4',serif;font-size:25px;font-weight:700;color:var(--primary);letter-spacing:0.2px;}
.bahi .brand .tag{font-size:12px;color:var(--slate);margin-top:2px;}
.bahi nav{display:flex;flex-direction:column;gap:2px;margin-top:2px;padding:0 12px;}
.bahi nav button{all:unset;box-sizing:border-box;cursor:pointer;padding:10px 12px;font-size:14px;color:var(--ink);
  border-radius:10px;display:flex;align-items:center;gap:11px;width:100%;}
.bahi nav button .navicon{flex-shrink:0;width:18px;height:18px;color:var(--slate);}
.bahi nav button:hover{background:rgba(52,84,209,0.07);}
.bahi nav button.active{background:var(--primary);color:#fff;font-weight:600;}
.bahi nav button.active .navicon{color:#fff;}
.bahi .side .helpbtn{margin:14px 12px 0 12px;}
.bahi .side .helpbtn button{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;align-items:center;gap:11px;
  padding:10px 12px;border-radius:10px;font-size:14px;color:var(--slate);border:1px dashed var(--rule);}
.bahi .side .helpbtn button:hover{color:var(--primary);border-color:var(--primary);background:rgba(52,84,209,0.05);}
.bahi .side .helpbtn .navicon{width:18px;height:18px;}

.bahi .main{flex:1;padding:36px 46px;max-width:1080px;}
.bahi .pagehead{margin-bottom:26px;padding-bottom:16px;border-bottom:1px solid var(--rule);}
.bahi .pagehead p{color:var(--slate);font-size:14px;margin-top:6px;}
.bahi .row{display:flex;gap:16px;flex-wrap:wrap;}

/* ---------- Stat tiles ---------- */
.bahi .stat{border:1px solid var(--rule);border-radius:12px;padding:16px 18px;min-width:170px;flex:1;
  background:var(--card);box-shadow:var(--shadow-sm);border-left:3px solid var(--rule);}
.bahi .stat .lbl{font-size:12.5px;color:var(--slate);}
.bahi .stat .val{font-family:'Source Serif 4',serif;font-size:25px;margin-top:6px;}
.bahi .stat.pos{border-left-color:var(--green);}
.bahi .stat.pos .val{color:var(--green);}
.bahi .stat.neg{border-left-color:var(--seal);}
.bahi .stat.neg .val{color:var(--seal);}
.bahi .stat.warn{border-left-color:var(--brass);}
.bahi .stat.warn .val{color:var(--brass);}

table{width:100%;border-collapse:collapse;font-size:14px;}
.bahi th{text-align:left;font-weight:500;color:var(--slate);font-size:12.5px;padding:8px 10px;
  border-bottom:1px solid var(--rule);}
.bahi td{padding:10px 10px;border-bottom:1px solid var(--rule);}
.bahi td.num,.bahi th.num{text-align:right;}

/* ---------- Buttons ---------- */
.bahi .btn{all:unset;box-sizing:border-box;cursor:pointer;background:var(--primary);color:#fff;padding:10px 20px;
  font-size:13.5px;font-weight:600;border-radius:999px;text-align:center;transition:background 0.15s, transform 0.05s;}
.bahi .btn:hover{background:var(--primary-dk);}
.bahi .btn:active{transform:scale(0.98);}
.bahi .btn:disabled{opacity:0.6;cursor:default;}
.bahi .btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--rule);}
.bahi .btn.ghost:hover{background:rgba(28,37,65,0.04);}
.bahi .btn.danger{background:var(--seal);}
.bahi .btn.danger:hover{background:#93222d;}
.bahi .btn.sm{padding:6px 14px;font-size:12px;}
.bahi .btn.xs{padding:4px 10px;font-size:11px;}

.bahi input,.bahi select,.bahi textarea{font-family:'IBM Plex Sans',sans-serif;font-size:14px;
  border:1px solid var(--rule);border-radius:9px;background:#fff;padding:9px 11px;color:var(--ink);}
.bahi input:focus,.bahi select:focus,.bahi textarea:focus{outline:2px solid var(--primary);outline-offset:1px;
  border-color:var(--primary);}
.bahi label{font-size:12.5px;color:var(--slate);display:flex;align-items:center;gap:5px;margin-bottom:4px;}
.bahi .field{margin-bottom:14px;}
.bahi .hint{font-size:11.5px;color:var(--slate);margin-top:4px;}
.bahi .card{border:1px solid var(--rule);border-radius:14px;padding:22px;margin-bottom:22px;background:var(--card);
  box-shadow:var(--shadow-sm);}
.bahi .grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.bahi .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.bahi .hr{border:none;border-top:1px solid var(--rule);margin:18px 0;}
.bahi .pill{display:inline-block;font-size:11.5px;padding:2px 9px;border-radius:999px;border:1px solid var(--rule);color:var(--slate);}
.bahi .pill.green{background:rgba(37,109,69,0.1);color:var(--green);border-color:var(--green);}
.bahi .pill.seal{background:rgba(179,50,63,0.1);color:var(--seal);border-color:var(--seal);}

/* ---------- Help tooltip (jargon buster) ---------- */
.bahi .help{position:relative;display:inline-flex;}
.bahi .help .helpq{all:unset;box-sizing:border-box;cursor:help;width:15px;height:15px;border-radius:50%;
  background:var(--rule);color:var(--slate);font-size:10px;line-height:15px;text-align:center;font-weight:600;}
.bahi .help:hover .helptext,.bahi .help:focus-within .helptext{display:block;}
.bahi .help .helptext{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);
  width:230px;background:var(--ink);color:#fff;font-size:12px;line-height:1.5;padding:9px 11px;border-radius:9px;
  box-shadow:var(--shadow-md);z-index:20;font-weight:400;}
.bahi .help .helptext::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);
  border:6px solid transparent;border-top-color:var(--ink);}

.bahi .tax-compare{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--rule);border-radius:14px;overflow:hidden;}
.bahi .tax-col{padding:20px;background:var(--card);}
.bahi .tax-col+.tax-col{border-left:1px solid var(--rule);}
.bahi .tax-col h3{font-size:17px;margin-bottom:12px;}
.bahi .tax-line{display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--slate);}
.bahi .tax-line b{color:var(--ink);font-weight:500;}
.bahi .tax-total{display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;
  border-top:1px solid var(--rule);font-family:'Source Serif 4',serif;font-size:20px;}
.bahi .winner{background:rgba(37,109,69,0.05);}
.bahi .disclaimer{font-size:12px;color:var(--slate);border-left:3px solid var(--brass);border-radius:8px;padding:10px 14px;
  background:rgba(192,138,46,0.08);margin-top:16px;}

/* ---------- Chat ---------- */
.bahi .chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 200px);border:1px solid var(--rule);
  border-radius:14px;overflow:hidden;background:var(--card);}
.bahi .chat-log{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
.bahi .msg-row{display:flex;flex-direction:column;max-width:78%;}
.bahi .msg-row.user{align-self:flex-end;align-items:flex-end;}
.bahi .msg-row.ai{align-self:flex-start;align-items:flex-start;}
.bahi .msg{font-size:14px;line-height:1.6;}
.bahi .msg.user{background:var(--primary);color:#fff;padding:10px 15px;border-radius:14px 14px 4px 14px;white-space:pre-wrap;}
.bahi .msg.ai{padding:4px 0;}
.bahi .msg.ai p{margin:0 0 10px 0;}
.bahi .msg.ai p:last-child{margin-bottom:0;}
.bahi .msg.ai h1,.bahi .msg.ai h2,.bahi .msg.ai h3{font-family:'Source Serif 4',serif;color:var(--ink);margin:14px 0 8px 0;line-height:1.3;}
.bahi .msg.ai h1:first-child,.bahi .msg.ai h2:first-child,.bahi .msg.ai h3:first-child{margin-top:0;}
.bahi .msg.ai h1{font-size:19px;}
.bahi .msg.ai h2{font-size:17px;}
.bahi .msg.ai h3{font-size:15px;}
.bahi .msg.ai ul,.bahi .msg.ai ol{margin:0 0 10px 0;padding-left:22px;}
.bahi .msg.ai li{margin-bottom:4px;}
.bahi .msg.ai strong{color:var(--ink);}
.bahi .msg.ai code{background:var(--paper);border:1px solid var(--rule);padding:1px 5px;font-size:12.5px;border-radius:4px;}
.bahi .msg.ai pre{background:var(--paper);border:1px solid var(--rule);border-radius:9px;padding:10px;overflow-x:auto;margin:0 0 10px 0;}
.bahi .msg.ai pre code{border:none;padding:0;}
.bahi .msg.ai table{border-collapse:collapse;width:100%;margin:0 0 12px 0;font-size:13px;}
.bahi .msg.ai th,.bahi .msg.ai td{border:1px solid var(--rule);padding:6px 8px;text-align:left;}
.bahi .msg.ai th{background:var(--paper);font-weight:600;}
.bahi .msg.ai blockquote{border-left:2px solid var(--rule);margin:0 0 10px 0;padding-left:12px;color:var(--slate);}
.bahi .msg.ai hr{border:none;border-top:1px solid var(--rule);margin:12px 0;}
.bahi .msg.ai a{color:var(--primary);}
.bahi .msg-actions{display:flex;gap:10px;margin-top:4px;}
.bahi .msg-actions button{all:unset;box-sizing:border-box;cursor:pointer;font-size:11px;color:var(--slate);}
.bahi .msg-actions button:hover{color:var(--primary);text-decoration:underline;}
.bahi .msg-actions button:disabled{opacity:0.5;cursor:default;text-decoration:none;}
.bahi .msg-edit textarea{width:100%;font-family:inherit;font-size:14px;padding:10px;border:1px solid var(--rule);
  border-radius:9px;resize:vertical;}
.bahi .msg-edit-actions{display:flex;gap:8px;margin-top:6px;justify-content:flex-end;}
.bahi .chat-input{display:flex;border-top:1px solid var(--rule);background:var(--card);}
.bahi .chat-input textarea{flex:1;border:none;border-radius:0;resize:none;padding:14px;font-size:14px;outline:none;}
.bahi .chat-input textarea:focus{outline:none;}
.bahi .chat-input button{border:none;border-radius:0;}
.bahi .empty{color:var(--slate);font-size:13.5px;padding:20px 0;}
.bahi .invoice-item-row{display:grid;grid-template-columns:2.2fr 0.8fr 1fr 0.9fr auto;gap:10px;margin-bottom:8px;align-items:end;}
.bahi .del{all:unset;cursor:pointer;color:var(--seal);font-size:13px;}
.bahi ::-webkit-scrollbar{width:8px;} .bahi ::-webkit-scrollbar-thumb{background:var(--rule);border-radius:8px;}

/* ---------- Auth ---------- */
.bahi .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
  background:radial-gradient(circle at 20% 15%, rgba(52,84,209,0.06), transparent 45%),
             radial-gradient(circle at 85% 90%, rgba(192,138,46,0.06), transparent 45%);}
.bahi .auth-card{width:100%;max-width:400px;border:1px solid var(--rule);background:var(--card);padding:36px;
  border-radius:20px;box-shadow:var(--shadow-md);}
.bahi .auth-card .mark{font-family:'Source Serif 4',serif;font-size:32px;font-weight:700;color:var(--primary);text-align:center;}
.bahi .auth-card .tag{font-size:13px;color:var(--slate);text-align:center;margin-top:4px;margin-bottom:26px;}
.bahi .auth-card .btn{width:100%;text-align:center;margin-top:6px;}
.bahi .auth-switch{text-align:center;margin-top:18px;font-size:13px;color:var(--slate);}
.bahi .auth-switch button{all:unset;cursor:pointer;color:var(--primary);font-weight:600;}
.bahi .auth-error{font-size:13px;color:var(--seal);margin:-6px 0 14px 0;}
.bahi .auth-info{font-size:13px;color:var(--green);margin:-6px 0 14px 0;}
.bahi .link-btn{all:unset;box-sizing:border-box;cursor:pointer;color:var(--slate);text-decoration:underline;}
.bahi .link-btn:hover{color:var(--primary);}
.bahi .side .logout{margin-top:auto;padding:14px 22px;border-top:1px solid var(--rule);}
.bahi .side .logout button{all:unset;cursor:pointer;font-size:13px;color:var(--slate);}
.bahi .side .logout button:hover{color:var(--primary);}
.bahi .confirm-inline{display:flex;gap:8px;align-items:center;}
.bahi .banner-error{border-left:3px solid var(--seal);background:rgba(179,50,63,0.06);color:var(--seal);border-radius:9px;
  font-size:13px;padding:10px 14px;margin-bottom:16px;}

/* ---------- Credit note rows ---------- */
.bahi .note-row td{border-bottom:1px dashed var(--rule);}
.bahi .note-row td{padding-top:4px;padding-bottom:4px;}
.bahi .note-badge{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;
  background:rgba(192,138,46,0.12);color:var(--brass);margin-left:6px;}

/* ---------- Guide modal ---------- */
.bahi .guide-overlay{position:fixed;inset:0;background:rgba(28,37,65,0.45);display:flex;align-items:center;
  justify-content:center;padding:20px;z-index:100;}
.bahi .guide-modal{width:100%;max-width:620px;max-height:85vh;overflow-y:auto;background:var(--card);
  border-radius:18px;box-shadow:var(--shadow-md);padding:30px 32px;}
.bahi .guide-modal h2{font-size:23px;}
.bahi .guide-modal .guide-close{all:unset;box-sizing:border-box;cursor:pointer;float:right;color:var(--slate);
  font-size:20px;line-height:1;padding:4px;}
.bahi .guide-modal .guide-close:hover{color:var(--seal);}
.bahi .guide-intro{color:var(--slate);font-size:13.5px;margin:8px 0 22px 0;line-height:1.6;}
.bahi .guide-step{display:flex;gap:14px;padding:14px 0;border-top:1px solid var(--rule);}
.bahi .guide-step:first-of-type{border-top:none;}
.bahi .guide-step .navicon{flex-shrink:0;width:20px;height:20px;color:var(--primary);margin-top:2px;}
.bahi .guide-step h4{font-size:14.5px;margin-bottom:3px;}
.bahi .guide-step p{font-size:13px;color:var(--slate);margin:0;line-height:1.55;}
.bahi .guide-glossary{margin-top:24px;padding-top:20px;border-top:1px solid var(--rule);}
.bahi .guide-glossary h3{font-size:15px;margin-bottom:12px;}
.bahi .guide-term{margin-bottom:12px;}
.bahi .guide-term dt{font-weight:600;font-size:13.5px;color:var(--ink);}
.bahi .guide-term dd{margin:2px 0 0 0;font-size:13px;color:var(--slate);line-height:1.55;}
.bahi .guide-footer{margin-top:26px;text-align:center;}

/* ---------- Responsive ---------- */
@media (max-width: 820px){
  .bahi .shell{flex-direction:column;}
  .bahi .side{width:100%;border-right:none;border-bottom:1px solid var(--rule);padding:14px 0;
    flex-direction:row;align-items:center;flex-wrap:wrap;}
  .bahi .brand{border-bottom:none;padding:0 16px;margin-bottom:0;flex-shrink:0;}
  .bahi nav{flex-direction:row;flex-wrap:wrap;margin-top:0;padding:0 8px;gap:4px;}
  .bahi nav button{padding:8px 11px;font-size:12.5px;}
  .bahi .side .helpbtn{margin:0 8px;width:auto;}
  .bahi .side .helpbtn button{width:auto;padding:8px 11px;}
  .bahi .side .logout{margin-top:0;border-top:none;padding:0 16px;margin-left:auto;}
  .bahi .main{padding:20px 16px;max-width:100%;}
  .bahi .grid2{grid-template-columns:1fr;gap:4px;}
  .bahi .grid3{grid-template-columns:1fr;}
  .bahi .row{gap:12px;}
  .bahi .stat{min-width:0;flex-basis:100%;}
  .bahi .tax-compare{grid-template-columns:1fr;}
  .bahi .tax-col+.tax-col{border-left:none;border-top:1px solid var(--rule);}
  .bahi .invoice-item-row{grid-template-columns:1fr;gap:6px;padding-bottom:10px;border-bottom:1px dashed var(--rule);}
  .bahi .table-wrap{overflow-x:auto;}
  .bahi .table-wrap table{min-width:720px;}
  .bahi .table-wrap thead th{position:sticky;top:0;background:var(--card);}
  .bahi .chat-wrap{height:calc(100vh - 260px);}
  .bahi .msg-row{max-width:92%;}
  .bahi .guide-modal{padding:24px 20px;}
}
`;
