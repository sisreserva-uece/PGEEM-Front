'use client';

import Link from 'next/link';
import React from 'react';

type RelatedItemLinkProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string | null;
  asideContent?: React.ReactNode;
};

export function RelatedItemLink({ href, icon, title, description, asideContent }: RelatedItemLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium text-sm text-primary transition-colors group-hover:text-primary/90">
            {title}
          </p>
          <p className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/80">
            {description}
          </p>
        </div>
      </div>
      {asideContent && <div>{asideContent}</div>}
    </Link>
  );
}
