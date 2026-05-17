"use client";

import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import {
  acceptJobRequest,
  closeJobRequest,
  getCurrentUser,
  getJobRequestById,
  type JobRequest,
} from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobRequest | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const id = params?.id;

    if (!id) {
      setMessage("Job not found.");
      setLoading(false);
      return;
    }

    Promise.all([getJobRequestById(id), getCurrentUser().catch(() => null)])
      .then(([jobResponse, currentUserResponse]) => {
        setJob(jobResponse);
        setCurrentUserId(currentUserResponse?.user?.id ?? null);
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Failed to load job.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleAccept = async () => {
    if (!job) {
      return;
    }

    setActionLoading(true);
    setMessage("");

    try {
      const updatedJob = await acceptJobRequest(job._id);
      setJob(updatedJob);
      router.refresh();
      setMessage("Job accepted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to accept job.");
    } finally {
      setActionLoading(false);
    }
  };

  const ownerId =
    typeof job?.user === "string"
      ? job.user
      : job?.user
        ? job.user.id || job.user._id || null
        : null;

  const isOwner = Boolean(currentUserId && ownerId && currentUserId === ownerId);
  const canAccept = Boolean(currentUserId && job && !isOwner && job.status !== "Closed" && !job.acceptedUser);

  if (loading) {
    return (
      <Panel className="p-6 sm:p-8">
        <p className="text-sm app-text-muted">Loading job...</p>
      </Panel>
    );
  }

  if (!job) {
    return (
      <Panel className="p-6 sm:p-8">
        <p className="text-sm app-text-accent">{message || "Job not found."}</p>
      </Panel>
    );
  }

  return (
    <Panel className="p-6 sm:p-8">
      <div className="grid gap-5">
        <div>
          <h1 className="page-title">Job details</h1>
          <p className="mt-3 text-sm leading-6 app-text-muted">Details for the selected job posting.</p>
        </div>

        <div className="grid gap-4 text-sm">
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Title</span>
            <span className="font-semibold app-text-ink">{job.title}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Description</span>
            <span className="font-semibold app-text-ink">{job.description}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Category</span>
            <span className="font-semibold app-text-ink">{job.category || "-"}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Location</span>
            <span className="font-semibold app-text-ink">{job.location || "-"}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Contact name</span>
            <span className="font-semibold app-text-ink">{job.contactName || "-"}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Contact email</span>
            <span className="font-semibold app-text-ink">{job.contactEmail || "-"}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Status</span>
            <span className="font-semibold app-text-ink">{job.status || "Open"}</span>
          </div>
          <div className="grid gap-1 border-t app-border-line pt-4">
            <span className="app-text-muted">Accepted by</span>
            <span className="font-semibold app-text-ink">
              {typeof job.acceptedUser === "object" && job.acceptedUser
                ? job.acceptedUser.name || job.acceptedUser.email || job.acceptedUser._id || "-"
                : job.acceptedUser || "-"}
            </span>
          </div>
        </div>

        {!currentUserId ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <p className="text-sm app-text-muted">Login to accept this job.</p>
            <Button href="/login" variant="primary" size="sm">
              Login
            </Button>
          </div>
        ) : canAccept ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" type="button" disabled={actionLoading} onClick={handleAccept}>
              {actionLoading ? "Accepting..." : "Accept job"}
            </Button>
          </div>
        ) : isOwner ? (
          <p className="text-sm app-text-muted">You posted this job, so you cannot accept it.</p>
        ) : null}

        {message ? <p className="text-sm app-text-accent">{message}</p> : null}
      </div>
    </Panel>
  );
}