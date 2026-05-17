
import Link from "next/link";

const Header = () => {

  return (
    <header className="app-header">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="brand-mark">
          <span className="brand-badge">JR</span>
          <span className="grid gap-0.5">
            <span className="brand-title">Job Request</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap gap-2">
          <Link href="/" className="nav-link nav-link-active">
            Home
          </Link>
          <Link href="/account" className="nav-link">
            Account
          </Link>
          <Link href="/new" className="nav-link">
            Post job
          </Link>
          <Link href="/login" className="nav-link">
            Login
          </Link>
          <Link href="/register" className="nav-link">
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
