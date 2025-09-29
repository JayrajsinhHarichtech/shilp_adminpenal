const dashboardMetrics = [
  { label: "Total Projects", value: 12 },
  { label: "Ongoing Units", value: 632 },
  { label: "Completed Units", value: 299 },
  { label: "Happy Clients", value: 220 },
  { label: "Years of Experience", value: 18 },
];

const latestProjects = [
  { name: "Shilp Aura", location: "Abhilasa - Sama Canal Road", image: "https://via.placeholder.com/300x200" },
  { name: "Shilp Serene", location: "Chhani", image: "https://via.placeholder.com/300x200" },
  { name: "Shilp 14", location: "Bodakdev, Ahmedabad", image: "https://via.placeholder.com/300x200" },
];

const testimonials = [
  { client: "Ajay Patel", feedback: "Recommended Shilp Group to our friends..." },
  { client: "Rahul Shah", feedback: "They made dream come true for us." },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dashboardMetrics.map((m, idx) => (
          <div key={idx} className="bg-white rounded shadow p-6 text-center">
            <div className="text-3xl font-bold">{m.value}</div>
            <div className="text-gray-600 mt-2">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Latest Projects */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Latest Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestProjects.map((proj, idx) => (
            <div key={idx} className="bg-white rounded shadow overflow-hidden hover:shadow-lg">
              <img src={proj.image} alt={proj.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{proj.name}</h3>
                <p className="text-gray-600 mt-1">{proj.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Testimonials</h2>
        <div className="space-y-4">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded shadow p-4">
              <p className="italic">"{t.feedback}"</p>
              <div className="mt-2 text-right font-semibold">— {t.client}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
