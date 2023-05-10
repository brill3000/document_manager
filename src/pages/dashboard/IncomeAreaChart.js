import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot, userSummary }) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);
    const [monthData, setMonthData] = useState(null)
    const [weekData, setWeekData] = useState(null)

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
            xaxis: {
                categories:
                    slot === 'month'
                        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: slot === 'month' ? 11 : 7
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light'
            }
        }));
    }, [primary, secondary, line, theme, slot]);

    const [series, setSeries] = useState([
        {
            name: 'Uploaded this week',
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'Received this week',
            data: [0, 0, 0, 0, 0, 0, 0]
        }
    ]);

    const {data, error, isError, isFetching, isSuccess} = userSummary
    useEffect(() => {
        if(data){
            if(data.monthly){
                let month = []
                for(let index in data.monthly ){
                    month[index] = data.monthly[index]
                }
                month.length > 0 && setMonthData([...month])
            }
            if(data.weekly){
                let week = []
                for(let index in data.weekly ){
                    week[index] = data.weekly[index]
                }
                week.length > 0 && setWeekData([...week])
            }
        }

    },[data, error, isError, isFetching, isSuccess])

    useEffect(() => {
        if(Array.isArray(monthData) && slot === 'month') {
            setSeries([
                {
                    name: 'Uploaded this month',
                    data: [...monthData]
                },
                {
                    name: 'Received this month',
                    data: [0,0,0,0,0,0,0,0,0,0,0,0]
                }
            ]);
        }else if(Array.isArray(weekData) && slot === 'week'){
            setSeries([
                {
                    name: 'Uploaded this week',
                    data: [...weekData]
                },
                {
                    name: 'Received this week',
                    data: [0,0,0,0,0,0]
                }
            ]);
        }
    },[weekData, monthData, slot])


    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
