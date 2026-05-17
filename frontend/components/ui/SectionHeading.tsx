type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  className?: string;
};

export default function SectionHeading({ eyebrow, title, copy, className = "" }: SectionHeadingProps) {
  return (
    <div className={`grid gap-2 ${className}`.trim()}>
      {eyebrow ? <span className="page-kicker">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}