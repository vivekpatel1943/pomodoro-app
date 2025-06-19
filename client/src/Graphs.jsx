import React, { useState, useEffect } from 'react';
import { useAuth } from './Root';
import { BarChart, Bar, Legend, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);


function Graph() {
    const { sessions, setSessions, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useAuth();

    // const [selectedYear,setSelectedYear] = useState(null)
    const [showYearlyGraph, setShowYearlyGraph] = useState(true);
    const [showMonthlyGraph, setShowMonthlyGraph] = useState(false);
    const [showDailyGraph, setShowDailyGraph] = useState(false);


    if (!sessions) {
        return (<div>
            Loading Sessions....
        </div>)
    }

    const grouped = {
        byTime: {},
        byDate: {},
        byWeek: [],
        byMonth: {},
        byYear: {}
    }

    console.log("sessions", sessions)
    sessions.forEach((session) => {
        console.log("individual sessions", session)
        const time = session.createdAt.split('T')[1].slice(0, 8);
        const date = session.createdAt.split('T')[0];  //yyyy-mm-day
        const month = session.createdAt.slice(0, 7) ///yyyy-mm
        const year = session.createdAt.slice(0, 4);
        const sessionLength = session.timeInMinutes;
        /* console.log("month", month)
        console.log("year", year)
        console.log("type of", typeof (year))
        console.log("date", date);
        console.log("time", time);
        console.log("session-length", sessionLength); */

        // grouped by time
        if (!grouped.byTime[time]) grouped.byTime[time] = [];
        grouped.byTime[time].push(session);

        // grouped by date
        if (!grouped.byDate[date]) grouped.byDate[date] = [];
        grouped.byDate[date].push(session);

        // grouped by week
        const now = dayjs()
        const logDate = dayjs(session.createdAt);
        console.log("logdate-week", logDate.week())
        if (logDate.isSame(now, 'week')) {
            grouped.byWeek.push(session);
        }


        // group by month
        if (!grouped.byMonth[month]) grouped.byMonth[month] = [];
        grouped.byMonth[month].push(session);

        // group by year 
        if (!grouped.byYear[year]) grouped.byYear[year] = [];
        grouped.byYear[year].push(session);

    })

    console.log("grouped", grouped)
    // console.log(JSON.stringify(grouped.byYear['2025']));

    //yearly-data
    let data2 = [];
    for (const year in grouped.byYear) {
        const totalTime = grouped.byYear[year].reduce((sum, session) => sum + session.timeInMinutes, 0)
        data2.push({ year: year, sessionCount: grouped.byYear[year].length, totalMinutes: totalTime })
    }

    //monthly-data
    let data3 = [];
    for (const month in grouped.byMonth) {

        // const monthlyDataForSelectedYear = month.filter((m) => m.slice(0,4) == selectedYear);
        // console.log(month.startsWith(selectedYear));
        console.log("selected year", selectedYear)
        if (month.startsWith(selectedYear)) {
            const totalTime = grouped.byMonth[month].reduce((sum, session) => sum + session.timeInMinutes, 0)
            data3.push({ month: month, sessionCount: grouped.byMonth[month].length, timeInMinutes: totalTime })
        }
    }

    // weekly-data, it will be completely fine if i could show the weekly data from these week only ,  
    const data4 = []
    /*  const totalTime = grouped.byWeek.reduce((sum, session) => sum + session.timeInMinutes, 0)
     data4.push({ sessionCount: grouped.byWeek.length, timeInMinutes: totalTime }) */
    for (const date in grouped.byDate) {
        const now = dayjs();
        if (dayjs(date).isSame(now, "week")) {
            const totalTime = grouped.byDate[date].reduce((sum, session) => sum + session.timeInMinutes, 0);
            data4.push({ date: date.slice(5, 10), sessionCount: grouped.byDate[date].length, timeInMinutes: totalTime });
        }

    }

    //daily data
    let data5 = [];
    for (const date in grouped.byDate) {
        if (date.slice(0, 7) == selectedMonth) {
            const totalTime = grouped.byDate[date].reduce((sum, session) => sum + session.timeInMinutes, 0);
            data5.push({ date: date.slice(5, 10), sessionCount: grouped.byDate[date].length, timeInMinutes: totalTime });
        }
    }

    // console.log("data", data)
    /* console.log("data2", data2)
    console.log("data3", data3)
    console.log("data4",data4); */

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {

            const data = payload[0].payload;


            return (
                <div className='bg-[#222] text-[#82ca9d] p-4 rounded-lg'>
                    <p>Year:<span className='pl-1 text-white'>{data.year ? data.year : (data.month ? data.month : data.date)}</span></p>
                    <p>SessionCount:<span className='pl-1 text-white'>{data.sessionCount}</span></p>
                    <p>total-minutes:<span className='pl-1 text-white'>{data.totalMinutes}</span></p>
                </div>
            )
        }
        return null;
    }

  
    // CustomTooltip();

    return (
        <div>
            {/* yearly-graph */}
            {showYearlyGraph &&
                <div style={{ width: "50%", height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={data2} onClick={(e) => {
                            if (e && e.activeLabel) {
                                console.log("e", e);
                                console.log("active label", e.activeLabel)
                                setSelectedYear(e.activeLabel);
                                setShowYearlyGraph(false);
                                setShowMonthlyGraph(true);
                            }
                        }}>
                            <XAxis dataKey="year" stroke='black' />
                            <YAxis stroke='black' />
                            <CartesianGrid stroke='gray' strokeDasharray="5 5" />
                            {/* <Tooltip contentStyle={{ backgroundColor: "black", color: "white" }} /> */}
                            <Line type="monotone" dataKey="sessionCount" stroke='#82ca9d' strokeWidth={2} />
                            {/* <Line type="monotone" dataKey="totalMinutes" stroke='white' strokeWidth={2} /> */}
                            <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }


            {/* monthly-graph */}
            {
                showMonthlyGraph &&

                <div style={{ width: "50%", height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={data3} onClick={(e) => {
                            if (e && e.activeLabel) {
                                setSelectedMonth(e.activeLabel);
                                setShowMonthlyGraph(false);
                                setShowDailyGraph(true);
                            }
                        }}>
                            <XAxis dataKey="month" stroke='black' />
                            <YAxis stroke='black' />
                            <CartesianGrid stroke='gray' strokeDasharray="5 5" />
                            {/* <Tooltip contentStyle={{ backgroundColor: "black", color: "white" }} /> */}
                            <Line type="monotone" dataKey="sessionCount" stroke='#82ca9d' strokeWidth={2} />
                            {/* <Line type="monotone" dataKey="totalMinutes" stroke='white' strokeWidth={2} /> */}
                            <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }


            {/* daily-graph */}
            {showDailyGraph &&

                <div style={{ width: "50%", height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={data5}>
                            <XAxis dataKey="date" stroke='black' />
                            <YAxis stroke='black' />
                            <CartesianGrid stroke='gray' strokeDasharray="5 5" />
                            {/* <Tooltip contentStyle={{ backgroundColor: "black", color: "white" }} /> */}
                            <Line type="monotone" dataKey="sessionCount" stroke='#82ca9d' strokeWidth={2} />
                            {/* <Line type="monotone" dataKey="totalMinutes" stroke='white' strokeWidth={2} /> */}
                            <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }

            {/* weekly-data */}
            <div style={{ width: "50%", height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={data4}>
                        <XAxis dataKey="date" stroke='black' />
                        <YAxis stroke='black' />
                        <CartesianGrid stroke='gray' strokeDasharray="5 5" />
                        {/* <Tooltip contentStyle={{ backgroundColor: "black", color: "white" }} /> */}
                        <Line type="monotone" dataKey="sessionCount" stroke='#82ca9d' strokeWidth={2} />
                        {/* <Line type="monotone" dataKey="totalMinutes" stroke='white' strokeWidth={2} /> */}
                        <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}

export default Graph;