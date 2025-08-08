import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const initialForm = {
  name: '',
  description: '',
  location: '',
  start_date: '',
  end_date: '',
};

function ProjectForm({ open, onClose, onSubmit, initialData, submitting }) {
  const [form, setForm] = useState(initialData ?? initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData ?? initialForm);
    setErrors({});
  }, [initialData, open]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await onSubmit(form);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert(err.message || 'Unexpected error');
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">{initialData ? 'Edit Project' : 'Create Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={submit} className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={update} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input name="location" value={form.location} onChange={update} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="start_date" value={form.start_date} onChange={update} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="end_date" value={form.end_date || ''} onChange={update} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date[0]}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description || ''} onChange={update} rows={3} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectRow({ project, onEdit, onDelete, onView }) {
  return (
    <tr className="border-t">
      <td className="px-4 py-3 text-sm text-gray-900">{project.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{project.location}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{project.start_date ?? '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{project.end_date ?? '-'}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => onView(project)} className="rounded-md border px-3 py-1 text-gray-700 hover:bg-gray-50">View</button>
          <button onClick={() => onEdit(project)} className="rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700">Edit</button>
          <button onClick={() => onDelete(project)} className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700">Delete</button>
        </div>
      </td>
    </tr>
  );
}

function DetailsModal({ project, onClose }) {
  if (!project) return null;
  const profit = project.profit ?? project.calculated_profit;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{project.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-900">{project.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dates</p>
            <p className="font-medium text-gray-900">{project.start_date || '-'} → {project.end_date || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Totals</p>
            <p className="font-medium text-gray-900">Investment: {project.total_investment ?? 0} | Expenses: {project.total_expenses ?? 0}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Description</p>
            <p className="whitespace-pre-wrap font-medium text-gray-900">{project.description || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Projects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [p.name, p.location, p.description].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, search]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/projects');
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (project) => {
    setEditing({ ...project });
    setDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/projects/${editing.id}`, data);
      } else {
        await api.post('/projects', data);
      }
      setDialogOpen(false);
      setEditing(null);
      await fetchProjects();
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (project) => {
    if (!confirm(`Delete project "${project.name}"?`)) return;
    try {
      await api.delete(`/projects/${project.id}`);
      await fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const openDetails = async (project) => {
    try {
      const res = await api.get(`/projects/${project.id}`);
      setSelected(res.data.data);
    } catch (err) {
      alert(err.message || 'Failed to load details');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button onClick={openCreate} className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">New Project</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow">
        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Start</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">End</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((p) => (
                  <ProjectRow key={p.id} project={p} onEdit={openEdit} onDelete={confirmDelete} onView={openDetails} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProjectForm
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialData={editing}
        submitting={submitting}
      />

      <DetailsModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Projects;