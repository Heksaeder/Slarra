'use client'
import React, { useState } from 'react';
import { useTopicsByGame } from '@/app/services/topics';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const TopicList = ({ gameId, userName }: { gameId: string, userName:string }) => {
  const { data: topics, isLoading, isError } = useTopicsByGame(gameId);
  const [isListVisible, setIsListVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 5;

  const toggleListVisibility = () => {
    setTimeout(() => {
      setIsListVisible(!isListVisible);
    }, 100);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching topics</div>;

  // Calculate total pages
  const totalPages = Math.ceil(topics.length / topicsPerPage);

  // Get topics for current page
  const currentTopics = topics.slice((currentPage - 1) * topicsPerPage, currentPage * topicsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <h2 className="sticky z-10">
        <button onClick={toggleListVisibility} className="text-xl mr-4">
          {isListVisible ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        Topics
      </h2>
      <div
        className={`${isListVisible ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'
          } transition-all duration-500 ease-in-out overflow-hidden`}
      >
        <div className='flex flex-col justify-start items-start h-full lg:w-full'>
          {currentTopics.map((topic: any) => (
            <div className='border-[#181818] border-b-2 w-full active:bg-neutral-800 p-4 flex flex-col justify-center items-center' key={topic._id}>
              <Link href={`/games/${gameId}/topics/${topic._id}`} key={topic._id} className='md:w-full'>
                <h3 className='p-4 font-bold active:text-xl bg-[#080808] w-[90dvw] md:w-full mx-4 my-2 md:m-0 rounded-full'>{topic.title}</h3>
              </Link>
              <p className='text-xs text-center'>lancé par {userName}</p>
              <p className='lg:w-1/2' dangerouslySetInnerHTML={{__html:topic.body.length > 180 ? `“ ${topic.body.substring(0, 180)}... ”` : `“ ${topic.body} ”`}}></p>
            </div>
          ))}
        </div>
        <div className="fixed z-20 bottom-0 w-full flex justify-between items-center p-4"> {/* Adjusted to be fixed */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className=" text-white rounded disabled:opacity-0"
          >
            <IoIosArrowBack/>
          </button>{/*<span className="text-white">
            Page {currentPage} of {totalPages}
        </span>*/}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className=" text-white rounded disabled:opacity-0"
          >
            <IoIosArrowForward/>
          </button>
        </div>
      </div>
    </>
  );
};

export default TopicList;
