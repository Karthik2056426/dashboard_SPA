
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const LiveScoreboard = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Calculate house scores from all event winners
  const houseMap: Record<string, { name: string; color: string; score: number; bgGradient: string }> = {
    Delany: { name: 'Delany', color: 'red', score: 0, bgGradient: 'from-red-500 to-red-600' },
    Gandhi: { name: 'Gandhi', color: 'blue', score: 0, bgGradient: 'from-blue-500 to-blue-600' },
    Tagore: { name: 'Tagore', color: 'green', score: 0, bgGradient: 'from-green-500 to-green-600' },
    Aloysius: { name: 'Aloysius', color: 'yellow', score: 0, bgGradient: 'from-yellow-500 to-yellow-600' },
  };
  events.forEach((event: any) => {
    event.winners?.forEach((winner: any) => {
      if (houseMap[winner.house]) {
        houseMap[winner.house].score += winner.points;
      }
    });
  });
  const houses = Object.values(houseMap);
  const maxScore = Math.max(...houses.map(h => h.score), 1);
  const sortedHouses = [...houses].sort((a, b) => b.score - a.score);

  // Dense ranking logic
  function getDenseRanks(sortedHouses: { score: number }[]) {
    let ranks = [];
    let lastScore = null;
    let rank = 1;
    for (let i = 0; i < sortedHouses.length; i++) {
      if (sortedHouses[i].score !== lastScore) {
        rank = ranks.length + 1;
      }
      ranks.push(rank);
      lastScore = sortedHouses[i].score;
    }
    return ranks;
  }
  const ranks = getDenseRanks(sortedHouses);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-orange-500" />;
      default: return <Award className="h-6 w-6 text-gray-300" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'border-yellow-400 shadow-yellow-100';
      case 1: return 'border-gray-300 shadow-gray-100';
      case 2: return 'border-orange-300 shadow-orange-100';
      default: return 'border-gray-200';
    }
  };

  return (
    <Card className="bg-white shadow-2xl border-0">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8" />
          <span>Live House Standings</span>
        </CardTitle>
        <CardDescription className="text-blue-100">
          Updated in real-time • Last updated: {new Date().toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedHouses.map((house, index) => {
            let houseClasses = '';
            switch (house.name) {
              case 'Tagore':
                houseClasses = 'bg-blue-100 text-blue-800 border-blue-200';
                break;
              case 'Aloysius':
                houseClasses = 'bg-red-100 text-red-800 border-red-200';
                break;
              case 'Gandhi':
                houseClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                break;
              case 'Delany':
                houseClasses = 'bg-green-100 text-green-800 border-green-200';
                break;
              default:
                houseClasses = 'bg-white text-gray-800 border-gray-200';
            }
            return (
            <div 
              key={house.name}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${getRankColor(index)} ${houseClasses}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getRankIcon(index)}
                  <div>
                      <h3 className="text-xl font-bold">{house.name}</h3>
                      <p className="text-sm">#{ranks[index]} Position</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{house.score}</div>
                    <div className="text-sm">points</div>
                  </div>
                </div>
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  LEADING
                </div>
              )}
            </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveScoreboard;
