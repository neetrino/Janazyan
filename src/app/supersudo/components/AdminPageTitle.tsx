import { ADMIN_PAGE_TITLE } from '../admin-ui-classes';

type AdminPageTitleProps = {
  lead: string;
  accent: string;
  className?: string;
};

/** Dashboard-style admin H1 with Janazyan brand colors. */
export function AdminPageTitle({ lead, accent, className = '' }: AdminPageTitleProps) {
  return (
    <h1 className={`${ADMIN_PAGE_TITLE} ${className}`.trim()}>
      {lead ? <span className="text-coral">{lead}</span> : null}
      {lead && accent ? ' ' : null}
      {accent ? <span className="text-accent">{accent}</span> : null}
    </h1>
  );
}
