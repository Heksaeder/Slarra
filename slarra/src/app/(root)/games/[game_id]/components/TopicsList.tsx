// components/CharacterList.tsx
import React from 'react';
import { useTopicsByGame } from '@/app/services/topics';
import Link from 'next/link';

const TopicList = ({ gameId }: { gameId: string }) => {
  const { data: topics, isLoading, isError } = useTopicsByGame(gameId);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching characters</div>;
  
  return (
    <>
  <h2>Topics</h2>
    <div className='flex flex-col justify-start items-start p-2 gap-2'>
        {topics.map((topic: any) => (
            <div className='p-2 bg-neutral-950' key={topic._id}>
              <Link href={`/games/${gameId}/topics/${topic._id}`} key={topic._id}>
                <h3 className='hover:text-green-800 '>{topic.title}</h3>
              </Link>
              <p className='bg-transparent text-sm'>{topic.body}</p>
            </div>
        ))}
    </div>
    </>
  );
};

export default TopicList;
