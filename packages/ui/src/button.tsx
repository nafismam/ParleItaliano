import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function Button({
  asChild,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={twMerge(
        clsx(
          'inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-electric px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ),
      )}
      {...props}
    />
  );
}
