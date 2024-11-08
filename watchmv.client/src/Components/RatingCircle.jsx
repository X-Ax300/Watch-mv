import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../ComponentsCSS/RatingCircle.css';

function RatingCircle({ rating }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const percent = rating * 100; // Transform rating to a percentage

        // Create new chart
        chartRef.current = new Chart(context, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percent, 100 - percent],
                    backgroundColor: [
                        '#21d07a', // Green for rating
                        '#e0e0e0'  // Grey for remaining
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%', // Adjusts the thickness of the doughnut
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });

        // Cleanup function
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [rating]);

    return (
        <div className="rating-circle">
            <canvas ref={canvasRef} width="68" height="68"></canvas>
            <div className="percent">
                <span className="rating-number">{Math.round(rating * 100)}%</span>
            </div>
        </div>
    );
}

export default RatingCircle;
