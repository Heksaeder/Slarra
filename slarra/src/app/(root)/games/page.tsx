'use client'
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAddGameMutation, useFetchGamesQuery } from '../../services/games';
import GameBox from './components/GameBox';
import AddGameForm from './components/AddGameForm';
import './styles.css';
import { FaPlusCircle } from 'react-icons/fa';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Games: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transitionDirection, setTransitionDirection] = useState('right');
  const gamesPerPage = 4;

  const { data: games, isLoading, isError } = useFetchGamesQuery();
  const addGameMutation = useAddGameMutation();
  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (isError) return <div>Error loading games</div>; // Show error state
  const handleAddGame = (newGame: { title: string; image: string; description: string }) => {
    addGameMutation.mutate(newGame);
  };

  const totalPages = games ? Math.ceil(games.length / gamesPerPage) : 1;

  const handlePageChange = (newPage: number, direction: 'left' | 'right') => {
    setTransitionDirection(direction);
    setCurrentPage(newPage);
  };

  const handleClickNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1, 'right');
    }
  };

  const handleClickPrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1, 'left');
    }
  };

  const currentGames = games ? games.slice((currentPage - 1) * gamesPerPage, currentPage * gamesPerPage) : [];



  return (
    <div className=''>
      <div className='lg:flex lg:flex-row flex flex-col'>
        <TransitionGroup component={null} >
          {currentGames.map((game: any) => (
            <CSSTransition key={game._id} timeout={500} classNames={
              transitionDirection === 'right'
                  ? { enter: 'fade-enter-right', enterActive: 'fade-enter-right-active', exit: 'fade-exit-left', exitActive: 'fade-exit-left-active' } // going to the right
                  : { enter: 'fade-enter-left', enterActive: 'fade-enter-left-active', exit: 'fade-exit-right', exitActive: 'fade-exit-right-active' } //  going to the left
                  }>
              
                <GameBox game={game} />
              
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <div className="flex w-[98dvw] justify-between absolute top-[50%] left-0 z-10">
        <button
          onClick={handleClickPrev}
          disabled={currentPage === 1}
          className="text-white disabled:opacity-0 text-4xl"
        >
          <IoIosArrowBack />
        </button>
        <button
          onClick={handleClickNext}
          disabled={currentPage === totalPages}
          className="text-white disabled:opacity-0 text-4xl"
        >
          <IoIosArrowForward />
        </button>
      </div>
      <div className='absolute bottom-2 right-4 text-4xl shadow-sm'>
        <button onClick={() => setIsOpenModal(true)}>
          <FaPlusCircle />
        </button>
      </div>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
        overlayClassName={'overlay-modal flex items-center justify-center'}
        contentLabel="Add Game"
        className="p-4 md:modal"
      >
        <AddGameForm onSubmit={handleAddGame} onClose={() => setIsOpenModal(false)} />
      </Modal>
    </div>
  );
}

export default Games;
