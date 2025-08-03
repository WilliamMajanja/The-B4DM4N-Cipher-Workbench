import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FrequencyData } from '../types.ts';

interface FrequencyChartProps {
    data: FrequencyData[];
    title: string;
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({ data, title }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner h-full flex flex-col ring-1 ring-white/10">
            <h3 className="text-lg font-semibold text-green-300 mb-4 text-center">{title}</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="letter" stroke="#A0AEC0" tick={{fontSize: 12}} />
                        <YAxis stroke="#A0AEC0" tick={{fontSize: 12}} tickFormatter={(value) => value.toFixed(3)} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#A0AEC0' }}
                            itemStyle={{ color: '#81E6D9' }}
                            cursor={{ fill: 'rgba(102, 252, 241, 0.1)' }}
                            formatter={(value: number) => [value.toFixed(4), 'Frequency']}
                        />
                        <Bar dataKey="frequency" fill="#68D391" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FrequencyChart;