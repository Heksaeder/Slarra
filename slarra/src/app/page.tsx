'use client'
import React from 'react'
import { useEffect, useState } from 'react'

const Home = () => {
  const [message, setMessage] = useState('Loading');

  useEffect(() => {
    fetch('http://localhost:8001/characters').then(
      res => res.json()
    ).then(
      data => {
        console.log(data)
        setMessage(data.message)
      }
    )
  }, [])

  return (
    <div>{message}</div>
  )
}

export default Home