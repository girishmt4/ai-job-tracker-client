import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const TabsContext = React.createContext<TabsContextValue>({ activeTab: '', setActiveTab: () => {} });

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('inline-flex h-10 items-center rounded-md bg-muted p-1 text-muted-foreground', className)}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { activeTab } = React.useContext(TabsContext);
  if (activeTab !== value) return null;
  return (
    <div className={cn('mt-2', className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
