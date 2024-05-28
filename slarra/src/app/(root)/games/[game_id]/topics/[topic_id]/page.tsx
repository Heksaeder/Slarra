'use client'
import React, { useEffect, useState } from 'react'
import { useTopicById } from '@/app/services/topics'
import { useMessagesByTopic } from '@/app/services/messages'
import TopicDetails from './components/TopicDetails'
import './styles.css'

const Topic = () => {
  const [topicId, setTopicId] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const topicId = window.location.pathname.split('/')[4];
      setTopicId(topicId)
    }
  }, [])

  const {data: messages, isLoading: messagesLoading, isError: messagesError} = useMessagesByTopic(topicId);
  console.log('messages:', messages)

  if (messagesLoading) return <div> </div>; // Show loading state
  if (messagesError) return <div> </div>; // Show error state

  return (
    <div>
      <TopicDetails/>
    </div>
  )
}

export default Topic
