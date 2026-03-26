import { getStories } from '@/server';
import { cn } from '@/lib';
import { Container } from './Container';
import { StoriesClient } from './StoriesClient';

interface Props {
  className?: string;
}

export async function Stories({ className }: Props) {
  const stories = await getStories();

  return (
    <Container
      className={cn('my-10', className)}
    >
      <StoriesClient stories={stories} />
    </Container>
  );
}
