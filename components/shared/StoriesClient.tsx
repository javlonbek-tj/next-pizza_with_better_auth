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
            <CarouselItem key={story.id} className='pl-2 basis-1/6'>
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
        <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full z-80 bg-black/80'>
          <div className='relative' style={{ width: 520 }}>
            <button
              className='absolute z-30 cursor-pointer -right-10 -top-5'
              onClick={() => setOpen(false)}
            >
              <X className='absolute top-0 right-0 w-8 h-8 text-white/50' />
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
              defaultInterval={3000}
              width={520}
              height={800}
            />
          </div>
        </div>
      )}
    </>
  );
};
