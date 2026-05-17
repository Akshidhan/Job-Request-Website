"use client";

import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Panel from "@/components/ui/Panel";
import { createJobRequest } from "@/lib/api";
import { useState } from "react";

export default function NewJobPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createJobRequest({
        title: String(formData.get("title") || ""),
        description: String(formData.get("description") || ""),
        category: String(formData.get("category") || ""),
        location: String(formData.get("location") || ""),
        contactName: String(formData.get("contactName") || ""),
        contactEmail: String(formData.get("contactEmail") || ""),
      });

      form.reset();
      setMessage("Job posted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <h1 className="page-title">Post job</h1>

      <Panel className="p-6 sm:p-8">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Field label="Title">
            <input className="input" type="text" name="title" />
          </Field>

          <Field label="Description">
            <textarea className="textarea" name="description" />
          </Field>

          <Field label="Category">
            <input className="input" type="text" name="category" />
          </Field>

          <Field label="Location">
            <input className="input" type="text" name="location" />
          </Field>

          <Field label="Contact name">
            <input className="input" type="text" name="contactName" />
          </Field>

          <Field label="Contact email">
            <input className="input" type="email" name="contactEmail" />
          </Field>

          <Button type="submit" variant="primary">
            {loading ? "Posting..." : "Post job"}
          </Button>

          {message ? <p className="text-sm app-text-accent">{message}</p> : null}
        </form>
      </Panel>
    </div>
  );
}
