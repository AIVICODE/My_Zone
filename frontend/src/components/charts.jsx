import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const StatsCharts = ({ stats }) => {
  // Verificación robusta para evitar errores al renderizar
  if (!stats || stats.coverage == null || stats.traffic == null || stats.comfort == null) {
    return null;
  }

  const data = [
    { name: 'Coverage', value: stats.coverage, fill: '#4CAF50' },
    { name: 'Traffic', value: stats.traffic, fill: '#2196F3' },
    { name: 'Amenities', value: stats.comfort, fill: '#FF9800' },
  ];
  

  return (
    <div className="flex flex-wrap gap-8 justify-center w-full">
      <h2 className="text-xl font-semibold text-gray-700">Analysis Summary
      </h2>

      <p className="text-gray-500">
      These charts display key information about coverage, potential traffic, and nearby amenities based on the selected location.      </p>
      {data.map((item, index) => (
        <div
          key={index}
          className="w-60 h-60 bg-white shadow-md rounded-lg flex flex-col items-center justify-center p-4"
        >

          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <ResponsiveContainer width="100%" height="80%">
            <RadialBarChart
              innerRadius="60%"
              outerRadius="90%"
              data={[item]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" fill={item.fill} cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-xl font-bold mt-4">{item.value}%</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCharts;
