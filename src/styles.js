export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

:root{
  --ink:#181C2E; --paper:#F5EFE1; --card:#FFFDF8; --primary:#3B4FE0; --primary-dk:#2B3AB0;
  --seal:#A82D3A; --brass:#C08A2E; --brass-lt:#E7C878; --green:#1F6B45; --slate:#6B7280; --rule:#E6DCC4;
  --field-bg:#FFFFFF; --overlay-bg:rgba(20,22,36,0.5);
  --shadow-sm: 0 1px 2px rgba(24,26,40,0.06);
  --shadow-md: 0 10px 28px rgba(24,26,40,0.10);
  --shadow-lg: 0 24px 56px rgba(24,26,40,0.16);
  --ring: rgba(59,79,224,0.18);
}
/* ---------- Dark mode ---------- */
html.dark{
  --ink:#ECE6D6; --paper:#0A0B12; --card:#161826; --primary:#6E80FF; --primary-dk:#8798FF;
  --seal:#E1596A; --brass:#E8BE58; --brass-lt:#F4DA8E; --green:#3FCB7E; --slate:#98A0B3; --rule:#262A3B;
  --field-bg:#1B1D2C; --overlay-bg:rgba(4,5,10,0.68);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.35);
  --shadow-md: 0 16px 38px rgba(0,0,0,0.45);
  --shadow-lg: 0 30px 70px rgba(0,0,0,0.6);
  --ring: rgba(110,128,255,0.28);
}

*{box-sizing:border-box;}
@media (prefers-reduced-motion: reduce){
  .bahi *{animation:none !important;transition:none !important;}
}

.bahi{font-family:'IBM Plex Sans',sans-serif;color:var(--ink);background:var(--paper);
  min-height:100vh;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;
  position:relative;isolation:isolate;}

/* Faint ledger-room atmosphere behind everything: two soft glows + a hint of
   paper grain in light mode, an inky vignette in dark mode. Fixed so it never
   scrolls with content, and z-index:-1 so it never intercepts clicks. */
.bahi::before{
  content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(620px circle at 8% -6%, rgba(192,138,46,0.10), transparent 60%),
    radial-gradient(720px circle at 108% 8%, rgba(59,79,224,0.08), transparent 55%),
    radial-gradient(900px circle at 50% 120%, rgba(168,45,58,0.05), transparent 60%);
}
html.dark .bahi::before{
  background:
    radial-gradient(620px circle at 8% -6%, rgba(232,190,88,0.07), transparent 60%),
    radial-gradient(720px circle at 108% 8%, rgba(110,128,255,0.10), transparent 55%),
    radial-gradient(900px circle at 50% 120%, rgba(225,89,106,0.05), transparent 60%);
}

.bahi h1,.bahi h2,.bahi h3{font-family:'Source Serif 4',serif;font-weight:600;margin:0;letter-spacing:-0.01em;}
.bahi .shell{display:flex;min-height:100vh;position:relative;z-index:1;}

/* ---------- Sidebar ---------- */
.bahi .side{width:230px;flex-shrink:0;background:var(--card);border-right:1px solid var(--rule);padding:22px 0;
  display:flex;flex-direction:column;position:relative;}
.bahi .side::after{
  content:"";position:absolute;top:0;right:-1px;width:1px;height:100%;
  background:linear-gradient(180deg, transparent, var(--brass) 15%, var(--brass) 85%, transparent);
  opacity:0.35;
}
.bahi .brand{padding:2px 20px 20px 20px;border-bottom:1px solid var(--rule);margin-bottom:14px;}
.bahi .brand .mark{font-family:'Source Serif 4',serif;font-size:23px;font-weight:700;color:var(--ink);letter-spacing:0.1px;}
.bahi .brand .mark img{
  box-shadow:0 0 0 2px var(--card), 0 0 0 3px var(--brass), var(--shadow-sm);
}
.bahi .brand .tag{font-size:11.5px;color:var(--slate);margin-top:3px;font-style:italic;}
.bahi nav{display:flex;flex-direction:column;gap:2px;margin-top:2px;padding:0 12px;}
.bahi nav button{all:unset;box-sizing:border-box;cursor:pointer;padding:10px 12px;font-size:14px;color:var(--ink);
  border-radius:10px;display:flex;align-items:center;gap:11px;width:100%;position:relative;
  transition:background 0.15s ease, color 0.15s ease, transform 0.1s ease;}
.bahi nav button .navicon{flex-shrink:0;width:18px;height:18px;color:var(--slate);transition:color 0.15s ease;}
.bahi nav button:hover{background:rgba(59,79,224,0.08);}
.bahi nav button:hover .navicon{color:var(--primary);}
.bahi nav button:active{transform:scale(0.98);}
.bahi nav button.active{
  background:linear-gradient(135deg, var(--primary), var(--primary-dk));
  color:#fff;font-weight:600;box-shadow:0 6px 16px rgba(59,79,224,0.28);
}
.bahi nav button.active::before{
  content:"";position:absolute;left:-12px;top:50%;transform:translateY(-50%);
  width:3px;height:60%;border-radius:3px;background:var(--brass);
}
.bahi nav button.active .navicon{color:#fff;}
.bahi .side .helpbtn{margin:14px 12px 0 12px;}
.bahi .side .helpbtn button{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;align-items:center;gap:11px;
  padding:10px 12px;border-radius:10px;font-size:14px;color:var(--slate);border:1px dashed var(--rule);
  transition:color 0.15s ease, border-color 0.15s ease, background 0.15s ease;}
.bahi .side .helpbtn button:hover{color:var(--primary);border-color:var(--primary);background:rgba(59,79,224,0.05);}
.bahi .side .helpbtn .navicon{width:18px;height:18px;}

.bahi .main{flex:1;padding:36px 46px;max-width:1080px;position:relative;}
.bahi .pagehead{margin-bottom:26px;padding-bottom:16px;border-bottom:1px solid var(--rule);position:relative;}
.bahi .pagehead::after{content:"";position:absolute;left:0;bottom:-1px;width:46px;height:2px;background:var(--brass);}
.bahi .pagehead p{color:var(--slate);font-size:14px;margin-top:6px;}
.bahi .row{display:flex;gap:16px;flex-wrap:wrap;}

/* ---------- Stat tiles ---------- */
.bahi .stat{border:1px solid var(--rule);border-radius:14px;padding:17px 19px;min-width:170px;flex:1;
  background:var(--card);box-shadow:var(--shadow-sm);border-left:3px solid var(--rule);
  position:relative;overflow:hidden;transition:transform 0.18s ease, box-shadow 0.18s ease;}
.bahi .stat:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
.bahi .stat::after{
  /* a small folded-corner motif, quietly nodding to a page of the ledger */
  content:"";position:absolute;top:0;right:0;width:0;height:0;
  border-style:solid;border-width:0 16px 16px 0;
  border-color:transparent var(--rule) transparent transparent;
  opacity:0.7;
}
.bahi .stat .lbl{font-size:12.5px;color:var(--slate);}
.bahi .stat .val{font-family:'Source Serif 4',serif;font-size:26px;margin-top:6px;}
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
.bahi tbody tr{transition:background 0.12s ease;}
.bahi tbody tr:hover{background:rgba(59,79,224,0.04);}
.bahi td.num,.bahi th.num{text-align:right;}

/* ---------- Buttons ---------- */
.bahi .btn{all:unset;box-sizing:border-box;cursor:pointer;background:linear-gradient(135deg, var(--primary), var(--primary-dk));
  color:#fff;padding:10px 22px;font-size:13.5px;font-weight:600;border-radius:999px;text-align:center;
  position:relative;overflow:hidden;letter-spacing:0.1px;
  box-shadow:0 4px 14px rgba(59,79,224,0.24);
  transition:box-shadow 0.18s ease, transform 0.08s ease;}
.bahi .btn::before{
  /* a single quiet sheen sweep on hover -- the one deliberate flourish */
  content:"";position:absolute;inset:0;
  background:linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.28) 40%, transparent 60%);
  transform:translateX(-120%);
}
.bahi .btn:hover{box-shadow:0 6px 20px rgba(59,79,224,0.36);}
.bahi .btn:hover::before{transform:translateX(120%);transition:transform 0.6s ease;}
.bahi .btn:active{transform:scale(0.98);}
.bahi .btn:disabled{opacity:0.6;cursor:default;box-shadow:none;}
.bahi .btn:disabled::before{display:none;}
.bahi .btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--rule);box-shadow:none;}
.bahi .btn.ghost:hover{background:rgba(24,26,40,0.04);box-shadow:none;}
.bahi .btn.danger{background:linear-gradient(135deg, var(--seal), #7d1f29);box-shadow:0 4px 14px rgba(168,45,58,0.28);}
.bahi .btn.danger:hover{box-shadow:0 6px 20px rgba(168,45,58,0.4);}
.bahi .btn.sm{padding:6px 14px;font-size:12px;}
.bahi .btn.xs{padding:4px 10px;font-size:11px;}

.bahi input,.bahi select,.bahi textarea{font-family:'IBM Plex Sans',sans-serif;font-size:14px;
  border:1px solid var(--rule);border-radius:9px;background:var(--field-bg);color:var(--ink);
  padding:9px 11px;transition:border-color 0.15s ease, box-shadow 0.15s ease;}
.bahi input:focus,.bahi select:focus,.bahi textarea:focus{outline:none;
  border-color:var(--primary);box-shadow:0 0 0 3px var(--ring);}
.bahi label{font-size:12.5px;color:var(--slate);display:flex;align-items:center;gap:5px;margin-bottom:4px;}
.bahi .field{margin-bottom:14px;}
.bahi .hint{font-size:11.5px;color:var(--slate);margin-top:4px;}
.bahi .card{border:1px solid var(--rule);border-radius:16px;padding:22px;margin-bottom:22px;background:var(--card);
  box-shadow:var(--shadow-sm);position:relative;}
.bahi .card::before{
  content:"";position:absolute;left:18px;right:18px;top:0;height:1px;
  background:linear-gradient(90deg, transparent, rgba(192,138,46,0.35), transparent);
}
.bahi .grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.bahi .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.bahi .hr{border:none;border-top:1px solid var(--rule);margin:18px 0;}
.bahi .pill{display:inline-block;font-size:11.5px;padding:2px 9px;border-radius:999px;border:1px solid var(--rule);color:var(--slate);}
.bahi .pill.green{background:rgba(31,107,69,0.1);color:var(--green);border-color:var(--green);}
.bahi .pill.seal{background:rgba(168,45,58,0.1);color:var(--seal);border-color:var(--seal);}

/* ---------- Help tooltip (jargon buster) ---------- */
.bahi .help{position:relative;display:inline-flex;}
.bahi .help .helpq{all:unset;box-sizing:border-box;cursor:help;width:15px;height:15px;border-radius:50%;
  background:var(--rule);color:var(--slate);font-size:10px;line-height:15px;text-align:center;font-weight:600;}
.bahi .help:hover .helptext,.bahi .help:focus-within .helptext{display:block;}
.bahi .help .helptext{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);
  width:230px;background:var(--ink);color:var(--paper);font-size:12px;line-height:1.5;padding:9px 11px;border-radius:9px;
  box-shadow:var(--shadow-md);z-index:20;font-weight:400;}
.bahi .help .helptext::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);
  border:6px solid transparent;border-top-color:var(--ink);}

.bahi .tax-compare{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--rule);border-radius:16px;overflow:hidden;}
.bahi .tax-col{padding:20px;background:var(--card);}
.bahi .tax-col+.tax-col{border-left:1px solid var(--rule);}
.bahi .tax-col h3{font-size:17px;margin-bottom:12px;}
.bahi .tax-line{display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--slate);}
.bahi .tax-line b{color:var(--ink);font-weight:500;}
.bahi .tax-total{display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;
  border-top:1px solid var(--rule);font-family:'Source Serif 4',serif;font-size:20px;}
.bahi .winner{background:rgba(31,107,69,0.06);}
.bahi .disclaimer{font-size:12px;color:var(--slate);border-left:3px solid var(--brass);border-radius:8px;padding:10px 14px;
  background:rgba(192,138,46,0.08);margin-top:16px;}

/* ---------- Chat ---------- */
.bahi .chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 200px);border:1px solid var(--rule);
  border-radius:16px;overflow:hidden;background:var(--card);box-shadow:var(--shadow-sm);}
.bahi .chat-log{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
.bahi .msg-row{display:flex;flex-direction:column;max-width:78%;}
.bahi .msg-row.user{align-self:flex-end;align-items:flex-end;}
.bahi .msg-row.ai{align-self:flex-start;align-items:flex-start;}
.bahi .msg{font-size:14px;line-height:1.6;}
.bahi .msg.user{background:linear-gradient(135deg, var(--primary), var(--primary-dk));color:#fff;padding:10px 15px;
  border-radius:14px 14px 4px 14px;white-space:pre-wrap;box-shadow:0 4px 12px rgba(59,79,224,0.22);}
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
.bahi .chat-input textarea{flex:1;border:none;border-radius:0;resize:none;padding:14px;font-size:14px;outline:none;background:transparent;}
.bahi .chat-input textarea:focus{outline:none;box-shadow:none;}
.bahi .chat-input button{border:none;border-radius:0;}
.bahi .empty{color:var(--slate);font-size:13.5px;padding:22px 18px;text-align:center;
  border:1px dashed var(--rule);border-radius:12px;background:rgba(107,114,128,0.03);}

/* A quiet loading moment -- a slow brass ring instead of a wall of grey text */
.bahi .loader{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
  padding:60px 20px;color:var(--slate);font-size:13.5px;text-align:center;}
.bahi .loader .ring{width:32px;height:32px;border-radius:50%;
  border:3px solid var(--rule);border-top-color:var(--brass);animation:bahi-spin 0.85s linear infinite;}
@keyframes bahi-spin{to{transform:rotate(360deg);}}
.bahi .invoice-item-row{display:grid;grid-template-columns:2.2fr 0.8fr 1fr 0.9fr auto;gap:10px;margin-bottom:8px;align-items:end;}
.bahi .del{all:unset;cursor:pointer;color:var(--seal);font-size:13px;}
.bahi ::-webkit-scrollbar{width:8px;} .bahi ::-webkit-scrollbar-thumb{background:var(--rule);border-radius:8px;}

/* ---------- Auth ---------- */
.bahi .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;position:relative;}
.bahi .auth-card{width:100%;max-width:408px;border:1px solid var(--rule);background:var(--card);padding:38px 36px;
  border-radius:22px;box-shadow:var(--shadow-lg);position:relative;}
.bahi .auth-card::before{
  content:"";position:absolute;inset:0;border-radius:22px;padding:1px;pointer-events:none;
  background:linear-gradient(150deg, var(--brass) 0%, transparent 28%, transparent 72%, var(--brass) 100%);
  opacity:0.5;
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
.bahi .auth-seal{
  width:56px;height:56px;border-radius:50%;margin:0 auto 16px auto;
  display:flex;align-items:center;justify-content:center;
  background:var(--card);box-shadow:0 0 0 2px var(--card), 0 0 0 3px var(--brass), var(--shadow-md);
}
.bahi .auth-card .mark{font-family:'Source Serif 4',serif;font-size:30px;font-weight:700;color:var(--ink);text-align:center;}
.bahi .auth-card .tag{font-size:13px;color:var(--slate);text-align:center;margin-top:5px;margin-bottom:26px;font-style:italic;}
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
.bahi .banner-error{border-left:3px solid var(--seal);background:rgba(168,45,58,0.06);color:var(--seal);border-radius:9px;
  font-size:13px;padding:10px 14px;margin-bottom:16px;}

/* Ornamental divider used for "or use email" etc. -- a quiet nod to a
   ledger page rule rather than a plain flat line. */
.bahi .auth-divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
.bahi .auth-divider .line{flex:1;height:1px;background:var(--rule);}
.bahi .auth-divider .dot{width:4px;height:4px;border-radius:50%;background:var(--brass);}
.bahi .auth-divider span{font-size:12px;color:var(--slate);}

/* ---------- Credit note rows ---------- */
.bahi .note-row td{border-bottom:1px dashed var(--rule);}
.bahi .note-row td{padding-top:4px;padding-bottom:4px;}
.bahi .note-badge{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;
  background:rgba(192,138,46,0.12);color:var(--brass);margin-left:6px;}

/* ---------- Sidebar extras (dark toggle, notifications) ---------- */
.bahi .side .themebtn{margin:0 12px 14px 12px;}
.bahi .side .themebtn button{all:unset;box-sizing:border-box;cursor:pointer;padding:10px 12px;border-radius:10px;
  font-size:14px;color:var(--slate);display:flex;align-items:center;gap:11px;width:100%;border:1px dashed var(--rule);
  transition:color 0.15s ease, border-color 0.15s ease, background 0.15s ease;}
.bahi .side .themebtn button:hover{color:var(--primary);border-color:var(--primary);background:rgba(59,79,224,0.05);}
.bahi .side .themebtn .navicon{width:18px;height:18px;}

.bahi .notif-wrap{position:relative;display:inline-block;}
.bahi .notif-bell{width:34px;height:34px;border-radius:10px;background:rgba(59,79,224,0.08);
  display:flex;align-items:center;justify-content:center;color:var(--slate);cursor:pointer;
  transition:background 0.15s, color 0.15s;}
.bahi .notif-bell:hover{background:rgba(59,79,224,0.14);color:var(--primary);}
.bahi .notif-bell.has-unread{color:var(--primary);position:relative;}
.bahi .notif-bell.has-unread::after{content:"";position:absolute;top:6px;right:6px;
  width:7px;height:7px;border-radius:50%;background:var(--seal);box-shadow:0 0 0 2px var(--card);}
.bahi .notif-dropdown{position:absolute;top:44px;right:0;width:320px;max-height:420px;
  background:var(--card);border:1px solid var(--rule);border-radius:14px;box-shadow:var(--shadow-lg);
  overflow-y:auto;z-index:50;display:none;}
.bahi .notif-wrap.open .notif-dropdown{display:block;}
.bahi .notif-item{padding:10px 12px;border-bottom:1px solid var(--rule);font-size:13px;cursor:pointer;
  transition:background 0.15s;}
.bahi .notif-item:hover{background:rgba(59,79,224,0.05);}
.bahi .notif-item.unread{background:rgba(59,79,224,0.06);}
.bahi .notif-item .notif-msg{color:var(--ink);margin-bottom:2px;line-height:1.4;}
.bahi .notif-item .notif-time{color:var(--slate);font-size:11.5px;}
.bahi .notif-empty{padding:16px;text-align:center;color:var(--slate);font-size:13px;}

/* ---------- Reports page ---------- */
.bahi .report-card{border:1px solid var(--rule);border-radius:16px;padding:22px;margin-bottom:22px;
  background:var(--card);box-shadow:var(--shadow-sm);}
.bahi .report-card h3{font-size:16px;margin-bottom:14px;}
.bahi .report-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.bahi .report-stat{border:1px solid var(--rule);border-radius:12px;padding:14px;background:var(--paper);
  text-align:center;}
.bahi .report-stat .val{font-family:'Source Serif 4',serif;font-size:22px;}
.bahi .report-stat .lbl{font-size:11.5px;color:var(--slate);margin-top:2px;}
.bahi .pill.neutral{background:rgba(107,114,128,0.1);color:var(--slate);}

/* Recharts renders its own inline styles for pie slice labels/legend text
   that don't pick up CSS variables automatically — force them to follow
   the theme so dark mode doesn't show near-invisible dark-on-dark text. */
.bahi .recharts-pie-label-text,.bahi .recharts-text{fill:var(--slate);}
.bahi .recharts-default-legend .recharts-legend-item-text{color:var(--slate) !important;}
.bahi .recharts-cartesian-axis-tick text{fill:var(--slate);}

/* ---------- Guide modal ---------- */
.bahi .guide-overlay{position:fixed;inset:0;background:var(--overlay-bg);display:flex;align-items:center;
   justify-content:center;padding:20px;z-index:100;backdrop-filter:blur(2px);}
.bahi .guide-modal{width:100%;max-width:620px;max-height:85vh;overflow-y:auto;background:var(--card);
  border-radius:20px;box-shadow:var(--shadow-lg);padding:30px 32px;border:1px solid var(--rule);}
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

/* ---------- Mobile top bar + off-canvas menu (hidden on desktop) ---------- */
.bahi .mobi-topbar{display:none;}
.bahi .mobi-overlay{display:none;}

/* ---------- Responsive ---------- */
@media (max-width: 820px){
  .bahi .shell{flex-direction:column;}

  /* Sticky top bar shown only on mobile: logo + hamburger toggle */
  .bahi .mobi-topbar{
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 16px;background:var(--card);border-bottom:1px solid var(--rule);
    position:sticky;top:0;z-index:70;
  }
  .bahi .mobi-topbar .mark{font-family:'Source Serif 4',serif;font-size:19px;font-weight:700;color:var(--ink);}
  .bahi .mobi-topbar .mark img{box-shadow:0 0 0 2px var(--card), 0 0 0 3px var(--brass);}
  .bahi .mobi-menu-btn{all:unset;box-sizing:border-box;cursor:pointer;width:38px;height:38px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;border-radius:10px;color:var(--ink);}
  .bahi .mobi-menu-btn:hover{background:rgba(59,79,224,0.08);}
  .bahi .mobi-menu-btn .navicon{width:22px;height:22px;}

  /* Dim backdrop behind the open menu */
  .bahi .mobi-overlay{display:block;position:fixed;inset:0;background:var(--overlay-bg);z-index:64;}

  /* Sidebar becomes a full-width off-canvas panel, closed by default */
  .bahi .side{
    display:none;
    position:fixed;top:0;left:0;right:0;bottom:0;
    width:100%;height:100dvh;
    background:var(--card);
    flex-direction:column;align-items:stretch;flex-wrap:nowrap;
    padding:0;
    overflow-y:auto;
    z-index:65;
    border-right:none;border-bottom:none;
  }
  .bahi .side::after{display:none;}
  .bahi .side.open{display:flex;}
  .bahi .brand{border-bottom:1px solid var(--rule);padding:18px 20px;margin-bottom:8px;flex-shrink:0;}
  .bahi nav{flex-direction:column;flex-wrap:nowrap;margin-top:0;padding:0 12px;gap:2px;}
  .bahi nav button{width:100%;padding:13px 14px;font-size:15px;}
  .bahi nav button.active::before{left:-12px;}
  .bahi .side .helpbtn{margin:10px 12px 0 12px;width:auto;}
  .bahi .side .helpbtn button{width:100%;padding:13px 14px;font-size:15px;}
  .bahi .side .themebtn{margin:14px 12px 0 12px;width:auto;}
  .bahi .side .themebtn button{width:100%;padding:13px 14px;font-size:15px;}
  .bahi .side .logout{margin-top:auto;border-top:1px solid var(--rule);padding:16px 20px;margin-left:0;flex-shrink:0;}

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

  /* Notification dropdown: pin to a comfortable width instead of a fixed
     320px box that can overflow narrow screens */
  .bahi .notif-dropdown{
    position:fixed;top:60px;left:12px;right:12px;width:auto;max-width:none;
  }
}

@media (max-width: 420px){
  .bahi .auth-wrap{padding:14px;}
  .bahi .auth-card{padding:28px 20px;}
}
`;
