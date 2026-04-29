import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: any;
  tags?: string[];
}

export const useForum = (initialThreads: ForumThread[] = []) => {
  const [threads, setThreads] = useState<ForumThread[]>(initialThreads);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'threads'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const threadData = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
            } as ForumThread;
          });
          setThreads(threadData);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching threads:", error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase not initialized", error);
      setLoading(false);
    }
  }, []);

  const createThread = async (title: string, content: string, category: string, authorId: string, authorName: string, tags: string[] = []) => {
    const newThread: ForumThread = {
      id: Math.random().toString(36).substring(7),
      title,
      content,
      category,
      authorId,
      authorName,
      tags,
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString()
    };
    try {
      await addDoc(collection(db, 'threads'), {
        title,
        content,
        category,
        authorId,
        authorName,
        tags,
        likes: 0,
        replies: 0,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error creating thread, adding locally:", error);
      setThreads(prev => [newThread, ...prev]);
    }
  };
  
  const likeThread = async (threadId: string) => {
    try {
      const threadRef = doc(db, 'threads', threadId);
      await updateDoc(threadRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Error liking thread", error);
    }
  };

  return { threads, loading, createThread, likeThread };
};
