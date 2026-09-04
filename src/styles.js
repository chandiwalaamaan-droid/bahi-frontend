export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
:root{
  --ink:#14213D; --paper:#FBFAF7; --seal:#7A2331; --brass:#B8935A;
  --green:#2F5233; --slate:#5B6470; --rule:#D8D3C7;
}
*{box-sizing:border-box;}
.bahi{font-family:'IBM Plex Sans',sans-serif;color:var(--ink);background:var(--paper);
  min-height:100vh;font-variant-numeric:tabular-nums;}
.bahi h1,.bahi h2,.bahi h3{font-family:'Source Serif 4',serif;font-weight:600;margin:0;}
.bahi .shell{display:flex;min-height:100vh;}
.bahi .side{width:210px;flex-shrink:0;border-right:1px solid var(--rule);padding:28px 0;
  display:flex;flex-direction:column;}
.bahi .brand{padding:0 24px 22px 24px;border-bottom:1px solid var(--rule);margin-bottom:8px;}
.bahi .brand .mark{font-family:'Source Serif 4',serif;font-size:26px;font-weight:700;color:var(--seal);letter-spacing:0.5px;}
.bahi .brand .tag{font-size:12px;color:var(--slate);margin-top:2px;}
.bahi nav{display:flex;flex-direction:column;margin-top:6px;}
.bahi nav button{all:unset;cursor:pointer;padding:12px 24px;font-size:14.5px;color:var(--ink);
  border-left:3px solid transparent;display:flex;align-items:center;gap:10px;}
.bahi nav button:hover{background:rgba(122,35,49,0.05);}
.bahi nav button.active{border-left:3px solid var(--seal);color:var(--seal);font-weight:600;background:rgba(122,35,49,0.06);}
.bahi .main{flex:1;padding:34px 44px;max-width:1040px;}
.bahi .pagehead{margin-bottom:26px;padding-bottom:16px;border-bottom:1px solid var(--rule);}
.bahi .pagehead p{color:var(--slate);font-size:14px;margin-top:6px;}
.bahi .row{display:flex;gap:24px;flex-wrap:wrap;}
.bahi .stat{border:1px solid var(--rule);padding:16px 18px;min-width:170px;flex:1;}
.bahi .stat .lbl{font-size:12.5px;color:var(--slate);}
.bahi .stat .val{font-family:'Source Serif 4',serif;font-size:26px;margin-top:6px;}
.bahi .stat.pos .val{color:var(--green);}
.bahi .stat.neg .val{color:var(--seal);}
.bahi .stat.warn .val{color:var(--brass);}
table{width:100%;border-collapse:collapse;font-size:14px;}
.bahi th{text-align:left;font-weight:500;color:var(--slate);font-size:12.5px;padding:8px 10px;
  border-bottom:1px solid var(--ink);}
.bahi td{padding:9px 10px;border-bottom:1px solid var(--rule);}
.bahi td.num,.bahi th.num{text-align:right;}
.bahi .btn{all:unset;box-sizing:border-box;cursor:pointer;background:var(--seal);color:var(--paper);padding:9px 18px;
  font-size:13.5px;font-weight:500;}
.bahi .btn:hover{opacity:0.88;}
.bahi .btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--rule);}
.bahi .btn.sm{padding:5px 10px;font-size:12px;}
.bahi .btn.xs{padding:3px 8px;font-size:11px;}
.bahi input,.bahi select,.bahi textarea{font-family:'IBM Plex Sans',sans-serif;font-size:14px;
  border:1px solid var(--rule);background:#fff;padding:8px 10px;color:var(--ink);}
.bahi label{font-size:12.5px;color:var(--slate);display:block;margin-bottom:4px;}
.bahi .field{margin-bottom:14px;}
.bahi .card{border:1px solid var(--rule);padding:22px;margin-bottom:22px;background:#fff;}
.bahi .grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.bahi .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.bahi .hr{border:none;border-top:1px solid var(--rule);margin:18px 0;}
.bahi .pill{display:inline-block;font-size:11.5px;padding:2px 8px;border:1px solid var(--rule);color:var(--slate);}
.bahi .pill.green{background:rgba(47,82,51,0.1);color:var(--green);border-color:var(--green);}
.bahi .pill.seal{background:rgba(122,35,49,0.1);color:var(--seal);border-color:var(--seal);}
.bahi .tax-compare{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--rule);}
.bahi .tax-col{padding:20px;}
.bahi .tax-col+.tax-col{border-left:1px solid var(--rule);}
.bahi .tax-col h3{font-size:17px;margin-bottom:12px;}
.bahi .tax-line{display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--slate);}
.bahi .tax-line b{color:var(--ink);font-weight:500;}
.bahi .tax-total{display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;
  border-top:1px solid var(--rule);font-family:'Source Serif 4',serif;font-size:20px;}
.bahi .winner{background:rgba(47,82,51,0.06);border-color:var(--green);}
.bahi .disclaimer{font-size:12px;color:var(--slate);border-left:2px solid var(--brass);padding:8px 12px;
  background:rgba(184,147,90,0.08);margin-top:16px;}
.bahi .chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 200px);border:1px solid var(--rule);}
.bahi .chat-log{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
.bahi .msg-row{display:flex;flex-direction:column;max-width:78%;}
.bahi .msg-row.user{align-self:flex-end;align-items:flex-end;}
.bahi .msg-row.ai{align-self:flex-start;align-items:flex-start;}
.bahi .msg{font-size:14px;line-height:1.55;}
.bahi .msg.user{background:var(--ink);color:var(--paper);padding:10px 14px;white-space:pre-wrap;}
.bahi .msg.ai{padding:10px 0;}
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
.bahi .msg.ai code{background:#fff;border:1px solid var(--rule);padding:1px 5px;font-size:12.5px;border-radius:3px;}
.bahi .msg.ai pre{background:#fff;border:1px solid var(--rule);padding:10px;overflow-x:auto;margin:0 0 10px 0;}
.bahi .msg.ai pre code{border:none;padding:0;}
.bahi .msg.ai table{border-collapse:collapse;width:100%;margin:0 0 12px 0;font-size:13px;}
.bahi .msg.ai th,.bahi .msg.ai td{border:1px solid var(--rule);padding:6px 8px;text-align:left;}
.bahi .msg.ai th{background:#fff;font-weight:600;}
.bahi .msg.ai blockquote{border-left:2px solid var(--rule);margin:0 0 10px 0;padding-left:12px;color:var(--slate);}
.bahi .msg.ai hr{border:none;border-top:1px solid var(--rule);margin:12px 0;}
.bahi .msg.ai a{color:var(--seal);}
.bahi .msg-actions{display:flex;gap:10px;margin-top:4px;}
.bahi .msg-actions button{all:unset;box-sizing:border-box;cursor:pointer;font-size:11px;color:var(--slate);}
.bahi .msg-actions button:hover{color:var(--seal);text-decoration:underline;}
.bahi .msg-actions button:disabled{opacity:0.5;cursor:default;text-decoration:none;}
.bahi .msg-edit textarea{width:100%;font-family:inherit;font-size:14px;padding:10px;border:1px solid var(--rule);resize:vertical;}
.bahi .msg-edit-actions{display:flex;gap:8px;margin-top:6px;justify-content:flex-end;}
.bahi .chat-input{display:flex;border-top:1px solid var(--rule);}
.bahi .chat-input textarea{flex:1;border:none;resize:none;padding:14px;font-size:14px;outline:none;}
.bahi .chat-input button{border:none;}
.bahi .empty{color:var(--slate);font-size:13.5px;padding:20px 0;}
.bahi .invoice-item-row{display:grid;grid-template-columns:2.2fr 0.8fr 1fr 0.9fr auto;gap:10px;margin-bottom:8px;align-items:end;}
.bahi .del{all:unset;cursor:pointer;color:var(--seal);font-size:13px;}
.bahi ::-webkit-scrollbar{width:8px;} .bahi ::-webkit-scrollbar-thumb{background:var(--rule);}
.bahi .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
.bahi .auth-card{width:100%;max-width:380px;border:1px solid var(--rule);background:#fff;padding:32px;}
.bahi .auth-card .mark{font-family:'Source Serif 4',serif;font-size:30px;font-weight:700;color:var(--seal);text-align:center;}
.bahi .auth-card .tag{font-size:13px;color:var(--slate);text-align:center;margin-top:2px;margin-bottom:24px;}
.bahi .auth-card .btn{width:100%;text-align:center;margin-top:6px;}
.bahi .auth-switch{text-align:center;margin-top:16px;font-size:13px;color:var(--slate);}
.bahi .auth-switch button{all:unset;cursor:pointer;color:var(--seal);font-weight:600;}
.bahi .auth-error{font-size:13px;color:var(--seal);margin:-6px 0 14px 0;}
.bahi .auth-info{font-size:13px;color:var(--green);margin:-6px 0 14px 0;}
.bahi .link-btn{all:unset;box-sizing:border-box;cursor:pointer;color:var(--slate);text-decoration:underline;}
.bahi .link-btn:hover{color:var(--seal);}
.bahi .side .logout{margin-top:auto;padding:12px 24px;border-top:1px solid var(--rule);}
.bahi .side .logout button{all:unset;cursor:pointer;font-size:13px;color:var(--slate);}
.bahi .side .logout button:hover{color:var(--seal);}
.bahi .confirm-inline{display:flex;gap:8px;align-items:center;}
.bahi .banner-error{border-left:2px solid var(--seal);background:rgba(122,35,49,0.06);color:var(--seal);
  font-size:13px;padding:8px 12px;margin-bottom:16px;}

/* ---------- Credit note rows ---------- */
.bahi .note-row td{border-bottom:1px dashed #ddd;}
.bahi .note-row td{padding-top:4px;padding-bottom:4px;}
.bahi .note-badge{display:inline-block;font-size:11px;padding:1px 6px;border-radius:3px;
  background:rgba(184,147,90,0.1);color:var(--brass);margin-left:6px;}

/* ---------- Responsive ---------- */
@media (max-width: 820px){
  .bahi .shell{flex-direction:column;}
  .bahi .side{width:100%;border-right:none;border-bottom:1px solid var(--rule);padding:16px 0;
    flex-direction:row;align-items:center;flex-wrap:wrap;}
  .bahi .brand{border-bottom:none;padding:0 16px;margin-bottom:0;flex-shrink:0;}
  .bahi nav{flex-direction:row;flex-wrap:wrap;margin-top:0;}
  .bahi nav button{border-left:none;border-bottom:3px solid transparent;padding:10px 12px;font-size:13px;}
  .bahi nav button.active{border-left:none;border-bottom:3px solid var(--seal);}
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
  .bahi .table-wrap thead th{position:sticky;top:0;background:#fff;}
  .bahi .chat-wrap{height:calc(100vh - 260px);}
  .bahi .msg-row{max-width:92%;}
}
`;
