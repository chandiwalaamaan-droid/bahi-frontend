import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiGet, apiPost, apiDelete } from "../utils";

export default function Advisor({ chat, setChat }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionBusyId, setActionBusyId] = useState(null); // message id (or "send") currently in flight
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [chat, busy]);

  const reload = async () => {
    try {
      const rows = await apiGet("/chat");
      setChat(rows);
    } catch {
      // Keep whatever's currently shown rather than wiping the conversation on a blip.
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setChat((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    try {
      await apiPost("/chat", { message: text });
      await reload();
    } catch (e) {
      setChat((prev) => [...prev, { role: "assistant", content: "Something went wrong reaching the advisor. Please try again." }]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditText(m.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    const text = editText.trim();
    if (!text) return;
    setActionBusyId(id);
    try {
      await apiPost(`/chat/${id}/edit`, { message: text });
      setEditingId(null);
      setEditText("");
      await reload();
    } catch (e) {
      alert(e.message || "Couldn't save that edit.");
    } finally {
      setActionBusyId(null);
    }
  };

  const regenerate = async (id) => {
    setActionBusyId(id);
    try {
      await apiPost(`/chat/${id}/regenerate`, {});
      await reload();
    } catch (e) {
      alert(e.message || "Couldn't regenerate that reply.");
    } finally {
      setActionBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    setActionBusyId(id);
    try {
      await apiDelete(`/chat/${id}`);
      setChat((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert(e.message || "Couldn't delete that message.");
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <div>
      <div className="pagehead">
        <h1>AI Advisor</h1>
        <p>Ask about GST, income tax, deductions, or anything in your books.</p>
      </div>
      <div className="chat-wrap">
        <div className="chat-log" ref={logRef}>
          {chat.length === 0 && (
            <p className="empty">Ask something like "Should I opt for the new or old tax regime?" or "How do I record a GST purchase invoice?"</p>
          )}
          {chat.map((m, i) => {
            const hasId = m.id != null;
            const isEditing = hasId && editingId === m.id;
            const rowBusy = hasId && actionBusyId === m.id;
            return (
              <div key={m.id ?? i} className={`msg-row ${m.role === "user" ? "user" : "ai"}`}>
                {isEditing ? (
                  <div className="msg-edit" style={{ width: "100%" }}>
                    <textarea rows={3} value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <div className="msg-edit-actions">
                      <button className="btn ghost sm" onClick={cancelEdit} disabled={rowBusy}>Cancel</button>
                      <button className="btn sm" onClick={() => saveEdit(m.id)} disabled={rowBusy}>
                        {rowBusy ? "Saving…" : "Save & resend"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`msg ${m.role === "user" ? "user" : "ai"}`}>
                      {m.role === "user" ? (
                        m.content
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      )}
                    </div>
                    {hasId && (
                      <div className="msg-actions">
                        {m.role === "user" && (
                          <button onClick={() => startEdit(m)} disabled={actionBusyId != null}>Edit</button>
                        )}
                        {m.role === "assistant" && (
                          <button onClick={() => regenerate(m.id)} disabled={actionBusyId != null}>
                            {rowBusy ? "Regenerating…" : "Regenerate"}
                          </button>
                        )}
                        <button onClick={() => remove(m.id)} disabled={actionBusyId != null}>
                          {rowBusy ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
          {busy && <div className="msg ai" style={{ color: "var(--slate)" }}>Thinking…</div>}
        </div>
        <div className="chat-input">
          <textarea
            rows={2}
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="btn" onClick={send} disabled={busy}>Send</button>
        </div>
      </div>
      <div className="disclaimer">
        The AI Advisor gives general, informational guidance and isn't a licensed Chartered Accountant. For filings, notices,
        audits, or anything with legal or financial consequences, confirm with a qualified CA.
      </div>
    </div>
  );
}
