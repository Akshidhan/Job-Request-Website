
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center justify-center">
        <span>Job Request &copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer;
