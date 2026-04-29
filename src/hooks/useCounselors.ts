import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface Counselor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  isOnline?: boolean;
}

export const useCounselors = (initialCounselors: Counselor[] = []) => {
  const [counselors, setCounselors] = useState<Counselor[]>(initialCounselors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'counselors'), orderBy('rating', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const counselorData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Counselor[];
          setCounselors(counselorData);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching counselors:", error);
        // Fallback to initial static data if firebase is not configured
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
       console.error("Firebase not initialized or configured", error);
       setLoading(false);
    }
  }, []);

  return { counselors, loading };
};
