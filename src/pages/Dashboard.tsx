import React, { useMemo } from 'react';
import { useAllClients } from '../hooks/useClients';
import { useAllOpportunities } from '../hooks/useOpportunities'; 
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import MainLayout from '../layouts/MainLayout';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { data: clients, isSuccess: clientsSuccess } = useAllClients();
  const { data: opportunities, isSuccess: opportunitiesSuccess } = useAllOpportunities();

  // Data Chart 1
  const barChartData = useMemo(() => {
    if (!clientsSuccess || !opportunitiesSuccess) return [];
  
    return clients.map((client: { id: number; name: string }) => {
      const clientOpportunities = opportunities.filter(
        (opp: { clientId: string; estimatedValue: string; status: string }) =>
          opp.clientId === client.id.toString()
      );
  
      const totalEstimated = clientOpportunities.reduce(
        (sum: number, opp: { estimatedValue: string }) => sum + parseFloat(opp.estimatedValue || "0"),
        0
      );
  
      const totalExecuted = clientOpportunities
        .filter((opp: { status: string }) => opp.status === "Finalizada")
        .reduce((sum: number, opp: { estimatedValue: string }) => sum + parseFloat(opp.estimatedValue || "0"), 0);
  
      return { client: client.name, totalEstimated, totalExecuted };
    });
  }, [clients, opportunities, clientsSuccess, opportunitiesSuccess]);


  // Data Chart 2
  const pieChart1Data = useMemo(() => {
    if (!opportunitiesSuccess) return [];
  
    const statusCounts = opportunities.reduce((acc: Record<string, number>, opp: { status: string }) => {
      acc[opp.status] = (acc[opp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      y: count,
    }));
  }, [opportunities, opportunitiesSuccess]);
  
  // Data Chart 3
  const pieChart2Data = useMemo(() => {
    if (!opportunitiesSuccess) return [];
  
    const businessLineCounts = opportunities.reduce((acc: Record<string, number>, opp: { businessLine: string }) => {
      acc[opp.businessLine] = (acc[opp.businessLine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    return Object.entries(businessLineCounts).map(([line, count]) => ({
      name: line,
      y: count,
    }));
  }, [opportunities, opportunitiesSuccess]);

  // Highcharts options
  interface BarChartData {
    client: string;
    totalEstimated: number;
    totalExecuted: number;
  }
  
  const barChartOptions = {
    chart: { type: 'column' },
    title: { text: 'Clientes: Total Estimado vs Valor Total Ejecutados' },
    xAxis: {
      categories: barChartData.map((data: BarChartData) => data.client),
      title: { text: 'Clientes' },
    },
    yAxis: { title: { text: 'Value (COP)' } },
    series: [
      {
        name: 'Total Estimado',
        data: barChartData.map((data: BarChartData) => data.totalEstimated),
      },
      {
        name: 'Total Ejecutado',
        data: barChartData.map((data: BarChartData) => data.totalExecuted),
      },
    ],
  };

  const pieChart1Options = {
    chart: { type: 'pie' },
    title: { text: 'Oportunidades por Status' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}',
        },
      },
    },
    series: [{ name: 'Oportunidades', data: pieChart1Data }],
  };

  const pieChart2Options = {
    chart: { type: 'pie' },
    title: { text: 'Oportunidades por línea de negocio' },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%',
        },
      },
    },
    series: [
      {
        name: 'Oportunidades',
        data: pieChart2Data,
      },
    ],
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="chart-container">
          <div className="chart">
            <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
          </div>
          <div className="chart">
            <HighchartsReact highcharts={Highcharts} options={pieChart1Options} />
          </div>
          <div className="chart">
            <HighchartsReact highcharts={Highcharts} options={pieChart2Options} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
