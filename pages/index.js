import React, { useState, useEffect } from 'react';

const GanttRouteChart = () => {
    const [zoomLevel, setZoomLevel] = useState(0);
    const [timeLabels, setTimeLabels] = useState([]);
    const [hoverLabel, setHoverLabel] = useState(null);
    const [hoverPos, setHoverPos] = useState(null);

    const sampleData = {
        routes: [
            {
                id: 1,
                name: "Route A",
                vehicle: "Truck 001",
                color: "#E91E63",
                route: [
                    { seq: 1, start_time: "08:00 AM", end_time: "09:30 AM" },
                    { seq: 2, start_time: "10:00 AM", end_time: "11:00 AM" },
                    { seq: 3, start_time: "11:30 AM", end_time: "12:15 PM" },
                    { seq: 4, start_time: "01:00 PM", end_time: "01:45 PM" },
                    { seq: 5, start_time: "02:30 PM", end_time: "04:00 PM" },
                    { seq: 6, start_time: "04:30 PM", end_time: "05:30 PM" },
                ],
            },
            {
                id: 2,
                name: "Route B",
                vehicle: "Truck 002",
                color: "#2196F3",
                route: [
                    { seq: 1, start_time: "08:30 AM", end_time: "09:15 AM" },
                    { seq: 2, start_time: "09:45 AM", end_time: "10:30 AM" },
                    { seq: 3, start_time: "11:00 AM", end_time: "12:00 PM" },
                    { seq: 4, start_time: "12:30 PM", end_time: "01:15 PM" },
                    { seq: 5, start_time: "02:00 PM", end_time: "03:30 PM" },
                    { seq: 6, start_time: "04:00 PM", end_time: "05:00 PM" },
                    { seq: 7, start_time: "05:30 PM", end_time: "06:00 PM" },
                ],
            },
        ]
    };

    const zoomConfigs = [
        { label: "24 Hours", gapMins: 120, width: 1200 },
        { label: "12 Hours", gapMins: 120, width: 2400 },
        { label: "8 Hours", gapMins: 60, width: 3600 },
        { label: "6 Hours", gapMins: 60, width: 4200 },
        { label: "4 Hours", gapMins: 60, width: 4800 },
        { label: "1 Hour", gapMins: 30, width: 5400 },
        { label: "30 Minutes", gapMins: 10, width: 6000 },
        { label: "15 Minutes", gapMins: 10, width: 6600 },
        { label: "5 Minutes", gapMins: 5, width: 7200 }
    ];

    const timelineStartOffset = 2;
    const totalMinutes = 24 * 60;
    const timelineWidth = zoomConfigs[zoomLevel].width;

    const timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
    };

    const formatTimeLabel = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    };

    useEffect(() => {
        const { gapMins } = zoomConfigs[zoomLevel];
        const labels = [];
        for (let min = 0; min <= totalMinutes; min += gapMins) {
            labels.push({
                minutes: min,
                label: formatTimeLabel(min),
                position: (min / totalMinutes) * 100
            });
        }
        setTimeLabels(labels);
    }, [zoomLevel]);

    const calculateBarPosition = (startTime, endTime) => {
        const start = timeToMinutes(startTime);
        const end = timeToMinutes(endTime);
        const left = (start / totalMinutes) * 100;
        const width = ((end - start) / totalMinutes) * 100;
        return {
            left: Math.max(0, left),
            width: Math.max(0.2, width)
        };
    };

    return (
        <div style={{ maxWidth: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '40px 0' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#444', marginRight: '12px', whiteSpace: 'nowrap' }}>
                    Timeline:
                </div>

                <div style={{
                    position: 'relative',
                    height: '30px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        right: '0',
                        height: '4px',
                        background: '#ddd',
                        borderRadius: '2px',
                        zIndex: 1
                    }} />

                    {zoomConfigs.map((cfg, idx) => {
                        const isSelected = idx === zoomLevel;
                        return (
                            <div
                                key={idx}
                                onMouseEnter={() => {
                                    setHoverLabel(cfg.label);
                                    setHoverPos((idx / 8) * 100);
                                }}
                                onMouseLeave={() => {
                                    setHoverLabel(null);
                                    setHoverPos(null);
                                }}
                                onClick={() => setZoomLevel(idx)}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: `${(idx / 8) * 100}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: isSelected ? '4px' : '2px',
                                    height: isSelected ? '16px' : '12px',
                                    backgroundColor: isSelected ? '#333' : '#aaa',
                                    zIndex: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            />
                        );
                    })}

                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${(zoomLevel / (zoomConfigs.length - 1)) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '14px',
                        height: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxShadow: '0 0 3px rgba(0,0,0,0.3)',
                        zIndex: 3
                    }} />

                    {hoverLabel && (
                        <div style={{
                            position: 'absolute',
                            top: '-30px',
                            left: `${hoverPos}%`,
                            transform: 'translateX(-50%)',
                            backgroundColor: '#333',
                            color: '#fff',
                            padding: '4px 8px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            zIndex: 5
                        }}>
                            {hoverLabel}
                        </div>
                    )}
                </div>
            </div>


            <div style={{
                marginTop: '8px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#555'
            }}>
                Time period selected: <strong>{zoomConfigs[zoomLevel].label}</strong>
            </div>

            <div style={{ display: 'flex' }}>
                <div style={{ width: '120px', marginTop: '100px' }}>
                    {sampleData.routes.map((route) => (
                        <div key={route.id} style={{ height: '80px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            <strong>{route.name}</strong>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        overflowX: 'auto',
                        overflowY: 'visible',
                        border: '1px solid #ccc',
                        position: 'relative',
                        paddingTop: '120px',
                        width: '100%'
                    }}
                >
                    <div style={{ width: `${timelineWidth}px`, position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-60px',
                            height: '60px',
                            width: '100%',
                            zIndex: 10
                        }}>
                            {timeLabels.map((label, idx) => (
                                <div
                                    key={`label-${idx}`}
                                    style={{
                                        position: 'absolute',
                                        left: `calc(${label.position}% + ${timelineStartOffset}%)`,
                                        transform: 'translateX(-50%) rotate(-35deg)',
                                        transformOrigin: 'left center',
                                        whiteSpace: 'nowrap',
                                        fontSize: '12px',
                                        color: '#333'
                                    }}
                                >
                                    {label.label}
                                </div>
                            ))}
                        </div>

                        {timeLabels.map((label, idx) => (
                            <div
                                key={`line-${idx}`}
                                style={{
                                    position: 'absolute',
                                    left: `calc(${label.position}% + ${timelineStartOffset}%)`,
                                    top: 0,
                                    height: '100%',
                                    width: '1px',
                                    backgroundColor: 'lightblue',
                                    zIndex: 1
                                }}
                            />
                        ))}

                        {sampleData.routes.map((route) => (
                            <div
                                key={route.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginBottom: '20px'
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: `${timelineWidth}px`,
                                        height: '50px',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {(() => {
                                        const firstStop = route.route[0];
                                        const lastStop = route.route[route.route.length - 1];
                                        const linePos = calculateBarPosition(firstStop.start_time, lastStop.end_time);
                                        return (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '24px',
                                                    left: `calc(${linePos.left}% + ${timelineStartOffset}%)`,
                                                    width: `${linePos.width}%`,
                                                    height: '4px',
                                                    backgroundColor: route.color,
                                                    opacity: 0.6,
                                                    borderRadius: '2px',
                                                    zIndex: 1
                                                }}
                                            />
                                        );
                                    })()}

                                    {route.route.map((stop) => {
                                        const pos = calculateBarPosition(stop.start_time, stop.end_time);
                                        return (
                                            <div
                                                key={`${route.id}-${stop.seq}`}
                                                title={`${stop.start_time} → ${stop.end_time}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: `calc(${pos.left}% + ${timelineStartOffset}%)`,
                                                    width: `${pos.width}%`,
                                                    height: '20px',
                                                    top: '15px',
                                                    backgroundColor: route.color,
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 0 4px rgba(0,0,0,0.1)',
                                                    transition: 'transform 0.2s ease',
                                                    zIndex: 2
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttRouteChart;
