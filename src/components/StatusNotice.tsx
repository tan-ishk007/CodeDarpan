import { AlertTriangle, Info, RefreshCw, XCircle } from 'lucide-react';

interface StatusNoticeProps {
  title: string;
  message: string;
  kind?: 'error' | 'warning' | 'info';
  stage?: string;
  code?: string;
  status?: number;
  retryable?: boolean;
  onRetry?: () => void;
}

export default function StatusNotice({ title, message, kind = 'info', stage, code, status, retryable, onRetry }: StatusNoticeProps) {
  const Icon = kind === 'error' ? XCircle : kind === 'warning' ? AlertTriangle : Info;
  return (
    <section className={`status-notice status-notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon size={17} aria-hidden="true" />
      <div className="status-notice-copy">
        <strong>{title}</strong>
        <p>{message}</p>
        {(stage || code || status) && <span className="status-stage">{stage ? `Stage: ${stage}` : ''}{stage && (code || status) ? ' · ' : ''}{code ?? ''}{code && status ? ' · ' : ''}{status ? `HTTP ${status}` : ''}</span>}
      </div>
      {retryable && onRetry && (
        <button type="button" className="text-button" onClick={onRetry}>
          <RefreshCw size={14} aria-hidden="true" /> Try again
        </button>
      )}
    </section>
  );
}
