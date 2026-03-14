'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FinancialCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const events: Record<number, { title: string, type: 'bill' | 'salary' | 'sub' }[]> = {
        5: [{ title: 'Netflix', type: 'sub' }],
        15: [{ title: 'Electricity', type: 'bill' }],
        28: [{ title: 'Salary', type: 'salary' }],
    };

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon size={20} className="text-indigo-600" />
                    Financial Calendar
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontWeight: '600', width: '100px', textAlign: 'center' }}>
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} style={{ fontWeight: 'bold', fontSize: '12px', color: '#64748b', paddingBottom: '8px' }}>{d}</div>
                ))}
                
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: totalDays }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = events[day];
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                    return (
                        <div key={day} style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '4px',
                            minHeight: '60px',
                            background: isToday ? '#eff6ff' : 'white',
                            borderColor: isToday ? '#3b82f6' : '#e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px'
                        }}>
                            <span style={{ fontSize: '12px', fontWeight: isToday ? 'bold' : 'normal', color: isToday ? '#2563eb' : '#334155' }}>
                                {day}
                            </span>
                            {dayEvents?.map((ev, idx) => (
                                <div key={idx} style={{
                                    fontSize: '9px',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'white',
                                    background: ev.type === 'salary' ? '#22c55e' : ev.type === 'sub' ? '#f59e0b' : '#ef4444'
                                }}>
                                    {ev.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', justifyContent: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></div> Bills</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }}></div> Salary</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%' }}></div> Subs</div>
            </div>
        </div>
    );
}
