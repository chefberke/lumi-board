import Footer from "@/components/landing/Footer";
import Nav from "@/components/landing/Nav";
import React from "react";

function Changelog() {
  const changelog = [
    {
      date: "14 July 25",
      title: "Initial Release",
      description:
        "Lumi is a back to basic kanban board focused on fast and delightful user experience.",
    },
    {
      date: "15 July 25",
      title: "Initial Release",
      description:
        "Lumi is a back to basic kanban board focused on fast and delightful user experience.",
    },
    {
      date: "16 July 25",
      title: "Initial Release",
      description:
        "Lumi is a back to basic kanban board focused on fast and delightful user experience.",
    },
    {
      date: "17 July 25",
      title: "Initial Release",
      description:
        "Lumi is a back to basic kanban board focused on fast and delightful user experience.",
    },
    {
      date: "18 July 25",
      title: "Initial Release",
      description:
        "Lumi is a back to basic kanban board focused on fast and delightful user experience.",
    },
    {
      date: "19 July 25",
      title: "Initial Release",
      description:
        "Lumi is a back to basic kanban board focused on fast and delightful user experience.",
    },
  ];

  return (
    <div>
      <Nav />
      <div>
        <div className="pt-6">
          <h2 className="text-4xl font-bold text-primary">Changelog</h2>
        </div>
        <div className="pt-8">
          {changelog.map((item: any) => (
            <div key={item.date} className="py-4">
              <h3 className="text-2xl font-bold">{item.date}</h3>
              <h4 className="text-lg font-medium text-gray-800 pt-2">
                {item.title}
              </h4>
              <p className="text-md text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Changelog;
