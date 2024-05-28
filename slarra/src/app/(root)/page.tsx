'use client'
import React, { useEffect, useState } from 'react'
import { getUserRole } from '../services/auth';
import './styles.css'
import { SiExpress, SiFigma, SiMongodb, SiMongoose, SiNextdotjs, SiNodedotjs, SiReact, SiTailwindcss, SiTypescript } from 'react-icons/si';

const Home = () => {
  const [userRole, setUserRole] = useState<string | null>(null);


  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);


  if (userRole === null) {
    // Render a loading state initially
    return <div>Loading...</div>;
  }


  const handleScroll = () => {
    const nextSection = document.querySelector('.next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <>
      <div className='w-screen h-screen flex flex-col justify-center items-center'>
        <h1>Home</h1>
        <div className='flex flex-row gap-x-2'>{userRole == 'admin' && (
          <a className='create-btn bg-blue-800 hover:bg-blue-950 active:bg-blue-950 my-2 transition-colors duration-300' href="/admin">Admin</a>
        )}
          <a className='create-btn bg-green-800 hover:bg-green-950 active:bg-green-950 my-2 transition-colors duration-300' href="/profile">Profile</a>
          <a className='create-btn bg-yellow-800 hover:bg-yellow-950 active:bg-yellow-950 my-2 transition-colors duration-300' href="/games">Games</a></div>
        <div className='flex flex-col m-6 justify-center items-center'>
          <img className='m-auto mb-10' src="https://i.ibb.co/YyDQCkX/ce-forum-jdr-slarra-bg-slarra-img1.png" alt="slarra icon" width={100} />
          <h2 className='w-full'>Slarra, qu'est-ce que c'est ?</h2>
          <p className='md:w-[90dvw] lg:w-[70dvw] xl:w-[40dvw]'>
            <ul>
              <li className='list-item hover:bg-yellow-700'>Une réponse lightweight à un géant des fora</li>
              <li className='list-item hover:bg-green-700'>Un forum orienté JDR écrit pour les amateurs</li>
              <li className='list-item hover:bg-purple-700'>Une plateforme moins contraignante qu'un MMORPG</li>
              <li className='list-item hover:bg-blue-700'>Un projet personnel pour se former en fullstack</li>
            </ul>
          </p>
        </div>
      </div>

      <div className='w-screen h-screen flex flex-col justify-center items-center next-section'>
        <h2 className='w-full md:w-[90dvw] lg:w-[70dvw] xl:w-[40dvw] mt-16'>Used technologies</h2>
        <br />
        <div className='flex flex-row w-screen items-start justify-center'>
          <div className='flex flex-col w-1/4 items-center gap-y-4 p-4'>
            <h2 className='w-full'>Database</h2>
            <div className='flex flex-row gap-x-10'><SiMongodb className='text-8xl text-green-800' /><SiMongoose className='text-8xl text-red-800' /></div>
            <ul className='w-full'>
              <li className='list-item'>Facile à prendre en main</li>
              <li className='list-item'>Pas de schéma fixe</li>
              <li className='list-item'>ODM orienté JavaScript</li>
              <li className='list-item'>Conçu pour lier MongoDB et Node.JS</li>
            </ul>
          </div>
          <div className='flex flex-col w-1/4 items-center gap-y-4 p-4'>
            <h2 className='w-full'>Backend</h2>
            <div className='flex flex-row gap-x-10'><SiNodedotjs className='text-8xl text-green-800' /><SiExpress className='text-8xl text-slate-100' /></div>
            <ul className='w-full'>
              <li className='list-item'>Plus robuste pour le backend</li>
              <li className='list-item'>Utilise le même langage que le frontend</li>
              <li className='list-item'>Framework conçu pour Node.JS</li>
              <li className='list-item'>Plus efficace, minimaliste et flexible</li>
            </ul>

          </div>
          <div className='flex flex-col w-1/4 items-center gap-y-4 p-4'>
            <h2 className='w-full'>Frontend</h2>
            <div className='flex flex-row gap-x-10'><SiNextdotjs className='text-8xl text-black' />
            <SiReact className='text-8xl text-blue-400' />
            <SiTailwindcss className='text-8xl text-teal-300' /></div>
            <ul className='w-full'>
              <li className='list-item'>Framework basé sur React & Node.JS</li>
              <li className='list-item'>S'appuie sur TypeScript (sur-ensemble de JS)</li>
              <li className='list-item'>Favorise le responsive et la personnalisation</li>
            </ul>
          </div>
        </div>
      </div>


      <div className='w-screen h-screen flex flex-col justify-center items-center next-section'>
        <h2 className='w-full md:w-[90dvw] lg:w-[70dvw] xl:w-[40dvw] mt-16'>Diagramme de DB</h2>
        <br />
        <div className='flex flex-row gap-x-10'>
          <div className='flex flex-col items-center gap-y-4 p-4'>
            <img src="https://i.imgur.com/2g0l6b0.png" width={1800} alt="mongodb" />
            </div>
          </div>
      </div>

      <div className='w-screen h-screen flex flex-col justify-center items-center next-section'>
        <h2 className='w-full md:w-[90dvw] lg:w-[70dvw] xl:w-[40dvw] mt-16'>Backend</h2>
        <br />
        <div className='flex flex-row gap-x-10 bg-pink-500 w-[60dvw]'>
          <div className='flex flex-col items-center gap-y-4 p-4 w-1/2 justify-start'>
            <h3>Configuration</h3>
            <ul className='w-full'>
              <li className='list-item'>'Server.ts' → Configuration du routeur Express</li>
              <li className='list-item'>Routes → Routes de l'API Slarra</li>
              <li className='list-item'>Controllers → Fonctions de callback</li>
              <li className='list-item'>Services → Logique métier (DB)</li>
              <li className='list-item'>Models → Schéma de données</li>
            </ul>
          </div>
          <div className='flex flex-col items-center gap-y-4 p-4 w-1/2 justify-start'>
            <h3>Modèle</h3>
          </div>
          </div>
      </div>

      <div className='w-screen h-screen flex flex-col justify-center items-center next-section'>
        <h2 className='w-full md:w-[90dvw] lg:w-[70dvw] xl:w-[40dvw] mt-16'>Future ideas</h2>
        <br />
        <ul className='list-disc text-left'>
          <li>Implement a search bar to find games (necessary ?)</li>
          <li>Implement a favorite/pinned system</li>
          <li>Implement private messages</li>
          <li>Implement last posted/updated messages</li>
        </ul>
      </div>
    </>
  )
}

export default Home