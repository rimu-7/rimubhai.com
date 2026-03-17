"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Percent,
  Calendar,
} from "lucide-react";

function Container({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dateRange, setDateRange] = useState("7"); // 7 days default
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    fetch("/api/turnstile-analytics")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setFilteredData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Filter data based on date range
  useEffect(() => {
    if (!data || !data.timeSeries) return;

    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = {
      ...data,
      timeSeries: data.timeSeries.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
      }),
    };

    // Recalculate summary based on filtered timeSeries
    const total = filtered.timeSeries.reduce(
      (sum, day) => sum + day.passed + day.failed,
      0,
    );
    const passed = filtered.timeSeries.reduce(
      (sum, day) => sum + day.passed,
      0,
    );
    const failed = filtered.timeSeries.reduce(
      (sum, day) => sum + day.failed,
      0,
    );

    filtered.summary = {
      total,
      passed,
      failed,
      solveRate: total > 0 ? ((passed / total) * 100).toFixed(1) : "0",
    };

    setFilteredData(filtered);
  }, [dateRange, data]);

  if (loading) {
    return (
      <Container>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-lg text-gray-500">Loading analytics...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="p-8 text-center bg-red-50 rounded">
          <h3 className="text-lg font-semibold text-red-800">
            Failed to load data
          </h3>
          <p className="text-red-600 mt-2">Please try again later</p>
        </div>
      </Container>
    );
  }

  if (
    !filteredData ||
    !filteredData.summary ||
    filteredData.summary.total === 0
  ) {
    return (
      <Container>
        <div className="p-12 text-center  rounded border">
          <ShieldCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">
            No Data Available
          </h3>
          <p className="text-gray-500 mt-2">
            Waiting for Turnstile verification data
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Security Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Cloudflare Turnstile verification stats
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm "
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="356">Last 1 Year</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className=" p-5 rounded border">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-semibold mt-2">
              {filteredData.summary.total.toLocaleString()}
            </p>
          </div>

          <div className=" p-5 rounded border">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-500">Passed</span>
            </div>
            <p className="text-2xl font-semibold mt-2">
              {filteredData.summary.passed.toLocaleString()}
            </p>
          </div>

          <div className=" p-5 rounded border">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-500">Blocked</span>
            </div>
            <p className="text-2xl font-semibold mt-2">
              {filteredData.summary.failed.toLocaleString()}
            </p>
          </div>

          <div className=" p-5 rounded border">
            <div className="flex items-center gap-3">
              <Percent className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-500">Success Rate</span>
            </div>
            <p className="text-2xl font-semibold mt-2">
              {filteredData.summary.solveRate}%
            </p>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className=" rounded border">
          <div className="px-5 py-4 border-b">
            <h3 className="font-medium">Daily Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Passed
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Blocked
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Total
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.timeSeries.map((day, index) => {
                  const dayTotal = day.passed + day.failed;
                  const dayRate =
                    dayTotal > 0
                      ? ((day.passed / dayTotal) * 100).toFixed(1)
                      : "0";

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-green-600 font-medium">
                        {day.passed.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-red-600 font-medium">
                        {day.failed.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-medium">
                        {dayTotal.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            parseFloat(dayRate) > 90
                              ? "bg-green-100 text-green-700"
                              : parseFloat(dayRate) > 70
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {dayRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Types Summary */}
        <div className=" rounded border">
          <div className="px-5 py-4 border-b">
            <h3 className="font-medium">Action Types</h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {filteredData.actionDistribution.map((action, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">
                    {action.name.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium">
                    {action.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
