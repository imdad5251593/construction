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

  const [viewing, setViewing] = useState(null); // detailed view project
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

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 fw-bold text-dark m-0">Projects</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>
      </div>

      <div className="bg-white shadow rounded-2">
        <div className="p-3 d-flex flex-column flex-sm-row gap-2 align-items-sm-center justify-content-sm-between">
          <div className="flex-grow-1">
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search by name, location, description…"
              className="form-control"
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted small m-0">Rows:</label>
            <select
              value={perPage}
              onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
              className="form-select w-auto"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                {[
                  ['name', 'Name'],
                  ['location', 'Location'],
                  ['start_date', 'Start'],
                  ['end_date', 'End'],
                  ['is_completed', 'Completed'],
                  ['is_sold', 'Sold'],
                ].map(([key, label]) => (
                  <th key={key} className="text-uppercase small text-muted" role="button" onClick={() => toggleSort(key)}>
                    <span className="d-inline-flex align-items-center gap-1">{label} <span className="text-muted">{sortIndicator(key)}</span></span>
                  </th>
                ))}
                <th className="text-end text-uppercase small text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="py-5 text-center text-muted">Loading…</td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-5 text-center text-muted">No projects found</td>
                </tr>
              )}
              {!loading && items.map((p) => (
                <tr key={p.id}>
                  <td className="text-dark">{p.name}</td>
                  <td className="text-secondary">{p.location || '—'}</td>
                  <td className="text-secondary">{p.start_date || '—'}</td>
                  <td className="text-secondary">{p.end_date || '—'}</td>
                  <td>
                    <span className={`badge rounded-pill ${p.is_completed ? 'bg-success-subtle text-success-emphasis border border-success-subtle' : 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle'}`}>
                      {p.is_completed ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${p.is_sold ? 'bg-primary-subtle text-primary-emphasis border border-primary-subtle' : 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle'}`}>
                      {p.is_sold ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm" role="group">
                      <button className="btn btn-link text-decoration-none" onClick={() => openView(p)}>View</button>
                      <button className="btn btn-link text-decoration-none" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-link text-danger text-decoration-none" onClick={() => confirmDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 d-flex align-items-center justify-content-between">
          <div className="small text-muted">Total: {meta.total}</div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <span className="small">Page {page} of {meta.last_page}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage((p) => Math.min(meta.last_page || 1, p + 1))} disabled={page >= (meta.last_page || 1)}>Next</button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3 py-2 small mb-0" role="alert">{error}</div>
      )}

      {/* Create/Edit Offcanvas-like Drawer */}
      {showForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex" style={{ zIndex: 1045 }}>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" onClick={() => setShowForm(false)} />
          <div className="ms-auto h-100 bg-white shadow-lg overflow-auto" style={{ width: 480 }}>
            <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
              <h2 className="h5 m-0">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <form className="p-4" onSubmit={submitForm} noValidate>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`form-control ${isInvalid('name') ? 'is-invalid' : ''}`} />
                {isInvalid('name') && <div className="invalid-feedback">{errorText('name')}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={`form-control ${isInvalid('location') ? 'is-invalid' : ''}`} />
                {isInvalid('location') && <div className="invalid-feedback">{errorText('location')}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`form-control ${isInvalid('description') ? 'is-invalid' : ''}`} />
                {isInvalid('description') && <div className="invalid-feedback">{errorText('description')}</div>}
              </div>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label">Start date</label>
                  <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={`form-control ${isInvalid('start_date') ? 'is-invalid' : ''}`} />
                  {isInvalid('start_date') && <div className="invalid-feedback">{errorText('start_date')}</div>}
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label">End date</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={`form-control ${isInvalid('end_date') ? 'is-invalid' : ''}`} />
                  {isInvalid('end_date') && <div className="invalid-feedback">{errorText('end_date')}</div>}
                </div>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <input id="is_completed" type="checkbox" className="form-check-input" checked={form.is_completed} onChange={(e) => setForm({ ...form, is_completed: e.target.checked })} />
                  <label className="form-check-label" htmlFor="is_completed">Completed</label>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <input id="is_sold" type="checkbox" className="form-check-input" checked={form.is_sold} onChange={(e) => setForm({ ...form, is_sold: e.target.checked })} />
                  <label className="form-check-label" htmlFor="is_sold">Sold</label>
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label">Sale date</label>
                <input type="date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} className={`form-control ${isInvalid('sale_date') ? 'is-invalid' : ''}`} />
                {isInvalid('sale_date') && <div className="invalid-feedback">{errorText('sale_date')}</div>}
              </div>
              <div className="pt-3 d-flex align-items-center justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save changes' : 'Create project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewing && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1045 }}>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25" onClick={closeView}></div>
          <div className="bg-white rounded-3 shadow-lg w-100" style={{ maxWidth: 900 }}>
            <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
              <h3 className="h5 m-0">Project details</h3>
              <button className="btn btn-sm btn-outline-secondary" onClick={closeView}>Close</button>
            </div>
            <div className="p-4">
              {viewLoading && <div className="text-muted">Loading…</div>}
              {!viewLoading && viewData && (
                <div className="row g-3 small">
                  <div className="col-12 col-md-6"><span className="text-muted">Name:</span> <span className="text-dark">{viewData.name}</span></div>
                  <div className="col-12 col-md-6"><span className="text-muted">Location:</span> <span className="text-dark">{viewData.location || '—'}</span></div>
                  <div className="col-12 col-md-6"><span className="text-muted">Start:</span> <span className="text-dark">{viewData.start_date || '—'}</span></div>
                  <div className="col-12 col-md-6"><span className="text-muted">End:</span> <span className="text-dark">{viewData.end_date || '—'}</span></div>
                  <div className="col-12 col-md-6"><span className="text-muted">Completed:</span> <span className="text-dark">{viewData.is_completed ? 'Yes' : 'No'}</span></div>
                  <div className="col-12 col-md-6"><span className="text-muted">Sold:</span> <span className="text-dark">{viewData.is_sold ? 'Yes' : 'No'}</span></div>
                  <div className="col-12 col-md-6"><span className="text-muted">Sale date:</span> <span className="text-dark">{viewData.sale_date || '—'}</span></div>
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