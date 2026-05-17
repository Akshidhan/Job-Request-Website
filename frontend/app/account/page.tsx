"use client";

import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import { closeJobRequest, deleteJobRequest, getCurrentUser, getUserJobRequests, logoutUser, type AuthUser, type JobRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [message, setMessage] = useState("Loading account...");
  const [closingJobId, setClosingJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => {
        setCurrentUser(user);
        setName(user.name);
        setEmail(user.email);
        return getUserJobRequests();
      })
      .then((items) => {
        setJobs(items);
        setMessage("");
      })
      .catch((error) => {
        if (error instanceof Error && error.message === "Unauthorized") {
          router.replace("/login");
          return;
        }

        setMessage(error instanceof Error ? error.message : "Failed to load account.");
      });
  }, [router]);

  const handleCloseJob = async (jobId: string) => {
    setClosingJobId(jobId);
    setMessage("");

    try {
      await closeJobRequest(jobId);
      const updatedJobs = await getUserJobRequests();
      setJobs(updatedJobs);
      setMessage("Job closed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to close job.");
    } finally {
      setClosingJobId(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    setDeletingJobId(jobId);
    setMessage("");

    try {
      await deleteJobRequest(jobId);
      const updatedJobs = await getUserJobRequests();
      setJobs(updatedJobs);
      setMessage("Job deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete job.");
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Clear UI state and redirect even if the server cookie is already gone.
    } finally {
      router.replace("/login");
    }
  };

  const ownsJob = (job: JobRequest) => {
    if (!currentUser) {
      return false;
    }

    if (!job.user) {
      return false;
    }

    if (typeof job.user === "string") {
      return job.user === currentUser.id;
    }

    return job.user.id === currentUser.id || job.user._id === currentUser.id;
  };

  const postedJobs = jobs.filter((job) => ownsJob(job));
  const acceptedJobs = jobs.filter((job) => !ownsJob(job));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title">Account</h1>
        <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Panel className="p-6 sm:p-8">
        <div className="grid gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] app-text-muted">Name</div>
            <div className="mt-2 text-lg font-semibold app-text-ink">{name || "-"}</div>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.24em] app-text-muted">Email</div>
            <div className="mt-2 text-lg font-semibold app-text-ink">{email || "-"}</div>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.24em] app-text-muted">Jobs posted</div>
            <div className="mt-3 grid gap-3">
              {postedJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col gap-3 rounded-2xl border app-border-line bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm font-medium app-text-ink">
                    <div>{job.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] app-text-muted">
                      {job.status || "Open"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button href={`/job/${job._id}`} variant="secondary" size="sm">
                      View
                    </Button>
                    {job.status !== "Closed" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={closingJobId === job._id}
                        onClick={() => handleCloseJob(job._id)}
                      >
                        {closingJobId === job._id ? "Closing..." : "Close"}
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={deletingJobId === job._id}
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      {deletingJobId === job._id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
              {!postedJobs.length && !message ? <div className="text-sm app-text-muted">No jobs posted yet.</div> : null}
            </div>
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.24em] app-text-muted">Accepted jobs</div>
            <div className="mt-3 grid gap-3">
              {acceptedJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col gap-3 rounded-2xl border app-border-line bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm font-medium app-text-ink">
                    <div>{job.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] app-text-muted">
                      {job.status || "Open"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button href={`/job/${job._id}`} variant="secondary" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {!acceptedJobs.length && !message ? <div className="text-sm app-text-muted">No accepted jobs yet.</div> : null}
            </div>
          </div>

          {message ? <p className="text-sm app-text-accent">{message}</p> : null}
        </div>
      </Panel>
    </div>
  );
}
