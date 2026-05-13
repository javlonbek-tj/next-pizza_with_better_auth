'use client';

import { useState } from 'react';
import ReactStories from 'react-insta-stories';
import Image from 'next/image';
import { X } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { IStory } from '@/types';

interface Props {
  stories: IStory[];
}

const getStoryInterval = (itemCount: number) =>
  Math.min(6000, Math.max(2000, Math.round(18000 / itemCount)));

export const StoriesClient: React.FC<Props> = ({ stories }) => {
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<IStory>();

  const onClickStory = (story: IStory) => {
    setSelectedStory(story);

    if (story.items.length > 0) {
      setOpen(true);
    }
  };

  return (
    <>
      <Carousel className='w-full' opts={{ align: 'start', dragFree: true }}>
        <CarouselContent className='-ml-2'>
          {stories.map((story) => (
            <CarouselItem key={story.id} className='pl-2 basis-1/3 sm:basis-1/4 lg:basis-1/6'>
              <div
                className='relative w-full h-56 overflow-hidden rounded-md cursor-pointer'
                onClick={() => onClickStory(story)}
              >
                <Image
                  fill
                  className='object-cover'
                  src={story.previewImageUrl}
                  alt='previewStory'
                  sizes='(max-width: 768px) 33vw, 17vw'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {open && (
        <div className='fixed inset-0 flex items-center justify-center z-80 bg-black/80'>
          <div
            className='relative w-full max-w-[520px] mx-4'
            style={{ height: 'min(800px, 90dvh)' }}
          >
            <button
              className='absolute z-30 cursor-pointer -right-2 md:-right-10 -top-8'
              onClick={() => setOpen(false)}
            >
              <X className='w-8 h-8 text-white/50' />
            </button>

            <ReactStories
              onAllStoriesEnd={() => setOpen(false)}
              stories={
                selectedStory?.items.map((item) => ({
                  url: item.sourceUrl,
                  type: 'image',
                  styles: {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    maxWidth: 'none',
                    maxHeight: 'none',
                  },
                })) || []
              }
              defaultInterval={getStoryInterval(selectedStory?.items.length ?? 1)}
              width='100%'
              height='100%'
            />
          </div>
        </div>
      )}
    </>
  );
};
