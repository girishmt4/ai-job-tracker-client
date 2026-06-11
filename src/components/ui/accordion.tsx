import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
}
const AccordionContext = React.createContext<AccordionContextValue>({ openItems: [], toggle: () => {} });

interface AccordionProps {
  type?: 'single' | 'multiple';
  children: React.ReactNode;
  className?: string;
}

function Accordion({ type = 'single', children, className }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const toggle = (value: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };
  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn('space-y-1', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <div data-value={value} className={cn('border rounded-md', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, { itemValue: value });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemValue?: string;
}

function AccordionTrigger({ itemValue, className, children, ...props }: AccordionTriggerProps) {
  const { openItems, toggle } = React.useContext(AccordionContext);
  const isOpen = itemValue ? openItems.includes(itemValue) : false;
  return (
    <button
      onClick={() => itemValue && toggle(itemValue)}
      className={cn(
        'flex w-full items-center justify-between p-4 text-sm font-medium hover:bg-accent/50 transition-all',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
      />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  itemValue?: string;
}

function AccordionContent({ itemValue, className, children, ...props }: AccordionContentProps) {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = itemValue ? openItems.includes(itemValue) : false;
  if (!isOpen) return null;
  return (
    <div className={cn('px-4 pb-4 text-sm', className)} {...props}>
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
