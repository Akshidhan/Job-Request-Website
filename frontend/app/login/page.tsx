"use client";

import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Panel from "@/components/ui/Panel";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      await loginUser(String(formData.get("email") || ""), String(formData.get("password") || ""));
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <h1 className="page-title">Login</h1>

      <Panel className="p-6 sm:p-8">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Field label="Email">
            <input className="input" type="email" name="email" />
          </Field>

          <Field label="Password">
            <input className="input" type="password" name="password" />
          </Field>

          <Button type="submit" variant="primary">
            {loading ? "Logging in..." : "Login"}
          </Button>
          {error ? <p className="text-sm app-text-accent">{error}</p> : null}
        </form>
      </Panel>
    </div>
  );
}