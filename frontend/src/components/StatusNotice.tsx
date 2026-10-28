import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type NoticeKind = 'error' | 'success' | 'info';

export function StatusNotice({ kind = 'info', title, children, onDismiss, action }: { kind?: NoticeKind; title?: string; children: React.ReactNode; onDismiss?: () => void; action?: { label: string; href: string } }) {
  const Icon = kind === 'error' ? AlertCircle : kind === 'success' ? CheckCircle2 : Info;
  return (
    <div className={`status-notice status-notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon aria-hidden="true" size={17} />
      <div className="status-notice__copy">{title && <strong>{title}</strong>}<span>{children}</span>{action && <a className="status-notice__action" href={action.href}>{action.label}</a>}</div>
      {onDismiss && <button type="button" className="icon-button" aria-label="Dismiss notice" onClick={onDismiss}>×</button>}
    </div>
  );
}
