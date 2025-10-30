import { useState } from "react";
import BlogsForm from "../components/blogs/blogsFrom";
import BlogsList from "../components/blogs/blogslist";

export default function BlogsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="p-6">
      <BlogsForm onSaved={() => setRefreshKey(refreshKey + 1)} />
      <BlogsList refreshKey={refreshKey} />
    </div>
  );
}
