import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user, password: pass }) });
    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || "Error");
      return;
    }
    router.push("/admin/cotizaciones");
  }

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <form className="w-full max-w-sm p-6 border rounded" onSubmit={submit}>
          <h2 className="text-lg font-bold mb-4">Admin Login</h2>
          {err && <div className="text-red-600 mb-2">{err}</div>}
          <label className="block mb-2" htmlFor="admin-user">Usuario</label>
          <input id="admin-user" aria-label="Usuario" placeholder="Usuario" className="w-full mb-3 p-2 border bg-white text-black" value={user} onChange={(e)=>setUser(e.target.value)} />
          <label className="block mb-2" htmlFor="admin-pass">Contraseña</label>
          <input id="admin-pass" type="password" aria-label="Contraseña" placeholder="Contraseña" className="w-full mb-4 p-2 border bg-white text-black" value={pass} onChange={(e)=>setPass(e.target.value)} />
          <button className="bg-emerald-600 text-white px-4 py-2 rounded">Entrar</button>
        </form>
      </div>
    </>
  );
}
