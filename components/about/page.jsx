"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Pencil, Trash2, X } from "lucide-react";

export default function AboutManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: "", onGoing: false });
  const [editingId, setEditingId] = useState(null); // If null, we are in "Create" mode
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. GET: Fetch items on load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (res.ok) {
        setItems(json.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Form Submit (Create OR Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/about/${editingId}` : "/api/about";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Reset form
        setFormData({ name: "", onGoing: false });
        setEditingId(null);
        // Refresh list
        fetchItems();
      } else {
        alert("Failed to save entry");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE: Remove an item
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      const res = await fetch(`/api/about/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state immediately for speed
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  // Helper to load item into form for editing
  const handleEditClick = (item) => {
    setEditingId(item._id);
    setFormData({ name: item.name, onGoing: item.onGoing });
  };

  // Helper to cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", onGoing: false });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage About Section</h1>

      {/* --- FORM SECTION --- */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Entry" : "Add New Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name / Title</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Master's Degree"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ongoing-check"
              checked={formData.onGoing}
              onChange={(e) => setFormData({ ...formData, onGoing: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="ongoing-check" className="text-sm text-gray-700">
              Is this On-Going?
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : editingId ? "Update Entry" : "Add Entry"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LIST SECTION --- */}
      <h2 className="text-xl font-semibold mb-4">Your List</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 italic">No entries found.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                {/* The Name (displayed as H3 for semantic structure, styled as H1 if needed) */}
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {item.name}

                  {/* THE GREEN ICON (Only shows if onGoing is true) */}
                  {item.onGoing && (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  )}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
