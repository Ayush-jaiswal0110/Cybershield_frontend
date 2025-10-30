import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import InfoTooltip from '../components/InfoTooltip';
import { emailSecurityAPI } from "../services/api";
import MaliciousData from "../data/Malicious.json";
import mlAPIService from "../services/mlAPIService";

export default function EmailSecurity() {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('filter') || 'all';
  const [quarantinedEmails, setQuarantinedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryRaw, setSearchQueryRaw] = useState('');
  const masterCheckboxRef = useRef(null);
  const searchInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [allEmails, setAllEmails] = useState(null); // when backend returns full list
  const requestIdRef = useRef(0);
  const pageCacheRef = useRef(new Map()); // cache pages keyed by `${page}-${pageSize}-${search}`
  const PAGE_ARRAY_THRESHOLD = 1000; // if backend returns > this, treat as server-paginated

  // Debounce raw input -> actual search query used for filtering
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchQueryRaw), 300);
    return () => clearTimeout(t);
  }, [searchQueryRaw]);

  // Filter emails based on URL parameter
  const filterEmailsByType = useCallback((emails) => {
    if (filterType === 'phishing') {
      return emails.filter(email => {
        const subject = (email.subject || '').toLowerCase();
        return subject.includes('urgent') || 
               subject.includes('verify') || 
               subject.includes('account') ||
               subject.includes('payment') ||
               subject.includes('password') ||
               subject.includes('login');
      });
    } else if (filterType === 'quarantined') {
      return emails.filter(email => email.probability >= 0.7); // High probability threats
    }
    return emails; // Show all emails
  }, [filterType]);

  // Filter the emails currently loaded (page) by the search query
  const filteredEmails = useMemo(() => {
    let emails = quarantinedEmails;
    
    // Apply type filter first
    emails = filterEmailsByType(emails);
    
    // Then apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      emails = emails.filter(e => {
        return (
          (e.subject || '').toLowerCase().includes(q) ||
          (e.from || '').toLowerCase().includes(q) ||
          (e.to || '').toLowerCase().includes(q)
        );
      });
    }
    
    return emails;
  }, [searchQuery, quarantinedEmails, filterEmailsByType]);

  // Compute the ids of the emails that are considered "visible" for selection.
  // If we have full dataset (allEmails) use the filtered full set (search applied across all items).
  // Otherwise fall back to the currently rendered (paged) list `filteredEmails`.
  const visibleEmailIds = useMemo(() => {
    if (allEmails) {
      const q = (searchQuery || '').toLowerCase();
      const filtered = q ? allEmails.filter(e => (
        (e.subject || '').toLowerCase().includes(q) ||
        (e.from || '').toLowerCase().includes(q) ||
        (e.to || '').toLowerCase().includes(q)
      )) : allEmails;
      return filtered.map(e => e.id);
    }
    return filteredEmails.map(e => e.id);
  }, [allEmails, filteredEmails, searchQuery]);

  // Keep the master checkbox checked/indeterminate state in sync with selection
  useEffect(() => {
    const el = masterCheckboxRef.current;
    if (!el) return;
    const total = visibleEmailIds.length;
    const selectedOnVisible = visibleEmailIds.filter(id => selectedEmails.has(id)).length;
    el.checked = total > 0 && selectedOnVisible === total;
    el.indeterminate = selectedOnVisible > 0 && selectedOnVisible < total;
  }, [visibleEmailIds, selectedEmails]);

  // initial fetch handled by the pagination-aware effect below

  // On page/pageSize/search change: if we have allEmails (backend returned array),
  // derive the visible page locally; otherwise call the API to fetch the page.
  useEffect(() => {
    console.debug('[EmailSecurity] pagination effect run', { page, pageSize, searchQuery, hasAll: !!allEmails });
    if (allEmails) {
      // apply search filter then paginate locally
      const q = (searchQuery || '').toLowerCase();
      const filtered = q ? allEmails.filter(e => (
        (e.subject || '').toLowerCase().includes(q) ||
        (e.from || '').toLowerCase().includes(q) ||
        (e.to || '').toLowerCase().includes(q)
      )) : allEmails;
      setTotalCount(filtered.length);
      const start = (page - 1) * pageSize;
      const pageItems = filtered.slice(start, start + pageSize);
      setQuarantinedEmails(pageItems);
    } else {
      console.debug('[EmailSecurity] fetching page from server', { page, pageSize, searchQuery });
      fetchQuarantinedEmails();
    }
  }, [page, pageSize, searchQuery, allEmails]);

  // When pageSize or searchQuery changes, reset to first page for predictable UX
  useEffect(() => {
    setPage(1);
  }, [pageSize, searchQuery]);

  // Clamp page to available pages when totalCount or pageSize changes
  useEffect(() => {
    if (totalCount != null && pageSize > 0) {
      const max = Math.max(1, Math.ceil(totalCount / pageSize));
      if (page > max) setPage(max);
    }
  }, [totalCount, pageSize]);

  const fetchQuarantinedEmails = async () => {
    console.debug('[EmailSecurity] fetchQuarantinedEmails called', { page, pageSize, searchQuery });
    const key = `${page}-${pageSize}-${searchQuery}`;
    // If cached, use it immediately
    const cached = pageCacheRef.current.get(key);
    if (cached) {
      setQuarantinedEmails(cached.items);
      setTotalCount(cached.total);
      setLoading(false);
      // still attempt a background refresh but don't block UI
    }

    const currentRequestId = ++requestIdRef.current;
    try {
      // Use the centralized API helper with pagination params
      const data = await emailSecurityAPI.getQuarantinedEmails({ page, pageSize, search: searchQuery });

      // If a newer request started after this one, ignore this result
      if (currentRequestId !== requestIdRef.current) {
        console.debug('[EmailSecurity] stale response ignored', { currentRequestId, latest: requestIdRef.current });
        return;
      }

      // Server may return either an array or an object { items: [], total }
      if (Array.isArray(data)) {
        // If the backend returned a very large array, avoid storing full dataset in-memory
        if ((data || []).length <= PAGE_ARRAY_THRESHOLD) {
          const normalized = normalizeEmails(data || []);
          setAllEmails(normalized);
          setTotalCount(normalized.length);
          const start = (page - 1) * pageSize;
          const pageItems = normalized.slice(start, start + pageSize);
          setQuarantinedEmails(pageItems);
          pageCacheRef.current.set(key, { items: pageItems, total: normalized.length });
        } else {
          // Treat as server-side: only normalize page items and cache
          const start = (page - 1) * pageSize;
          const pageItemsRaw = (data || []).slice(start, start + pageSize);
          const pageItems = normalizeEmails(pageItemsRaw);
          setAllEmails(null);
          setQuarantinedEmails(pageItems);
          setTotalCount(data.length);
          pageCacheRef.current.set(key, { items: pageItems, total: data.length });
        }
      } else if (data && Array.isArray(data.items)) {
        // Server-side pagination
        console.debug('[EmailSecurity] server-side pagination response', { total: data.total, items: data.items.length });
        setAllEmails(null);
        const pageItems = normalizeEmails(data.items || []);
        setQuarantinedEmails(pageItems);
        const total = typeof data.total === 'number' ? data.total : data.items.length;
        setTotalCount(total);
        pageCacheRef.current.set(key, { items: pageItems, total });
      } else {
        // Unknown shape: try to fallback
        setAllEmails(null);
        setQuarantinedEmails(normalizeEmails([]));
        setTotalCount(0);
        pageCacheRef.current.set(key, { items: [], total: 0 });
      }

      // Prefetch next page to improve perceived navigation speed
      prefetchPage(page + 1, pageSize, searchQuery);
    } catch (error) {
      console.error('Failed to fetch quarantined emails:', error);
      
      // Check if Python ML API is available
      try {
        const healthCheck = await mlAPIService.checkHealth();
        console.log('Python ML API Health:', healthCheck);
        
        if (healthCheck.status === 'healthy' && healthCheck.ml_model_loaded) {
          console.log('✅ Python ML API is available, loading sample data...');
          
          // Load sample data from Python ML API
          const mlResults = await mlAPIService.loadSampleData();

          // Convert ML API results to our format
      const ThreatsLoaded = mlResults.map((result, index) => ({
            id: result.id || `email_${index}`,
            subject: result.subject,
            from: result.sender,
            to: result.receiver,
            threatLevel: result.threatLevel,
            threatType: result.threatType,
            receivedAt: result.analysis_timestamp || new Date().toISOString(),
            reason: `Python ML Detection: ${result.reasoning}`,
            body: result.body,
            file_path: null,
            label: result.threatType,
            sender: result.sender,
            orig: result.receiver,
            // ML Analysis Results from Python API
            prediction: result.prediction,
            probability: result.probability,
            confidence: result.confidence,
            analysis: result.features,
            features: result.features,
            analysis_timestamp: result.analysis_timestamp
          }));
          
          // Treat ML API sample data as full dataset and paginate client-side
          const normalizedML = normalizeEmails(ThreatsLoaded);
          setAllEmails(normalizedML);
          setTotalCount(normalizedML.length);
          setQuarantinedEmails(normalizedML.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
        } else {
          throw new Error('Python ML API not available or model not loaded');
        }
      } catch (mlError) {
        console.error('Python ML API not available, using fallback:', mlError);
        
        // Fallback: Process emails locally with simple analysis
        // Run fallback analysis in parallel to avoid serial waits
        const analyses = await Promise.all(
          MaliciousData.emails.map(async (emailData, i) => {
            try {
              const fallbackAnalysis = await mlAPIService.analyzeEmailFallback({
                sender: emailData.sender,
                receiver: emailData.receiver,
                subject: emailData.subject,
                body: emailData.body
              });

              return {
                id: `email_${i}`,
                subject: emailData.subject,
                from: emailData.sender,
                to: emailData.receiver,
                receivedAt: new Date().toISOString(),
                reason: `Fallback Detection: ${fallbackAnalysis.reasoning}`,
                body: emailData.body,
                file_path: null,
                sender: emailData.sender,
                orig: emailData.receiver,
                prediction: emailData.prediction,
                probability: fallbackAnalysis.probability ?? emailData.probability,
                confidence: fallbackAnalysis.confidence,
                analysis: emailData.analysis,
                features: fallbackAnalysis.features,
                analysis_timestamp: fallbackAnalysis.analysis_timestamp
              };
            } catch (fallbackError) {
              console.error(`Fallback analysis failed for email ${i}:`, fallbackError);
              return {
                id: `email_${i}`,
                subject: emailData.subject,
                from: emailData.sender,
                to: emailData.receiver,
                receivedAt: new Date().toISOString(),
                reason: `JSON Data: Prediction ${emailData.prediction} - Probability ${emailData.probability}`,
                body: emailData.body,
                file_path: null,
                sender: emailData.sender,
                orig: emailData.receiver,
                prediction: emailData.prediction,
                probability: emailData.probability,
                analysis: emailData.analysis
              };
            }
          })
        );

  // Treat local fallback analyses as full dataset and paginate client-side
  const normalizedAnalyses = normalizeEmails(analyses);
  setAllEmails(normalizedAnalyses);
  setTotalCount(normalizedAnalyses.length);
  setQuarantinedEmails(normalizedAnalyses.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
      }
    } finally {
      setLoading(false);
    }
  };

  const prefetchPage = useCallback(async (prefetchPageNum, prefetchPageSize, prefetchSearch) => {
    const key = `${prefetchPageNum}-${prefetchPageSize}-${prefetchSearch}`;
    if (pageCacheRef.current.has(key)) return; // already cached
    try {
      const data = await emailSecurityAPI.getQuarantinedEmails({ page: prefetchPageNum, pageSize: prefetchPageSize, search: prefetchSearch });
      if (Array.isArray(data)) {
        if ((data || []).length <= PAGE_ARRAY_THRESHOLD) {
          const normalized = normalizeEmails(data || []);
          const start = (prefetchPageNum - 1) * prefetchPageSize;
          const pageItems = normalized.slice(start, start + prefetchPageSize);
          pageCacheRef.current.set(key, { items: pageItems, total: normalized.length });
        } else {
          const start = (prefetchPageNum - 1) * prefetchPageSize;
          const pageItems = normalizeEmails((data || []).slice(start, start + prefetchPageSize));
          pageCacheRef.current.set(key, { items: pageItems, total: data.length });
        }
      } else if (data && Array.isArray(data.items)) {
        const pageItems = normalizeEmails(data.items || []);
        const total = typeof data.total === 'number' ? data.total : data.items.length;
        pageCacheRef.current.set(key, { items: pageItems, total });
      }
    } catch (e) {
      // prefetch failures are non-fatal
      console.debug('[EmailSecurity] prefetch failed', e);
    }
  }, []);

  // Normalize emails: ensure numeric probability and cached threatLevel to avoid
  // recomputing it repeatedly during render for large lists.
  const normalizeEmails = (emails) => {
    return (emails || []).map(e => {
      const prob = Number(e.probability ?? e.probability === 0 ? e.probability : (e.probability || 0)) || 0;
      let threatLevel = 'Low';
      if (prob >= 0.98) threatLevel = 'Critical';
      else if (prob >= 0.90) threatLevel = 'High';
      else if (prob >= 0.75) threatLevel = 'Medium';
      return { ...e, probability: prob, threatLevel };
    });
  };

  const handleEmailAction = async (emailId, action) => {
    try {
      console.log(`${action} email:`, emailId);
      
      // Update local state instead of calling API
      setQuarantinedEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
      if (allEmails) {
        // remove from full dataset as well
        const newAll = allEmails.filter(e => e.id !== emailId);
        setAllEmails(newAll);
        setTotalCount(newAll.length);
        // recalc current page items
        const start = (page - 1) * pageSize;
        setQuarantinedEmails(newAll.slice(start, start + pageSize));
      }
      
      // Show success message
      alert(`Email ${action}d successfully!`);
      
    } catch (error) {
      console.error(`Failed to ${action} email:`, error);
      alert(`Failed to ${action} email. Please try again.`);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      console.log(`Bulk ${action} emails:`, Array.from(selectedEmails));
      
      // Update local state instead of calling API
      // Remove from currently loaded page
      setQuarantinedEmails(prevEmails => prevEmails.filter(email => !selectedEmails.has(email.id)));

      // If we have the full dataset, remove from allEmails and recalc pagination
      if (allEmails) {
        const newAll = allEmails.filter(e => !selectedEmails.has(e.id));
        setAllEmails(newAll);
        setTotalCount(newAll.length);
        const start = (page - 1) * pageSize;
        setQuarantinedEmails(newAll.slice(start, start + pageSize));
      }

      const removedCount = selectedEmails.size;

      // Clear selection
      setSelectedEmails(new Set());

      // Show success message
      alert(`${removedCount} email(s) ${action}d successfully!`);
      
    } catch (error) {
      console.error(`Failed to bulk ${action} emails:`, error);
      alert(`Failed to ${action} emails. Please try again.`);
    }
  };

  const toggleEmailSelection = (emailId) => {
    const newSelection = new Set(selectedEmails);
    if (newSelection.has(emailId)) {
      newSelection.delete(emailId);
    } else {
      newSelection.add(emailId);
    }
    setSelectedEmails(newSelection);
  };

  const toggleSelectVisible = () => {
    const ids = visibleEmailIds;
    if (ids.length === 0) return;
    const allSelected = ids.every(id => selectedEmails.has(id));
    const next = new Set(selectedEmails);
    if (allSelected) {
      // unselect visible
      ids.forEach(id => next.delete(id));
    } else {
      // select visible
      ids.forEach(id => next.add(id));
    }
    setSelectedEmails(next);
  };

  const getThreatLevelFromProbability = (probability) => {
    if (probability >= 0.98) return 'Critical';
    if (probability >= 0.90) return 'High';
    if (probability >= 0.75) return 'Medium';
    return 'Low';
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'Critical': return 'text-red-400 bg-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPageTitle = () => {
    switch (filterType) {
      case 'phishing': return 'Phishing Attempts';
      case 'quarantined': return 'Quarantined Emails';
      default: return 'Email Security Management';
    }
  };

  const getPageDescription = () => {
    switch (filterType) {
      case 'phishing': return 'Emails that attempt to trick users into sharing sensitive information or clicking malicious links.';
      case 'quarantined': return 'Emails placed in quarantine are held separately because they look suspicious or may contain malware or phishing content. Review them here to release or delete.';
      default: return 'Manage and review suspicious emails detected by the security system.';
    }
  };

  return (
    <DashboardLayout title="Email Security Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-gray-800">{getPageTitle()}</h2>
            <InfoTooltip id="quarantined-header-info" text={getPageDescription()} />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleBulkAction('release')}
              disabled={selectedEmails.size === 0}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:transform-none"
            >
              Release Selected ({selectedEmails.size})
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedEmails.size === 0}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:transform-none"
            >
              Delete Selected ({selectedEmails.size})
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="glass rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 w-full md:w-1/2">
              <input
                ref={searchInputRef}
                value={searchQueryRaw}
                onChange={(e) => setSearchQueryRaw(e.target.value)}
                placeholder="Search by subject, from or to..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <button
                onClick={() => { setSearchQueryRaw(''); setSearchQuery(''); searchInputRef.current?.focus(); }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading quarantined emails...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                      <input
                        ref={masterCheckboxRef}
                        type="checkbox"
                        onChange={toggleSelectVisible}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                        aria-label="Select all visible emails"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">From</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">To</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Subject</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Threat Level</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Received</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((email) => (
                    <tr key={email.id} className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEmails.has(email.id)}
                          onChange={() => toggleEmailSelection(email.id)}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{email.from}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{email.to}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{email.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          email.threatLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                          email.threatLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                          email.threatLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {email.threatLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(email.receivedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEmailAction(email.id, 'release')}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Release
                          </button>
                          <button
                            onClick={() => handleEmailAction(email.id, 'delete')}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Page size:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="px-2 py-1 border rounded"
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 bg-gray-100 disabled:opacity-50 rounded"
                  >Prev</button>
                  <div className="text-sm text-gray-700">Page {page}{totalCount ? ` of ${Math.ceil(totalCount / pageSize)}` : ''}</div>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={totalCount !== null && page >= Math.ceil(totalCount / pageSize)}
                    className="px-3 py-2 bg-gray-100 disabled:opacity-50 rounded"
                  >Next</button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Security Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quarantined Card */}
          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-0">Total Quarantined</h3>
                  <p className="text-gray-600 text-sm">Emails requiring review</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-amber-600">{quarantinedEmails.length}</div>
                <InfoTooltip variant="dark" id="quarantined-card-info" text="Emails held in quarantine for admin review." />
              </div>
            </div>
          </div>

          {/* High Risk Card */}
          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-0">High Risk</h3>
                  <p className="text-gray-600 text-sm">Critical/High threats</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-red-600">
                  {quarantinedEmails.filter(e => e.threatLevel === 'Critical' || e.threatLevel === 'High').length}
                </div>
                <InfoTooltip variant="dark" id="highrisk-card-info" text="Emails flagged as high or critical risk." />
              </div>
            </div>
          </div>

          {/* Auto-Blocked Card */}
          <div className="glass p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-0">Auto-Blocked</h3>
                  <p className="text-gray-600 text-sm">Success rate</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-emerald-600">98.7%</div>
                <InfoTooltip variant="dark" id="autoblocked-card-info" text="Percentage of emails automatically blocked by the system." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
