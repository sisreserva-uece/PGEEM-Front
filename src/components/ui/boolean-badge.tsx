import { Badge } from '@/components/ui/badge';

type BooleanBadgeProps = {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
};

export function BooleanBadge({ value, trueLabel = 'Sim', falseLabel = 'Não' }: BooleanBadgeProps) {
  return value
    ? <Badge variant="outline" className="text-green-600 border-green-400 text-[10px] px-1 py-0">{trueLabel}</Badge>
    : <Badge variant="outline" className="text-muted-foreground text-[10px] px-1 py-0">{falseLabel}</Badge>;
}
