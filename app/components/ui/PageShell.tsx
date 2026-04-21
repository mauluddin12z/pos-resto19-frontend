import type { ReactNode } from "react";
import Sidebar from "../layout/Sidebar";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, description, actions, children }: Props) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
