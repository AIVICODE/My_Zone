import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const StatsCharts = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: 'Cobertura', value: stats.coverage, fill: '#4CAF50' },
    { name: 'Tráfico', value: stats.traffic, fill: '#2196F3' },
    { name: 'Comodidades', value: stats.comfort, fill: '#FF9800' },
  ];

  return (
    <div className="flex flex-wrap gap-8 justify-center w-full">
      {data.map((item, index) => (
        <div key={index} className="w-60 h-60 bg-white shadow-md rounded-lg flex flex-col items-center justify-center p-4">
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <ResponsiveContainer width="100%" height="80%">
            <RadialBarChart
              innerRadius="60%"
              outerRadius="90%"
              data={[item]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                tick={false} // Oculta los ticks
              />
              <RadialBar
                dataKey="value"
                fill={item.fill}
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-xl font-bold mt-4">{item.value}%</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCharts;
