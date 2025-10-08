// import React, { useState, useEffect } from "react";
// import io, { Socket } from "socket.io-client";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { useDispatch, useSelector } from "react-redux";
// import { setStats } from "@/store/admin/order-slice";
// import { RootState } from "@/store/store";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   // Tooltip,
//   Legend
// );

// const salesData = {
//   labels: [],
//   datasets: [
//     {
//       label: "Sales",
//       data: [],
//       borderColor: "#000000",
//       backgroundColor: "rgba(0,0,0,0.1)",
//       tension: 0.3,
//       fill: true,
//     },
//   ],
// };

// const dateFilters = ["Last 7 Days", "Last 14 Days", "Last 24 Days"];

// export default function Dashboard() {
//   const [selectedDateFilter, setSelectedDateFilter] = useState("Last 24 Days");

//   const dispatch = useDispatch();

//   // ✅ Load persisted stats from localStorage on mount
//   // useEffect(() => {
//   //   const savedStats = localStorage.getItem("adminStats");
//   //   if (savedStats) {
//   //     const parsed = JSON.parse(savedStats);
//   //     dispatch(setStats(parsed));
//   //   }
//   // }, [dispatch]);

//   // ✅ Get stats from Redux
//   const totalRevenue = useSelector(
//     (state: RootState) => state?.adminOrder?.totalRevenue ?? 0
//   );
//   const totalOrders = useSelector(
//     (state: RootState) => state?.adminOrder?.totalOrders ?? 0
//   );

//   // ✅ Persist stats to localStorage whenever they change
//   // useEffect(() => {
//   //   localStorage.setItem(
//   //     "adminStats",
//   //     JSON.stringify({ totalRevenue, totalOrders })
//   //   );
//   // }, [totalRevenue, totalOrders]);

//   useEffect(() => {
//     const socket: Socket = io("http://localhost:5001");

//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connect error:", err);
//     });

//     // Update Redux with stats from the socket event
//     socket.on("orderUpdate", (data) => {
//       console.log("📦 Received orderUpdate:", data);
//       if (data && data.totalRevenue !== undefined && data.totalOrders !== undefined) {
//         dispatch(setStats({ totalRevenue: data.totalRevenue, totalOrders: data.totalOrders }));
//       }
//     });

//     return () => {
//       socket.disconnect(); // Clean up properly on unmount
//     };
//   }, [dispatch]);

//   const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedDateFilter(e.target.value);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
//       {/* Welcome Header */}
//       <header className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-semibold">Welcome back, Matthew</h1>
//           <p className="text-gray-600 text-sm">
//             Here are today's stats from your online store
//           </p>
//         </div>
        
//       </header>

//       {/* Stats Tiles */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <div className="bg-black text-white rounded-lg p-6 flex flex-col">
//           <div className="flex justify-between items-center mb-1">
//             <span className="font-semibold">Total Revenue</span>
//             <svg
//               className="w-6 h-6 opacity-60"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3 10h14M3 14h10M21 6v6m0 0v6m0-6h-6"
//               />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-bold">${Number(totalRevenue).toFixed(2)}</h2> {/* ✅ Using persisted totalRevenue */}
//           <div className="text-xs text-gray-400 mt-auto flex items-center space-x-2">
//             <span>+15.6%</span>
//             <svg
//               className="w-3 h-3 fill-current text-green-500"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M12 5L19 19H5L12 5Z" />
//             </svg>
//             <span>+1.48 this week</span>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg p-6 flex flex-col shadow-sm">
//           <div className="flex justify-between items-center mb-1">
//             <span className="font-semibold">Visitors</span>
//             <svg
//               className="w-6 h-6 opacity-60"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M17 20h5v-2a5 5 0 00-5-5H9a5 5 0 00-5 5v2h5"
//               />
//               <circle
//                 cx="12"
//                 cy="7"
//                 r="4"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-bold">12,302</h2>
//           <div className="text-xs text-gray-400 mt-auto flex items-center space-x-2">
//             <span>+12.7%</span>
//             <svg
//               className="w-3 h-3 fill-current text-green-500"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M12 5L19 19H5L12 5Z" />
//             </svg>
//             <span>+1.28 this week</span>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg p-6 flex flex-col shadow-sm">
//           <div className="flex justify-between items-center mb-1">
//             <span className="font-semibold">Orders</span>
//             <svg
//               className="w-6 h-6 opacity-60"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
//               <circle
//                 cx="12"
//                 cy="12"
//                 r="9"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-bold">{totalOrders}</h2> {/* ✅ Using persisted totalOrders */}
//           <div className="text-xs text-gray-400 mt-auto flex items-center space-x-2">
//             <span>-12.7%</span>
//             <svg
//               className="w-3 h-3 fill-current text-red-500 rotate-180"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M12 19L5 5h14L12 19Z" />
//             </svg>
//             <span>-23%</span>
//           </div>
//         </div>
//       </div>

//       {/* Sales Performance section */}
//       {/* <section className="bg-white p-6 rounded-lg shadow-sm">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-lg">Sales Performance</h3>
//           <div className="flex space-x-4">
//             <select
//               onChange={handleDateFilterChange}
//               value={selectedDateFilter}
//               className="border border-gray-300 rounded px-2 py-1 text-sm"
//             >
//               {dateFilters.map((filter) => (
//                 <option key={filter} value={filter}>
//                   {filter}
//                 </option>
//               ))}
//             </select>
//             <button className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
//               Export data
//             </button>
//           </div>
//         </div>
//         <Line
//           data={salesData}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: { display: false },
//             },
//             scales: {
//               y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
//               x: { grid: { color: "#e5e7eb" } },
//             },
//             elements: { point: { radius: 2 } },
//           }}
//         />
//       </section> */}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useDispatch, useSelector } from "react-redux";
import { setStats } from "@/store/admin/order-slice";
import { RootState } from "@/store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const salesData = {
  labels: [],
  datasets: [
    {
      label: "Sales",
      data: [],
      borderColor: "#000000",
      backgroundColor: "rgba(0,0,0,0.1)",
      tension: 0.3,
      fill: true,
    },
  ],
};

const dateFilters = ["Last 7 Days", "Last 14 Days", "Last 24 Days"];

export default function Dashboard() {
  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 24 Days");

  const dispatch = useDispatch();

  // Select totalRevenue and totalOrders directly from Redux state
  const totalRevenue = useSelector(
    (state: RootState) => state.adminOrder.totalRevenue ?? 0
  );
  const totalOrders = useSelector(
    (state: RootState) => state.adminOrder.totalOrders ?? 0
  );

  useEffect(() => {
    const socket: Socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });

    socket.on("orderUpdate", (data) => {
      console.log("📦 Received orderUpdate:", data);
      if (
        data &&
        data.totalRevenue !== undefined &&
        data.totalOrders !== undefined
      ) {
        dispatch(
          setStats({ totalRevenue: data.totalRevenue, totalOrders: data.totalOrders })
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDateFilter(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
      {/* Welcome Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, Matthew</h1>
          <p className="text-gray-600 text-sm">
            Here are today's stats from your online store
          </p>
        </div>
      </header>

      {/* Stats Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black text-white rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Total Revenue</span>
            <svg
              className="w-6 h-6 opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h14M3 14h10M21 6v6m0 0v6m0-6h-6"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">${Number(totalRevenue).toFixed(2)}</h2>
          <div className="text-xs text-gray-400 mt-auto flex items-center space-x-2">
            <span>+15.6%</span>
            <svg
              className="w-3 h-3 fill-current text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5L19 19H5L12 5Z" />
            </svg>
            <span>+1.48 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Visitors</span>
            <svg
              className="w-6 h-6 opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a5 5 0 00-5-5H9a5 5 0 00-5 5v2h5"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">12,302</h2>
          <div className="text-xs text-gray-400 mt-auto flex items-center space-x-2">
            <span>+12.7%</span>
            <svg
              className="w-3 h-3 fill-current text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5L19 19H5L12 5Z" />
            </svg>
            <span>+1.28 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Orders</span>
            <svg
              className="w-6 h-6 opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">{totalOrders}</h2>
          <div className="text-xs text-gray-400 mt-auto flex items-center space-x-2">
            <span>-12.7%</span>
            <svg
              className="w-3 h-3 fill-current text-red-500 rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 19L5 5h14L12 19Z" />
            </svg>
            <span>-23%</span>
          </div>
        </div>
      </div>

      {/* Uncomment and use sales chart as needed */}
      {/* 
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Sales Performance</h3>
          <div className="flex space-x-4">
            <select
              onChange={handleDateFilterChange}
              value={selectedDateFilter}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {dateFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
            <button className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
              Export data
            </button>
          </div>
        </div>
        <Line
          data={salesData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
              x: { grid: { color: "#e5e7eb" } },
            },
            elements: { point: { radius: 2 } },
          }}
        />
      </section> 
      */}
    </div>
  );
}
