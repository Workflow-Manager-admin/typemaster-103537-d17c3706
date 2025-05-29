import React, { useState, useEffect, createContext } from 'react';
import './App.css';

// PUBLIC_INTERFACE
export const ThemeContext = createContext();
// PUBLIC_INTERFACE
export const SoundContext = createContext();

const primaryColor = "#6C63FF";
const secondaryColor = "#FF6584";
const accentColor = "#FFD600";

// Helper: Returns true if window width indicates mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

// PUBLIC_INTERFACE
function App() {
  // Theme and sound
  const [darkMode, setDarkMode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Auth and user
  const [user, setUser] = useState(null); // {name: string, tests: number, isAdmin: bool, id: string}
  const [authed, setAuthed] = useState(false);

  // Routing (simple pseudo-routing)
  const [page, setPage] = useState("typing"); // "typing", "leaderboard", "profile", "admin", "login", "signup", "settings"

  // Global app colors
  useEffect(() => {
    document.body.style.background = darkMode
      ? "linear-gradient(120deg, #24243e, #302b63, #0f0c29)"
      : `linear-gradient(120deg, ${primaryColor}, ${secondaryColor} 90%)`;
    document.body.style.transition = "background 0.6s";
  }, [darkMode]);

  // Demo users (remove in integration)
  const DEMO_USER = {
    name: "Alex",
    tests: 12,
    isAdmin: true,
    id: "u1"
  };

  // Demo function for login/signup (would use API/backend)
  function handleLogin(credentials) {
    // authentication logic placeholder
    if (credentials.name === "admin") {
      setUser({ ...DEMO_USER, name: "admin", isAdmin: true });
    } else {
      setUser({ name: credentials.name, tests: 3, isAdmin: false, id: "u2" });
    }
    setAuthed(true);
    setPage("typing");
  }

  function handleLogout() {
    setUser(null);
    setAuthed(false);
    setPage("login");
  }

  function goTo(p) {
    setPage(p);
  }

  const isMobile = useIsMobile();

  // Navigation
  function NavBar() {
    return (
      <nav className="navbar" style={{
        background: darkMode ?
          "rgba(15,12,41,0.98)" : "rgba(255,255,255,0.95)",
        color: darkMode ? "#fff" : "#121212",
        borderBottom: darkMode
          ? "1.5px solid #333"
          : `1.5px solid ${primaryColor}`,
        transition: "background .5s"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="logo" style={{ letterSpacing: "2px", color: primaryColor, fontWeight: 700, fontSize:  isMobile ? "0.95rem" : "1.25rem", cursor: "pointer" }}
              onClick={() => goTo("typing")}>
            <span className="logo-symbol" style={{ color: accentColor, fontSize: "1.8em", marginRight: 6 }}>
              <svg width="24" height="24" viewBox="0 0 24 24"><circle fill={primaryColor} cx="12" cy="12" r="10"/><text x="7" y="17" fontSize="9" fill="white" fontFamily="monospace">T</text></svg>
            </span>
            TypeMaster
          </div>
          <div style={{ display: "flex", gap: isMobile ? 9 : 16, alignItems: "center" }}>
            {authed && <>
              <NavLink onClick={() => goTo("leaderboard")}
                icon="🏆" text="Leaderboard" active={page === 'leaderboard'} />
              <NavLink onClick={() => goTo("profile")}
                icon="👤" text="Profile" active={page === 'profile'} />
              {user && user.isAdmin && (
                <NavLink onClick={() => goTo("admin")}
                  icon="🛠" text="Admin" active={page === 'admin'} />
              )}
            </>}
            <NavLink onClick={() => goTo("settings")}
              icon="⚙️" text={isMobile ? "" : "Settings"} active={page === 'settings'} />
            {authed
              ? <button className="btn"
                  onClick={handleLogout}
                  style={{ background: secondaryColor, marginLeft: 8, fontWeight: 600 }}>
                  Logout
                </button>
              : <>
              <NavLink onClick={() => goTo("login")}
                icon="🔑" text="Login" active={page === "login"} />
              <NavLink onClick={() => goTo("signup")}
                icon="📝" text="Sign Up" active={page === "signup"} />
              </>}
          </div>
        </div>
      </nav>
    );
  }

  function NavLink({ onClick, icon, text, active }) {
    return (
      <button className="btn"
        onClick={onClick}
        style={{
          background: active ? primaryColor : "transparent",
          color: active ? "#fff" : darkMode ? "#fff" : "#333",
          boxShadow: active ? `0 2px 8px ${primaryColor}33` : "",
          border: "none",
          fontWeight: active ? 700 : 500,
          fontSize: "1em",
          letterSpacing: "1px",
          margin: 0,
          padding: "8px 13px",
          display: "flex",
          alignItems: "center"
        }}>
        <span style={{ marginRight: text ? 7 : 0 }}>{icon}</span> {text}
      </button>
    );
  }

  // Page container with fade-in
  function PageWrapper({ children }) {
    return (
      <div
        className="container"
        style={{
          marginTop: 88,
          minHeight: "calc(100vh - 110px)",
          transition: "background .5s",
          animation: "fadeIn .7s"
        }}
      >{children}</div>
    );
  }

  // ---- ROUTES ----

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, primaryColor, accentColor, secondaryColor }}>
      <SoundContext.Provider value={{ soundOn, setSoundOn }}>
        <div className="app" style={{ minHeight: "100vh", width: "100%" }}>
          <NavBar />
          <main>
            {/* Routing */}
            <PageWrapper>
              {!authed ? (
                page === "signup"
                  ? <SignUpForm onSignup={handleLogin} switchToLogin={() => setPage("login")} />
                  : <LoginForm onLogin={handleLogin} switchToSignup={() => setPage("signup")} />
              ) : page === "typing"
                ? <TypingTest user={user} />
                : page === "leaderboard"
                  ? <Leaderboard user={user} />
                  : page === "profile"
                    ? <Profile user={user} />
                    : page === "admin"
                      ? (user?.isAdmin ? <AdminPanel /> : <NoAccess />)
                      : page === "settings"
                        ? <Settings
                            darkMode={darkMode} setDarkMode={setDarkMode}
                            soundOn={soundOn} setSoundOn={setSoundOn}
                          />
                        : <NotFound />
              }
            </PageWrapper>
          </main>
          <footer style={{
            textAlign: "center",
            padding: "19px",
            fontSize: "1em",
            color: darkMode ? "#aaa" : primaryColor,
            background: "transparent"
          }}>
            © 2024 TypeMaster | Crafted with <span style={{color:secondaryColor}}>♥</span>
          </footer>
          {/* CSS for fadeIn */}
          <style>
            {`
            @keyframes fadeIn {
              0% { opacity:0; transform:translateY(30px); }
              70% { opacity:0.9; }
              100% { opacity:1; transform:translateY(0);}
            }
            `}
          </style>
        </div>
      </SoundContext.Provider>
    </ThemeContext.Provider>
  );
}


// -------- FEATURE SCHELETON COMPONENTS ---------

// PUBLIC_INTERFACE
function LoginForm({ onLogin, switchToSignup }) {
  const [name, setName] = useState("");
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      padding: 36,
      borderRadius: 18,
      boxShadow: "0 8px 32px #3334",
      maxWidth: 380,
      margin: "64px auto 0",
      color: "#222"
    }}>
      <div style={{ fontSize: "1.6em", fontWeight: 600, color: "#444" }}>
        <span role="img" aria-label="login">🔑</span> Login to TypeMaster
      </div>
      <input
        style={inputStyle} placeholder="Enter your name"
        value={name} onChange={e => setName(e.target.value)} autoFocus
        onKeyDown={e => { if (e.key === 'Enter') { onLogin({ name }); } }} maxLength={20}
      />
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap:8 }}>
        <button className="btn btn-large"
          style={{ background: primaryColor }}
          onClick={() => onLogin({ name })}>
          Login
        </button>
        <span style={{ fontSize: ".93em", color: "#666", marginTop:9, cursor:"pointer", textDecoration: "underline"}}
             onClick={switchToSignup}>
          No account? Sign up instead.
        </span>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function SignUpForm({ onSignup, switchToLogin }) {
  const [name, setName] = useState("");
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)",
      padding: 35,
      borderRadius: 18,
      boxShadow: "0 8px 32px #3333",
      maxWidth: 370,
      margin: "64px auto 0",
      color: "#222"
    }}>
      <div style={{ fontSize: "1.6em", fontWeight: 600, color: "#444" }}>
        <span role="img" aria-label="signup">📝</span> Sign Up
      </div>
      <input
        style={inputStyle} placeholder="Choose a name"
        value={name} onChange={e => setName(e.target.value)} autoFocus
        onKeyDown={e => { if (e.key === 'Enter') { onSignup({ name }); } }} maxLength={20}
      />
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap:8 }}>
        <button className="btn btn-large"
          style={{ background: secondaryColor }}
          onClick={() => onSignup({ name })}>
          Sign Up
        </button>
        <span style={{ fontSize: ".93em", color: "#666", marginTop:9, cursor:"pointer", textDecoration: "underline"}}
             onClick={switchToLogin}>
          Already have an account? Login.
        </span>
      </div>
    </div>
  );
}


// PUBLIC_INTERFACE
function TypingTest({ user }) {
  // Placeholder: not interactive real implementation — just demo UI
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(30);
  const [input, setInput] = useState("");
  const testText = "The quick brown fox jumps over the lazy dog. Type as fast and accurately as possible!";
  const totalWords = testText.split(" ").length;
  const wpm = Math.round((input.trim().split(" ").length / (30 - time + 1)) * 60 / 5);
  const accuracy = Math.max(0, 100 - Math.floor(Math.abs(input.length - testText.length) / testText.length * 100));
  useEffect(() => {
    if (!started || time === 0) return;
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [started, time]);
  function handleInput(e) {
    if (!started) setStarted(true);
    setInput(e.target.value);
  }
  function handleRestart() {
    setInput(""); setStarted(false); setTime(30);
  }

  // Animated ring progress (for timer)
  function ProgressRing({ value, max, color }) {
    const radius = 36, circumference = 2 * Math.PI * radius;
    const pct = Math.max(0, Math.min(1, value / max));
    return (
      <svg width="80" height="80">
        <circle r={radius} cx="40" cy="40"
          fill="none" stroke="#ddd7" strokeWidth="9" />
        <circle
          r={radius} cx="40" cy="40"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1s" }}
        />
        <text x="40" y="46" textAnchor="middle"
          style={{ fontWeight: 700, fill: "#333", fontSize:"1.33em" }}>
          {value}
        </text>
      </svg>
    );
  }

  return (
    <div style={{
      marginTop: isMobile() ? 18 : 40,
      background: "linear-gradient(120deg, #f8fafc 55%, #ebedfa 90%)",
      borderRadius: 20,
      boxShadow: "0 12px 40px 0 #6C63FF22",
      padding: isMobile() ? 15 : 35,
      maxWidth: 600,
      marginLeft: "auto",
      marginRight: "auto",
      minHeight: 340,
      position: "relative"
    }}>
      <div style={{
        fontSize: "1.25em", fontWeight: 700, marginBottom: 9,
        color: primaryColor, display: "flex", alignItems: "center", gap: 7
      }}>
        <span role="img" aria-label="keyboard"
          style={{fontSize:"1.5em"}}>⌨️</span>
        Typing Challenge
      </div>
      <div style={{
        color: "#444", fontWeight: 500, fontSize: "1.1em",
        marginBottom: 12, textAlign: "center"
      }}>
        {testText}
      </div>
      <textarea
        value={input}
        onChange={handleInput}
        disabled={time === 0}
        placeholder="Start typing..."
        style={{
          width: "100%", minHeight: 65, borderRadius: 8, border: "1.8px solid #eee",
          padding: "10px 14px", fontSize: "1.18em", letterSpacing: "0.1px",
          outline: "none", fontFamily: "inherit"
        }}
      />
      <div style={{
        display: "flex", alignItems: "center",
        gap: 24, justifyContent: "center", marginTop: 28
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: primaryColor }}>WPM</div>
          <AnimatedStat value={wpm} icon="⚡" color={primaryColor} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: accentColor }}>Accuracy</div>
          <AnimatedStat value={accuracy + "%"} icon="✔️" color={accentColor} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: secondaryColor }}>Time</div>
          <ProgressRing value={time} max={30} color={secondaryColor} />
        </div>
      </div>
      <div style={{
        textAlign: "center", marginTop: 30
      }}>
        <button className="btn btn-large"
          onClick={handleRestart}
          style={{ background: secondaryColor }}>
          Restart
        </button>
      </div>
      <div style={{
        position: "absolute", top: 18, right: 24,
        fontWeight: 500, color: "#aaa", fontSize: "0.95em"
      }}>
        User: <span style={{color:primaryColor,fontWeight:700}}>{user?.name}</span>
      </div>
    </div>
  );
}

// Helper for animated stat
function AnimatedStat({ value, icon, color }) {
  return <div style={{
    color, fontWeight: 700, fontSize: "1.22em",
    background: "#fff7", borderRadius: 9, minWidth: 54, display: "inline-block"
  }}>
    <span role="img" aria-label="stat" style={{ fontSize: "1.15em", marginRight: 3 }}>{icon}</span>
    <span style={{ fontFamily: "monospace" }}>{value}</span>
  </div>;
}
// PUBLIC_INTERFACE
function Leaderboard() {
  // Placeholder data
  const data = [
    { name: "Alex", wpm: 121, accuracy: 98, date: "today" },
    { name: "Sam", wpm: 115, accuracy: 96, date: "today" },
    { name: "Riley", wpm: 112, accuracy: 97, date: "week" },
  ];
  const [tab, setTab] = useState(0); // 0--today, 1--week, 2--alltime
  const tabs = ["Today", "This Week", "All Time"];
  return (
    <div style={{
      background: "rgba(255,255,255,0.09)",
      borderRadius: 15,
      padding: "28px 10px 35px 10px",
      margin: "30px auto 0",
      maxWidth: 540,
      boxShadow: "0 6px 22px #8881"
    }}>
      <div style={{fontSize:"1.3em",fontWeight:700,
        color:primaryColor,marginBottom:18, textAlign:"center"}}>
        <span role="img" aria-label="leaderboard">🏆</span> Leaderboard
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:17,marginBottom:18}}>
        {tabs.map((t,i) =>
          <button key={t} onClick={()=>setTab(i)}
            style={{
              background: tab===i?primaryColor:"transparent",
              color: tab===i ? "#fff" : "#333",
              fontWeight: tab===i? 700 : 500,
              border: "none", borderRadius: 5, padding: "7px 19px",
              fontSize: "1em", cursor:"pointer", boxShadow: tab===i?`0 2px 8px ${primaryColor}33`:""
            }}>{t}</button>
        )}
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"1.08em"}}>
        <thead>
          <tr style={{color:"#888",fontWeight:600}}>
            <td style={{padding:"6px 5px"}}>Rank</td>
            <td>User</td>
            <td>WPM</td>
            <td>Acc %</td>
          </tr>
        </thead>
        <tbody>
        {data.map((r, i) => (
          <tr key={r.name} style={{background: i%2?"#fff8":"#fff5"}}>
            <td style={{padding:"7px 5px",fontWeight:700,color:primaryColor}}>{i+1}</td>
            <td>{r.name}</td>
            <td>
              <span style={{color:primaryColor,fontWeight:700}}>{r.wpm}</span>
            </td>
            <td>
              <span style={{color:accentColor,fontWeight:700}}>{r.accuracy+"%"}</span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

// PUBLIC_INTERFACE
function Profile({ user }) {
  // Placeholder data
  const testResults = [
    { wpm: 110, accuracy: 98, date: "2024-05-26" },
    { wpm: 103, accuracy: 97, date: "2024-05-26" },
    { wpm: 121, accuracy: 99, date: "2024-05-25" },
  ];
  const avgWpm = Math.round(testResults.reduce((a, t) => a + t.wpm, 0) / testResults.length);
  const avgAcc = Math.round(testResults.reduce((a, t) => a + t.accuracy, 0) / testResults.length);
  function clearHistory() {
    // clear logic placeholder
    alert("Test history deleted!");
  }
  return (
    <div style={{
      background:"rgba(255,255,255,0.10)",borderRadius:18,padding:"32px 19px",margin:"26px auto 0",maxWidth:440,boxShadow:"0 10px 32px #8881"
    }}>
      <div style={{fontSize:"1.2em", color:primaryColor, fontWeight:700, marginBottom:10}}>
        <span role="img" aria-label="profile">👤</span> {user?.name} — Profile
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <span style={{color:primaryColor, fontWeight:700, fontSize:"1.2em"}}>{avgWpm}</span> avg WPM
        </div>
        <div>
          <span style={{color:accentColor, fontWeight:700, fontSize:"1.2em"}}>{avgAcc}%</span> avg Accuracy
        </div>
      </div>
      <div style={{marginTop:20, marginBottom:15,fontWeight:600}}>Test History</div>
      <table style={{width:"100%",fontSize:"1.04em",marginBottom:14}}>
        <thead>
          <tr style={{color:"#aaa",fontWeight:600}}>
            <td>Date</td><td>WPM</td><td>Accuracy</td>
          </tr>
        </thead>
        <tbody>
        {testResults.map((r, i) => (
          <tr key={i} style={{background: i%2 ? "#ffe04e11" : "#eee3"}}>
            <td>{r.date}</td>
            <td>
              <span style={{color:primaryColor,fontWeight:700}}>{r.wpm}</span>
            </td>
            <td>
              <span style={{color:accentColor,fontWeight:700}}>{r.accuracy+"%"}</span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className="btn"
          onClick={clearHistory}
          style={{background:secondaryColor,padding:"5px 18px",fontSize:"1em"}}>
          Delete History
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function AdminPanel() {
  // Placeholder dummy texts
  const testTexts = [
    { id: "tt1", text: "The quick brown fox jumps over the lazy dog." },
    { id: "tt2", text: "Pack my box with five dozen liquor jugs." }
  ];
  return (
    <div style={{
      background:"rgba(255,255,255,0.12)",
      borderRadius:20,padding:28,maxWidth:540,margin:"32px auto 0",
      boxShadow: "0 10px 34px #8881"
    }}>
      <div style={{fontSize:"1.3em",fontWeight:700,color:primaryColor,marginBottom:18}}>
        <span role="img" aria-label="admin">🛠</span> Admin Panel
      </div>
      <div style={{marginBottom:13,fontWeight:500}}>Manage Typing Texts</div>
      <table style={{width:"100%",fontSize:"1.03em"}}>
        <thead>
          <tr style={{color:"#999",fontWeight:600}}>
            <td>ID</td><td>Text</td><td>Action</td>
          </tr>
        </thead>
        <tbody>
        {testTexts.map((txt) =>
          <tr key={txt.id} style={{background:"#fff6"}}>
            <td>{txt.id}</td>
            <td>{txt.text}</td>
            <td>
              <button className="btn"
                style={{background:secondaryColor,padding:"3px 11px",fontSize:"0.92em",marginRight:7}}>Edit</button>
              <button className="btn"
                style={{background:"#aaa",padding:"3px 11px",fontSize:"0.92em"}}>Delete</button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      <button className="btn btn-large" style={{background:primaryColor,marginTop:19}}>
        Add New Text
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function Settings({ darkMode, setDarkMode, soundOn, setSoundOn }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.08)",borderRadius:18,
      padding:30,maxWidth:340,margin:"48px auto 0",boxShadow:"0 4px 14px #aaa5"
    }}>
      <div style={{fontSize:"1.24em", fontWeight:700, marginBottom:24,
        color:primaryColor}}>
        <span role="img" aria-label="settings">⚙️</span> Settings
      </div>
      <div style={{display:"flex",alignItems:"center",marginBottom:17,gap:14}}>
        <span>Dark Mode:</span>
        <Toggle checked={darkMode} onChange={()=>setDarkMode(dk=>!dk)} />
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <span>Sound Effects:</span>
        <Toggle checked={soundOn} onChange={()=>setSoundOn(s=>!s)} />
      </div>
    </div>
  );
}
function Toggle({ checked, onChange }) {
  return (
    <label style={{display:"inline-block",position:"relative",width:48,height:28}}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{display:"none"}}
      />
      <span style={{
        position:"absolute",top:0,left:0,width:48,height:28,background:checked?primaryColor:"#ccc",borderRadius:34,transition:"all .3s"
      }} />
      <span style={{
        position:"absolute",top:4,left:checked?24:4,width:20,height:20,background:"#fff",borderRadius:"50%",boxShadow:"0 1px 6px #3332",transition:"all .3s"
      }} />
    </label>
  );
}

// -------------- SUPPORT --------------
function NoAccess() {
  return (
    <div style={{
      background:"rgba(255,37,84,0.12)",borderRadius:10,
      padding:29,textAlign:"center",margin:"56px auto 0",maxWidth:400
    }}>
      <span style={{fontSize:"2.7em"}}>⛔️</span>
      <div>This area is for admins only.</div>
    </div>
  );
}
function NotFound() {
  return (
    <div style={{
      background:"rgba(255,37,84,0.1)",borderRadius:10,
      padding:33,textAlign:"center",margin:"66px auto 0",maxWidth:400
    }}>
      <span style={{fontSize:"2.1em"}}>🤷‍♂️</span>
      <div>Page not found.</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #bbb",
  padding: "10px 14px",
  fontSize: "1.1em",
  marginTop: "22px",
  fontFamily: "inherit",
  outline: "none"
};

// Helper: Mobile check
function isMobile() {
  return window.innerWidth < 700;
}

export default App;
