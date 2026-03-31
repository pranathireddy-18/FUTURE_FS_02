import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const statusInfo = {
  new: { color: '#3b82f6', label: 'New' },
  contacted: { color: '#f97316', label: 'Contacted' },
  converted: { color: '#22c55e', label: 'Converted' },
};

const DashboardPage = () => {
  const { token, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editNotes, setEditNotes] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'Website', status: 'new', notes: '' });

  const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` } });

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/leads');
      setLeads(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line
  }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'new').length;
    const contacted = leads.filter(l => l.status === 'contacted').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    return { total, newCount, contacted, converted };
  }, [leads]);

  const filtered = leads
    .filter(lead => filterStatus === 'all' || lead.status === filterStatus)
    .filter(lead => lead.name.toLowerCase().includes(search.toLowerCase()) || lead.email.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/leads/${id}`, { status });
      toast.success('Status updated');
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const deleteLead = async id => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.delete(`/api/leads/${id}`);
      toast.success('Lead removed');
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openNotes = lead => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || '');
    setIsNotesOpen(true);
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    try {
      const res = await api.put(`/api/leads/${selectedLead.id}`, { notes: editNotes });
      setLeads(prev => prev.map(l => (l.id === selectedLead.id ? res.data : l)));
      setIsNotesOpen(false);
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Save notes failed');
    }
  };

  const createLead = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/leads', newLead);
      setLeads([res.data, ...leads]);
      setShowAdd(false);
      setNewLead({ name: '', email: '', phone: '', source: 'Website', status: 'new', notes: '' });
      toast.success('Lead added');
    } catch (err) {
      toast.error('Add lead failed');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="top-bar glass">
        <h1>Mini CRM Dashboard</h1>
        <button className="btn logout" onClick={logout}>Logout</button>
      </div>
      <div className="stats-grid">
        <div className="stat-card glass">Total Leads <strong>{stats.total}</strong></div>
        <div className="stat-card glass">New <strong>{stats.newCount}</strong></div>
        <div className="stat-card glass">Contacted <strong>{stats.contacted}</strong></div>
        <div className="stat-card glass">Converted <strong>{stats.converted}</strong></div>
      </div>
      <div className="filters">
        <div className="filter-group">
          <input placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          <button className="btn" onClick={() => setShowAdd(true)}>Add Lead</button>
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal glass" onClick={e => e.stopPropagation()}>
            <h3>Add New Lead</h3>
            <form onSubmit={createLead}>
              <input placeholder="Name" required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} />
              <input placeholder="Email" type="email" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
              <input placeholder="Phone" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} />
              <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                <option>Website</option>
                <option>LinkedIn</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
              <button className="btn" type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      {isNotesOpen && (
        <div className="modal-overlay" onClick={() => setIsNotesOpen(false)}>
          <div className="modal glass" onClick={e => e.stopPropagation()}>
            <h3>Notes for {selectedLead?.name}</h3>
            <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={4} />
            <div className="modal-actions">
              <button className="btn" onClick={saveNotes}>Save Notes</button>
              <button className="btn cancel" onClick={() => setIsNotesOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container glass">
        {loading ? (
          <div className="loader">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No leads found. Add your first lead.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} className="hover-row">
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>{lead.source}</td>
                  <td>
                    <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                    <span className="status-badge" style={{ backgroundColor: statusInfo[lead.status]?.color || '#64748b' }}>
                      {statusInfo[lead.status]?.label || 'Unknown'}
                    </span>
                  </td>
                  <td>{lead.notes ? lead.notes.substring(0, 20) + '...' : '-'} <button className="link-btn" onClick={() => openNotes(lead)}>Edit</button></td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  <td><button className="btn danger" onClick={() => deleteLead(lead.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
