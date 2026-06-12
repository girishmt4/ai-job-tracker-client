import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4 border-b pb-5', className)}>
      <div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          {description && <span className="text-sm">{description}</span>}
        </div>
        <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
