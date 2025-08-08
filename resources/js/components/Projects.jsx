import React, { useEffect, useMemo, useState } from 'react';

const defaultForm = {
  name: '',
  description: '',
  location: '',
  start_date: '',
  end_date: '',
  is_completed: false,
  is_sold: false,
  sale_date: '',
};

const Projects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [sortBy, setSortBy] = useState('start_date');
  const [sortDirection, setSortDirection] = useState('desc');

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [viewing, setViewing] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, debouncedSearch, sortBy, sortDirection]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        search: debouncedSearch,
        sort_by: sortBy,
        sort_direction: sortDirection,
      });
      const res = await window.axios.get(`/api/projects?${params.toString()}`);
      if (res.data && res.data.success) {
        setItems(res.data.data || []);
        setMeta(res.data.meta || { current_page: 1, last_page: 1, total: 0 });
      } else {
        throw new Error('Unexpected response');
      }
    } catch (e) {
      setError(e?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setFieldErrors({});
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingId(project.id);
    setForm({
      name: project.name || '',
      description: project.description || '',
      location: project.location || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      is_completed: Boolean(project.is_completed),
      is_sold: Boolean(project.is_sold),
      sale_date: project.sale_date || '',
    });
    setFieldErrors({});
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e?.preventDefault?.();
    try {
      setLoading(true);
      setError('');
      setFieldErrors({});
      const payload = { ...form };
      if (!payload.end_date) delete payload.end_date;
      if (!payload.sale_date) delete payload.sale_date;

      if (editingId) {
        await window.axios.put(`/api/projects/${editingId}`, payload);
      } else {
        await window.axios.post('/api/projects', payload);
      }

      setShowForm(false);
      resetForm();
      await fetchProjects();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 422) {
        const errors = e?.response?.data?.errors || {};
        setFieldErrors(errors);
      } else {
        setError(e?.response?.data?.message || e?.message || 'Failed to save project');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (id) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return;
    try {
      setLoading(true);
      setError('');
      await window.axios.delete(`/api/projects/${id}`);
      const isLastItemOnPage = items.length === 1 && page > 1;
      if (isLastItemOnPage) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        await fetchProjects();
      }
    } catch (e) {
      setError(e?.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const openView = async (project) => {
    setViewing(project.id);
    setViewData(null);
    try {
      setViewLoading(true);
      const res = await window.axios.get(`/api/projects/${project.id}`);
      setViewData(res.data?.data || project);
    } catch (_) {
      setViewData(project);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewing(null);
    setViewData(null);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const sortIndicator = useMemo(() => (field) => {
    if (sortBy !== field) return '';
    return sortDirection === 'asc' ? '▲' : '▼';
  }, [sortBy, sortDirection]);

  const isInvalid = (field) => !!fieldErrors[field];
  const errorText = (field) => Array.isArray(fieldErrors[field]) ? fieldErrors[field][0] : fieldErrors[field];

  const inputClass = (field) => `mt-1 block w-full rounded-md border ${isInvalid(field) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={openCreate}
        >
          + New Project
        </button>
      </div>

      <div className="bg-white shadow rounded-md">
        <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search by name, location, description…"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows:</label>
            <select
              value={perPage}
              onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-24"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  ['name', 'Name'],
                  ['location', 'Location'],
                  ['start_date', 'Start'],
                  ['end_date', 'End'],
                  ['is_completed', 'Completed'],
                  ['is_sold', 'Sold'],
                ].map(([key, label]) => (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort(key)}>
                    <span className="inline-flex items-center gap-1">{label} <span className="text-gray-400">{sortIndicator(key)}</span></span>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading…</td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No projects found</td>
                </tr>
              )}
              {!loading && items.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.location || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.start_date || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.end_date || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.is_completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.is_completed ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.is_sold ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.is_sold ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => openView(p)}>View</button>
                    <button className="text-gray-600 hover:text-gray-900" onClick={() => openEdit(p)}>Edit</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => confirmDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Total: {meta.total}</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >Prev</button>
            <span className="text-sm">Page {page} of {meta.last_page}</span>
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(meta.last_page || 1, p + 1))}
              disabled={page >= (meta.last_page || 1)}
            >Next</button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowForm(false)}></div>
          <div className="relative ml-auto h-full w-full sm:w-[480px] bg-white shadow-xl overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={submitForm} noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass('name')} />
                {isInvalid('name') && <p className="mt-1 text-sm text-red-600">{errorText('name')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass('location')} />
                {isInvalid('location') && <p className="mt-1 text-sm text-red-600">{errorText('location')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass('description')} />
                {isInvalid('description') && <p className="mt-1 text-sm text-red-600">{errorText('description')}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start date</label>
                  <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputClass('start_date')} />
                  {isInvalid('start_date') && <p className="mt-1 text-sm text-red-600">{errorText('start_date')}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End date</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputClass('end_date')} />
                  {isInvalid('end_date') && <p className="mt-1 text-sm text-red-600">{errorText('end_date')}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={form.is_completed} onChange={(e) => setForm({ ...form, is_completed: e.target.checked })} />
                  Completed
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={form.is_sold} onChange={(e) => setForm({ ...form, is_sold: e.target.checked })} />
                  Sold
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sale date</label>
                <input type="date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} className={inputClass('sale_date')} />
                {isInvalid('sale_date') && <p className="mt-1 text-sm text-red-600">{errorText('sale_date')}</p>}
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700">{editingId ? 'Save changes' : 'Create project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={closeView}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Project details</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeView}>✕</button>
            </div>
            <div className="p-6">
              {viewLoading && <div className="text-gray-600">Loading…</div>}
              {!viewLoading && viewData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="text-gray-900">{viewData.name}</span></div>
                  <div><span className="text-gray-500">Location:</span> <span className="text-gray-900">{viewData.location || '—'}</span></div>
                  <div><span className="text-gray-500">Start:</span> <span className="text-gray-900">{viewData.start_date || '—'}</span></div>
                  <div><span className="text-gray-500">End:</span> <span className="text-gray-900">{viewData.end_date || '—'}</span></div>
                  <div><span className="text-gray-500">Completed:</span> <span className="text-gray-900">{viewData.is_completed ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-gray-500">Sold:</span> <span className="text-gray-900">{viewData.is_sold ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-gray-500">Sale date:</span> <span className="text-gray-900">{viewData.sale_date || '—'}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;