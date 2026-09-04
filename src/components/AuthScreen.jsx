import React, { useState, useEffect } from "react";
import { CSS } from "../styles";
import { apiAuth, TOKEN_KEY } from "../utils";

export default function AuthScreen({ onAuthed }) {
  // modes: "login" | "register" | "forgot" | "reset"
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // If the user arrived via a password-reset email link (?resetToken=...),
  // jump straight into the reset-password form.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("resetToken");
    if (token) {
      setResetToken(token);
      setMode("reset");
      // Clean the token out of the visible URL/browser history.
      params.delete("resetToken");
      const rest = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""));
    }
  }, []);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
  };

  const submitLoginOrRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const path = mode === "login" ? "/login" : "/register";
      const body = mode === "login" ? { email, password } : { email, password, name };
      const data = await apiAuth(path, body);
      localStorage.setItem(TOKEN_KEY, data.token);
      onAuthed(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const data = await apiAuth("/forgot-password", { email });
      setInfo(data.message || "If that email is registered, we've sent a password reset link.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const data = await apiAuth("/reset-password", { token: resetToken, password });
      setInfo(data.message || "Password updated. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => switchMode("login"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bahi">
      <style>{CSS}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="mark">Bahi</div>
          <div className="tag">Your AI chartered accountant</div>

          {(mode === "login" || mode === "register") && (
            <form onSubmit={submitLoginOrRegister}>
              {mode === "register" && (
                <div className="field">
                  <label>Name (optional)</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="field">
                <label>Password {mode === "register" && "(min 8 characters)"}</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "12px" }}>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => switchMode("forgot")}
                    style={{ fontSize: "0.9em" }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {error && <div className="auth-error">{error}</div>}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={submitForgot}>
              <p style={{ marginTop: 0 }}>
                Enter your account email and we'll send you a link to reset your password.
              </p>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              {info && <div className="auth-info">{info}</div>}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={submitReset}>
              <p style={{ marginTop: 0 }}>Choose a new password for your account.</p>
              <div className="field">
                <label>New password (min 8 characters)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              {info && <div className="auth-info">{info}</div>}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Reset password"}
              </button>
            </form>
          )}

          <div className="auth-switch">
            {mode === "login" && (
              <>
                New to Bahi? <button onClick={() => switchMode("register")}>Create an account</button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account? <button onClick={() => switchMode("login")}>Sign in</button>
              </>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <>
                Remembered it? <button onClick={() => switchMode("login")}>Back to sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
