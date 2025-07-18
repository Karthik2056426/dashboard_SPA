import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { useEventContext } from './EventContext';

interface CarouselViewProps {
  onBack: () => void;
}

const CarouselView = ({ onBack }: CarouselViewProps) => {
  const { events } = useEventContext();
  // Calculate house scores from all event winners
  const houseMap: Record<string, { name: string; color: string; score: number; bgGradient: string }> = {
    Delany: { name: 'Delany', color: 'red', score: 0, bgGradient: 'from-red-500 to-red-600' },
    Gandhi: { name: 'Gandhi', color: 'blue', score: 0, bgGradient: 'from-blue-500 to-blue-600' },
    Tagore: { name: 'Tagore', color: 'green', score: 0, bgGradient: 'from-green-500 to-green-600' },
    Aloysius: { name: 'Aloysius', color: 'yellow', score: 0, bgGradient: 'from-yellow-500 to-yellow-600' },
  };
  events.forEach(event => {
    event.winners.forEach(winner => {
      if (houseMap[winner.house]) {
        houseMap[winner.house].score += winner.points;
      }
    });
  });
  const houses = Object.values(houseMap);
  const sortedHouses = [...houses].sort((a, b) => b.score - a.score);

  // Dense ranking logic (no skips)
  function getDenseRanks(sortedHouses: { score: number }[]) {
    let ranks: number[] = [];
    let lastScore: number | null = null;
    let rank = 0;
  
    for (let i = 0; i < sortedHouses.length; i++) {
      if (sortedHouses[i].score !== lastScore) {
        rank++; // Increment rank only when score changes
      }
      ranks.push(rank);
      lastScore = sortedHouses[i].score;
    }
  
    return ranks;
  }
  
  const ranks = getDenseRanks(sortedHouses);
  // Use events from context for the event carousel
  const [api, setApi] = useState<CarouselApi>();

  // Auto-rotation effect
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  const getHouseColor = (house: string) => {
    const colors = {
      'Delany': 'bg-green-100 text-green-800 border-green-200',
      'Gandhi': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Tagore': 'bg-blue-100 text-blue-800 border-blue-200',
      'Aloysius': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[house as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Trophy className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-orange-500" />;
      default: return <Award className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onBack}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Cynosure 2025-'26</h1>
                <p className="text-white/80">Cultural Event Results Showcase</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Side by Side Layout */}
      <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-2 h-[calc(100vh-60px)] flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-4 items-start min-h-0 overflow-hidden">
          {/* Live House Standings */}
          <div className="w-full lg:w-1/5 flex-shrink-0 h-full min-h-0">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full flex flex-col">
              <CardContent className="p-2 lg:p-2 flex-1 flex flex-col min-h-0">
                <h2 className="text-xl font-bold text-white mb-2 text-center">Live House Standings</h2>
                <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-auto scrollbar-hide">
                  {sortedHouses.map((house, index) => {
                    let houseClasses = '';
                    switch (house.name) {
                      case 'Tagore':
                        houseClasses = 'bg-[#38b6ff] text-white border-blue-200';
                        break;
                      case 'Aloysius':
                        houseClasses = 'bg-[#ed6258] text-white border-red-200';
                        break;
                      case 'Gandhi':
                        houseClasses = 'bg-[#f7d136] text-white border-yellow-200';
                        break;
                      case 'Delany':
                        houseClasses = 'bg-[#00bf63] text-white border-green-200';
                        break;
                      default:
                        houseClasses = 'bg-white text-gray-800 border-gray-200';
                    }
                    return (
                      <div 
                        key={house.name}
                        className={`backdrop-blur-sm rounded-lg p-2 text-center border ${houseClasses}`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {getRankIcon(index)}
                          <span className="font-semibold ml-2">#{ranks[index]}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{house.name}</h3>
                        <div className="text-3xl font-bold">{house.score}</div>
                        <p className="text-sm">points</p>
                      </div>
                    );
                  })}
                </div>
          
              </CardContent>
            </Card>
          </div>

          {/* Event Results Carousel */}
          <div className="w-full lg:w-4/5 flex-shrink-0 h-full min-h-0">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full flex flex-col">
              <CardContent className="p-1 flex-1 flex flex-col min-h-0">
                <h2 className="text-xl font-bold text-white mb-4 text-center">Event Results</h2>
                <Carousel className="w-full h-full" setApi={setApi} opts={{ loop: true }}>
                  <CarouselContent>
                    {events.map((event) => (
                      <CarouselItem key={event.id}>
                        <div className="p-1 lg:p-2 h-full flex flex-col">
                          <Card className="bg-white/20 backdrop-blur-sm border-white/30 h-full flex flex-col">
                            <CardContent className="p-1 lg:p-4 flex-1 flex flex-col min-h-0">
                              <div className="text-center mb-2 lg:mb-4">
                                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{event.name}</h3>
                                <p className="text-white/80 text-base lg:text-lg">
                                  {new Date(event.date).toLocaleDateString()} • {event.category} • {event.gradeLevel}
                                </p>
                              </div>
                              <div className="flex flex-row gap-4 justify-center items-stretch flex-1 min-h-0 overflow-auto">
                                {event.winners.map((winner) => (
                                  <div 
                                    key={winner.position}
                                    className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 flex flex-col flex-1 basis-0 min-w-0"
                                  >
                                    <div className="flex flex-col items-center justify-center mb-2 lg:mb-3">
                                      <div className="flex items-center justify-center">
                                        {getPositionIcon(winner.position)}
                                        <span className="text-white font-bold ml-2 text-lg lg:text-xl">
                                          {winner.position === 1 ? '1st' : winner.position === 2 ? '2nd' : '3rd'} Place
                                        </span>
                                      </div>
                                      <span className={`px-4 py-2 rounded-full text-base lg:text-lg font-medium mt-2 mb-[20px] ${getHouseColor(winner.house)}`}>
                                        {winner.house}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                      <img 
                                        src={winner.photo || '/placeholder.svg'} 
                                        alt={winner.name}
                                        className="w-full max-w-xs h-32 lg:h-44 object-cover rounded-lg mx-auto mb-[20px] border-4 border-white/30 shadow-2xl"
                                        style={{ marginTop: 0 }}
                                        onError={(e) => {
                                          // Fallback to placeholder if image fails to load
                                          const target = e.target as HTMLImageElement;
                                          if (target.src !== '/placeholder.svg') {
                                            target.src = '/placeholder.svg';
                                          }
                                        }}
                                      />
                                      <h4 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">{winner.name}</h4>
                                      <div className="text-2xl lg:text-3xl font-bold text-white">{winner.points} pts</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselView;
