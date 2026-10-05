// Composant shadcn/ui : bloc gris animé affiché pendant un chargement.
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot='skeleton'
      className={cn('animate-pulse rounded-md bg-accent', className)}
      {...props}
    />
  )
}

export { Skeleton }
