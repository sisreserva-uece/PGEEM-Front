import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

function FormTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
  // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      className={cn(
        'text-xl font-bold text-gray-800',
        className,
      )}
      {...props}
    />
  );
}

function FormSubtitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-green-600 font-medium',
        className,
      )}
      {...props}
    />
  );
}

type FormHeaderProps = {
  title: string;
  subtitle: string;
  className?: string;
};

function FormHeader({ title, subtitle, className }: FormHeaderProps) {
  return (
    <div className={cn('text-center mb-6', className)}>
      <FormTitle>{title}</FormTitle>
      <FormSubtitle>{subtitle}</FormSubtitle>
    </div>
  );
}

export { FormHeader, FormSubtitle, FormTitle };
