"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Activity, MessageSquare, Newspaper } from "lucide-react";

interface DashboardStatsProps {
  summary: {
    totalUsers: number;
    activeRoles: number;
    totalLogs: number;
    totalMessages: number;
    totalNews: number;
  };
}

export function DashboardStats({ summary }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: Users,
      description: "Registered platform users",
      gradient: "",
      border: "hover:border-blue-500/50",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-foreground",
    },
    {
      title: "Active Roles",
      value: summary.activeRoles,
      icon: Shield,
      description: "Configured access levels",
      gradient: "",
      border: "hover:border-purple-500/50",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      valueColor: "text-foreground",
    },
    {
      title: "Audit Logs",
      value: summary.totalLogs,
      icon: Activity,
      description: "Total recorded system actions",
      gradient: "",
      border: "hover:border-orange-500/50",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      valueColor: "text-foreground",
    },
    {
      title: "Inquiries",
      value: summary.totalMessages,
      icon: MessageSquare,
      description: "Public contact messages",
      gradient: "",
      border: "hover:border-green-500/50",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      valueColor: "text-foreground",
    },
    {
      title: "News Articles",
      value: summary.totalNews,
      icon: Newspaper,
      description: "Published updates",
      gradient: "",
      border: "hover:border-pink-500/50",
      iconBg: "bg-pink-500/20",
      iconColor: "text-pink-400",
      valueColor: "text-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`group relative overflow-hidden shadow-lg border-none bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${stat.border}`}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${stat.valueColor} transition-all duration-300 group-hover:scale-105 origin-left`}>
              {stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>

          {/* Bottom accent bar */}
          <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${stat.iconColor.replace('text', 'from')} to-transparent`} />
        </Card>
      ))}
    </div>
  );
}