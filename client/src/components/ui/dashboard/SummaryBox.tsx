import { useState, useEffect } from 'react';
import { IconType } from 'react-icons';

interface BoxProps {
  title: string;
  count: number | undefined;
  icon1: IconType;
}

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'm';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

const SummaryBoxUI = ({ title, count, icon1: Icon1 }: BoxProps) => {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    if (count === undefined) return;

    const duration = 50;
    const frameRate = 250;
    const totalFrames = (duration / 1000) * frameRate;
    const increment = (count - animatedCount) / totalFrames;

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      setAnimatedCount((prev) => prev + increment);

      if (frame === totalFrames) {
        clearInterval(counter);
        setAnimatedCount(count);
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [count, animatedCount]);

  return (
    <div className='w-full rounded-md border border-slate-200 bg-white p-3 shadow-md xxl:h-[9.5rem]'>
      <div className='flex justify-between'>
        <div className='text-md rounded-md border border-slate-300 p-2'>
          <Icon1 />
        </div>
      </div>

      <div className='mt-6 xxl:mt-10'>
        <p className='text-xs text-slate-500'>{title}</p>
        <p className='mt-1 text-xl font-semibold text-slate-700'>
          {formatCount(Math.round(animatedCount))}
        </p>
      </div>
    </div>
  );
};

export default SummaryBoxUI;
