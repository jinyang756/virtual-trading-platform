import React from 'react';
import { Card } from 'antd';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  icon?: React.ReactNode;
  accent?: 'green' | 'blue' | 'purple' | 'orange';
}

const accentMap: Record<string, string> = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  orange: 'bg-orange-50 text-orange-700'
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon, accent = 'blue' }) => {
  return (
    <Card className="shadow-sm">
      <div className="flex items-center">
        {icon && (
          <div className={`p-3 rounded-lg mr-4 ${accentMap[accent]}`}>{icon}</div>
        )}
        <div className="flex-1">
          <div className="text-gray-500 text-sm">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          {(subtitle || trend) && (
            <div className="text-xs text-gray-500 mt-1">
              {subtitle && <span>{subtitle}</span>}
              {subtitle && trend && <span className="mx-2">•</span>}
              {trend && <span className="text-green-600 font-medium">{trend}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
