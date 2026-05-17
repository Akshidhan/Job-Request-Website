import Link from "next/link";
import Button from "@/components/ui/Button";
import { getJobRequests, searchJobRequests } from "@/lib/api";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() || "";
  let jobs = [] as Awaited<ReturnType<typeof getJobRequests>>;

  try {
    jobs = query ? await searchJobRequests(query) : await getJobRequests();
  } catch {
    jobs = [];
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h1 className="page-title">Job postings</h1>
        <form method="get" action="/" className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search jobs by title, description, category, or location"
            className="min-w-0 flex-1 rounded-2xl border app-border-line bg-white px-4 py-3 text-sm app-text-ink outline-none transition focus:ring-2 focus:ring-black/5"
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
          {query ? (
            <Button href="/" variant="ghost" size="md">
              Clear
            </Button>
          ) : null}
        </form>
        {query ? <p className="text-sm app-text-muted">Showing results for “{query}”.</p> : null}
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="rounded-3xl border app-border-line bg-white/70 p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold app-text-ink">{job.title}</h2>
                <p className="mt-2 text-sm leading-6 app-text-muted">{job.description}</p>
              </div>
              <Link href={`/job/${job._id}`} className="text-sm font-semibold app-text-accent">
                View
              </Link>
            </div>
          </div>
        ))}
        {!jobs.length ? (
          <div className="text-sm app-text-muted">{query ? "No jobs matched your search." : "No jobs available yet."}</div>
        ) : null}
      </div>
    </div>
  );
}